const express = require('express');
const router = express.Router();
const { getAllBanks, simulateSavings } = require('../controllers/bankController');

router.get('/', getAllBanks);
router.post('/simulate', simulateSavings);

module.exports = router;