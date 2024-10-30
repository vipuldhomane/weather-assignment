import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { hostedDomain } from "../hooks/useWeatherData";

const WeatherDatePicker = ({ city }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  // Set the min and max dates to restrict date range
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 7); // 7 days in the past
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7); // 7 days in the future

  const handleDateChange = async (date) => {
    setSelectedDate(date);

    // Format date to YYYY-MM-DD for API request
    const formattedDate = date.toISOString().split("T")[0];

    try {
      const response = await axios.get(
        `${hostedDomain}/api/specific-date?city=${city}&date=${formattedDate}`
      );
      console.log(response.data);

      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
    console.log(weatherData);
  };

  return (
    <div className="mt-10 flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Select Date for Weather Data
      </h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        className="p-2 border rounded-lg w-full text-center"
        placeholderText="Select a date"
        dateFormat="yyyy-MM-dd"
      />

      {weatherData && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full text-center">
          <h3 className="text-lg font-semibold">
            Weather on {selectedDate.toLocaleDateString()}
          </h3>
          <p>Condition: {weatherData.condition}</p>
          <p>Max Temperature: {weatherData.maxTemp}°C</p>
          <p>Min Temperature: {weatherData.minTemp}°C</p>
        </div>
      )}
    </div>
  );
};

export default WeatherDatePicker;
