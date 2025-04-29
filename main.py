from fastapi import FastAPI
from Backend.routers import reminder_route, whisper_route, hospital_route, rag_route
from fastapi.responses import RedirectResponse
import uvicorn
# from Backend.routers import bot_audio_route
app = FastAPI(title="MediBot API")

from fastapi.middleware.cors import CORSMiddleware  

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow requests from React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Add a root route that redirects to API documentation
@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

app.include_router(reminder_route.router, prefix="/reminder", tags=["Reminders"])
app.include_router(whisper_route.router, prefix="/api/transcribe", tags=["Audio Transcription"])
app.include_router(hospital_route.router, prefix="/hospital", tags=["Hospital Finder"])
app.include_router(rag_route.router, prefix="/rag", tags=["RAG Queries"])
app.include_router(whisper_route.router, prefix="/api/speech", tags=["Speech Recognition"])

if __name__ == "_main_":
    
    uvicorn.run(app, host="127.0.0.1", port=8000)