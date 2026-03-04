import os
import pathlib 
from supabase import create_client, Client
from dotenv import load_dotenv, find_dotenv
import sys 

# Path import

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))

import users.main as users_db

# Load env 

load_dotenv(find_dotenv(".env"))

SUPBASE_URL = os.getenv("SUPABASE_URL")
SUPBASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

# Creating the client 

supbase : Client = create_client(
    SUPBASE_URL,
    SUPBASE_ANON_KEY
)

# Function for auth

def signup_user(name: str, email: str, phone: str, password: str):

    # 1. Create auth account in Supabase
    response = supbase.auth.sign_up({"email": email, "password": password})

    supabase_user = response.user
    if not supabase_user:
        return {"error": "Signup failed"}

    # 2. Save user in our DB using the same Supabase UUID
    db_user = users_db.create_user(
        name=name,
        email=email,
        phone=phone,
        password=password,
        user_id=str(supabase_user.id)
    )

    return {
        "user": supabase_user,
        "session": response.session,
        "db_user": db_user
    }


def signin_user(email: str, password: str):

    response = supbase.auth.sign_in_with_password({"email": email, "password": password})

    return {
        "user": response.user,
        "session": response.session,
    }
