from pymongo import MongoClient
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# MongoDB connection
client = MongoClient("mongodb://localhost:3000/")
db = client["your_database_name"]
products_collection = db["Products"]

# Load ResNet50 model for feature extraction
model = ResNet50(weights="imagenet", include_top=False, pooling="avg")

def extract_features(img_path):
    """Extract features using ResNet50"""
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    features = model.predict(img_array)
    return features.flatten()

def get_recommendations(product_id):
    """Fetch recommended products based on image features"""
    selected_product = products_collection.find_one({"_id": ObjectId(product_id)})
    if not selected_product or not selected_product.get("ImageFeatures"):
        raise ValueError("Product or its features not found.")

    selected_features = np.array(selected_product["ImageFeatures"])
    recommendations = []

    for product in products_collection.find({"_id": {"$ne": ObjectId(product_id)}}):
        if "ImageFeatures" in product and product["ImageFeatures"]:
            product_features = np.array(product["ImageFeatures"])
            similarity = cosine_similarity([selected_features], [product_features]).max()
            recommendations.append({"product_id": str(product["_id"]), "similarity": similarity})

    # Sort by similarity in descending order
    recommendations.sort(key=lambda x: x["similarity"], reverse=True)
    return recommendations[:5]
