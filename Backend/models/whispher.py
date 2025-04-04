# import whisper
# import speech_recognition as sr

# whisper_model = whisper.load_model("base")

# def record_audio():
#     recognizer = sr.Recognizer()
    
#     try:
#         with sr.Microphone() as source:
#             print("Listening... Speak now.")
#             recognizer.adjust_for_ambient_noise(source, duration=1)
#             audio = recognizer.listen(source)

#             audio_file = "input_audio.wav"
#             with open(audio_file, "wb") as f:
#                 f.write(audio.get_wav_data())
            
#             print("Audio saved as 'input_audio.wav'")
#             return audio_file
#     except Exception as e:
#         print(f"Error recording audio: {e}")
#         return None

# def transcribe_audio(audio_file):
#     if not audio_file:
#         return "Error: No audio recorded."

#     print("Transcribing audio...")
#     result = whisper_model.transcribe(audio_file)
    
#     return result["text"].strip() if result["text"] else "No speech detected."

# def record_and_transcribe():
#     audio_file = record_audio()
#     return transcribe_audio(audio_file) if audio_file else "Error in recording audio."

# if __name__ == "__main__":
#     print("Recording and transcribing...")
#     transcribed_text = record_and_transcribe()
#     print("\nTranscription:", transcribed_text)
import whisper
import logging

logger = logging.getLogger(__name__)

def transcribe_audio(file_path: str) -> str:
    try:
        # Load model
        model = whisper.load_model("base")
        logger.info("Loaded Whisper model")

        # Transcribe with specific parameters
        result = model.transcribe(
            file_path,
            language="en",
            temperature=0.0,
            word_timestamps=True,
            verbose=True
        )
        
        transcribed_text = result.get("text", "").strip()
        logger.info(f"Raw transcription: {transcribed_text}")

        if not transcribed_text:
            return None

        return transcribed_text

    except Exception as e:
        logger.error(f"Transcription failed: {str(e)}")
        return None