// utils/analytics.js
import dayjs from "dayjs";

export const getAnalyticsData = (history, forecast) => {
  if (!history || !forecast)
    return {
      historySeries: [],
      forecastSeries: [],
      historyOptions: {},
      forecastOptions: {},
    };

  const historySeries = [
    {
      name: "Max Temp",
      data: history
        .slice()
        .reverse()
        .map((item) => item?.maxTemp || 0),
    },
    {
      name: "Min Temp",
      data: history
        .slice()
        .reverse()
        .map((item) => item?.minTemp || 0),
    },
  ];

  const forecastSeries = [
    {
      name: "Max Temp",
      data: forecast.map((item) => item?.maxTemp || 0),
    },
    {
      name: "Min Temp",
      data: forecast.map((item) => item?.minTemp || 0),
    },
  ];

  const maxTempColor = "#FF5733";
  const minTempColor = "#33A1FF";

  const historyChartOptions = {
    chart: { toolbar: { show: false } },
    xaxis: {
      categories: history
        .slice()
        .reverse()
        .map((item) => dayjs(item.date).format("MMM-DD")),
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: [maxTempColor, minTempColor],
    },
    fill: { opacity: 1, colors: [maxTempColor, minTempColor] },
    legend: { show: true },
  };

  const forecastChartOptions = {
    chart: { toolbar: { show: false } },
    xaxis: {
      categories: forecast.map((item) => dayjs(item.date).format("MMM-DD")),
    },
    stroke: {
      width: 2,
      curve: "smooth",
      colors: [maxTempColor, minTempColor],
    },
    fill: { opacity: 1, colors: [maxTempColor, minTempColor] },
    legend: { show: true },
  };

  return {
    historySeries,
    forecastSeries,
    historyOptions: historyChartOptions,
    forecastOptions: forecastChartOptions,
  };
};

export const prepareHourlyData = (hourlyData) => {
  const series = [
    {
      name: "Temperature",
      data: hourlyData.map((item) => item.temperature),
    },
  ];

  const options = {
    chart: {
      toolbar: { show: false },
    },
    xaxis: {
      categories: hourlyData.map((item) => dayjs(item.time).format("HH:mm")),
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    legend: { show: true },
  };

  return { series, options };
};
