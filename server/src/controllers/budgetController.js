const pool = require('../config/db');

// GET /api/budgets
const getBudgets = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Query parameter userId wajib diisi' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM budgets WHERE user_id = $1 ORDER BY year DESC, month DESC',
      [userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/budgets
const setBudget = async (req, res) => {
  const { userId, month, year, amount } = req.body;

  if (!userId || !month || !year || amount === undefined) {
    return res.status(400).json({
      success: false,
      message: 'userId, month, year, dan amount wajib diisi',
    });
  }

  try {
    const query = `
      INSERT INTO budgets (user_id, month, year, amount)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, month, year) 
      DO UPDATE SET amount = EXCLUDED.amount
      RETURNING *
    `;
    const result = await pool.query(query, [userId, month, year, amount]);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/budgets/summary
const getBudgetSummary = async (req, res) => {
  const { userId, month, year } = req.query;

  if (!userId || !month || !year) {
    return res.status(400).json({
      success: false,
      message: 'Query parameter userId, month, dan year wajib diisi',
    });
  }

  try {
    const budgetRes = await pool.query(
      'SELECT amount FROM budgets WHERE user_id = $1 AND month = $2 AND year = $3',
      [userId, month, year]
    );
    const budgetCap = budgetRes.rows.length > 0 ? parseFloat(budgetRes.rows[0].amount) : 0;

    const totalsRes = await pool.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS total_expense
       FROM transactions
       WHERE user_id = $1 
         AND EXTRACT(MONTH FROM transaction_date) = $2 
         AND EXTRACT(YEAR FROM transaction_date) = $3`,
      [userId, month, year]
    );

    const totalIncome = parseFloat(totalsRes.rows[0].total_income);
    const totalExpense = parseFloat(totalsRes.rows[0].total_expense);
    const remainingBudget = budgetCap - totalExpense;

    res.json({
      success: true,
      summary: {
        month: parseInt(month),
        year: parseInt(year),
        budgetCap,
        totalIncome,
        totalExpense,
        remainingBudget,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { setBudget, getBudgetSummary, getBudgets };