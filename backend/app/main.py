from fastapi import FastAPI, UploadFile, File, Form ,Request ,Depends ,HTTPException
from typing import List , Optional
from app.services.parser import clean_resume_text
from app.services.parser import extract_text_from_bytes
from app.services.analyzer import analyze_resume
from app.services.llm import generate
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import hashlib
from app.core.cache import r
from app.services.analysis import llm_analysis
from app.routes.auth import router as auth_router
from app.core.deps import get_current_user, get_db
from app.db.models import Candidate
from sqlalchemy.orm import Session
import os
import uuid
from datetime import datetime
from fastapi.responses import FileResponse


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"error": "Too many requests. Please try again later."},
    )

@app.get("/")
def root():
    return {"status": "running"}

@app.post("/analyze")
@limiter.limit("5/minute")   # 🔥 LIMIT HERE
async def analyze(
    request: Request,   # ✅ REQUIRED
    files: List[UploadFile] = File(...),
    job_role: str = Form(...),
    required_exp: int = Form(...),
    job_description: Optional[str] = Form(None),   # ✅ NEW FIELD
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = []

    #caching
    jd_key = f"jd:{job_role}:{required_exp}"

    # ✅ Use user JD if provided
    if job_description and len(job_description.strip()) >= 30:
        jd = job_description
        print("✅ Using user-provided JD")

    else:
        print("⚠️ Invalid JD, using cache/generator")

        cached_jd = r.get(jd_key)

        if cached_jd:
            print("✅ CACHE HIT (JD):", jd_key)
            jd = cached_jd
        else:
            print("❌ CACHE MISS (JD):", jd_key)

            jd = generate(f"""
Generate a realistic job description for {job_role}.

Required experience: {required_exp}+ years.

Avoid overloading with tools. Keep it practical.
""")
            r.setex(jd_key, 86400, jd)  # 1 day cache

    for file in files:
        content = await file.read()
        
         # 🔥 UNIQUE FILE NAME
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

         # 🔥 SAVE FILE
        with open(file_path, "wb") as f:
            f.write(content)

        text = extract_text_from_bytes(content)

        res = analyze_resume(text, jd, required_exp)

        text = clean_resume_text(text)

        # analysis_text = llm_analysis(
        #     jd=jd,
        #     text=text,
        #     job_role=job_role,
        #     e_raw=res["exp_years"]
        # )

        candidate = Candidate(
            user_id=user.id,
            resume_text=text,
            file_name=file.filename,
            file_path=file_path,   # 🔥 IMPORTANT
            score=round(float(res["score"]), 2),
            exp_years=round(float(res["exp_years"]), 1),
            campared_exp=(float(required_exp)),
            job_role=job_role,
            job_description=jd,
            created_at=datetime.utcnow().isoformat()

        )

        db.add(candidate)
        db.commit()
        db.refresh(candidate)

        results.append({
            "candidate_id": str(candidate.id),
            "name": file.filename,
            **res,
            # "analysis": analysis_text
        })

    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return {
        "job_description": jd,
        "results": results
    }



@app.get("/analyze-history")
def history(user = Depends(get_current_user), db: Session = Depends(get_db)):
    candidates = (
        db.query(Candidate)
        .filter(Candidate.user_id == user.id)
        .order_by(Candidate.created_at.desc())
        .all()
    )

    results = [
        {
            "candidate_id": str(c.id),
            "name": c.file_name,             
            "score": c.score,
            "exp_years": c.exp_years,
            "job_role": c.job_role,
            "campared_exp": c.campared_exp,
            "created_at": c.created_at,      
            
        }
        for c in candidates
    ]

    return {"results": results}



@app.get("/candidate/{id}")
def get_candidate(id: str, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == id).first()

    if not candidate:
        raise HTTPException(404)

    return {
        "candidate_id": str(candidate.id),
        "job_role": candidate.job_role,
        "exp_years": candidate.exp_years,
        "job_description": candidate.job_description,
        "resume_text": candidate.resume_text,
        "campared_exp": candidate.campared_exp,
        "file_name":candidate.file_name,
    }



@app.get("/candidate/file/{id}")
def get_file(id: str, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == id).first()

    if not candidate or not candidate.file_path:
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(candidate.file_path)

# @app.post("/candidate/summary")
# @limiter.limit("5/minute")   # 🔥 LIMIT HERE

# async def summary(
    
# )




@app.get("/candidate/summary/{id}")
@limiter.limit("10/minute") 
async def candidate_summary(
    id: str,
    request: Request,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 🔥 1. FETCH + OWNERSHIP CHECK
    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == id, Candidate.user_id == user.id)
        .first()
    )

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # 🔥 2. INPUTS (IMPORTANT)
    job_role = candidate.job_role
    campared_exp = int(candidate.campared_exp)  # ⚠️ ideally store separately
    jd = candidate.job_description or ""

    # 🔥 3. CREATE JD HASH
    jd_hash = hashlib.md5(jd.encode()).hexdigest()

    # 🔥 4. REDIS CACHE KEY
    cache_key = f"summary:{id}:{job_role}:{campared_exp}:{jd_hash}"

    # 🔥 5. CACHE CHECK
    cached = r.get(cache_key)
    if cached:
        print("✅ SUMMARY CACHE HIT")
        return {
            "candidate_id": id,
            "analysis": cached.decode(),
            "cached": True
        }

    print("❌ SUMMARY CACHE MISS")

    # 🔥 6. RUN LLM ANALYSIS
    try:
        analysis_text = llm_analysis(
            jd=jd,
            text=candidate.resume_text,
            job_role=job_role,
            e_raw=candidate.exp_years,
            required_exp=campared_exp,
        )

    except Exception as e:
        print("❌ LLM ERROR:", e)
        analysis_text = None

    # 🔥 7. FALLBACK
    if not analysis_text or "failed" in analysis_text.lower():
        print("⚠️ Using fallback summary")

        gap = candidate.exp_years - campared_exp

        if gap >= 1:
            msg = f"Candidate exceeds required experience by {gap} years."
        elif gap == 0:
            msg = "Candidate meets the required experience."
        else:
            msg = f"Candidate is below required experience by {abs(gap)} years."

        analysis_text = f"""
Strengths:
- Experience: {candidate.exp_years} years
- Score: {candidate.score}/10

Weaknesses:
- {msg}
- Skills need manual evaluation
"""

    # 🔥 8. SAVE TO REDIS (CACHE)
    r.setex(cache_key, 86400, analysis_text)  # ⏱️ 24 HOURS

    # 🔥 9. RETURN
    return {
        "candidate_id": id,
        "analysis": analysis_text,
        "cached": False
    }