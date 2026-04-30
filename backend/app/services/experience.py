import re
from app.services.llm import generate
from app.services.rag import get_experience_context
import hashlib
from app.core.cache import r
# from app.services.analyzer import 
def extract_experience(text):
    text_lower = text.lower()

    exp_section = ""

    match = re.search(
        r"(professional experience|work experience|experience)(.*?)(projects|education|skills|$)",
        text_lower,
        re.DOTALL
    )

    if match:
        exp_section = match.group(2)
    else:
        exp_section = text_lower

    matches = re.findall(r'(20\d{2}).{0,15}(present|20\d{2})', exp_section)

    total = 0

    for start, end in matches:
        start = int(start)
        end = 2026 if "present" in end else int(end)

        if start <= end:
            total += (end - start)

    if total == 0:
        patterns = [
            r'(\d+)\+?\s*(years|yrs)',
            r'(\d+)\s*year[s]?\s*of\s*experience'
        ]

        values = []

        for p in patterns:
            matches = re.findall(p, text_lower)
            for m in matches:
                values.append(int(m[0]))

        if values:
            total = max(values)

    return total


def llm_experience_correction(text, current_exp):
     # 🔥 create stable hash key
    key = "exp:" + hashlib.md5(text.encode()).hexdigest()

    cached = r.get(key)
    if cached:
        print("CACHE HIT (EXP):", key)
        return float(cached)
    
    print("CACHE MISS (EXP):", key)

    context = get_experience_context(text)

    prompt = f"""
You are an ATS system.

Estimate ONLY PROFESSIONAL EXPERIENCE.

STRICT RULES:
- Count ONLY jobs and internships
- DO NOT count projects
- DO NOT assume experience
- Be conservative

Return ONLY a number (example: 1.2)

TEXT:
{context}
"""

    try:
        output = generate(prompt)
        value = float(re.findall(r'\d+\.?\d*', output)[0])

        r.setex(key, 86400, str(value))

        return value
    except:
        return current_exp