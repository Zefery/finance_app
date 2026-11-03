const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getExpenseTrend,
} = require('../controllers/transactionController');

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/trend', getExpenseTrend);

module.exports = router;