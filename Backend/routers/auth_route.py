from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from bson.objectid import ObjectId
from passlib.hash import bcrypt
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get the MongoDB URI from the environment
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set in environment")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["medibot"]
users_collection = db["users"]

router = APIRouter()


# Pydantic models
class SignupData(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginData(BaseModel):
    email: EmailStr
    password: str


# Sign Up Route
@router.post("/signup")
async def signup(data: SignupData):
    existing_user = users_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = bcrypt.hash(data.password)
    new_user = {
        "name": data.name,
        "email": data.email,
        "password": hashed_password,
    }

    result = users_collection.insert_one(new_user)
    user_id = str(result.inserted_id)

    return {
        "id": user_id,
        "name": data.name,
        "email": data.email,
    }


# Login Route
@router.post("/login")
async def login(data: LoginData):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not bcrypt.verify(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
    }
