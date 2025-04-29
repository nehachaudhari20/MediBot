import whisper
import speech_recognition as sr
import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)
whisper_model = whisper.load_model("base")

def record_audio(duration=5):
    """Record audio from microphone for specified duration"""
    recognizer = sr.Recognizer()
    audio_file = None
    
    try:
        with sr.Microphone() as source:
            logger.info("Listening... Speak now.")
            recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = recognizer.listen(source, timeout=duration)

            # Create temp directory if it doesn't exist
            temp_dir = Path("temp")
            temp_dir.mkdir(exist_ok=True)
            
            audio_file = temp_dir / "input_audio.wav"
            with open(audio_file, "wb") as f:
                f.write(audio.get_wav_data())
            
            logger.info(f"Audio saved as '{audio_file}'")
            return str(audio_file)
    except Exception as e:
        logger.error(f"Error recording audio: {e}")
        return None
    finally:
        # Only attempt cleanup if file exists
        if audio_file and os.path.exists(str(audio_file)):
            try:
                os.remove(str(audio_file))
                logger.info("Cleaned up temporary audio file")
            except Exception as e:
                logger.error(f"Error cleaning up file: {e}")

def transcribe_audio(audio_file):
    """Transcribe audio file using Whisper model"""
    if not audio_file or not os.path.exists(audio_file):
        logger.error("Invalid audio file path")
        return "Error: No valid audio file"

    try:
        logger.info(f"Transcribing audio from {audio_file}")
        result = whisper_model.transcribe(audio_file)
        transcribed_text = result["text"].strip()
        
        if not transcribed_text:
            logger.warning("No speech detected in audio")
            return "No speech detected"
            
        logger.info(f"Successfully transcribed: {transcribed_text[:50]}...")
        return transcribed_text
        
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        return f"Error transcribing audio: {str(e)}"