const isLatitudeValid = (lat) => lat >= -90 && lat <= 90;

const isLongitudeValid = (lat) => lat >= -180 && lat <= 180;

const isCoordinatesValid = (lat, lon) =>
  isLatitudeValid(lat) && isLongitudeValid(lon);

module.exports = { isLatitudeValid, isLongitudeValid, isCoordinatesValid };
