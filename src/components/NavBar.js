import React from 'react';
import '../css/NavBar.css';

const NavBar = ({ onLoginClick, onSignupClick, logOut, mode, toggleSideNav, WeatherData }) => {
  const getWeatherIcon = (weatherCode) => {
    switch (weatherCode.toUpperCase()) {
      case 'CLEAR SKY':
        return '☀️'; // Sun icon
      case 'FEW CLOUDS':
        return '🌤️'; // Sun behind clouds icon
      case 'SCATTERED CLOUDS':
      case 'BROKEN CLOUDS':
        case 'OVERCAST CLOUDS':
        return '☁️'; // Cloud icon
      case 'SHOWER RAIN':
      case 'RAIN':
        return '🌧️'; // Rain cloud icon
      case 'THUNDERSTORM':
        return '⛈️'; // Thunderstorm icon
      case 'SNOW':
        return '❄️'; // Snowflake icon
      case 'MIST':
        return '💨'; // Wind icon for mist
        case 'HAZE':
        return '🌫️';
      default:
        return '❓'; // Question mark for unknown weather
    }
  };

  return (
    <nav className="navbar">
      {mode === 'logout' && (
        <button className="side-nav-toggle" onClick={toggleSideNav}>
          ☰
        </button>
      )}
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>

      {mode === 'logout' && (
      <div className="weather-info">
        <div>
          <strong>{WeatherData.cityName}</strong>
        </div>
        <span>{WeatherData.temp}°C</span>
        <div>
        

          <span className='weather-icon'>{getWeatherIcon(WeatherData.weatherLooks)}</span>

         
          <span>{WeatherData.weatherLooks}</span>
        </div>
      </div>
      )}

      <div className="auth-links">
        {mode === 'login' && (
          <div>
            <button onClick={onLoginClick}>Log In</button>
            <button onClick={onSignupClick}>Sign Up</button>
          </div>
        )}
        {mode === 'logout' && (
          <div>
            <button onClick={logOut}>Log Out</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
