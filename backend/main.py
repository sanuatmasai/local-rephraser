from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import datetime
import os

app = FastAPI()

# CORS (Allow frontend requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now (not for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create log folder if not exists
if not os.path.exists("../logs"):
    os.makedirs("../logs")

@app.post("/rephrase")
async def rephrase(request: Request):
    data = await request.json()
    input_text = data.get("text")
    tone = data.get("tone", "professional")

    prompt = f"Rephrase this sentence like a {tone}:\n\"{input_text}\""

    try:
        result = subprocess.run(
            ["ollama", "run", "tinyllama", prompt],
            capture_output=True,
            text=True,
            timeout=60
        )
        output = result.stdout.strip()
    except Exception as e:
        output = f"Error: {str(e)}"

    # Save to log
    with open("../logs/output_log.txt", "a", encoding="utf-8") as log_file:
        log_file.write(f"{datetime.datetime.now()}\nPROMPT: {prompt}\nOUTPUT: {output}\n\n")

    return {"response": output}
