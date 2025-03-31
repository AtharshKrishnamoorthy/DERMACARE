import os
import tensorflow as tf
import numpy as np
import cv2

class Model:
    def __init__(self, file):
        self.image = file

    def predict_class(self):
        class_names = [
            "Actinic Keratosis",
            "Melanoma",
            "Squamous Cell Carcinoma",
            "Vascular Lesion",
            "Basal Cell Carcinoma",
            "Benign Keratosis",
            "Dermatofibroma",
            "Melanocytic Nevi"
        ]

        try:
            if not os.path.exists('my_model.h5'):
                raise FileNotFoundError("Model file 'my_model.h5' not found.")

            load_model = tf.keras.models.load_model('my_model.h5')

            # Resize the image to the desired size
            size = (224, 224)
            resized_image = self.image.resize(size)
            image_array = np.asarray(resized_image)
            img = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
            img_reshaped = tf.image.resize(img, size)
            prediction = load_model.predict(np.expand_dims(img_reshaped / 255, 0))
            predicted_class_index = np.argmax(prediction[0])
            predicted_class_name = class_names[predicted_class_index]
            return predicted_class_name

        except FileNotFoundError as e:
            return f"Error: {e}"
        except Exception as e:
            return f"Error predicting: {e}"
