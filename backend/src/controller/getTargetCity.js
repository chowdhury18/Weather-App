const fetch = require('node-fetch', );

// fetch the weather information of target city
const fetchWeather = async(mapURI, targetCity, appId) => {
    const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
    const response = await fetch(endpoint, );
    return response ? response.json() : {};
};

// get the weather information of target city
const getTargetCity = (router, mapURI, targetCity, appId) => {
    router.get('/api/weather', async(ctx, ) => {
        const weatherData = await fetchWeather(mapURI, targetCity, appId);
        const todayDate = Date(weatherData.dt, );
        const weather = {
            main: weatherData.weather[0].main,
            icon: weatherData.weather[0].icon
        }
        const temp = {
            temp: (weatherData.main.temp - 273.15).toFixed(0),
            feels_like: (weatherData.main.feels_like - 273.15).toFixed(0)
        };
        const wind = weatherData.wind;
        const location = weatherData.name;
        const data = {
            Date: todayDate,
            Weather: weather,
            Temp: temp,
            Wind: wind,
            Location: location
        };
        ctx.type = 'application/json; charset=utf-8';
        ctx.body = data;
    }, );
};

module.exports = getTargetCity;