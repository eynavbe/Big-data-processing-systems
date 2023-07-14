fetch('/sun-simulation')
.then(response => response.json())
.then(data => {
    document.getElementById("sunSimulation").src = "../images/sunspots.jpg";
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
    currentTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
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
  var start_time = formatTime(now);
  return start_time;
}

function startTime() {
  const now = new Date();  
  const time = new Date(now.getTime() - 12 * 10 * 60 * 1000);
  var stop_time =formatTime(time);
  return stop_time;
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
    const timestamps = time_list
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

  } else {
    
  }
};
xhr_info.send();