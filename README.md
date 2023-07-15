# Big-data-processing-systems
In this project, a system is designed that is fed by relays that warn of astronomical events, presents them at a daily update level, stores and enables research and search and locating patterns through machine learning. </br>
Design and implementation of a big data alert and analytics system harnessing NoSQL Databases infrastructures, tools from Ecosystem Hadoop
and a guided concept of services (local and cloud-based) using a typical architectural template for a hybrid cloud computing environment.

## the requirements in the project
### Functional requirements
- The system has one user type and there is no need for user management.
- The system will save locally a copy of the catalog of bright celestial objects (Catalog Star Bright)
- The system will receive messages from a simulator about astronomical events.
- Each message will include:
  - Date and time (UTC)
  - Notifying factor (from a list of about ten observatories or satellite telescopes).
  - Location in RA and DEC units
  - Type of event:
    - Gamma ray burst (GRB)
    - A significant increase in the level of apparent illumination (Rise Brightness Apparent)
    - Significant increase in UV radiation (Rise UV)
    - Significant increase in X-ray radiation (Rise Ray-X)
    - Discovery of a comet
  - Reference urgency level (1-5)
- The system will display a list of recent event data within the Dashboard, a recent event will be displayed separately with full details about it
The source (let's say the details of the star) and if the urgency level is 4 or higher it will be highlighted and UX effects will be implemented to attract the user's attention.
- The system will allow searching and locating:
  - All messages involving some celestial body within a time frame.
  - All messages, or messages of a certain type, in a time frame.
  - All messages originating from a certain observatory/telescope in a time frame.
- The system will display the list of bodies that are supposed to pass near KA in the next 24 hours.
- The system will display the solar activity forecast for the next few hours

### Non-functional requirements
- The overall system design will be conceptually based on the Lambda Architecture template.
- Services will be developed based on the Microservices pattern.
- The central application server be based on Express/js.Node and Python services.
- The potential source data for astronomical events (stars, nebulae) will be copied from the Harvard University catalog and will be managed by the Redis server (locally or via Docker).
- using Web Scraping
- The Kafka server (in the cloud) will receive messages and distribute them to the Search Elastic search engine (in a Docker container).
- Machine learning - predicting solar activity data
- A js.Node-based (local) server will use the following databases:
  - Search Elastic (Docker): performing queries regarding astronomical event data as detailed in the requirements above.
  - Redis (local or Docker): will be used as a cache for quick locating of star data and other entities.
  - MongoDB (in the cloud): storing solar activity data for the need to perform machine learning.
  - MongoDB - Astronomical event data storage from Elastic
- js.Node-based server (local) will create a Cards-based dashboard with summary indicators showing the number
- The events of any type that have been reported in the last day, and if an urgent message arrives, a flashing window will be displayed (via
WS protocol).
- Additionally, a js.Node-based server (local) will display:
  - Distribution of the types of events in the last week (cut by urgency 1-5)
  - Graph of the distribution of asteroids that passed near 21 in the last month (by size)
  - The table of NEOs that will pass near KA in the next 24 hours and their data
  - Graph of the sun's activity in the last two hours (X-radiation levels)
  - Simulation of the activity and appearance of the sun's surface at the current time

## sources
- [Bright Star Catalog JSON](https://github.com/aduboisforge/Bright-Star-Catalog-JSON)
- Data about asteroids that are near KA from: </br>
[NEO Earth Close Approaches (nasa.gov)](https://cneos.jpl.nasa.gov/ca/) </br>
[NASA Open APIs](https://api.nasa.gov/)
- Solar data from: </br>
[Solar information](https://www.spaceweatherlive.com/en/solar-activity.html) </br>
[Simulation sun](https://theskylive.com/sun-info) </br>
[Solar activity](https://www.lmsal.com/)
- Details about a star/celestial object using the SIMBAD catalog.



## Instructions for working with the app server:

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
node send_to_redis.js
```

The Redis exported data works directly in the simulator that makes the Json messeages.

*important, this step should be done only once to get all the data in the server*


5. Generates messages and publishes them to the Kafka topic.

```
python main.py
```
   
6. Open a new terminal or command prompt and navigate to the project directory.
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


Feel free to modify or enhance the code as per your requirements.

7. Download and install Node.js on your computer.


8. Download and install MongoDB Desktop on your computer.
9. connect to MongoDB 

10. run the project
```
node server.js
```


## Simulation of the project
