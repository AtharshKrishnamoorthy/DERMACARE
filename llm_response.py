import streamlit as st
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from PIL import Image
import tensorflow as tf
from identification_model import Model
from dotnev import load_dotenv
import os

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def prompt(question):
    prompt_template = f""" 
    Act as a professional dermatologist with 30 years of experience and tell all the details about {question} if it is a 
    skin disease then tell the answer as provided "Answer" in the given below text so take this details to be 
    provided and fill the information and give the output in the same format. if it is not then reply something like it is not related to this
    At starting of an answer convey like "Yeah sure here is the description of the disease(that particular disease)" or like "Certainly here is the description of that disease u want to know abt" Like that. Also generate response a bit interactive with the user.
    The below format for the answer needed to be folowed only when the question is like bland - "Can u explain about Melanoma" or like "Can u tell about Ecezma" Drafts like this if the answer is too specific (like "Explain the symtoms of Melanoma") then provide the answer accurately to the question.
    Question : {question}
    Answer :
    Format of the answer:
       No specific format required just give accrate answers to the questions
      **References : **
        Provide the reference links for the diseases
    Bold the text enclosed between ** **
    """
    return prompt_template


def get_llm_response(question):
    model = GoogleGenerativeAI(model='gemini-2.0-flash-exp', google_api_key=GOOGLE_API_KEY)
    template = prompt(question)
    prompts = PromptTemplate.from_template(template)

    chain = prompts | model
    return chain.invoke({"question": question})


