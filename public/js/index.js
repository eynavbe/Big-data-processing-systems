
// fetch('/data-save-mongodb')
//   .then(response => response.json())
//   .then(data => {
    
//       console.log(data);
//   })
//   .catch(error => {
//       console.error('Failed to fetch data:', error);
//   });


  fetch('/data-last-day')
  .then(response => response.json())
  .then(data => {
    const grbCount = data.filter(event => event.EventType === '1').length;
    const brightnessRiseCount = data.filter(event => event.EventType === '2').length;
    const uvRiseCount = data.filter(event => event.EventType === '3').length;
    const xrayRiseCount = data.filter(event => event.EventType === '4').length;
    const cometCount = data.filter(event => event.EventType === '5').length;
  
    document.getElementById('grbCount').textContent = grbCount.toString();
    document.getElementById('brightnessRiseCount').textContent = brightnessRiseCount.toString();
    document.getElementById('uvRiseCount').textContent = uvRiseCount.toString();
    document.getElementById('xrayRiseCount').textContent = xrayRiseCount.toString();
    document.getElementById('cometCount').textContent = cometCount.toString();

    const cometEventsUrgent = data.filter(event => event.Urgent === 5);
    if(cometEventsUrgent.length > 0){
      const randomEvent = cometEventsUrgent[Math.floor(Math.random() * cometEventsUrgent.length)];
      const eventData = { UTC: randomEvent.UTC, EventSource: randomEvent.EventSource, RA: randomEvent.RA, DEC: randomEvent.DEC, EventType: randomEvent.EventType, Urgent: randomEvent.Urgent, Title: randomEvent.Title };
      startDelayedEvent(eventData);
    }else{
      const xrayRiseEventsUrgent = data.filter(event => event.Urgent === 4);

      if(xrayRiseEventsUrgent.length > 0){
      const randomEvent = xrayRiseEventsUrgent[Math.floor(Math.random() * xrayRiseEventsUrgent.length)];
      const eventData = { UTC: randomEvent.UTC, EventSource: randomEvent.EventSource, RA: randomEvent.RA, DEC: randomEvent.DEC, EventType: randomEvent.EventType, Urgent: randomEvent.Urgent, Title: randomEvent.Title };
      startDelayedEvent(eventData);
      }
    }
  })
  .catch(error => {
      console.error('Failed to fetch data:', error);
  });



  fetch('/nasa-next-24-hours')
  .then(response => response.text())
  .then(data => {
    var cleanedString = data.replace(/`|\s/g, '');
    var keyValuePairs2 = cleanedString.split('[');
    var key2 = keyValuePairs2[0];
    var value1;
    var key1;
    key1 = key2.replace(/"|{|'|:/g, '');
    var keyValuePairs3 ;
    var keyValuePairs4;
    var tableDataObj = {};
    for (var i = 1; i < keyValuePairs2.length; i++) {
      keyValuePairs3 = keyValuePairs2[i];
      keyValuePairs4 = keyValuePairs3.split(']');
      value1 = keyValuePairs4[0];
      value1 = value1.split(',')
      tableDataObj[key1] = value1;
      key1 = keyValuePairs4[1].replace(/,|'|:/g, '');
    }
  
    var nameData = tableDataObj['Name'];
    var minDiameterData = tableDataObj['EstimatedDiameter(min)'];
    var maxDiameterData = tableDataObj['EstimatedDiameter(max)'];
    var closeApproachData = tableDataObj['CloseApproachDate'];
    var missDistanceData = tableDataObj['MissDistance(kilometers)'];
    var velocityData = tableDataObj['RelativeVelocity(kilometersperhour)'];
  
    const names = [];
    for (var i = 0; i < nameData.length; i++) {
      names.push(nameData[i]);
    }

    const nameList = document.getElementById("name-list");
    names.forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      nameList.appendChild(li);
    });

  })
  .catch(error => {
      console.error('Failed to fetch data:', error);
  });



fetch('/sun_machine_learning')
.then(response => response.json())
.then(data => {
    
})
.catch(error => {
    console.error('Failed to fetch data:', error);
});



function formatTime(time) {
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}


function generateTimestamps(start_time, stop_time) {
  const startTimeParts = start_time.split(':');
  const startHours = parseInt(startTimeParts[0], 10);
  const startMinutes = parseInt(startTimeParts[1], 10);

  const stopTimeParts = stop_time.split(':');
  const stopHours = parseInt(stopTimeParts[0], 10);
  const stopMinutes = parseInt(stopTimeParts[1], 10);

  const start = new Date();
  start.setHours(startHours);
  start.setMinutes(startMinutes);

  const stop = new Date();
  stop.setHours(stopHours);
  stop.setMinutes(stopMinutes);

  const timeArray = [];
  let currentTime = start;
  while (currentTime <= stop) {
    timeArray.push(formatTime(currentTime));
    currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
  }
  return timeArray;
}


function formatTime(time) {
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}


function stopTime() {
  const now = new Date();
  const time = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  const stop_time = formatTime(time);
  return stop_time;
}

function startTime() {
  const now = new Date();
  var start_time = formatTime(now);
  return start_time;
}


var start_time = startTime();
var stop_time = stopTime();
const xhr_info = new XMLHttpRequest();
xhr_info.open('GET', `/sun_prediction?start_time=${start_time}&stop_time=${stop_time}`);
xhr_info.setRequestHeader('Content-Type', 'application/json');
xhr_info.onload = function () {
  if (xhr_info.status === 200) {
    const data = JSON.parse(xhr_info.responseText);
    var keyValuePairs2 = data.split('[');
    var key2 = keyValuePairs2[1].replace(']', '');
    var value1  = key2.split(',');
    const dataAll = [];
  
    for (var i = 0; i < value1.length; i++) {
      var keyValuePairs3 = value1[i].replace("'", "").replace("'", "");  
      dataAll.push(keyValuePairs3);
    }

    const time_list = generateTimestamps(start_time,stop_time);
    const radiationLevels = dataAll;
    const adjustedRadiationLevels = [];
    const yLabels = [10, 20, 30, 40, 50, 60];
    const keys = time_list;
    const adjustedRadiationLevels2 = [];

    for (let i = 0; i < radiationLevels.length-1; i++) {
      const level = radiationLevels[i];
      const levelValue = parseFloat(level.replace(/[A-Z\s]/g, ''));
      adjustedRadiationLevels2.push([keys[i], levelValue]);

      if (level.includes('A')) {
        adjustedRadiationLevels.push([keys[i], yLabels[0] + levelValue]);
      } else if (level.includes('B')) {
        adjustedRadiationLevels.push([keys[i], yLabels[1] + levelValue]);
      } else if (level.includes('C')) {
        adjustedRadiationLevels.push([keys[i], yLabels[2] + levelValue]);
      } else if (level.includes('M')) {
        adjustedRadiationLevels.push([keys[i], yLabels[3] + levelValue]);
      } else if (level.includes('X')) {
        adjustedRadiationLevels.push([keys[i], yLabels[4] + levelValue]);
      }
    }

    var dataSet = anychart.data.set(adjustedRadiationLevels);
    var dataSet2 = anychart.data.set(adjustedRadiationLevels2);

    var firstSeriesData = dataSet.mapAs({x: 0, value: 1});
    var firstSeriesData2 = dataSet2.mapAs({x: 0, value: 1});

    var chart = anychart.line();

    var firstSeries = chart.line(firstSeriesData);
    firstSeries.stroke({ color: "black" }); 
    firstSeries.name("X-ray levels");

    var secondSeries = chart.line(firstSeriesData2);
    secondSeries.hovered().markers().enabled(false); 
    secondSeries.name("X-ray levels");

  
    var tooltip = firstSeries.tooltip();
    tooltip.format("{%chart.series('X-ray levels').value}");
    secondSeries.stroke(null);
    
    chart.legend().enabled(true);
    chart.title("The activity of the sun in the last two hours");

    chart.container("sunGraph");

    chart.yScale().ticks().interval(10);

    const yLabels2 = ['','A', 'B', 'C', 'M', 'X'];
    chart.yAxis().labels().format(function () {
      return yLabels2[this.tickValue/10];
    });

    const straightLineDataA = keys.map((key) => [key, 10]);
    const straightLineDataSetA = anychart.data.set(straightLineDataA);
    const straightLineSeriesDataA = straightLineDataSetA.mapAs({ x: 0, value: 1 });
    const straightLineSeriesA = chart.line(straightLineSeriesDataA);
    straightLineSeriesA.name("A");
    straightLineSeriesA.stroke({ color: "rgb(192, 192, 192)" }); 
    straightLineSeriesA.hovered().markers().enabled(false); 
    straightLineSeriesA.tooltip().enabled(false); 

    const straightLineDataB = keys.map((key) => [key, 20]);
    const straightLineDataSetB = anychart.data.set(straightLineDataB);
    const straightLineSeriesDataB = straightLineDataSetB.mapAs({ x: 0, value: 1 });
    const straightLineSeriesB = chart.line(straightLineSeriesDataB);
    straightLineSeriesB.name("B");
    straightLineSeriesB.stroke({ color: "gray" }); 
    straightLineSeriesB.hovered().markers().enabled(false); 
    straightLineSeriesB.tooltip().enabled(false); 

    const straightLineDataC = keys.map((key) => [key, 30]);
    const straightLineDataSetC = anychart.data.set(straightLineDataC);
    const straightLineSeriesDataC = straightLineDataSetC.mapAs({ x: 0, value: 1 });
    const straightLineSeriesC = chart.line(straightLineSeriesDataC);
    straightLineSeriesC.name("C");
    straightLineSeriesC.stroke({ color: "yellow" }); 
    straightLineSeriesC.hovered().markers().enabled(false); 
    straightLineSeriesC.tooltip().enabled(false);

    const straightLineDataM = keys.map((key) => [key, 40]);
    const straightLineDataSetM = anychart.data.set(straightLineDataM);
    const straightLineSeriesDataM = straightLineDataSetM.mapAs({ x: 0, value: 1 });
    const straightLineSeriesM = chart.line(straightLineSeriesDataM);
    straightLineSeriesM.name("M");
    straightLineSeriesM.stroke({ color: "orange" }); 
    straightLineSeriesM.hovered().markers().enabled(false); 
    straightLineSeriesM.tooltip().enabled(false); 

    const straightLineDataX = keys.map((key) => [key, 50]);
    const straightLineDataSetX = anychart.data.set(straightLineDataX);
    const straightLineSeriesDataX = straightLineDataSetX.mapAs({ x: 0, value: 1 });
    const straightLineSeriesX = chart.line(straightLineSeriesDataX);
    straightLineSeriesX.name("X");
    straightLineSeriesX.stroke({ color: "red" }); 
    straightLineSeriesX.hovered().markers().enabled(false); 
    straightLineSeriesX.tooltip().enabled(false); 

    chart.draw();
  } else {}
};
xhr_info.send();


const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  console.log('WebSocket connection opened');
};

socket.onmessage = (event) => {
  const newEvents = JSON.parse(event.data);
  handleUrgentMessage(newEvents);
};

function handleUrgentMessage(events) {
  const urgentEvents = events.filter((event) => event.Urgent >= 4);

  if (urgentEvents.length > 0) {
    openFlashingWindow(urgentEvents);
  }
}

function openFlashingWindow(urgentEvents) {
  const flashingWindowWidth = 400;
  const flashingWindowHeight = 300;
  const flashingWindowLeft = window.innerWidth / 2 - flashingWindowWidth / 2;
  const flashingWindowTop = window.innerHeight / 2 - flashingWindowHeight / 2;

  const flashingWindow = window.open(
    '',
    '_blank',
    `width=${flashingWindowWidth},height=${flashingWindowHeight},left=${flashingWindowLeft},top=${flashingWindowTop}`
  );      
  const flashingWindowDoc = flashingWindow.document;


  const cardStyles = `
    .card {
      width: 200px;
      height: 150px;
      border: 1px solid #ccc;
      margin: 10px;
      padding: 10px;
    }
  `;

  const flashingStyles = `
    body {
      background-color: white;
      animation: flashing 1s infinite;
    }

    @keyframes flashing {
      0% {
        background-color: white;
      }
      50% {
        background-color: red;
      }
      100% {
        background-color: white;
      }
    }
  `;



  const cardElements = urgentEvents
    .map((event) => `<div class="card">
    UTC: ${event.UTC}<br>
    EventSource: ${event.EventSource}<br>
    RA: ${event.RA}<br>
    DEC: ${event.DEC}<br>
    EventType: ${event.EventType}<br>
    Urgent: ${event.Urgent}<br>
    Title: ${event.Title}
  </div>`)        .join('');

  const htmlContent = `
    <html>
    <head>
      <title>Flashing Window</title>
      <style>
        ${cardStyles}
        ${flashingStyles}
      </style>
    </head>
    <body>
      
      <h1>URGENT MESSAGE</h1>
      <p>An urgent event has occurred!</p>
      ${cardElements}
    </body>
    </html>`;

  flashingWindowDoc.open();
  flashingWindowDoc.write(htmlContent);
  flashingWindowDoc.close();
}

function startDelayedEvent(eventData) {
  setTimeout(() => sendEventData(eventData), 5000); 
}


function sendEventData(eventData) {
  fetch('http://localhost:3000/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  })
    .then((response) => {
      if (response.ok) {
        console.log('Event data sent successfully');
      } else {
        console.error('Failed to send event data');
      }
    })
    .catch((error) => {
      console.error('An error occurred while sending event data:', error);
    });
}