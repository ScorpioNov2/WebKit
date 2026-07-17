import React, { useState, useEffect } from 'react';
import './App.css';

const OPENMETEO_API = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

const weatherIcons = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌧️', 53: '🌧️', 55: '🌧️',
  61: '🌧️', 63: '⛈️', 65: '⛈️',
  71: '❄️', 73: '❄️', 75: '❄️',
  77: '❄️', 80: '🌧️', 81: '⛈️', 82: '⛈️',
  85: '❄️', 86: '❄️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
};

function App() {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Foggy', 51: 'Drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
      61: 'Rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Snow', 73: 'Snow',
      75: 'Heavy snow', 77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers',
      82: 'Rain showers', 85: 'Snow showers', 86: 'Snow showers',
      95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
    };
    return descriptions[code] || 'Unknown';
  };

  const geocodeCity = async (cityName) => {
    const response = await fetch(
      `${GEOCODING_API}?name=${cityName}&count=1&language=en&format=json`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('City not found');
    }

    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
      name: data.results[0].name,
      country: data.results[0].country
    };
  };

  const fetchWeather = async (latitude, longitude, cityName, countryName) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${OPENMETEO_API}?` +
        `latitude=${latitude}&` +
        `longitude=${longitude}&` +
        `current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&` +
        `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&` +
        `timezone=auto`
      );

      const data = await response.json();
      setWeatherData({ ...data, cityName, countryName });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const location = await geocodeCity(city);
      await fetchWeather(
        location.latitude,
        location.longitude,
        location.name,
        location.country
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const geoData = await response.json();
          const cityName = geoData.address.city || geoData.address.town || 'Your Location';
          const countryName = geoData.address.country || '';

          await fetchWeather(latitude, longitude, cityName, countryName);
        } catch (err) {
          setError('Failed to get location name');
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    handleSearch({ preventDefault: () => {} });
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Fetching weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🌤️ Weather Dashboard</h1>
      </div>

      <div className="search-box">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
          />
          <button type="submit">Search</button>
          <button type="button" onClick={handleLocationClick}>📍 My Location</button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      {weatherData && (
        <>
          <CurrentWeather data={weatherData} getWeatherDescription={getWeatherDescription} weatherIcons={weatherIcons} />
          <Forecast data={weatherData} getWeatherDescription={getWeatherDescription} weatherIcons={weatherIcons} />
        </>
      )}
    </div>
  );
}

function CurrentWeather({ data, getWeatherDescription, weatherIcons }) {
  const current = data.current;
  const icon = weatherIcons[current.weather_code] || '🌤️';
  const description = getWeatherDescription(current.weather_code);

  return (
    <div className="current-weather">
      <div className="weather-main">
        <div className="weather-icon">{icon}</div>
        <div className="weather-info">
          <h2>{data.cityName}, {data.countryName}</h2>
          <p className="temperature">{Math.round(current.temperature_2m)}°C</p>
          <p>{description}</p>
        </div>
      </div>
      <div className="weather-details">
        <DetailCard label="Feels Like" value={`${Math.round(current.temperature_2m)}°C`} />
        <DetailCard label="Humidity" value={`${current.relative_humidity_2m}%`} />
        <DetailCard label="Wind Speed" value={`${Math.round(current.wind_speed_10m)} km/h`} />
        <DetailCard label="Timezone" value={data.timezone} />
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="detail-card">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
}

function Forecast({ data, getWeatherDescription, weatherIcons }) {
  const daily = data.daily;

  return (
    <div className="forecast">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {daily.time.slice(0, 5).map((date, index) => {
          const dateObj = new Date(date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const weatherCode = daily.weather_code[index];
          const icon = weatherIcons[weatherCode] || '🌤️';
          const description = getWeatherDescription(weatherCode);
          const maxTemp = Math.round(daily.temperature_2m_max[index]);
          const minTemp = Math.round(daily.temperature_2m_min[index]);

          return (
            <ForecastCard
              key={date}
              day={dayName}
              icon={icon}
              maxTemp={maxTemp}
              minTemp={minTemp}
              description={description}
            />
          );
        })}
      </div>
    </div>
  );
}

function ForecastCard({ day, icon, maxTemp, minTemp, description }) {
  return (
    <div className="forecast-card">
      <h4>{day}</h4>
      <div className="icon">{icon}</div>
      <div className="temp">{maxTemp}° / {minTemp}°</div>
      <div className="condition">{description}</div>
    </div>
  );
}

export default App;
