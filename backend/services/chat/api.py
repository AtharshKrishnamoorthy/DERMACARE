from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from chat import chat

# Creating FastAPI instance

app = FastAPI(
    title="Chat API",
    description="API for the DermaCare AI chatbot, built with LangGraph and Google Gemini.",
)

# CORS Middleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Request Models

class ChatRequest(BaseModel):
    user_id: str
    query: str

class ChatResponse(BaseModel):
    response: str


# Endpoints

# Health check

@app.get("/health")
def health_check():
    return {"status": "ok"}


# Root 

@app.get("/")
def root():
    return {"message": "Welcome to the DermaCare AI Chat API!"}


# Chat endpoint

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = chat(request.query, request.user_id)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

