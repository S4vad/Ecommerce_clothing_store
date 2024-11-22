import joblib
import sys
from sklearn.feature_extraction.text import TfidfVectorizer


sentiment_model = joblib.load('python_ml_models/savedModels/sentiment_model.joblib')
tfidf_vectorizer = joblib.load('python_ml_models/savedVectorizer/sentimentAnalysis_tfidf_vectorizer.joblib')

def predict_sentiment(review_text):
    review_tfidf = tfidf_vectorizer.transform([review_text.lower()])
    prediction = sentiment_model.predict(review_tfidf)
    return prediction[0]  

if __name__ == '__main__':
    review_text = sys.argv[1]  # Get the review text passed from Node.js
    
