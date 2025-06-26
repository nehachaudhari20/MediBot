from fastapi import APIRouter, UploadFile, File, HTTPException
from ..models.whisper import transcribe_audio
import tempfile
import os
import logging
from pydub import AudioSegment
import io

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/record/")
async def transcribe_stream(file: UploadFile = File(...)):
    temp_path = None
    try:
        # Validate file
        if not file.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid content type: {file.content_type}. Expected audio/*"
            )

        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")

        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            if file.content_type == 'audio/webm':
                # Convert WebM to WAV
                audio = AudioSegment.from_file(io.BytesIO(content), format='webm')
                audio.export(temp_file.name, format='wav')
            else:
                # Write content directly for WAV files
                temp_file.write(content)
            
            temp_path = temp_file.name
            logger.info(f"Saved audio to: {temp_path}")

        # Transcribe
        result = transcribe_audio(temp_path)
        
        if result == "No speech detected":
            return {"transcription": "No speech detected", "status": "warning"}
            
        return {"transcription": result, "status": "success"}

    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                logger.info("Cleaned up temporary file")
            except Exception as e:
                logger.error(f"Error cleaning up: {e}")