from fastapi import FastAPI
from pydantic import BaseModel
from recommendation import get_recommendations
from fastapi.responses import JSONResponse

app = FastAPI()

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
