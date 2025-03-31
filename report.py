from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os

load_dotenv()


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def vision_model(): 
    # Initialize Google Generative AI model
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", google_api_key=GOOGLE_API_KEY,
                                 temperature=0.4)

    return llm


def fine_tuning():
    # fine-tuning on prompt
    input_prompt = """As a professional dermatologist with over 30 years of experience, please provide a 
    comprehensive analysis of the medical report provided below and explain in generic way that inexperienced people 
    also be able to understand.

    **Medical Report Analysis:**

    **Patient Information:**
    - Name:
    - Age:
    - Gender:
    - Medical History:

    **Report Overview:**
    Provide a brief overview of the medical report, including any notable symptoms or observations.

    **Key Findings:**
    List the key findings from the medical report, including any abnormalities or significant observations.

    **Diagnosis:**
    Based on the findings, provide a diagnosis or differential diagnosis for the patient's condition.

    **Treatment Recommendations:**
    Outline appropriate treatment recommendations for the diagnosed condition, including medications, procedures, or lifestyle changes.

    **Prognosis:**
    Discuss the expected prognosis for the patient, considering the effectiveness of the recommended treatment and any potential complications.

    **Additional Notes:**
    Include any additional information or considerations relevant to the analysis of the medical report.
    
    **Report Condition:**
    Based on all the above analysis provide a condition for the report(Normal,Mild,Severe,Serious).
    
    **Analysis Score:**
    Based on the above analysis provide me with a score indicating the seriousness to be taken. The score should range between 1-10.
       Format for displaying the score:
       Score for the above analysis : Score(Mild or Serious)
    """
    
    

    return input_prompt


def analyze_medical_report(image_file):
    # Create HumanMessage with image data
    report = HumanMessage(
        content=[
            {"type": "text", "text": fine_tuning()},
            {"type": "image_url", "image_url": image_file},
        ]
    )

    # Invoke model
    message = vision_model().invoke([report])

    # Retrieve text content from message
    response = message.content

    return response
