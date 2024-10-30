import { useEffect, useState } from "react";
import WeatherDisplay from "./components/WeatherDisplay";
import Chart from "react-apexcharts";
import ClipLoader from "react-spinners/ClipLoader";
import CitySelect from "./components/CitySelect";
import useWeatherData from "./hooks/useWeatherData";
import { getAnalyticsData, prepareHourlyData } from "./utils/analytics";
import WeatherDatePicker from "./components/WeatherDatePicker ";

function App() {
  const [city, setCity] = useState("Mumbai");
  const { weatherData, error, loading } = useWeatherData(city);
  const [historySeries, setHistorySeries] = useState([]);
  const [forecastSeries, setForecastSeries] = useState([]);
  const [hourlySeries, setHourlySeries] = useState([]);
  const [historyOptions, setHistoryOptions] = useState({});
  const [forecastOptions, setForecastOptions] = useState({});
  const [hourlyOptions, setHourlyOptions] = useState({});

  const handleCitySelect = (selectedCity) => {
    console.log("Selected city:", selectedCity);
    setCity(selectedCity);

    // Reset chart data when the city changes
    setHistorySeries([]);
    setForecastSeries([]);
    setHourlySeries([]);
    setHistoryOptions({});
    setForecastOptions({});
    setHourlyOptions({});
  };

  useEffect(() => {
    if (weatherData.history && weatherData.forecast) {
      const { historySeries, forecastSeries, historyOptions, forecastOptions } =
        getAnalyticsData(weatherData.history, weatherData.forecast);
      setHistorySeries(historySeries);
      setForecastSeries(forecastSeries);
      setHistoryOptions(historyOptions);
      setForecastOptions(forecastOptions);
    }
  }, [weatherData]);

  useEffect(() => {
    if (weatherData.hourly) {
      const { series, options } = prepareHourlyData(weatherData.hourly);
      setHourlySeries(series);
      setHourlyOptions(options);
    }
  }, [weatherData]);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Weather Dashboard</h1>
      <CitySelect onSelect={handleCitySelect} />

      {/* <button
        onClick={() => setCity(city)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Get Weather Data
      </button> */}

      {loading ? (
        <ClipLoader color={"#3b82f6"} size={50} />
      ) : (
        <>
          {weatherData && <WeatherDisplay data={weatherData} />}
          <WeatherDatePicker city={city} />
          {weatherData.history && weatherData.forecast && (
            <>
              {/* History Chart */}
              <div className="mb-4 mt-10 bg-white shadow rounded p-4 w-full max-w-4xl mx-auto">
                {" "}
                <h2 className="text-xl font-semibold mt-4">Historic Data</h2>
                <Chart
                  options={historyOptions}
                  series={historySeries}
                  height={370}
                  type="area"
                />
              </div>

              {/* Forecast Chart */}
              <div className="mb-4 mt-10 bg-white shadow rounded p-4 w-full max-w-4xl mx-auto">
                {" "}
                <h2 className="text-xl font-semibold mt-4">Forecast Data</h2>
                <Chart
                  options={forecastOptions}
                  series={forecastSeries}
                  height={370}
                  type="area"
                />
              </div>

              {/* Hourly Chart */}
              {weatherData.hourly && (
                <div className="mb-4 mt-10 bg-white shadow rounded p-4 w-full max-w-4xl mx-auto">
                  {" "}
                  <h2 className="text-xl font-semibold mt-4">
                    Hourly Forecast
                  </h2>
                  <Chart
                    options={hourlyOptions}
                    series={hourlySeries}
                    height={370}
                    type="line"
                  />
                </div>
              )}
            </>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}

export default App;
