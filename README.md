# Cloud_Computing_Course

Instructions for working with the app server:

1. Download and install Docker Desktop on your computer.
2. Clone or download all the files from this repository.
3. Open a terminal or command prompt and navigate to the project directory.
Start the Docker containers by running the following command:
```
docker-compose up
```
This command will set up the necessary containers for the application.
To stop the containers, you can use the following command:
```
docker-compose down
```
4. Start the program that sends the data from the JSON (BSC.JSON) to Redis container:
```
node send_to_redis_js
```

The Redis exported data works directly in the simulator that makes the Json messeages.

*important, this step should be done only once to get all the data in the server*

5. Open a new terminal or command prompt and navigate to the project directory.
Run the Kafka consumer by executing the following command:
```
node kafkaConsume.js
```
This will start consuming messages from the Kafka topic.

You should see in the kafkaConsume.js terminal something like this :

Document indexed successfully-check

{

  UTC: '2023-06-04 02:21:51 UTC',
  
  EventSource: 'Keck 1 and 2',
  
  RA: '08:05:49.60',
  
  DEC: '+25:14:06.00',
  
  EventType: '2',
  
  Urgent: 1
  
}

Document indexed successfully

That means that the data is sent to Elastic.

You can check this by running this program:
```
python check_elastic.py
```

That should print something like this:

{'UTC': '2023-07-02 16:21:13 UTC', 'EventSource': 'Thirty Meter Telescope', 'RA': '09:22:24.0', 'DEC': '-60:29:58.0', 'EventType': '1', 'Urgent': 5}

{'UTC': '2023-06-21 05:46:28 UTC', 'EventSource': 'Very Large Telescope', 'RA': '12:20:10.7', 'DEC': '-39:43:34.0', 'EventType': '2', 'Urgent': 4}

{'UTC': '2023-06-03 10:26:15 UTC', 'EventSource': 'Very Large Telescope', 'RA': '08:46:49.2', 'DEC': '+49:07:15.0', 'EventType': '2', 'Urgent': 2}

{'UTC': '2023-06-26 03:02:19 UTC', 'EventSource': 'Gran Telescopio Canarias', 'RA': '21:58:53.4', 'DEC': '-02:26:52.0', 'EventType': '1', 'Urgent': 5}

{'UTC': '2023-06-07 16:09:47 UTC', 'EventSource': 'MMT', 'RA': '19:28:42.3', 'DEC': '-23:31:19.0', 'EventType': '1', 'Urgent': 5}

{'UTC': '2023-06-15 08:27:56 UTC', 'EventSource': 'MMT', 'RA': '23:44:40.7', 'DEC': '-72:46:32.0', 'EventType': '2', 'Urgent': 5}

{'UTC': '2023-06-27 05:11:50 UTC', 'EventSource': 'Keck 1 and 2', 'RA': '05:38:53.1', 'DEC': '-22:23:30.0', 'EventType': '2', 'Urgent': 2}

Feel free to modify or enhance the code as per your requirements.
