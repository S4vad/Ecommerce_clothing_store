from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np


# Load ResNet50 model for feature extraction
model = ResNet50(weights="imagenet", include_top=False, pooling="avg")

def extractFeatures(img_path):
    try:
        print(f"Extracting features from: {img_path}")
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        print("Image preprocessed, extracting features...")
        features = model.predict(img_array)
        print("Extracted Features:", features)  # Add this to see the output
        return features.flatten().tolist()
    except Exception as e:
        print(f"Error extracting features: {e}")
        raise RuntimeError(f"Error in feature extraction: {e}")

