from fastapi import FastAPI
from pydantic import BaseModel
from recommendation import get_recommendations
from fastapi.responses import JSONResponse
import os
from extractFeatureHelper import extractFeatures

app = FastAPI()

# Base path to the uploads directory
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "../public/uploads")

class RecommendationRequest(BaseModel):
    product_id: str

@app.post("/recommendations/")
async def recommend_products(request: RecommendationRequest):
    product_id = request.product_id
    try:
        recommendations = get_recommendations(product_id)
        return JSONResponse(content={"recommendations": recommendations})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

class FeatureRequest(BaseModel):
    image_path: str

@app.post("/extract-features/")
async def extract_features_api(request: FeatureRequest):
    try:
        # Resolve the full image path by joining the base upload directory and the requested image path
        img_path = os.path.normpath(os.path.join(UPLOAD_DIR, request.image_path))  # Normalize the path
        
        # Print the full image path for debugging
        print(f"Extracting features from: {img_path}")
        
        # Call the feature extraction function
        features = extractFeatures(img_path)
        return JSONResponse(content={"features": features})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
