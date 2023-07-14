const radioButtons = document.getElementsByName('search-type');
  radioButtons.forEach(radioButton => {
    radioButton.addEventListener('click', () => {
      radioButtons.forEach(rb => {
        rb.checked = false;
      });

      radioButton.checked = true;
    });
  });


  
  fetch('/data-all')
    .then(response => response.json())
    .then(data => {
    const blogList = document.getElementById('list');
    blogList.innerHTML = '';
    for (let i = 1; i < data.length; i++) {
      const blog = data[i];
      const listItem = document.createElement('li');
      const timeSpan = document.createElement('span');
      timeSpan.classList.add('time');
      timeSpan.textContent = blog.UTC;
      listItem.appendChild(timeSpan);

      const urgentDiv = document.createElement('div');
      urgentDiv.classList.add('urgent');
      urgentDiv.textContent = blog.Urgent;
      listItem.appendChild(urgentDiv);

      if (parseInt(blog.Urgent) >= 4) {
        urgentDiv.style.backgroundColor = 'red';
      }
      const titleHeading = document.createElement('h4');
      titleHeading.textContent = blog.Title || 'No Title Available'; // Populate the title or set a default value
      listItem.appendChild(titleHeading);

      const contentPara = document.createElement('p');
      contentPara.textContent = 'Source '+ blog.EventSource + ' - Type ' +blog.EventType+ " - RA "+ (blog.RA) + ' - DEC ' + (blog.DEC); 
      listItem.appendChild(contentPara);
      blogList.appendChild(listItem);
    }
  })
  .catch(error => {
      console.error('Failed to fetch data:', error);
  });



    fetch('/data-more-info')
    .then(response => response.json())
    .then(data => {
      const markDiv = document.querySelector('.mark');
      markDiv.innerHTML = `
      <span class="time">${data[0].UTC}</span>
      <div class="urgent">${data[0].Urgent}</div>
      <h2>${data[0].Name}</h2>
      <span>${'Source '+data[0].EventSource + ' - Type ' +data[0].EventType+ " - RA "+ + data[0].RA + ' - DEC ' + data[0].DEC}</span>
      <p>${'Type ' +data[0].Type + ' - Parallax ' + data[0].Parallax + ' - RadialVelocity ' + data[0].RadialVelocity+ ' - FluxU ' + data[0].FluxU+ ' - FluxB ' + data[0].FluxB+ ' - FluxV ' + data[0].FluxV}</p>`;
      
      const urgentDiv = document.querySelector('.mark .urgent');
      if (parseInt(data[0].Urgent) >= 4) {
        urgentDiv.style.backgroundColor = 'red';
      }
    })
    .catch(error => {
        console.error('Failed to fetch data:', error);
    });



  function search() {
    const searchInput = document.getElementById('search-input');
    const searchText = searchInput.value;
    const radioButtons = document.getElementsByName('search-type');
    const searchDaterange = document.getElementById('daterange');
    const searchDaterangeText = searchDaterange.value;
    let selectedRadio = '';
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        selectedRadio = radioButton.value;
      }
    });
  
    const xhr_info = new XMLHttpRequest();
        xhr_info.open('GET', `/data-more-info?selectedRadio=${encodeURIComponent(selectedRadio)}&searchText=${searchText}&searchDaterangeText=${searchDaterangeText}`);
        xhr_info.setRequestHeader('Content-Type', 'application/json');
        xhr_info.onload = function () {
          if (xhr_info.status === 200) {
            const data = JSON.parse(xhr_info.responseText);
            const markDiv = document.querySelector('.mark');
            markDiv.innerHTML = `
            <span class="time">${data[0].UTC}</span>
            <div class="urgent">${data[0].Urgent}</div>
            <h2>${data[0].Name}</h2>
            <span>${'Source '+data[0].EventSource + ' - Type ' +data[0].EventType+ " - RA "+ + data[0].RA + ' - DEC ' + data[0].DEC}</span>
            <p>${'Type ' +data[0].Type + ' - Parallax ' + data[0].Parallax + ' - RadialVelocity ' + data[0].RadialVelocity+ ' - FluxU ' + data[0].FluxU+ ' - FluxB ' + data[0].FluxB+ ' - FluxV ' + data[0].FluxV}</p>`;
          
            const urgentDiv = document.querySelector('.mark .urgent');
            if (parseInt(data[0].Urgent) >= 4) {
              urgentDiv.style.backgroundColor = 'red';
            }
          } else {
            const markDiv = document.getElementById('.mark');
            markDiv.innerHTML = '';
            console.error('Error retrieving data:', xhr_info.status);
          }
        };
        xhr_info.send();


    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/data-search?selectedRadio=${encodeURIComponent(selectedRadio)}&searchText=${searchText}&searchDaterangeText=${searchDaterangeText}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        const blogList = document.getElementById('list');
        blogList.innerHTML = '';
        for (let i = 1; i < data.length; i++) {
          const blog = data[i];
          const listItem = document.createElement('li');
          const timeSpan = document.createElement('span');
          timeSpan.classList.add('time');
          timeSpan.textContent = blog.UTC;
          listItem.appendChild(timeSpan);

          const urgentDiv = document.createElement('div');
          urgentDiv.classList.add('urgent');
          urgentDiv.textContent = blog.Urgent;
          listItem.appendChild(urgentDiv);
          if (parseInt(blog.Urgent) >= 4) {
            urgentDiv.style.backgroundColor = 'red';
          }
        
          const titleHeading = document.createElement('h4');
          titleHeading.textContent = blog.Title || 'No Title Available'; // Populate the title or set a default value
          listItem.appendChild(titleHeading);

          const contentPara = document.createElement('p');
          contentPara.textContent = 'Source '+ blog.EventSource + ' - Type ' +blog.EventType+ " - RA "+ (blog.RA) + ' - DEC ' + (blog.DEC); 
          listItem.appendChild(contentPara);
          blogList.appendChild(listItem);
        }
        console.log(data);
      } else {
        const blogList = document.getElementById('list');
        blogList.innerHTML = '';
        console.error('Error retrieving data:', xhr.status);
      }
    };
    xhr.send();
  }