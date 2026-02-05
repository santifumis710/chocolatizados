import os
import requests
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("OPENROUTER_API_KEY")

if not key:
    print("No API Key found")
    exit()

headers = {"Authorization": f"Bearer {key}"}
resp = requests.get("https://openrouter.ai/api/v1/models", headers=headers)

if resp.status_code == 200:
    models = resp.json()["data"]
    print("Found models:")
    for m in models:
        id = m["id"]
        if "dall" in id or "image" in id or "stable" in id or "flux" in id:
            print(f"- {id}")
else:
    print(f"Error: {resp.status_code} {resp.text}")
