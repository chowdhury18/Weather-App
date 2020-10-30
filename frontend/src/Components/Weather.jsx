import React from 'react';
import './Components.css';

// Weather components
function Weather(props) {
    const data = props.weatherData;
    const date = new Date(data.Date);
    const dateString = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    return (
        <div className="weather_container">
            <div className="weather_left_container">
                <img style={logo} alt="icon" src={`/Img/${data.Weather.icon.slice(0, -1)}.svg`} />
            </div>
            <div className="weather_right_container">
                <span><b>Date:</b> {dateString}</span> <br/>
                <span><b>Location:</b> {data.Location}</span> <br/>
                <span><b>Weather:</b> {data.Weather.main}</span> <br/>
                <span><b>Temperature:</b> {data.Temp.temp}&#8451;</span> <br/>
                <span><b>Feels like:</b> {data.Temp.feels_like}&#8451;</span> <br/>
            </div>
        </div>
    )
};

const logo = {
    width: "50%",
    height: "50%"
};

export default Weather;
