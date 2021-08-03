loadAddressInfo = function (url, weatherurl, callback) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      callback(weatherurl, request.responseText);
    }
  };
  const address = document.getElementById("address").value;
  request.open("GET", url + address + "&api_key=8009f18b206193355553f40101b926f21108b36");
  request.send();
};

loadWeatherData = function (url, addressResponse) {
  const jsonFormat = JSON.parse(addressResponse);
  const locationInfo = jsonFormat["results"][0].location;
  const latitude = locationInfo.lat;
  const longitude = locationInfo.lng;
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      loadForeCast(request.responseText);
      const parsedResponse = JSON.parse(request.responseText);
      const parsedStation = parsedResponse["properties"].radarStation;
      loadCurrent(parsedStation);
    }
  };
  request.open("GET", url + latitude + "," + longitude);
  request.send();
};

loadForeCast = function (weatherResponse) {
  const jsonFormat = JSON.parse(weatherResponse);

  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      displayForeCast(request.responseText, weatherResponse);
    }
  };
  const foreCastUrl = jsonFormat["properties"].forecast;
  request.open("GET", foreCastUrl);
  request.send();
};

loadCurrent = function (station) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      displayCurrent(request.responseText);
    }
  };
  request.open("GET", "https://api.weather.gov/stations/" + station + "/observations/latest");
  request.send();
};

// Loop through Current Data
function displayCurrent(currentData) {
  const parsedCurrent = JSON.parse(currentData);
  const currentDiv = document.getElementById("currentDiv");
  const cardBody = document.createElement("div");
  const imgTag = document.createElement("img");
  const nameTag = document.createElement("h4");
  const temperatureTag = document.createElement("h6");
  const highTemperatureTag = document.createElement("h6");
  const lowTemperatureTag = document.createElement("h6");
  const heatIndexTag = document.createElement("h6");
  const descriptionTag = document.createElement("h6");
  const windDirectionTag = document.createElement("h6");
  const windSpeedTag = document.createElement("h6");
  const windGustTag = document.createElement("h6");
  const humidityTag = document.createElement("h6");
  const dewPointTag = document.createElement("h6");

  let tempFahr = 0;

  // console.log(parsedCurrent);

  // Reset all fields - Find better way?
  currentDiv.innerHTML = "";

  // Create card
  cardBody.id = "card";
  cardBody.className = "card-div";

  // Show Current
  nameTag.innerHTML = "Currently";

  //Create image
  imgTag.id = "img";
  imgTag.src = parsedCurrent.properties.icon;

  // Show temp
  temperatureTag.id = "temp";
  tempFahr = convertCelsiusToFahr(parsedCurrent.properties.temperature.value);
  temperatureTag.innerHTML = "Current Temperature: " + tempFahr;

  if (parsedCurrent.properties.maxTemperatureLast24Hours.value) {
    // Show high temp
    highTemperatureTag.id = "high-temp";
    tempFahr = convertCelsiusToFahr(parsedCurrent.properties.maxTemperatureLast24Hours.value);
    highTemperatureTag.innerHTML = "High Temperature (past 24 hrs): " + tempFahr;
  }

  if (parsedCurrent.properties.minTemperatureLast24Hours.value) {
    // Show low temp
    lowTemperatureTag.id = "low-temp";
    tempFahr = convertCelsiusToFahr(parsedCurrent.properties.minTemperatureLast24Hours.value);
    lowTemperatureTag.innerHTML = "Low Temperature (past 24 hrs): " + tempFahr;
  }

  if (parsedCurrent.properties.heatIndex.value) {
    // Show heat index
    heatIndexTag.id = "heat-index";
    tempFahr = convertCelsiusToFahr(parsedCurrent.properties.heatIndex.value);
    heatIndexTag.innerHTML = "Heat Index: " + tempFahr;
  }

  // Show description
  descriptionTag.id = "description";
  descriptionTag.innerText = parsedCurrent.properties.textDescription;

  // Show wind direction
  windDirectionTag.id = "wind-direction";
  windDirectionTag.innerHTML =
    "Wind Direction: " + parsedCurrent.properties.windDirection.value + "<span>&#176;</span>";

  // Show wind speed
  windSpeedTag.id = "wind-speed";
  let speedMph = convertKphToMph(parsedCurrent.properties.windSpeed.value);
  windSpeedTag.innerText = "Wind Speed: " + speedMph + " mph";

  if (parsedCurrent.properties.windGust.value) {
    // Show wind gust
    windGustTag.id = "wind-gust";
    windGustTag.innerText = "Wind Gust: " + parsedCurrent.properties.windGust.value;
  }

  // Show humidity
  humidityTag.id = "humidity";
  humidityTag.innerText = "Humidity: " + parsedCurrent.properties.windDirection.value + "%";

  // Show dew point
  dewPointTag.id = "dew";
  tempFahr = convertCelsiusToFahr(parsedCurrent.properties.dewpoint.value);
  dewPointTag.innerText = "Dew Point: " + tempFahr;

  // Append info
  currentDiv.appendChild(cardBody);
  cardBody.append(imgTag);
  cardBody.append(nameTag);
  cardBody.append(descriptionTag);
  cardBody.append(temperatureTag);
  cardBody.append(heatIndexTag);
  cardBody.append(highTemperatureTag);
  cardBody.append(lowTemperatureTag);
  cardBody.append(windGustTag);
  cardBody.append(windDirectionTag);
  cardBody.append(windSpeedTag);
  cardBody.append(humidityTag);
  cardBody.append(dewPointTag);
}

// Loop through foreCastData
function displayForeCast(foreCastData, locationData) {
  const parsedForecast = JSON.parse(foreCastData);
  const parsedLocationData = JSON.parse(locationData);
  const locationDiv = document.getElementById("locationDiv");
  const locationTag = document.createElement("h2");
  const gridDiv = document.getElementById("foreCastDiv");

  // Reset all fields - Find better way?
  locationDiv.innerHTML = "";
  gridDiv.innerHTML = "";

  // Create location
  locationTag.id = "location";
  locationTag.className = "location-heading";
  locationTag.innerHTML =
    parsedLocationData.properties.relativeLocation.properties.city +
    ", " +
    parsedLocationData.properties.relativeLocation.properties.state;
  locationDiv.appendChild(locationTag);

  for (let i = 0; i <= 13; i++) {
    const cardBody = document.createElement("div");
    const imgTag = document.createElement("img");
    const nameTag = document.createElement("h4");
    const temperatureTag = document.createElement("h6");
    const windSpeedTag = document.createElement("h6");
    const windDirectionTag = document.createElement("h6");
    const detailedForecastTag = document.createElement("p");

    // Create card
    cardBody.id = "card" + i;
    cardBody.className = "card-div";

    //Create image
    imgTag.id = "img" + i;
    imgTag.src = parsedForecast.properties.periods[i].icon;

    // Create name
    nameTag.id = "day" + i;
    nameTag.className = "period-name";
    nameTag.innerText = parsedForecast.properties.periods[i].name;

    // Creat wind speed
    temperatureTag.id = "temperature" + i;
    temperatureTag.className = "temperature";
    temperatureTag.innerText = "Temperature: " + parsedForecast.properties.periods[i].temperature;

    // Creat wind speed
    windSpeedTag.id = "windspeed" + i;
    windSpeedTag.className = "wind-speed";
    windSpeedTag.innerText = "Wind Speed: " + parsedForecast.properties.periods[i].windSpeed;

    // Creat wind direction
    windDirectionTag.id = "winddirection" + i;
    windDirectionTag.className = "wind-direction";
    windDirectionTag.innerText = "Wind Direction: " + parsedForecast.properties.periods[i].windDirection;

    // Create description
    detailedForecastTag.id = "description" + i;
    detailedForecastTag.className = "detail-description";
    detailedForecastTag.innerText = parsedForecast.properties.periods[i].detailedForecast;

    // Append info
    gridDiv.appendChild(cardBody);
    cardBody.append(imgTag);
    cardBody.append(nameTag);
    cardBody.append(temperatureTag);
    cardBody.append(windSpeedTag);
    cardBody.append(windDirectionTag);
    cardBody.append(detailedForecastTag);

    // imgTag.onclick = function () {
    //
    // };
  }
}

function convertCelsiusToFahr(temp) {
  let tempFahr = Math.round((temp * 9) / 5 + 32);
  return tempFahr;
}

function convertKphToMph(speed) {
  let speedMph = Math.round(speed / 1.609344);
  return speedMph;
}
