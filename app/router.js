const express = require('express');
const { getData, getSummary, reloadData } = require('./controller');
const { coordinatesValidator } = require('./middleware');

const router = new express.Router();

router.get('/data', coordinatesValidator, getData);
router.get('/summarize', coordinatesValidator, getSummary);
router.post('/reload-data', reloadData);

module.exports = router;
