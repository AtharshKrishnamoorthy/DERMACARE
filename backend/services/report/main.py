from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List
from pathlib import Path
from docling.document_converter import DocumentConverter
from dotenv import load_dotenv, find_dotenv
import os 

# Load env 

load_dotenv(find_dotenv(".env"))

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


# Loading skills

def load_skill(path: str = "SKILL.md") -> str:
    return Path(path).read_text(encoding="utf-8")


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
    Accepts a local file path or a URL.
    Returns the document content as clean markdown text.
    """
    converter = DocumentConverter()
    result = converter.convert(source)
    return result.document.export_to_markdown()


# Chain 

def build_chain(skill_path: str = "SKILL.md"):
    skill = load_skill(skill_path)

    prompt = ChatPromptTemplate.from_messages([
        ("system", skill),
        ("human", "Here is the medical report to analyze:\n\n{report_content}")
    ])

    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-LITE", 
                                 api_key=GOOGLE_API_KEY,
                                 temperature=0.5
                                )
    structured_llm = llm.with_structured_output(ReportAnalysis)

    return prompt | structured_llm


# ── Main Function ─────────────────────────────────────────────────────────────

def analyze_report(source: str, skill_path: str = "SKILL.md") -> ReportAnalysis:
    """
    source     — local file path or URL to the report (PDF, DOCX, image, etc.)
    skill_path — path to the SKILL.md file defining agent personality
    """
    report_content = extract_document(source)
    chain = build_chain(skill_path)
    return chain.invoke({"report_content": report_content})


# ── Run ───────────────────────────────────────────────────────────────────────

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