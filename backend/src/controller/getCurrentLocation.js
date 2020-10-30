const fetch = require('node-fetch', );
const bodyParser = require('koa-body', )();

// fetching weather information based on geo-location
const fetchGeoLocation = async(lat, lon, mapURI, appId) => {
    const endpoint = `${mapURI}/weather?lat=${lat}&lon=${lon}&appid=${appId}&`;
    const response = await fetch(endpoint, );
    return response ? response.json() : {};
};

// get weather information of current location
const getCurrentLocation = (router, mapURI, appId) => {
    router.post('/api/location', bodyParser, async(ctx, ) => {
        const postData = ctx.request.body;
        const weatherData = await fetchGeoLocation(postData.lat, postData.lon, mapURI, appId);
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

module.exports = getCurrentLocation;