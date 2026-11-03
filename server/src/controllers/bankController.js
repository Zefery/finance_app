const pool = require('../config/db');
const { calculateSavingsInterest } = require('../utils/interestCalculator');

// GET /api/banks - Ambil semua daftar bank
const getAllBanks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM banks ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/banks/simulate - Simulasi kalkulasi deposito
const simulateSavings = async (req, res) => {
  const { bankId, amount } = req.body;

  if (!bankId || !amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'bankId dan amount (harus > 0) wajib diisi',
    });
  }

  try {
    const bankResult = await pool.query('SELECT * FROM banks WHERE id = $1', [bankId]);
    if (bankResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Bank tidak ditemukan' });
    }

    const bank = bankResult.rows[0];
    const calculation = calculateSavingsInterest(
      amount,
      bank.interest_rate_pa,
      bank.tax_rate_percent
    );

    res.json({
      success: true,
      bank: {
        id: bank.id,
        name: bank.name,
      },
      result: calculation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllBanks, simulateSavings };