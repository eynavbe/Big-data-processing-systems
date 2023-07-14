import sys
import joblib
from datetime import datetime, timedelta

def main():
    classifier = joblib.load('sunclassifier.pkl')
    prediction_list = []
    if len(sys.argv) > 1:
        start_time = sys.argv[1]
        stop_time = sys.argv[2]
        start = datetime.strptime(start_time, "%H:%M")
        end = datetime.strptime(stop_time, "%H:%M")
        hours_difference = (end - start).total_seconds() / 3600
        if hours_difference < 3:
            num_intervals = int((end - start).total_seconds() / (15 * 60))
            time_array = [start.strftime("%H:%M")]
            for i in range(1, num_intervals + 1):
                time = (start + timedelta(minutes=i * 15)).strftime("%H:%M")
                time_array.append(time)
            time_array.append(end.strftime("%H:%M"))
        else:
            num_intervals = int((end - start).total_seconds() / (30 * 60))
            time_array = [start.strftime("%H:%M")]
            for i in range(1, num_intervals + 1):
                time = (start + timedelta(minutes=i * 30)).strftime("%H:%M")
                time_array.append(time)
            time_array.append(end.strftime("%H:%M"))
        for i in range(len(time_array)):
            time = time_array[i]
            hour = time.split(':')[0]
            minutes = time.split(':')[1]
            timestamp_minutes = int(hour) * 60 + int(minutes)
            prediction = classifier.predict([[timestamp_minutes, timestamp_minutes]])[0]
            prediction_list.append(prediction)
    print(prediction_list)


if __name__ == '__main__':
    main()