from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm_engine import get_llm_response

class ChatRequest(BaseModel):
    message: str

app = FastAPI()

# Allow frontend → backend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat(request: ChatRequest):
    user_msg = request.message
    reply = get_llm_response(user_msg)
    return {"response": reply}

@app.get("/")
def root():
    return {"message": "ChatEase Backend Running!"}