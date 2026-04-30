import hashlib
from app.core.cache import r
from app.services.rag import get_context
from app.services.llm import generate


def generate_cache_key(text, jd, job_role, e_raw, required_exp):
    raw = f"{text}:{jd}:{job_role}:{e_raw}:{required_exp}"
    return "llm:" + hashlib.md5(raw.encode()).hexdigest()


def llm_analysis(jd, text, job_role, e_raw, required_exp):
    context = get_context(text, jd)

    key = generate_cache_key(text, jd, job_role, e_raw, required_exp)

    cached = r.get(key)
    if cached is not None:
        print("✅ CACHE HIT (LLM analysis)")
        return cached.decode() if isinstance(cached, bytes) else cached

    print("❌ CACHE MISS (LLM analysis)")

    prompt = f"""
Evaluate candidate for role: {job_role}

JOB DESCRIPTION:
{jd}    

CONTEXT:
{context}

Candidate Experience: {e_raw} years
Required Experience: {required_exp} years

Give:
- strengths
- weaknesses

Rules:
- Strengths = skills and experience clearly matching the job description
- Weaknesses = ONLY missing REQUIRED skills from the job description

Experience rules:
- If candidate experience >= required experience → DO NOT mark as weakness
- If candidate experience < required experience → include as weakness

Skill rules:
- If JD says "one of" or "any of", treat it as OR condition
- Do NOT assume missing skills unless clearly absent

Context rules:
- Use context as primary source
- If unclear, DO NOT guess

Output rules:
- Bullet points only
- EXACTLY 3 strengths (max)
- EXACTLY 3 weaknesses (max)
- No extra explanation
"""

    analysis = generate(prompt)

    try:
        r.setex(key, 86400, analysis)
    except Exception as e:
        print("⚠️ Redis error:", e)

    return analysis