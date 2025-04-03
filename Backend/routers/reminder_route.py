from fastapi import APIRouter
from models.remainder import schedule_email

router = APIRouter()

@router.post("/schedule_reminder/")
def schedule_reminder(reminder_text: str, time_str: str):
    schedule_email(reminder_text, time_str)
    return {"message": "Reminder scheduled successfully."}
