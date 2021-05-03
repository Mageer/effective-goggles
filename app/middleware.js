const { isCoordinatesValid } = require('./validators');

const coordinatesValidator = async (req, res, next) => {
  const { lat, lon } = req.query;
  if (!isCoordinatesValid(lat, lon)) {
    res.status(400).send({ error: 'Invalid coordinates' });
    return;
  }
  next();
};

module.exports = { coordinatesValidator };
