import joblib
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.naive_bayes import MultinomialNB

file_path ="python_ml_models/datas/clothing_review.csv"
data = pd.read_csv(file_path)


print("Dataset info:")
print(data.info())
print("\nDataset description:")
print(data.describe())
print("\nNull values in each column:")
print(data.isnull().sum())

data = data[['Review Text', 'Recommended IND']].dropna()

data['Sentiment'] = data['Recommended IND'].apply(lambda x: 'Positive' if x == 1 else 'Negative')


# sns.countplot(data=data, x='Sentiment')
# plt.title("Sentiment Distribution")
# plt.show()


data['Review Text'] = data['Review Text'].str.lower()


tfidf = TfidfVectorizer(max_features=5000)
X = tfidf.fit_transform(data['Review Text'])
y = data['Sentiment']


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)


joblib.dump(model, "python_ml_models/savedModels/sentiment_model.joblib")
joblib.dump(tfidf, "python_ml_models/savedModels/tfidf_vectorizer.joblib")


y_pred = model.predict(X_test)


accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy * 100:.2f}%")


conf_matrix = confusion_matrix(y_test, y_pred)
# sns.heatmap(conf_matrix, annot=True, fmt="d", cmap="Blues", xticklabels=['Negative', 'Positive'], yticklabels=['Negative', 'Positive'])
# plt.title("Confusion Matrix")
# plt.xlabel("Predicted")
# plt.ylabel("Actual")
# plt.show()


print("Classification Report:")
print(classification_report(y_test, y_pred))


def predict_sentiment(review_text):
    review_text = review_text.lower()  # Preprocess the text
    review_tfidf = tfidf.transform([review_text])  # Transform the text into TF-IDF features
    prediction = model.predict(review_tfidf)
    return prediction[0]


sample_review = input("Enter Password: ")
print("Sample review:", sample_review)
print("Predicted Sentiment:", predict_sentiment(sample_review))




