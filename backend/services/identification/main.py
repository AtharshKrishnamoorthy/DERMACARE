import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))

import os
import numpy as np
import cv2
import tensorflow as tf
from PIL import Image
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(".env"))

# Path to the model — set MODEL_PATH in .env or place my_model.h5 in the backend root
MODEL_PATH = os.getenv("MODEL_PATH", str(pathlib.Path(__file__).resolve().parents[3] / "my_model.h5"))

CLASS_NAMES = [
    "Actinic Keratosis",
    "Melanoma",
    "Squamous Cell Carcinoma",
    "Vascular Lesion",
    "Basal Cell Carcinoma",
    "Benign Keratosis",
    "Dermatofibroma",
    "Melanocytic Nevi",
]

# Load model once at startup
_model = None

def load_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
        _model = tf.keras.models.load_model(MODEL_PATH)
    return _model


def predict(image: Image.Image) -> str:
    """Takes a PIL image and returns the predicted disease name."""
    model = load_model()

    size = (224, 224)
    image_array = np.asarray(image.resize(size))
    img = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
    img_resized = tf.image.resize(img, size)

    prediction = model.predict(np.expand_dims(img_resized / 255, 0))
    predicted_index = np.argmax(prediction[0])

    return CLASS_NAMES[predicted_index]


def predict_and_describe(image: Image.Image, user_id: str) -> dict:
    """Predicts the disease from the image and gets a description from the chat agent."""
    from services.chat.chat import chat

    disease = predict(image)

    description = chat(
        f"Provide a neat description of this skin disease: {disease}. "
        "Include what it is, common symptoms, and general advice.",
        user_id=user_id
    )

    return {
        "predicted_disease": disease,
        "description": description,
    }
