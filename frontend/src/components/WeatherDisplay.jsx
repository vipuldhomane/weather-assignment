import React from "react";

const WeatherDisplay = ({ data }) => {
  const { current } = data;

  // Determine the time of day for styling
  const currentHour = new Date(current?.location.localtime).getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18;

  // Determine temperature styling
  const temp = current?.current.temp_c;
  let tempColor = "text-gray-800";
  if (temp < 0) {
    tempColor = "text-blue-500";
  } else if (temp >= 0 && temp < 15) {
    tempColor = "text-blue-600";
  } else if (temp >= 15 && temp < 30) {
    tempColor = "text-orange-500";
  } else {
    tempColor = "text-red-500";
  }

  const localTime = new Date(current?.location.localtime);
  const dateString = localTime.toLocaleDateString();
  const timeString = localTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`mt-10 w-full max-w-4xl shadow-lg p-6 rounded-lg ${
        isDayTime ? "bg-gradient-to-r from-blue-300 to-blue-500" : "bg-gray-800"
      } text-center text-white`}
    >
      <h3 className="text-3xl font-semibold mb-2">Weather Data for</h3>
      <h2 className="text-4xl font-semibold mb-4">{current?.location.name}</h2>
      <h3 className="text-xl font-semibold mb-2">
        {current?.location.region}, {current?.location.country}
      </h3>

      <div className="mb-4">
        <p className="text-lg mb-2">Date: {dateString}</p>
        <p className="text-lg mb-2">Time: {timeString}</p>
        <h3 className="font-bold text-2xl mb-2">Current Weather:</h3>
        <p className={`${tempColor} text-2xl mb-2`}>Temperature: {temp}°C</p>
        <p className="text-lg mb-2">
          Condition: {current?.current.condition.text}
        </p>
        <p className="text-lg">Humidity: {current?.current.humidity}%</p>
      </div>
    </div>
  );
};

export default WeatherDisplay;
