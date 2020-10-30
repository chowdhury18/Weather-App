const fetch = require('node-fetch', );

// fetch the forecast information of target city
const fetchForecast = async(mapURI, targetCity, appId) => {
    const endpoint = `${mapURI}/forecast?q=${targetCity}&appid=${appId}&`;
    const response = await fetch(endpoint, );
    return response ? response.json() : {};
};

// get the forecast information of target city
const getForecast = (router, mapURI, targetCity, appId) => {
    router.get('/api/forecast', async(ctx, ) => {
        const todayForecastdata = [];
        const forecastData = await fetchForecast(mapURI, targetCity, appId);
        const keys = Object.keys(forecastData, );
        if (keys.includes('list', )) {
            Object.keys(forecastData.list, ).forEach(function(key, ) {
                const date = new Date(forecastData.list[key].dt_txt, ).getDate();
                const todayDate = new Date();
                const weatherData = forecastData.list[key];
                if (todayDate.getDate() === date) {
                    const weather = {
                        main: weatherData.weather[0].main,
                        icon: weatherData.weather[0].icon
                    }
                    const temp = {
                        temp: (weatherData.main.temp - 273.15).toFixed(0),
                        feels_like: (weatherData.main.feels_like - 273.15).toFixed(0)
                    };
                    const wind = weatherData.wind;
                    const location = targetCity;
                    const data = {
                        Date: weatherData.dt_txt,
                        Weather: weather,
                        Temp: temp,
                        Wind: wind,
                        Location: location
                    };
                    todayForecastdata.push(data, );
                }
            }, );
        }
        ctx.type = 'application/json; charset=utf-8';
        ctx.body = todayForecastdata;
    }, );

}

module.exports = getForecast;