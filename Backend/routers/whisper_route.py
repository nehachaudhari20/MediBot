from fastapi import APIRouter
from Backend.models.whispher import record_and_transcribe

router = APIRouter()

@router.post("/transcribe/")
def transcribe_audio():
    result = record_and_transcribe()
    return {"transcription": result}