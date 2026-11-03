import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Endpoint Bank & Simulasi
export const fetchBanks = () => API.get('/banks');
export const simulateDeposit = (data) => API.post('/banks/simulate', data);

// Endpoint Budget
export const fetchBudgetSummary = (userId, month, year) => 
  API.get(`/budgets/summary?userId=${userId}&month=${month}&year=${year}`);
export const setMonthlyBudget = (data) => API.post('/budgets', data);

// Endpoint Transaksi & Trend
export const fetchTransactions = (userId, month, year) => 
  API.get(`/transactions?userId=${userId}&month=${month}&year=${year}`);
export const createTransaction = (data) => API.post('/transactions', data);
export const fetchExpenseTrend = (userId, month, year) => 
  API.get(`/transactions/trend?userId=${userId}&month=${month}&year=${year}`);

export default API;