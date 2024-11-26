
from pymongo import MongoClient
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId  #objectId should import otherwise show internal error 

try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["ecommerce"]
    products_collection = db["products"]
    print("MongoDB connection successful.")
except Exception as e:
    print("Failed to connect to MongoDB:", e)

# Load ResNet50 model for feature extraction
model = ResNet50(weights="imagenet", include_top=False, pooling="avg")

def get_recommendations(product_id):
    """Fetch recommended products based on image features"""
    selected_product = products_collection.find_one({"_id": ObjectId(product_id)})

    if not selected_product or not selected_product.get("ImageFeatures"):
        raise ValueError("Product or its features not found.")

    selected_features = np.array(selected_product["ImageFeatures"])
    print(f"The Features of product are: {selected_features}")

    recommendations = []

    for product in products_collection.find({"_id": {"$ne": ObjectId(product_id)}}): #ne for notequal
        if "ImageFeatures" in product and product["ImageFeatures"]:
            product_features = np.array(product["ImageFeatures"])

            similarity = cosine_similarity(selected_features, product_features).max()     
            recommendations.append({"product_id": str(product["_id"]), "similarity": similarity})


    # Sort by similarity in descending orde
    recommendations.sort(key=lambda x: x["similarity"], reverse=True)

    print(f"The final recommendation are: {recommendations}")

    return recommendations[:5]
