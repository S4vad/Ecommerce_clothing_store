
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np



def recommend_products(selected_product_features, products_collection):
    similarities = []
    for product in products_collection.find():
        if "ImageFeatures" in product:
            # Calculate similarity with each image feature vector of the selected product
            max_similarity = max(
                cosine_similarity(
                    [np.array(selected_product_features)], 
                    np.array(product["ImageFeatures"])
                )[0]
            )
            similarities.append((product["_id"], max_similarity))
    # Sort by similarity score in descending order
    similarities = sorted(similarities, key=lambda x: x[1], reverse=True)
    return [product_id for product_id, score in similarities[:5]]  # Return top 5 product IDs


# selected_product = products_collection.find_one({"_id": ObjectId("selected_product_id")})
# recommendations = recommend_products(selected_product["ImageFeatures"], products_collection)