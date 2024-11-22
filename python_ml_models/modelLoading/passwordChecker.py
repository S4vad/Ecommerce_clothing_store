import joblib
import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer

def word(password):
    # Tokenization logic, modify as needed
    return list(password)

model = joblib.load("python_ml_models/savedModels/password_strength_model.joblib")
tdif = joblib.load("python_ml_models/savedVectorizer/passwordChecker_tfidf_vectorizer.joblib")

password = sys.argv[1]  # Get password from command line arguments

if not password:
    print(json.dumps({'strength': 'Error: No password provided'}))
    sys.exit(1)

# Transform password input
data_vec = tdif.transform([password]).toarray()


prediction = model.predict(data_vec)

print(json.dumps({'strength': prediction[0]}))  
