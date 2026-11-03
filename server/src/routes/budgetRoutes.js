const express = require('express');
const router = express.Router();
const { setBudget, getBudgetSummary, getBudgets} = require('../controllers/budgetController');

router.post('/', setBudget);
router.get('/', getBudgets);
router.get('/summary', getBudgetSummary);

module.exports = router;