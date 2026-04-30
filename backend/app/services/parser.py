import PyPDF2
import io
import unicodedata
import re
from app.services.analyzer import fix_spaced_text
def extract_text_from_bytes(file_bytes):
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""

    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text()

    return text


def clean_resume_text(text: str):
    if not text:
        return ""

    # 🔥 1. Remove NULL bytes (CRITICAL FIX)
    text = text.replace("\x00", "")

    # 🔥 2. Normalize unicode
    text = unicodedata.normalize("NFKD", text)

    # 🔥 3. Remove non-printable chars
    text = re.sub(r"[^\x09\x0A\x0D\x20-\x7E]", "", text)

    # 🔥 4. Fix spaced text (your function)
    text = fix_spaced_text(text)

    # 🔥 5. Normalize spaces again
    text = re.sub(r'\s+', ' ', text)

    return text.strip()