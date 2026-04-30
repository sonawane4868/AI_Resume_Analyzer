import re
from sklearn.metrics.pairwise import cosine_similarity

from app.services.embedding import embedder
from app.services.experience import extract_experience, llm_experience_correction
from app.services.rag import get_context




def fix_spaced_text(text: str):
    # Fix spaced letters (J a v a → Java)
    text = re.sub(r'(?:(?<=\b)|(?<=\s))([A-Za-z])\s(?=[A-Za-z]\b)', r'\1', text)

    # Merge repeated spaced chars
    text = re.sub(r'(\b(?:[A-Za-z]\s){2,}[A-Za-z]\b)', 
                  lambda m: m.group(0).replace(" ", ""), 
                  text)

    # Fix things like "N e x t . j s" → "Next.js"
    text = re.sub(r'\s*\.\s*', '.', text)

    # Normalize spaces
    text = re.sub(r'\s+', ' ', text)

    return text.strip()

def extract_keywords(text):
    text = fix_spaced_text(text)  # 🔥 ADD THIS

    text = text.lower()
    words = re.findall(r'\b[a-zA-Z\.\+\#]{2,}\b', text)

    stopwords = {
        "the","and","for","with","this","that","are","was","were",
        "have","has","had","you","your","our","their","will",
        "work","team","role","job","developer","software"
    }

    return list(set([w for w in words if w not in stopwords]))



def keyword_score(resume, jd):
    r = set(extract_keywords(resume))
    j = set(extract_keywords(jd))

    if not j:
        return 0, []

    match = r & j
    score = len(match) / (len(j) * 0.5)

    return round(min(score, 1) * 10, 2), list(match)



def semantic_score(resume, jd):
    r_part = " ".join(extract_keywords(resume))[:1000]
    j_part = " ".join(extract_keywords(jd))[:1000]

    r_vec = embedder.embed_query(r_part)
    j_vec = embedder.embed_query(j_part)

    sim = cosine_similarity([r_vec], [j_vec])[0][0]
    return round(sim * 10, 2)



def experience_score(candidate_exp, required_exp):
    if candidate_exp == 0:
        return 4
    if required_exp > 0:
        return min((candidate_exp / required_exp) * 10, 10)
    return min(5 + candidate_exp, 10)



def final_score(k, s, e):
    return round(min((0.4*k + 0.4*s + 0.2*e), 10), 2)



def decision(score):
    if score >= 6.5:
        return "Hire"
    elif score >= 4.5:
        return "Maybe"
    return "Reject"




def analyze_resume(text, jd, required_exp):

    k, _ = keyword_score(text, jd)
    s = semantic_score(text, jd)

    exp_years = extract_experience(text)

    if exp_years == 0:
        exp_years = llm_experience_correction(text, exp_years)
    # elif exp_years < 1:
    #     exp_years = max(exp_years, llm_experience_correction(text, exp_years))

    e_raw = experience_score(exp_years, required_exp)

    if s < 5:
        e = e_raw * 0.4
    else:
        e = e_raw

    total = final_score(k, s, e)

    return {
        "score": total,
        "keyword": k,
        "semantic": s,
        "experience": e,
        "exp_years": exp_years,
        "decision": decision(total),
        # "text": text
    }    