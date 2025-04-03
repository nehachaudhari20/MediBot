import requests
from bs4 import BeautifulSoup
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma
import chromadb
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

def extract_text_from_website(url):
    try:
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        response.raise_for_status()  
        soup = BeautifulSoup(response.text, "html.parser")
        paragraphs = soup.find_all("p")
        return " ".join([p.get_text() for p in paragraphs]) if paragraphs else "No content available."
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return "Error fetching content."

# URLs for maternity guidance
career_urls = [
    # maternity hopitals in pune
    "https://www.pmc.gov.in/en/hosp-list",
    "https://www.justdial.com/Pune/Maternity-Hospitals/nct-10314263",
    "https://www.pmc.gov.in/en/hospital_list",
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

# Loading embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Initializing ChromaDB
chroma_client = chromadb.PersistentClient(path="./career_db")
collection = chroma_client.get_or_create_collection(name="career_guidance")

# Storing extracted text into ChromaDB
existing_ids = set(collection.get()["ids"])
for url in career_urls:
    if url not in existing_ids:
        text = extract_text_from_website(url)
        collection.add(ids=[url], documents=[text])

genai.configure(api_key="AIzaSyCYYUDOTqdhMC_NDbrQS-htFND7vocAIes")

conversation_history = []

def get_best_maternity_guide(query, results, conversation_history):
    """Fetches the best response based on AI guidance and retrieved documents."""
    if not results["documents"]:
        return "Sorry, I couldn't find relevant information."

    matched_texts = "\n\n".join(results["documents"][0])
    conversation_history.append(f"User Query: {query}")

    system_prompt = """
    You are a medical advisor specializing in pregnancy and postpartum care.
    Based on the provided extracted text, respond with:
    - Clear, structured, and step-by-step guidance.
    - Medically accurate information without unnecessary details.
    - Avoid * and use - for bullet points.
    - Maintain a friendly and supportive tone.
    - If there is any symptom user is facing, give detailed expliantion about how to overcome it.
    - If the question is not related to pregnancy or any thing which you feel not at all related to pregnancy health, tell user that cannot be answered in a sweet tone.
    - If the user asks for a specific location, provide the best available options.
    - If the user asks for maternity hospitals, provide the best available options.
    - If the user asks for a specific query, and if it is not in the documents provided, then answer for that on your own (only if it is related to pregnancy).
    - If the user asks for location then provide location in the form of map link or any website where the information can be found.
    """

    user_prompt = f"User Query: {query}\n\nExtracted Information:\n{matched_texts}\n\nHistory:\n{conversation_history}"

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(system_prompt + "\n\n" + user_prompt)

    conversation_history.append(f"AI Response: {response.text.strip()}")

    return response.text.strip()
