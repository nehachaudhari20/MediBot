from fastapi import FastAPI
from Backend.routers import remainder_router, whisper_router, hospital_finder_router, rag_router

app = FastAPI()

app.include_router(remainder_router.router, prefix="/reminder", tags=["Reminders"])
app.include_router(whisper_router.router, prefix="/audio", tags=["Audio Transcription"])
app.include_router(hospital_finder_router.router, prefix="/hospital", tags=["Hospital Finder"])
app.include_router(rag_router.router, prefix="/rag", tags=["RAG Queries"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
