import React from 'react';
import Weather from './Weather';

// Forecast components
function Forecast(props) {
    const data = props.forecastData;
    return data.map((forecast, index) => <Weather key={index} weatherData={forecast}/>);
};

export default Forecast;
