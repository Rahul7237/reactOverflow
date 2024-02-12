import React, { useState, useEffect } from 'react';
import '../css/Weather.css'; // Ensure this path matches your CSS file's location

function Weather({ Weather }) {
    const [input, setInput] = useState('');
    const [weather, setWeather] = useState({
        loading: false,
        data: null,
        error: false,
        errorMessage: ''
    });

    const toDateFunction = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
    };

    const fetchWeather = async (lat, lon, city = null) => {
        //setWeather({ ...weather, loading: true });
        const apiKey = '433894e0bdab09b4cea83d34e561f606'; // Replace with your actual API key
        let url = city ?
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}` :
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const responseData = await response.json();
            setWeather({ data: responseData, loading: false, error: false });
            const weatherData = {
                cityName: responseData.name,
                temp: Math.round(responseData.main.temp),
                weatherLooks: responseData.weather[0].description.toUpperCase(),
                icon: responseData.weather[0].icon,
            }
            Weather(weatherData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeather({ loading: false, error: true, errorMessage: 'Failed to fetch weather data' });
        }
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error('Error getting location:', error);
                setWeather({ error: true, errorMessage: 'Geolocation not available' });
            }
        );
    }, []);

    const handleSearch = (event) => {
        if (event.key === 'Enter' && input) {
            fetchWeather(null, null, input);
            setInput('');
        }
    };

    return (
        <div className="weather-app">
            <h2> Explore Weather With City Names</h2>
            <div className="search-bar">
                <input
                    type="text"
                    className="city-search"
                    placeholder="Enter City Name..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleSearch}
                />
            </div>
            {weather.error && (
                <span className="error-message">
                    <span style={{ marginLeft: '10px' }}>{weather.errorMessage}</span>
                </span>
            )}
            {weather.data && (
                <div className="weather-details">
                    <div className="city-name">
                        <h2>{weather.data.name}, <span>{weather.data.sys.country}</span></h2>
                    </div>
                    <div className="date">
                        <span>{toDateFunction(weather.data.dt)}</span>
                    </div>
                    <div className="icon-temp">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                            alt={weather.data.weather[0].description}
                        />
                        {Math.round(weather.data.main.temp)}<sup className="deg">°C</sup>
                    </div>
                    <div className="des-wind">
                        <p>{weather.data.weather[0].description.toUpperCase()}</p>
                        <p>Wind Speed: {weather.data.wind.speed} m/s</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Weather;
