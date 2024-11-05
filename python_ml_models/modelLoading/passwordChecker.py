import joblib
import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer

def word(password):
    # Tokenization logic, modify as needed
    return list(password) 
    
model = joblib.load("python_ml_models/savedModels/password_strength_model.joblib")
tdif = joblib.load("python_ml_models/savedVectorizer/passwordChecker_tfidf_vectorizer.joblib")

# Read input data directly from command line arguments
password = sys.argv[1]  # Now we get the password directly

# Transform the input password
data_vec = tdif.transform([password]).toarray()

# Make a prediction
prediction = model.predict(data_vec)

# Output the prediction
print(json.dumps({'strength': prediction[0]}))
