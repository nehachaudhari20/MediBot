from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Message(BaseModel):
    message: str

@app.post("/rag_route")
async def chat_response(data: Message):
    return {"response": f"You said: {data.message}"}
