from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List
from pathlib import Path
from PyPDF2 import PdfReader
from dotenv import load_dotenv, find_dotenv
import os 

# Load env 

load_dotenv(find_dotenv(".env"))

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


# Cache for skill text and compiled chain so they are built only once per process
_skill_cache: dict = {}
_chain_cache: dict = {}


# Loading skills

def load_skill(path: str = "SKILL.md") -> str:
    if path not in _skill_cache:
        _skill_cache[path] = Path(path).read_text(encoding="utf-8")
    return _skill_cache[path]


# Structured Output

class ReportAnalysis(BaseModel):
    summary: str = Field(
        description="Plain-language summary of the overall report"
    )
    identified_conditions: List[str] = Field(
        description="Skin conditions or issues identified in the report"
    )
    severity: str = Field(
        description="Overall severity: Mild / Moderate / Severe / Critical"
    )

    severity_score : int = Field(
        description="Numerical severity score from 1 to 10, with 10 being most severe"
    )

    key_findings: List[str] = Field(
        description="Important findings pulled directly from the report"
    )
    recommended_actions: List[str] = Field(
        description="Next steps the patient should take"
    )
    should_see_dermatologist: bool = Field(
        description="True if the patient needs urgent professional consultation"
    )
    disclaimer: str = Field(
        description="Short reminder that this is AI analysis, not a medical diagnosis"
    )

# Doc extraction

def extract_document(source: str) -> str:
    """
    Accepts a local PDF file path.
    Returns the document content as plain text.
    """
    reader = PdfReader(source)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text.strip()


# Chain 

# Module-level LLM instance — created once, reused for every request
_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    api_key=GOOGLE_API_KEY,
    temperature=0.5,
)


def build_chain(skill_path: str = "SKILL.md"):
    """Return a cached chain, building it only on first call per skill file."""
    if skill_path not in _chain_cache:
        skill = load_skill(skill_path)

        prompt = ChatPromptTemplate.from_messages([
            ("system", skill),
            ("human", "Here is the medical report to analyze:\n\n{report_content}")
        ])

        structured_llm = _llm.with_structured_output(ReportAnalysis)
        _chain_cache[skill_path] = prompt | structured_llm

    return _chain_cache[skill_path]


def analyze_report(source: str, skill_path: str = "SKILL.md") -> ReportAnalysis:
    report_content = extract_document(source)
    chain = build_chain(skill_path)
    return chain.invoke({"report_content": report_content})



if __name__ == "__main__":
    result = analyze_report(
        source="path/to/patient_report.pdf",
        skill_path="SKILL.md"
    )

    print("=== DermaCare Report Analysis ===\n")
    print(f"Summary       : {result.summary}\n")
    print(f"Conditions    : {result.identified_conditions}")
    print(f"Severity      : {result.severity}")
    print(f"Key Findings  : {result.key_findings}")
    print(f"Actions       : {result.recommended_actions}")
    print(f"See Derm ASAP : {result.should_see_dermatologist}")
    print(f"\nDisclaimer    : {result.disclaimer}")