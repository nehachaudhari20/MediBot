from fastapi import FastAPI
#from Backend.routers import remainder_router, whisper_router, hospital_finder_router, rag_router
from Backend.routers import router as remainder_router
from Backend.routers import router as whisper_router
from Backend.routers import router as hospital_finder_router
from Backend.routers import router as rag_router
app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(remainder_router, prefix="/reminder", tags=["Reminders"])
app.include_router(whisper_router, prefix="/audio", tags=["Audio Transcription"])
app.include_router(hospital_finder_router, prefix="/hospital", tags=["Hospital Finder"])
app.include_router(rag_router, prefix="/rag", tags=["RAG Queries"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
