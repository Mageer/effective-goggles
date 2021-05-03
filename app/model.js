const mongoose = require('mongoose');
const fs = require('fs').promises;
const parse = require('csv-parse/lib/sync');

const weatherSchema = new mongoose.Schema({
  longitude: {
    type: Number,
    required: true,
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180'],
  },
  latitude: {
    type: Number,
    required: true,
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90'],
  },
  forecastTime: {
    type: Date,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  precipitation: {
    type: Number,
    required: true,
    min: [0, 'No such thing as negative rain'],
  },
});

weatherSchema.index(
  { longitude: 1, latitude: 1, forecastTime: 1 },
  { unique: true }
);

weatherSchema.statics.getForecastData = async function (lat, lon) {
  const Weather = this;
  const forecastData = await Weather.find({ longitude: lon, latitude: lat });
  return forecastData.map((data) => ({
    forecastTime: data.forecastTime,
    temperature: data.temperature,
    precipitation: data.precipitation,
  }));
};

const avg = (data) => data.reduce((a, b) => a + b) / data.length;
const min = (data) => Math.min(...data);
const max = (data) => Math.max(...data);

weatherSchema.statics.getForecastSummary = async function (lat, lon) {
  const Weather = this;
  const forecastData = await Weather.getForecastData(lat, lon);
  if (forecastData.length === 0) {
    return undefined;
  }
  const temperatures = forecastData.map((data) => data.temperature);
  const precipitation = forecastData.map((data) => data.precipitation);

  const aggregate = (func) => ({
    Temperature: func(temperatures),
    Precipitation: func(precipitation),
  });

  return {
    max: aggregate(max),
    min: aggregate(min),
    avg: aggregate(avg),
  };
};

const csvDataPointToWeather = (csvDataPoint) => ({
  longitude: csvDataPoint[0],
  latitude: csvDataPoint[1],
  forecastTime: csvDataPoint[2],
  temperature: csvDataPoint[3],
  precipitation: csvDataPoint[4],
});

const getCsvData = async (filePath) => {
  const content = await fs.readFile(filePath);
  const records = parse(content);
  records.shift();
  const weather = records.map((data) => csvDataPointToWeather(data));
  return weather;
};

weatherSchema.statics.loadCsvData = async function (filePath) {
  const Weather = this;
  const weather = await getCsvData(filePath);

  const batchSize = 10000;
  const numberOfBatches = Math.ceil(weather.length / batchSize);
  const range = Array.from(Array(numberOfBatches).keys());

  try {
    await range.reduce(
      (_promise, i) =>
        _promise.then(() => {
          console.log(`${i * batchSize}`);
          const batch = weather.slice(i * batchSize, (i + 1) * batchSize);
          return Weather.insertMany(batch);
        }),
      Promise.resolve(null)
    );
    console.log('Insertion done!');
  } catch (err) {
    console.error(err);
    throw new Error('Ingestion failed!');
  }
};

const Weather = mongoose.model('Weather', weatherSchema, 'weathers');
module.exports = Weather;
