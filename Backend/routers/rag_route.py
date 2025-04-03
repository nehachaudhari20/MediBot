from fastapi import APIRouter
from models.rag import process_query

router = APIRouter()

@router.post("/query_rag/")
def query_rag(user_query: str):
    response = process_query(user_query)
    return {"response": response}
