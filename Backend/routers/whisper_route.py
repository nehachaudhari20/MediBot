from fastapi import APIRouter, UploadFile, File, HTTPException
from Backend.models.whispher import transcribe_audio
import tempfile
import os
import logging
from pydub import AudioSegment
import io

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/transcribe/stream/")
async def transcribe_stream(file: UploadFile = File(...)):
    temp_path = None
    try:
        # Validate content type for WebM audio from browser
        if not file.content_type.startswith('audio/webm'):
            raise HTTPException(
                status_code=400, 
                detail="Invalid audio format. Expected WebM audio stream"
            )

        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Empty audio stream")

        # Convert WebM to WAV
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            audio = AudioSegment.from_file(io.BytesIO(content), format='webm')
            audio.export(temp_file.name, format='wav')
            temp_path = temp_file.name
            logger.info(f"Converted and saved audio stream to: {temp_path}")

        # Transcribe audio
        result = transcribe_audio(temp_path)
        
        if not result:
            logger.warning("No speech detected in stream")
            return {"transcription": "No speech detected"}
            
        logger.info(f"Transcription result: {result}")
        return {"transcription": result}

    except Exception as e:
        logger.error(f"Stream processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)
            logger.info("Cleaned up temporary file")