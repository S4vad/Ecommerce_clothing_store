import joblib
import sys
import json

model = joblib.load("python_ml_models/savadModels/password_strength_model.joblib")
tdif = joblib.load("python_ml_models/savadVectorizer/passwordChecker_tfidf_vectorizer.joblib")

# Read input data
data = json.loads(sys.stdin.read())
password = data['password']
data_vec = tdif.transform([password]).toarray()  # Ensure variable names match

# Make a prediction
prediction = model.predict(data_vec)  # Use the correct variable name

# Output the prediction
print(json.dumps({'strength': prediction[0]}))  # Change key for clarity
