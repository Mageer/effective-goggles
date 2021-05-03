const path = require('path');
const Weather = require('./model');

const getData = async (req, res) => {
  const { lat, lon } = req.query;
  const forecast = await Weather.getForecastData(lat, lon);
  if (forecast.length === 0) {
    res.status(404).send('Forecast not found');
    return;
  }
  const transformedForecast = forecast.map((row) => ({
    forecastTime: row.forecastTime,
    Temperature: row.temperature,
    Precipitation: row.precipitation,
  }));
  res.send(transformedForecast);
};

const getSummary = async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const summary = await Weather.getForecastSummary(lat, lon);
    if (!summary) {
      res.status(404).send('No summary exists');
      return;
    }
    res.send(summary);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const reloadData = async (req, res) => {
  try {
    await Weather.deleteMany({});
    await Weather.loadCsvData(path.join(__dirname, 'assets', 'file1.csv'));
    await Weather.loadCsvData(path.join(__dirname, 'assets', 'file2.csv'));
    await Weather.loadCsvData(path.join(__dirname, 'assets', 'file3.csv'));
    res.send({ Message: 'Data loaded' });
  } catch (error) {
    res.status(500).send({ error: 'Data loading failed!' });
  }
};

module.exports = { getData, getSummary, reloadData };
