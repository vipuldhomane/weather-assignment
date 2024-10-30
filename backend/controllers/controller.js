import axios from "axios";
const weatherApiKey = "fdc33007428f499db1c101209242109";

// Function to fetch current weather data for a specific location
const fetchWeatherData = async (location) => {
  const url = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}&aqi=no`;
  const response = await axios.get(url);
  return response.data;
};

// Function to fetch historical weather data for a specific location and date
const fetchHistoricalWeatherData = async (location, date) => {
  const url = `http://api.weatherapi.com/v1/history.json?key=${weatherApiKey}&q=${location}&dt=${date}`;
  const response = await axios.get(url);
  return response.data;
};

// Function to fetch forecast weather data for a specific location
const fetchForecastWeatherData = async (location, days) => {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${location}&days=${days}&aqi=no&alerts=no`;
  const response = await axios.get(url);
  return response.data;
};

// Function to fetch forecast weather data for a specific location and time period
const fetchHourlyForecastData = async (location, hours) => {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${location}&days=1&aqi=no&alerts=no`;
  const response = await axios.get(url);

  // Limiting data to the specified number of hours
  const hourlyData = response.data.forecast.forecastday[0].hour.slice(0, hours);

  return hourlyData.map((hour) => ({
    time: hour.time,
    temperature: hour.temp_c,
    condition: hour.condition.text,
    wind: hour.wind_kph,
    humidity: hour.humidity,
  }));
  // return hourlyData;
};

// Function to fetch weather data for a specific date
const fetchWeatherDataForDate = async (location, date) => {
  const currentDate = new Date().toISOString().split("T")[0];

  // Choose the endpoint based on whether the date is in the past or future
  const endpoint = date < currentDate ? "history" : "forecast";
  const url = `http://api.weatherapi.com/v1/${endpoint}.json?key=${weatherApiKey}&q=${location}&dt=${date}`;
  const response = await axios.get(url);

  // Extract max and min temperature along with the condition
  const data = response.data.forecast.forecastday[0].day;
  return {
    date,
    maxTemp: data.maxtemp_c,
    minTemp: data.mintemp_c,
    condition: data.condition.text,
  };
};

// Handlers

export const getData = async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ message: "City parameter is required" });
  }

  try {
    const weatherData = await fetchWeatherData(city);
    // console.log(weatherData);

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching current weather data",
      error: error.message,
    });
  }
};

export const getHistoricalData = async (req, res) => {
  const city = req.query.city;
  const days = parseInt(req.query.days);

  if (!city || isNaN(days) || days <= 0) {
    return res
      .status(400)
      .json({ message: "City and a valid days parameter are required" });
  }

  try {
    const historicalData = [];

    // Fetch historical data for the specified number of days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i); // Subtract days
      const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

      const dailyData = await fetchHistoricalWeatherData(city, formattedDate);
      console.log(dailyData);

      // Extract max and min temperature from the response
      const maxTemp = dailyData.forecast.forecastday[0].day.maxtemp_c;
      const minTemp = dailyData.forecast.forecastday[0].day.mintemp_c;

      historicalData.push({ date: formattedDate, maxTemp, minTemp });
    }

    res.json(historicalData);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching historical weather data",
      error: error.message,
    });
  }
};

export const getForecast = async (req, res) => {
  const city = req.query.city;
  const days = parseInt(req.query.days);

  if (!city || isNaN(days) || days <= 0 || days > 7) {
    return res
      .status(400)
      .json({ message: "City and a valid days parameter (1-7) are required" });
  }

  try {
    const forecastData = await fetchForecastWeatherData(city, days);

    // Extract max and min temperatures for each forecast day
    const dailyForecasts = forecastData.forecast.forecastday.map((day) => ({
      date: day.date,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
    }));

    res.json(dailyForecasts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching forecast weather data",
      error: error.message,
    });
  }
};

// Get hourly forecast for a city
export const getHourlyForecast = async (req, res) => {
  const city = req.query.city;
  const hours = parseInt(req.query.hours) || 24;

  if (!city || isNaN(hours) || hours <= 0) {
    return res
      .status(400)
      .json({ message: "City and a valid hours parameter are required" });
  }

  try {
    const hourlyForecast = await fetchHourlyForecastData(city, hours);
    res.json(hourlyForecast);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching hourly weather data",
      error: error.message,
    });
  }
};

// Handler function for a specific date route
export const getWeatherForSpecificDate = async (req, res) => {
  const city = req.query.city;
  const date = req.query.date;

  if (!city || !date) {
    return res
      .status(400)
      .json({ message: "City and date parameters are required" });
  }

  try {
    const weatherData = await fetchWeatherDataForDate(city, date);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching weather data for the specified date",
      error: error.message,
    });
  }
};
