// Weather.js
// This component fetches and displays both daily and weekly weather information.

import React, { useState } from "react";
import { API_KEY } from "./config";

function Weather() {
  // State variables to store user input and weather data
  const [city, setCity] = useState(""); 
  const [today, setToday] = useState(null);
  const [forecast, setForecast] = useState([]);

  // Function to fetch weather based on city
  const getWeather = async () => {
    if (!city) {
      alert("Please enter a city name.");
      return;
    }

    try {
      // Step 1: Get coordinates (latitude & longitude) from the city name
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        alert("City not found. Please check the spelling.");
        return;
      }

      const { lat, lon } = geoData[0];

      // Step 2: Get the weather forecast using coordinates
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherResponse.json();

      // Step 3: Save today's weather (first data point)
      setToday(weatherData.list[0]);

      // Step 4: Save one forecast for each day at 12:00
      const dailyData = weatherData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyData);

    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Weather App</h1>

      {/* Input for city name */}
      <input
        type="text"
        placeholder="Enter a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>

      {/* Display today's weather */}
      {today && (
        <div className="weather-box">
          <h2>Today in {city}</h2>
          <p>Temperature: {today.main.temp}°C</p>
          <p>Weather: {today.weather[0].description}</p>
        </div>
      )}

      {/* Display 5-day forecast */}
      {forecast.length > 0 && (
        <div className="weather-box">
          <h2>Weekly Forecast</h2>
          <ul>
            {forecast.map((day, index) => (
              <li key={index}>
                {day.dt_txt} - {day.main.temp}°C - {day.weather[0].description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Weather;
