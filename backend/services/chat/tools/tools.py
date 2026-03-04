import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3]))

from langchain.tools import tool
from langchain_tavily import TavilySearch
from dotenv import load_dotenv, find_dotenv
import os

import services.dashboard.identification.main as identification_service
import services.dashboard.report.main         as report_service
import services.dashboard.settings.main       as settings_service
import services.dashboard.symptom.main        as symptom_service
import auth.users.main                        as users_service

load_dotenv(find_dotenv(".env"))

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")


# WEB TOOL

web_tool = TavilySearch(
    max_results=5,
    topic="general",
    tavily_api_key=TAVILY_API_KEY
)


# PROFILE READER

@tool
def profile_reader(user_id: str) -> str:
    """Fetches the user's profile — name, skin type, known conditions, allergies
    and settings. Use this to personalize every response."""

    user = users_service.get_user(user_id)
    if not user:
        return "User profile not found."

    settings = settings_service.get_settings(user_id)

    profile = (
        f"Name: {user.name}\n"
        f"Email: {user.email}\n"
        f"Phone: {user.phone}\n"
        f"Skin Type: {user.skin_type or 'Not set'}\n"
        f"Known Conditions: {user.known_conditions or 'None'}\n"
        f"Allergies: {user.allergies or 'None'}"
    )
    if settings:
        profile += f"\nLanguage: {settings.language}\nTheme: {settings.theme}"

    return profile


# HISTORY READER

@tool
def history_reader(user_id: str) -> str:
    """Retrieves the user's past skin scans and report analyses.
    Use this to give context-aware, history-based answers."""

    scans   = identification_service.get_user_identifications(user_id)
    reports = report_service.get_user_reports(user_id)

    output = ""

    if scans:
        output += "Recent Skin Scans:\n"
        for s in scans[:5]:
            output += f"  - {s.predicted_disease} (on {s.created_at.date()})\n"
            if s.model_response:
                output += f"    Response: {s.model_response[:200]}...\n"
    else:
        output += "No skin scans found.\n"

    if reports:
        output += "\nRecent Report Analyses:\n"
        for r in reports[:5]:
            output += f"  - {r.file_type} report (on {r.created_at.date()})\n"
            if r.analysis:
                output += f"    Analysis: {r.analysis[:200]}...\n"
    else:
        output += "No reports found.\n"

    return output.strip()


# URGENCY DETECTOR

URGENT_KEYWORDS = [
    "spreading fast", "bleeding", "won't stop bleeding", "swollen", "pus",
    "fever", "infected", "black spot", "growing rapidly", "painful lump",
    "sudden rash", "all over body", "ulcer", "open wound", "oozing",
    "melanoma", "carcinoma",
]

@tool
def urgency_detector(user_message: str) -> str:
    """Scans the user's message for alarming symptoms. If anything urgent is
    detected, returns a warning to see a dermatologist immediately."""

    triggered = [kw for kw in URGENT_KEYWORDS if kw in user_message.lower()]

    if triggered:
        return (
            f"URGENT: Alarming symptoms detected — {', '.join(triggered)}. "
            "Advise the user to consult a licensed dermatologist or visit an "
            "emergency clinic immediately. Do not suggest self-treatment."
        )
    return "No urgent symptoms detected."


# SYMPTOM LOGGER

@tool
def symptom_logger(user_id: str, symptoms: str) -> str:
    """Logs symptoms described by the user into their history.
    Builds long-term memory across sessions."""

    result = symptom_service.add_symptom(user_id, symptoms)
    if result:
        return f"Symptoms logged: {symptoms}"
    return "Failed to log symptoms."

