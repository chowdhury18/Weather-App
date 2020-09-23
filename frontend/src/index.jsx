/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';

const apiURL = process.env.ENDPOINT;

const getWeatherFromApi = async () => {
  try {
    const response = await fetch(`${apiURL}/weather`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

const getForecastFromApi = async () => {
  try {
    const response = await fetch(`${apiURL}/forecast`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

function getPosition() {
  return new Promise((res, rej) => {
    // eslint-disable-next-line no-undef
    navigator.geolocation.getCurrentPosition(res, rej);
  });
}

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

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: [],
      foreData: [],
    };
  }

  async componentDidMount() {
    const arr = [];
    const forecastData = [];
    const weather = await getWeatherFromApi();
    if (!isEmptyObject(weather)) {
      const data = { loc: 'Helsinki', icon: weather.Weather.icon.slice(0, -1) };
      arr.push(data);
      this.setState({ icon: arr });
    } else {
      console.log('Weather data of Helsinki region NO FOUND');
    }
    const forecast = await getForecastFromApi();
    if (!isEmptyObject(forecast)) {
      const keys = Object.keys(forecast);
      for (let i = 0; i < keys.length; i += 1) {
        forecastData.push({
          date: forecast[keys[i]].Date,
          icon: forecast[keys[i]].Weather.icon.slice(0, -1),
        });
        this.setState({
          foreData: forecastData,
        });
      }
    } else {
      console.log('Weather forecast for today NO FOUND');
    }
    const locationWeather = await getWeatherFromGeoLocation();
    if (!isEmptyObject(locationWeather)) {
      const data = {
        loc: locationWeather.Loc,
        icon: locationWeather.Weather.icon.slice(0, -1),
      };
      arr.push(data);
      this.setState({ icon: arr });
    } else {
      console.log('Weather data of current location NO FOUND');
    }
  }

  render() {
    const { icon, foreData } = this.state;
    return (
      <div className="icon">
        {
          icon.map((item) => (
            <div key={item.loc}>
              <span>Location: </span>
              {item.loc }
              <img alt="icon" src={`/img/${item.icon}.svg`} />
            </div>
          ))
        }
        <h4>Forcast</h4>
        {
          foreData.map((item) => (
            <div key={item.date}>
              <span>Date and Time: </span>
              {item.date}
              <img alt="icon" src={`/img/${item.icon}.svg`} />
            </div>
          ))
        }
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app'),
);
