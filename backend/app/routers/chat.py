from fastapi import APIRouter, HTTPException
from app.models import ChatQuery
from app.ai.chatbot import Chatbot
from pydantic import BaseModel

router = APIRouter()
chatbot = Chatbot()

class ChatResponse(BaseModel):
    response: str

# @router.post("/ask")
# async def chat_endpoint(query: ChatQuery):
#     response = chatbot.generate_response(
#         query=query.message,
#         prescription_drugs=query.prescription
#     )
#     return {"response": response}

@router.post("/ask", response_model=ChatResponse)
async def chat_endpoint(query: ChatQuery):
    """
    Endpoint for medication-related queries
    Requires:
    - message: User's question
    - prescription: List of medicine names in the prescription
    """
    try:
        response = chatbot.generate_response(
            query=query.message,
            prescription_drugs=query.prescription
        )
        return {"response": response}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chat processing failed: {str(e)}"
        )