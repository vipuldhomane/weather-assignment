import express from "express";
import {
  getData,
  getForecast,
  getHistoricalData,
  getHourlyForecast,
} from "../controllers/controller.js";

const router = express.Router();

// Get current weather for a city
router.get("/current", getData);

// Get historical weather data for a specific city over the last days
router.get("/history", getHistoricalData);

// Get forecast weather data for a specific city over the next days
router.get("/forecast", getForecast);

// Get hourly forecast for a city
router.get("/hourly", getHourlyForecast);

export default router;
