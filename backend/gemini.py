from google import genai

client = genai.Client(api_key="AIzaSyD9LfcqFWjqpGB2Z1wnSWuC4d2YedTSazI")

models = client.models.list()

for m in models:
    print(m.name)