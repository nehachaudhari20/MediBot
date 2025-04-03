from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..models.rag import collection, get_best_maternity_guide

router = APIRouter()

class QueryRequest(BaseModel):
    message: str

@router.post("/query_rag/")
async def query_rag(request: QueryRequest):
    try:
        # Query the ChromaDB collection
        results = collection.query(
            query_texts=[request.message],
            n_results=3
        )
        
        # Get response using the RAG model
        response = get_best_maternity_guide(
            query=request.message,
            results=results,
            conversation_history=[]  # You can maintain conversation history if needed
        )
        
        return {"response": response}
    except Exception as e:
        print(f"Error in RAG query: {str(e)}")  # Log the error
        raise HTTPException(
            status_code=500,
            detail="Failed to process your query. Please try again."
        )