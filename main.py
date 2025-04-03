
from Backend.models import rag  # Correct import statement

def main():
    """
    Main function to extract text from career roadmap URLs and display the results.
    """
    # Extract career roadmaps
    maternity_guide = rag.extract_text_from_website()

    # Print a sample (first 500 characters) of the extracted text for each URL
    for url, text in maternity_guide.items():
        print(f"\nExtracted from {url}:\n{text[:400]}...")  # Print first 500 chars

if _name_ == "_main_":
    main()