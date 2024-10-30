// hooks/useWeatherData.js
import { useEffect, useState } from "react";
import axios from "axios";

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
      const current = await axios.get(`http://localhost:5000/api/current`, {
        params: { city },
      });
      const history = await axios.get(`http://localhost:5000/api/history`, {
        params: { city, days: 7 },
      });
      const forecast = await axios.get(`http://localhost:5000/api/forecast`, {
        params: { city, days: 7 },
      });
      const hourly = await axios.get(`http://localhost:5000/api/hourly`, {
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
