const pool = require('../config/db');

// POST /api/transactions - Tambah Transaksi (Income / Expense)
const createTransaction = async (req, res) => {
  const { userId, type, amount, category, description, transactionDate } = req.body;

  if (!userId || !type || !amount || !category || !transactionDate) {
    return res.status(400).json({
      success: false,
      message: 'userId, type (INCOME/EXPENSE), amount, category, dan transactionDate wajib diisi',
    });
  }

  try {
    const query = `
      INSERT INTO transactions (user_id, type, amount, category, description, transaction_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [userId, type, amount, category, description || null, transactionDate];
    const result = await pool.query(query, values);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/transactions - Ambil semua transaksi user (Opsional: Filter Bulan & Tahun)
const getTransactions = async (req, res) => {
  const { userId, month, year } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Query parameter userId wajib diisi' });
  }

  try {
    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [userId];

    if (month && year) {
      query += ` AND EXTRACT(MONTH FROM transaction_date) = $2 AND EXTRACT(YEAR FROM transaction_date) = $3`;
      params.push(month, year);
    }

    query += ' ORDER BY transaction_date DESC, id DESC';
    const result = await pool.query(query, params);

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/transactions/trend - Agregasi pengeluaran harian untuk Line Chart React
const getExpenseTrend = async (req, res) => {
  const { userId, month, year } = req.query;

  if (!userId || !month || !year) {
    return res.status(400).json({
      success: false,
      message: 'Query parameter userId, month, dan year wajib diisi',
    });
  }

  try {
    const query = `
      SELECT 
        transaction_date AS date, 
        SUM(amount) AS total_expense 
      FROM transactions 
      WHERE user_id = $1 
        AND type = 'EXPENSE' 
        AND EXTRACT(MONTH FROM transaction_date) = $2 
        AND EXTRACT(YEAR FROM transaction_date) = $3 
      GROUP BY transaction_date 
      ORDER BY transaction_date ASC
    `;
    const result = await pool.query(query, [userId, month, year]);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createTransaction, getTransactions, getExpenseTrend };