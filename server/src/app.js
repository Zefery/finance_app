const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');
const bankRoutes = require('./routes/bankRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check Health Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbTest = await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      message: 'Server dan Database berjalan dengan baik',
      dbTime: dbTest.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// Routing Modul
app.use('/api/banks', bankRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server REST API berjalan di http://localhost:${PORT}`);
});