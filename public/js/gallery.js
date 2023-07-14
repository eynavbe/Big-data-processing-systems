fetch('/neo-data-last-month')
.then(response => response.json())
.then(data => {
  console.log(data);
  var keyValuePairs2 = data.split('[');
  var key2 = keyValuePairs2[1].replace(']', '');
  var value1  = key2.split(',');
  const dataAll = [];
  for (var i = 1; i < value1.length; i++) {
    var keyValuePairs3 = value1[i];
    dataAll.push(keyValuePairs3);
  }

  const dateCounts = {};
  dataAll.forEach((date) => {
    const dateWithoutTime = date.split(' ')[1].replace("'", '');
    if (dateCounts[dateWithoutTime]) {
      dateCounts[dateWithoutTime]++;
    } else {
      dateCounts[dateWithoutTime] = 1;
    }
  });
  var sizes = [];
  var labels = [];
  for (const date in dateCounts) {
    console.log(`${date}: ${dateCounts[date]}`);
    sizes.push(dateCounts[date]);
    labels.push(date);

  }


  const markDiv = document.querySelector('.graph');
            markDiv.innerHTML = `
            <canvas id="myChart"></canvas>`;
						var ctx = document.getElementById('myChart').getContext('2d');
						var myChart = new Chart(ctx, {
						  type: 'bar',
						  data: {
							labels: labels,
							datasets: [{
							  label: 'Count',
							  data: sizes,
							  backgroundColor: 'rgba(75, 192, 192, 0.2)',
							  borderColor: 'rgba(75, 192, 192, 1)',
							  borderWidth: 1
							}]
						  },
						  options: {
							scales: {
							  y: {
								beginAtZero: true
							  }
							},
							aspectRatio: 2,
							maintainAspectRatio: false
						  }
						});
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

  var table = document.getElementById('nasaTable');
  var tbody = table.getElementsByTagName('tbody')[0];

  for (var i = 0; i < nameData.length; i++) {
    var row = tbody.insertRow(i);
    row.insertCell(0).textContent = nameData[i];
    row.insertCell(1).textContent = minDiameterData[i];
    row.insertCell(2).textContent = maxDiameterData[i];
    row.insertCell(3).textContent = closeApproachData[i];
    row.insertCell(4).textContent = missDistanceData[i];
    row.insertCell(5).textContent = velocityData[i];
  }
})
.catch(error => {
    console.error('Failed to fetch data:', error);
});