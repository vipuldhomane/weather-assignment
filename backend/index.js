// index.js or wherever you're importing

import express from "express";
import cors from "cors";
import {
  getData,
  getHistoricalData,
  getForecast,
} from "./controllers/controller.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Get current weather for a city
app.get("/api/current", getData);

// Get historical weather data for a specific city over the last days
app.get("/api/history", getHistoricalData);

// Get forecast weather data for a specific city over the next days
app.get("/api/forecast", getForecast);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
