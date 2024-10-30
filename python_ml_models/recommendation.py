from pymongo import MongoClient
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np
from bson import ObjectId

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["your_database_name"]
products_collection = db["Products"]

# Load pre-trained ResNet50 model for feature extraction
model = ResNet50(weights="imagenet", include_top=False, pooling="avg")

def extract_features(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    features = model.predict(img_array)
    return features.flatten()

# Loop through products and extract features for each image
for product in products_collection.find():
    product_features = []
    for img_filename in product["Images"]:
        img_path = f"./public/uploads/{img_filename}"  # Path where images are stored
        feature_vector = extract_features(img_path)
        product_features.append(feature_vector.tolist())  # Store feature vectors as lists

    # Update product in MongoDB with extracted features
    products_collection.update_one(
        {"_id": ObjectId(product["_id"])},
        {"$set": {"ImageFeatures": product_features}}
    )
