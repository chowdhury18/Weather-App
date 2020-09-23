// eslint-disable-next-line no-unused-vars
const debug = require('debug',)('weathermap',);

const Koa = require('koa',);
const router = require('koa-router',)();
const bodyParser = require('koa-body',)();
const fetch = require('node-fetch',);
const cors = require('kcors',);

// const appId = process.env.APPID || '203b57b10848013a65d81ebc3c505efe';
// const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
// const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';
// const port = process.env.PORT || 9000;

const appId = process.env.APPID || '';
const mapURI = process.env.MAP_ENDPOINT || "";
const targetCity = process.env.TARGET_CITY || "";
const port = process.env.PORT;

const app = new Koa();

app.use(cors(),);

const fetchWeather = async () => {
  const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
  const response = await fetch(endpoint,);
  return response ? response.json() : {};
};

const fetchForecast = async () => {
  const endpoint = `${mapURI}/forecast?q=${targetCity}&appid=${appId}&`;
  const response = await fetch(endpoint,);
  return response ? response.json() : {};
};

const fetchGeoLocation = async (lat, lon,) => {
  const endpoint = `${mapURI}/weather?lat=${lat}&lon=${lon}&appid=${appId}&`;
  const response = await fetch(endpoint,);
  return response ? response.json() : {};
};

router.get('/api/weather', async (ctx,) => {
  const weatherData = await fetchWeather();
  const todayDate = Date(weatherData.dt,);
  const data = { Date: todayDate, Weather: weatherData.weather[0], };
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = data;
},);

router.get('/api/forecast', async (ctx,) => {
  const todayForecastdata = [];
  const forecastData = await fetchForecast();
  const keys = Object.keys(forecastData,);
  if (keys.includes('list',)) {
    Object.keys(forecastData.list,).forEach(function (key,) {
      const date = new Date(forecastData.list[key].dt_txt,).getDate();
      const todayDate = new Date();
      if (todayDate.getDate() === date) {
        const data = {
          Date: forecastData.list[key].dt_txt,
          Weather: forecastData.list[key].weather[0],
        };
        todayForecastdata.push(data,);
      }
    },);
  }
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = todayForecastdata;
},);

router.post('/api/location', bodyParser, async (ctx,) => {
  const postData = ctx.request.body;
  const weatherData = await fetchGeoLocation(postData.lat, postData.lon,);
  const todayDate = Date(weatherData.dt,);
  const data = { Date: todayDate, Weather: weatherData.weather[0], Loc: weatherData.name, };
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = data;
},);

app.use(router.routes(),);
app.use(router.allowedMethods(),);

app.listen(port,);

console.log(`App listening on port ${port}`,);
