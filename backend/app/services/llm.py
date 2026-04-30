import requests
import time
from google import genai
from contextvars import ContextVar

from app.core.config import GEMINI_API_KEY, OPENROUTER_API_KEY


# --------------------------
# 🔥 GEMINI CLIENT
# --------------------------
client = genai.Client(api_key=GEMINI_API_KEY)


# --------------------------
# 🔥 REQUEST STATE
# --------------------------
request_cache = ContextVar("request_cache", default={})
gemini_disabled = ContextVar("gemini_disabled", default=False)


# --------------------------
# 🔥 RETRY
# --------------------------
def retry(func, retries=2):
    delay = 1
    for i in range(retries):
        result = func()
        if result:
            return result
        print(f"⚠️ Retry {i+1} failed, waiting {delay}s...")
        time.sleep(delay)
        delay *= 2
    return None


# --------------------------
# 🔥 GEMINI
# --------------------------
def call_gemini(prompt: str):
    if gemini_disabled.get():
        return None

    def _call():
        try:
            print("🔍 Using Gemini...")

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            if response and getattr(response, "text", None):
                print("✅ Gemini success")
                return response.text.strip()

        except Exception as e:
            print("❌ Gemini ERROR:", e)
            gemini_disabled.set(True)

        return None

    return retry(_call, retries=2)


# --------------------------
# 🔥 OPENROUTER
# --------------------------
def call_openrouter(prompt: str):
    def _call():
        try:
            print("🔍 Using OpenRouter...")

            res = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "openai/gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.2,
                    "max_tokens": 120,
                },
                timeout=10,
            )

            if res.status_code != 200:
                print("❌ OpenRouter ERROR:", res.status_code)
                return None

            data = res.json()
            print("✅ OpenRouter success")
            return data["choices"][0]["message"]["content"].strip()

        except Exception as e:
            print("🔥 OpenRouter CRASH:", e)
            return None

    return retry(_call, retries=1)


# --------------------------
# 🔥 OLLAMA (phi3 fallback)
# --------------------------
def call_ollama(prompt: str):
    def _call():
        try:
            print("🔍 Using Ollama (phi3)...")

            res = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "phi3:mini",
                    "prompt": prompt,
                    "stream": False
                },
                timeout=580
            )

            if res.status_code != 200:
                print("❌ Ollama ERROR:", res.status_code)
                return None

            data = res.json()
            print("✅ Ollama success")
            return data.get("response", "").strip()

        except Exception as e:
            print("🔥 Ollama CRASH:", e)
            return None

    return retry(_call, retries=1)


# --------------------------
# 🔥 FINAL FALLBACK
# --------------------------
def fallback_response():
    return "Basic analysis generated (AI unavailable)."


# --------------------------
# 🔥 MAIN GENERATE
# --------------------------
def generate(prompt: str) -> str:
    prompt = prompt.strip()

    # 🔥 REQUEST CACHE ONLY (no Redis)
    cache = request_cache.get()

    if prompt in cache:
        print("⚡ REQUEST CACHE HIT")
        return cache[prompt]

    # 🔥 GEMINI
    result = call_gemini(prompt)
    if result:
        cache[prompt] = result
        request_cache.set(cache)
        return result

    # 🔥 OPENROUTER
    result = call_openrouter(prompt)
    if result:
        cache[prompt] = result
        request_cache.set(cache)
        return result

    # 🔥 OLLAMA
    result = call_ollama(prompt)
    if result:
        cache[prompt] = result
        request_cache.set(cache)
        return result

    # 🔥 FINAL
    print("🔥 ALL FAILED → fallback")
    result = fallback_response()
    cache[prompt] = result
    request_cache.set(cache)
    return result