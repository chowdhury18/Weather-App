import React, { Component } from 'react'
import './App.css';
import Weather from './Components/Weather';
import Forecast from './Components/Forecast';

// ENDPOINT
const apiURL = process.env.ENDPOINT || "http://localhost:9000/api";

// fetch the lat and lon of current location through browser (promise)
function getPosition() {
  return new Promise((res, rej) => {
    // eslint-disable-next-line no-undef
    navigator.geolocation.getCurrentPosition(res, rej);
  });
}

// fetch the lat and lon of current location through browser
const getWeatherFromGeoLocation = async () => {
  try {
    const loc = await getPosition();
    const crd = loc.coords;
    const endpoint = `${apiURL}/location`;
    const response = await fetch(
      endpoint,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: crd.latitude,
          lon: crd.longitude,
        }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
  return {};
};

// fetch the weather information of target city
const getTargetCityFromApi = async () => {
  try {
    const response = await fetch(`${apiURL}/weather`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

// fetch the weather forecast of target city
const getForecastFromApi = async () => {
  try {
    const response = await fetch(`${apiURL}/forecast`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

// check for empty object
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

// App component
export class App extends Component {
  constructor(props) {
    super(props)
    const initialData = {
      "Date": new Date().toString(),
      "Weather": {
        "main": "Clear",
        "icon": "01d"
      },
      "Temp": {
        "temp": "30",
        "feels_like": "35"
      },
      "Wind": {
        "speed": 6,
        "deg": 180
      },
      "Location": "Helsinki"
    }
    this.state = {
       targetCityData: initialData,
       currentLocationData: initialData,
       forecastData: [initialData],
    }
  }

  async componentDidMount() {
    const forecastData = [];
    const weather = await getTargetCityFromApi();
    //console.log("fetchTargetCity:", weather);
    if (!isEmptyObject(weather)) {
      this.setState({ targetCityData: weather });
    } else {
      console.log('Weather data of Helsinki region NO FOUND');
    }

    const locationWeather = await getWeatherFromGeoLocation();
    //console.log("fetchCurrentLoc:", locationWeather);
    if (!isEmptyObject(locationWeather)) {
      this.setState({ currentLocationData: locationWeather });
    } else {
      console.log('Weather data of current location NO FOUND');
    }

    const forecast = await getForecastFromApi();
    //console.log("fetchForecast:", forecast);
    if (!isEmptyObject(forecast)) {
      const keys = Object.keys(forecast);
      for (let i = 0; i < keys.length; i += 1) {
        forecastData.push(forecast[i]);
      }
      this.setState({forecastData: forecastData});
    } else {
      console.log('Weather forecast for today NO FOUND');
    }
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Weather App</h2>
        </header>
        <div className="App-Weather-Body">
          <h4>Target Location</h4>
          <Weather weatherData={this.state.targetCityData}/>
          <h4>Current Location</h4>
          <Weather weatherData={this.state.currentLocationData}/>
          <h4>Forecast</h4>
          <Forecast forecastData={this.state.forecastData} />
          <hr/>
        </div>
      </div>
    )
  }
}

export default App;