from sklearn.model_selection import train_test_split
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import  StandardScaler
from sklearn.multiclass import OneVsRestClassifier
from sklearn.metrics import precision_score, accuracy_score, recall_score, f1_score
from pymongo import MongoClient
import joblib


url = "https://www.lmsal.com/solarsoft/latest_events/"
response = requests.get(url)
html_content = response.text
soup = BeautifulSoup(html_content, "html.parser")
body_text = soup.body.get_text()
lines = body_text.split("\n")
lines = [line.strip() for line in lines if line.strip()]
start_index = lines.index("Derived Position")
table_data = []
for i in range(start_index + 1, len(lines[start_index + 1:]), 7):
    row_data = lines[i:i+7]
    table_data.append({
        "Start": row_data[2],
        "Last": row_data[2].split(' ')[0] + ' '+ row_data[3],
        "GOES Class": row_data[5],
    })


url = "https://www.lmsal.com/solarsoft/latest_events_archive.html"
response = requests.get(url)
html_content = response.text
soup = BeautifulSoup(html_content, "html.parser")
body_text = soup.body.get_text()
lines = body_text.split("\n")
lines = [line.strip() for line in lines if line.strip()]
start_index = lines.index("#X")
for i in range(start_index + 1, len(lines[start_index + 1:]), 9):
    row_data = lines[i:i+9]
    if row_data[1] != '-':
        table_data.append({
            "Start": row_data[1]+":00",
            "Last": row_data[2]+":00",
            "GOES Class": row_data[4].split(' ')[0] ,
        })


if len(table_data) > 100:
    urlMongo = 'mongodb://localhost:27017'  
    dbName = 'admit'
    collectionName = 'sunactivity' 
    client = MongoClient(urlMongo)
    db = client[dbName]
    collection = db[collectionName]
    collection.delete_many({})
    insert_result = collection.insert_many(table_data)
else:
    urlMongo = 'mongodb://localhost:27017' 
    dbName = 'admit'  
    collectionName = 'sunactivity'  
    client = MongoClient(urlMongo)
    db = client[dbName]
    collection = db[collectionName]
    all_documents = collection.find()
    table_data = all_documents


X = []
y = []
for data in table_data:
    start_time = data['Start']
    last_time = data['Last']
    goes_class = data['GOES Class']
    start_dt = datetime.strptime(start_time, "%Y/%m/%d %H:%M:%S")
    start_minutes = start_dt.hour * 60 + start_dt.minute
    last_dt = datetime.strptime(last_time, "%Y/%m/%d %H:%M:%S")
    last_minutes = last_dt.hour * 60 + last_dt.minute
    X.append([start_minutes, last_minutes])
    y.append(goes_class)


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline = make_pipeline(StandardScaler(), OneVsRestClassifier(RandomForestClassifier(random_state=42)))
pipeline.fit(X_train, y_train)
joblib.dump(pipeline, 'sunclassifier.pkl')
y_pred = pipeline.predict(X_test)
precision = precision_score(y_test, y_pred, average='weighted', zero_division=1)
accuracy = accuracy_score(y_test, y_pred)
recall = recall_score(y_test, y_pred, average='weighted', zero_division=1)
f1 = f1_score(y_test, y_pred, average='weighted', zero_division=1)
print("Precision:", precision)
print("Accuracy:", accuracy)
print("Recall:", recall)
print("F1-score:", f1)




# timestamp_minutes = int(hour) * 60 + int(minutes)
# classifier = joblib.load('sunclassifier.pkl')
# prediction_encoded = classifier.predict([[timestamp_minutes, timestamp_minutes]])[0]
# prediction = prediction_encoded
# print("Predicted radiation level at 10:27:", prediction)