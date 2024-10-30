// hooks/useWeatherData.js
import { useEffect, useState } from "react";
import axios from "axios";

export const hostedDomain = "https://weather-assignment-rtly.onrender.com";
const useWeatherData = (city) => {
  const [weatherData, setWeatherData] = useState({
    current: null,
    history: null,
    forecast: null,
    hourly: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const current = await axios.get(`${hostedDomain}/api/current`, {
        params: { city },
      });
      const history = await axios.get(`${hostedDomain}/api/history`, {
        params: { city, days: 7 },
      });
      const forecast = await axios.get(`${hostedDomain}/api/forecast`, {
        params: { city, days: 7 },
      });
      const hourly = await axios.get(`${hostedDomain}/api/hourly`, {
        params: { city },
      });

      setWeatherData({
        current: current.data,
        history: history.data,
        forecast: forecast.data,
        hourly: hourly.data,
      });
      setError("");
    } catch (error) {
      setError("Error fetching weather data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  return { weatherData, error, loading };
};

export default useWeatherData;
