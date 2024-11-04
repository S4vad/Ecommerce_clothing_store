
from joblib import dump

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

csv_file_path = 'python_ml_models/datas/pass.csv'
data = pd.read_csv(csv_file_path, on_bad_lines='skip', encoding='latin-1')
print(data.head())


data = data.dropna()
data["strength"] = data["strength"].map({0: "Weak", 
                                         1: "Medium",
                                         2: "Strong"})
print(data.sample(5))



data=data[0:30000]




def word(password):
    character=[]
    for i in password:
        character.append(i)
    return character
  
x = np.array(data["password"])
y = np.array(data["strength"])

tdif = TfidfVectorizer(tokenizer=word)
x = tdif.fit_transform(x)

xtrain, xtest, ytrain, ytest = train_test_split(x, y, 
                                                test_size=0.05, 
                                                random_state=42)


model = RandomForestClassifier()
model.fit(xtrain, ytrain)
print(model.score(xtest, ytest))


model_filename = 'python_ml_models/savedModels/password_strength_model.joblib'
dump(model, model_filename)


tfidf_filename = 'python_ml_models/savedVectorizer/passwordChecker_tfidf_vectorizer.joblib'
dump(tdif, tfidf_filename) 


import getpass
user = input("Enter Password: ")
data = tdif.transform([user]).toarray()
output = model.predict(data)
print(output)







