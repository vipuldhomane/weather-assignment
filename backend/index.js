const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const weatherApiKey = "fdc33007428f499db1c101209242109"; // Your API key

// Function to fetch weather data for a specific location
const fetchWeatherData = async (location) => {
  const url = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}&aqi=no`;
  const response = await axios.get(url);
  return response.data;
};

// get current weather for city
app.get("/api/current", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ message: "City parameter is required" });
  }

  try {
    const weatherData = await fetchWeatherData(city);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching current weather data",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
