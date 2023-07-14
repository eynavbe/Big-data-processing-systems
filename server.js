const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const { spawn } = require('child_process');
const moment = require('moment');

const WebSocket = require('ws');

const app = express();

const { MongoClient } = require('mongodb');
const urlMongo = 'mongodb://adminUser:adminPassword@127.0.0.1:27017';
const clientMongo = new MongoClient(urlMongo);

const dbName = 'admit'; 
const collectionName = 'events';


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    const url = 'http://localhost:3000/';
    import('chalk').then((chalk) => {
        const blue = chalk.default.blue;
        const underline = chalk.default.underline;
        console.log(`Server running on ${blue(url)}`);
        console.log(`Click to open the dashboard: ${underline(blue(url))}`);
      });
    res.sendFile(__dirname + '/views/index.html');
  });
  


app.get('/sun_machine_learning', async (req, res) => {
  const pythonProcess = spawn('python', ['sun_machine_learning.py']);
  pythonProcess.stdout.on('data', (data) => {

    res.json( (data.toString()));
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(data.toString());
    res.status(500).json({ error: 'Failed to fetch NEO data' });
  });
  });



app.get('/sun-simulation', async (req, res) => {
  const pythonProcess = spawn('python', ['sun_scrap.py']);
  pythonProcess.stdout.on('data', (data) => {

    res.json( (data.toString()));
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(data.toString());
    res.status(500).json({ error: 'Failed to fetch NEO data' });
  });
  });



  
app.get('/sun_prediction', async (req, res) => {
  console.log("sun_prediction");
  const { start_time,stop_time} = req.query;
  console.log(start_time)
  console.log(stop_time)


  const pythonProcess = spawn('python', ['sun_prediction.py',start_time,stop_time]);
  pythonProcess.stdout.on('data', (data) => {
    console.log((data.toString()));
    res.json( (data.toString()));
  });
  

  pythonProcess.stderr.on('data', (data) => {
    console.error(data.toString());
    res.status(500).json({ error: 'Failed to fetch NEO data' });
  });
  });



app.get('/data', async (req, res) => {
  const { Client } = require('@elastic/elasticsearch');
  const client = new Client({ node: 'http://localhost:9200' }); 

    try {
      const { body } = await client.search({
        index: 'astro', 
        size: 1000, 
        body: {
          query: {
            match_all: {}
          }
        }
      });
  
      const hits = body.hits.hits.map(hit => hit._source);
      client.close();
      res.json(hits);
   
    } catch (error) {
      console.error('Failed to retrieve documents:', error);
      res.status(500).json({ error: 'Failed to retrieve documents' });
    }
  });




app.get('/data-save-mongodb', async (req, res) => {
  const { Client } = require('@elastic/elasticsearch');
  const client = new Client({ node: 'http://localhost:9200' }); 
  try {
      const { body } = await client.search({
        index: 'astro',
        size: 1000, 
        body: {
          query: {
            match_all: {}
          }
        }
      });
  
      let hits = body.hits.hits.map(hit => hit._source);
      client.close();

    await clientMongo.connect();
    const db = clientMongo.db(dbName);
    const collection = db.collection(collectionName);
    const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', ' UTC');
    const trimmedTime = currentTime.split('.')[0] + " UTC";
    const lastDayEvents = await collection
      .find({ UTC: { $lte: trimmedTime } })
      .toArray();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const filteredHits = hits.filter((hit) => {
      const hitDate = new Date(hit.UTC);
      return hitDate >= lastWeek;
    });
    const deleteResult = await collection.deleteMany({});
    lastWeek.setDate(lastWeek.getDate() - 7);
    const insertResult = await collection.insertMany(filteredHits);
    res.json(insertResult);
  } catch (error) {
    console.log("Failed to insert hits2");
    console.error('Failed to insert hits2:', error);
    res.status(500).json({ error: 'Failed to insert hits2' });
  } finally {
    await clientMongo.close();
  }
});



app.get('/data-last-day', async (req, res) => {
  try {
    const clientMongo = new MongoClient(urlMongo);
    await clientMongo.connect();
    const db = clientMongo.db(dbName);
    const collection = db.collection(collectionName);
    const currentDate = new Date();
    const startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
    const endTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startISO = startTime.toISOString().replace('T', ' ').replace('Z', ' UTC');
    const endISO = endTime.toISOString().replace('T', ' ').replace('Z', ' UTC');

    const eventsLastDay = await collection
      .find({ UTC: { $gte: startISO, $lt: endISO } })
      .sort({ UTC: -1 })
      .toArray();

    console.log(eventsLastDay.length);
    if (eventsLastDay.length > 0) {
      res.json(eventsLastDay);
    } else {
      res.status(404).json({ message: 'No events found.' });
    }
  } catch (error) {
    console.error('Error retrieving closest events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    clientMongo.close();
  }
});



app.get('/data-all', async (req, res) => {
  try {
    const clientMongo = new MongoClient(urlMongo);
    await clientMongo.connect();
    const db = clientMongo.db(dbName);
    const collection = db.collection(collectionName);

    const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', ' UTC');
    const trimmedTime = currentTime.split('.')[0] + " UTC";
    const closestEvents = await collection
    .find({ UTC: { $lte: trimmedTime } })
    .sort({ UTC: -1 })
    .toArray();
    if (closestEvents.length > 0) {
      res.json(closestEvents);
    } else {
      res.status(404).json({ message: 'No events found.' });
    }
  } catch (error) {
    console.error('Error retrieving closest events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    clientMongo.close();
  }
});




app.get('/data-search', async (req, res) => {
  try {
   
    const clientMongo = new MongoClient(urlMongo);
    await clientMongo.connect();
    const db = clientMongo.db(dbName);
    const collection = db.collection(collectionName);
    const { selectedRadio, searchText ,searchDaterangeText} = req.query;
    let filter = {};
    const dateRangeParts = searchDaterangeText.split(' - ');
    const startDate = moment(dateRangeParts[0], 'DD/MM/YYYY').utc().format();
    const endDate = moment(dateRangeParts[1], 'DD/MM/YYYY').utc().format();
    switch (selectedRadio) {
      case '0':
        filter = { Title: searchText, UTC: { $gte: startDate, $lte: endDate } };
        break;
      case '1':
        filter = { EventType: searchText, UTC: { $gte: startDate, $lte: endDate } };
        break;
      case '2':
        filter = { EventSource: searchText, UTC: { $gte: startDate, $lte: endDate } };
        break;
      default:
        res.status(400).json({ message: 'Invalid search type.' });
        return;
    }
    const closestEvents = await collection.find(filter).toArray();
    if (closestEvents.length > 0) {
      res.json(closestEvents);
    } else {
      res.status(404).json({ message: 'No events found.' });
    }
  } catch (error) {
    console.error('Error retrieving closest events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    clientMongo.close();
  }
});



app.get('/data-more-info', async (req, res) => {
  const pythonResults = [];
  try {
    const clientMongo = new MongoClient(urlMongo);
    await clientMongo.connect();
    const db = clientMongo.db(dbName);
    const collection = db.collection(collectionName);
    const { selectedRadio, searchText ,searchDaterangeText} = req.query;
   
    var closestEvent;
    if (selectedRadio || searchText || searchDaterangeText) {
      let filter = {};
      const dateRangeParts = searchDaterangeText.split(' - ');
      const startDate = moment(dateRangeParts[0], 'DD/MM/YYYY').utc().format();
      const endDate = moment(dateRangeParts[1], 'DD/MM/YYYY').utc().format();
    
    switch (selectedRadio) {
      case '0':
        filter = { Title: searchText, UTC: { $gte: startDate, $lte: endDate } };
        break;
      case '1':
        filter = { EventType: searchText, UTC: { $gte: startDate, $lte: endDate } };
        break;
      case '2':
        filter = { EventSource: searchText, UTC: { $gte: startDate, $lte: endDate } };
        break;
      default:
        res.status(400).json({ message: 'Invalid search type.' });
        return;
    }
     closestEvent = await collection.findOne(
      filter,
      { sort: { UTC: 1 } }
    );
    }else{
      const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', ' UTC');
    const trimmedTime = currentTime.split('.')[0] + " UTC";
     closestEvent = await collection.findOne(
      { UTC: { $lte: trimmedTime } },
      { sort: { UTC: -1 } }
    );
    }
    
    if (closestEvent) {
      const {EventType,Urgent,count,UTC,EventSource,RA,DEC,Title} = closestEvent;
      const pythonProcess = spawn('python', ['details_star.py', UTC, RA, DEC]);
      let result = '';
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      await new Promise((resolve, reject) => {
        pythonProcess.on('close', (code) => {
          const resultArray = result.split('\n');
          const separatedResult = {};
          
          for (const line of resultArray) {
            if (line.includes(':')) {
              const [key, value] = line.split(':');
              const trimmedKey = key.trim();
              const trimmedValue = value.trim();
          
              separatedResult[trimmedKey] = trimmedValue;
            }
          }
          
          Name = separatedResult['Object Name'];
          Type = separatedResult['Object Type'];
          Parallax = separatedResult['Parallax'];
          RadialVelocity = separatedResult['Radial Velocity'];
          FluxU = separatedResult['Flux U'];
          FluxB = separatedResult['Flux B'];
          FluxV = separatedResult['Flux V'];

          pythonResults.push({
            EventType,
            Urgent,
            count,
            UTC,
            EventSource,
            RA,
            DEC,
            Name,
            Type,
            Parallax,
            RadialVelocity,
            FluxU,
            FluxB,
            FluxV
          });

          resolve();
        });

        pythonProcess.on('error', (error) => {
          console.error('Python script execution failed:', error);
          reject(error);
        });
      });
      res.json(pythonResults);
    } else {
      res.status(404).json({ message: 'No events found.' });
    }
  } catch (error) {
    console.error('Error retrieving closest event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    clientMongo.close();
  }
});

  

  app.get('/nasa-next-24-hours', (req, res) => {
    const pythonProcess = spawn('python', ['nasa_data.py', 'neo_data_next_24_hours']);
    pythonProcess.stdout.on('data', (data) => {
      res.json( (data.toString()));
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(data.toString());
      res.status(500).json({ error: 'Failed to fetch NEO data' });
    });
  });


  app.get('/nasa-data-last-month', (req, res) => {
    const pythonProcess = spawn('python', ['nasa_data.py', 'neo_data_last_month']);
    pythonProcess.stdout.on('data', (data) => {
      const neoData = JSON.parse(data.toString());
      res.json(neoData);
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error(data.toString());
      res.status(500).json({ error: 'Failed to fetch NEO data' });
    });
  });
  

  app.get('/neo-next-24-hours', (req, res) => {
    const pythonProcess = spawn('python', ['neo_data.py', 'neo_data_next_24_hours']);
    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      const neoData = JSON.parse(data.toString());
      result += data.toString();
      res.json(neoData);
    });
    pythonProcess.stderr.on('data', (data) => {
      console.error(data.toString());
      res.status(500).json({ error: 'Failed to fetch NEO data' });
    });
  });


  app.get('/neo-data-last-month', (req, res) => {
    const pythonProcess = spawn('python', ['neo_data.py', 'neo_data_last_month']);
    pythonProcess.stdout.on('data', (data) => {   
      res.json(data.toString());
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error(data.toString());
      res.status(500).json({ error: 'Failed to fetch NEO data' });
    });
  });



const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
  exec(`open http://localhost:${port}`);
});


const wss = new WebSocket.Server({ server });

let events = [];

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  ws.send(JSON.stringify(events));
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

app.post('/events', express.json(), (req, res) => {
  const event = req.body;
  console.log(event);
  events.push(event);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify([event]));
    }
  });

  res.sendStatus(200);
});
