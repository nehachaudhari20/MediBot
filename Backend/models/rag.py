import requests
from bs4 import BeautifulSoup
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma
import os
import requests
import chromadb
from sentence_transformers import SentenceTransformer
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
import networkx as nx
import re

# def extract_text_from_website(url):
#     response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
#     soup = BeautifulSoup(response.text, "html.parser")

#     paragraphs = soup.find_all("p")  # Extract paragraphs
#     text = " ".join([p.get_text() for p in paragraphs])
    
#     return text

def extract_text_from_website(url):
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(response.text, "html.parser")

    paragraphs = soup.find_all("p")  # Extract paragraphs
    text = " ".join([p.get_text() for p in paragraphs])
    
    return text



career_urls = [
    # general
    "https://resources.healthgrades.com/right-care/pregnancy/9-months-pregnant",
    "https://nhsrcindia.org/sites/default/files/2021-12/Care%20During%20Pregnancy%20and%20Childbirth%20Training%20Manual%20for%20CHO%20at%20AB-HWC.pdf",
    "https://www.healthline.com/health/pregnancy/9-months-pregnant#symptoms",
    "https://www.stemcyteindia.com/9month/#:~:text=9th%20months%20pregnant%20baby's%20position,and%2050.7cm%20in%20height",
    "https://vanshivf.com/9-month-pregnancy-care-tips/",
    "https://www.in.pampers.com/pregnancy/pregnancy-calendar/9-months-pregnant",
    "https://aurawomen.in/blog/how-to-take-care-of-nine-months-pregnancy/",
    # complications
    "https://www.nichd.nih.gov/health/topics/pregnancy/conditioninfo/complications",
    "https://my.clevelandclinic.org/health/articles/24442-pregnancy-complications",
    # breastfeeding
    "https://llli.org/breastfeeding-info/",
    # postpartum recovery
    "https://familydoctor.org/recovering-from-delivery/",
    # symptoms during pregnancy
    "https://my.clevelandclinic.org/health/articles/pregnancy-pains",
    "https://www.betterhealth.vic.gov.au/health/healthyliving/pregnancy-signs-and-symptoms",
    "https://www.medparkhospital.com/en-US/lifestyles/symptoms-of-pregnancy",
    # fetal development milestones
    "https://my.clevelandclinic.org/health/articles/7247-fetal-development-stages-of-growth",
    "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/prenatal-care/art-20045302",
    # vaccination
    "https://www.marchofdimes.org/find-support/topics/planning-baby/vaccinations-and-pregnancy",
    "https://www.acog.org/womens-health/faqs/routine-tests-during-pregnancy",
    # dietary guidelines
    "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy-nutrition/art-20043844",
    "https://www.nhs.uk/pregnancy/keeping-well/have-a-healthy-diet/",
    # safe medications during pregnancy
    "https://health.clevelandclinic.org/pregnancy-safe-medications",
    "https://www.medicinesinpregnancy.org/",
    # signs of labor and when to go to hospital
    "https://www.nhs.uk/pregnancy/labour-and-birth/signs-of-labour/signs-that-labour-has-begun/"
]

maternity_guide = {url: extract_text_from_website(url) for url in career_urls}


for key, value in maternity_guide.items():
    print(f"\nExtracted from {key}:\n{value[:500]}...")


model = SentenceTransformer("all-MiniLM-L6-v2")

# convert sentences into vector embeddings
career_embeddings = {
    url: model.encode(text) for url, text in maternity_guide.items()
}

print(list(career_embeddings.values())[0][:5])

# Create ChromaDB client
chroma_client = chromadb.PersistentClient(path="./career_db")

# Create collection for career guidance
collection = chroma_client.get_or_create_collection(name="career_guidance")

# Insert data into ChromaDB
for url, text in maternity_guide.items():
    collection.add(
        ids=[url],  # Unique ID (URL)
        documents=[text],  # Full roadmap text
    )

print("Information stored in ChromaDB!")

import google.generativeai as genai

genai.configure(api_key="AIzaSyCYYUDOTqdhMC_NDbrQS-htFND7vocAIes")

conversation_history = []  #list to store conversation history

def get_best_career_advice(query, results, conversation_history):
    
    matched_texts = "\n\n".join(results['documents'][0])  # Combine multiple chunks

    # add the new query and response to the conversation history
    conversation_history.append(f"User Query: {query}")

    conversation_context = "\n".join(conversation_history)  
    system_prompt = """
    You are an expert doctor advisor for pregnancy and postpartum care.
    You will receive extracted text from multiple sources. 
    Your task is to:
    - Remove redundant or irrelevant details.
    - Generate a clear, structured step-by-step answer for the query.
    - Format it into a useful guide.
    """

    user_prompt = f"User Query: {query}\n\nExtracted Information:\n{matched_texts}\n\nConversation History:\n{conversation_context}"

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(system_prompt + "\n\n" + user_prompt)
    conversation_history.append(f"AI Response: {response.text}")
    
    return response.text  

def start_conversation():
    print("Welcome to the Doctor! Type 'exit' to end the conversation.")
    
    while True:
        user_query = input("\nAsk a question: ")

        if user_query.lower() == "exit":
            print("Goodbye!")
            # break
            return

        # fetch matching documents from ChromaDB
        results = collection.query(query_texts=[user_query], n_results=3)  # Fetch multiple chunks

        # get advice based on the query
        best_career_advice = get_best_career_advice(user_query, results, conversation_history)
        
        print("\nAI Response:", best_career_advice)

start_conversation()


