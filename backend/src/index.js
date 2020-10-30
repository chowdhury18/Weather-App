// eslint-disable-next-line no-unused-vars
const debug = require('debug', )('weathermap', );
const Koa = require('koa', );
const router = require('koa-router', )();
const bodyParser = require('koa-body', )();
const fetch = require('node-fetch', );
const cors = require('kcors', );

// import controllers
const getTargetCityWeather = require('./controller/getTargetCity');
const getForecastWeather = require('./controller/getForecast');
const getCurrentLocationWeather = require('./controller/getCurrentLocation');

// initializing the dependent variables
const appId = process.env.APPID;
const mapURI = process.env.MAP_ENDPOINT;
const targetCity = process.env.TARGET_CITY;
const port = process.env.PORT;

// initializing the app
const app = new Koa();

// initializing the usage
app.use(cors(), );
app.use(router.routes(), );
app.use(router.allowedMethods(), );

// controllers
getTargetCityWeather(router, mapURI, targetCity, appId);
getForecastWeather(router, mapURI, targetCity, appId);
getCurrentLocationWeather(router, mapURI, appId);

// listen to server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`, );
});