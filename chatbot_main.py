import re
from Backend.models import rag
from Backend.models import whisper
from Backend.models.hospital_finder import get_maternity_hospitals_nearby  # Import function
from gtts import gTTS
import pygame
import time

def text_to_speech(response):
    """Convert AI-generated response to speech and play it."""
    if not response.strip():
        print("No response to speak.")
        return

    filename = "response.mp3"

    tts = gTTS(text=response, lang="en")  
    tts.save(filename)

    pygame.mixer.init()
    pygame.mixer.music.load(filename)
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        time.sleep(0.1)

    pygame.mixer.quit()  

def extract_location_from_query(query):
    """
    Extracts the location from a user query.
    Example: "Give me maternity hospitals near Kothrud" -> "Kothrud"
    """
    query = query.lower()
    location_match = re.search(r"near (\w+)", query)  # Extracts word after "near"
    if location_match:
        return location_match.group(1).title()  # Convert to title case
    return query.title()  # If no "near", assume the last word is location

def main():
    while True:
        user_choice = input("Would you like to speak or type your query? (speak/type/exit): ").strip().lower()

        if user_choice == "speak":
            print("Press ENTER to stop recording and process your query.")
            audio_file = whisper.record_audio()
            transcription = whisper.transcribe_audio(audio_file)
            print("\nTranscription:", transcription)
            user_query = transcription

        elif user_choice == "type":
            user_query = input("\nPlease type your query: ").strip()

        elif user_choice == "exit":
            print("Goodbye!")
            break  

        else:
            print("Invalid input. Please type 'speak' or 'type'.")
            continue  

        # Check if user is asking for hospital locations
        if "maternity hospital" in user_query.lower() or "hospital near" in user_query.lower():
            area = extract_location_from_query(user_query)
            print(f"\nFetching maternity hospitals near {area}...")

            hospitals = get_maternity_hospitals_nearby(area)

            if hospitals and hospitals[0] != "No maternity hospitals found in this area.":
                print("\n".join([f"{i+1}. {hospital}" for i, hospital in enumerate(hospitals)]))  # Numbered output

                # Optional: Convert response to speech
                convert_choice = input("\nDo you want me to read it out loud? (yes/no): ").strip().lower()
                if convert_choice == "yes":
                    print("📢 Converting response to speech...")
                    text_to_speech("\n".join(hospitals))
                else:
                    print("Skipping text-to-speech conversion.")
            else:
                print("⚠️ No hospitals found in this area.")
            continue  # Ensure the chatbot keeps running

        # If not a hospital query, process as usual
        print("\nProcessing your query...")
        results = rag.collection.query(query_texts=[user_query], n_results=3)

        if results['documents']:
            best_advice = rag.get_best_maternity_guide(user_query, results, rag.conversation_history)
            print("\nAI Response:", best_advice)

            convert_choice = input("\nDo you want to convert this response to speech? (yes/no): ").strip().lower()
            if convert_choice == "yes":
                print("Converting response to speech...")
                text_to_speech(best_advice)
            else:
                print("Skipping text-to-speech conversion.")

        else:
            no_info_msg = "\nNo relevant information found in the database."
            print(no_info_msg)

            convert_choice = input("\nDo you want to convert this message to speech? (yes/no): ").strip().lower()
            if convert_choice == "yes":
                print("Converting response to speech...")
                text_to_speech(no_info_msg)
            else:
                print("Skipping text-to-speech conversion.")

if __name__ == "__main__":
    main()
