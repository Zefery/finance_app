/**
 * Menghitung estimasi imbal hasil deposito
 * @param {number} amount - Nominal dana simpanan
 * @param {number} ratePa - Suku bunga p.a (%)
 * @param {number} taxRate - Pajak atas bunga (default 20%)
 */
const calculateSavingsInterest = (amount, ratePa, taxRate = 20) => {
  const amountNum = parseFloat(amount);
  const rateNum = parseFloat(ratePa);
  const taxNum = parseFloat(taxRate);

  // Bunga kotor & bersih per tahun
  const grossInterestYearly = amountNum * (rateNum / 100);
  const netInterestYearly = grossInterestYearly * (1 - taxNum / 100);

  // Estimasi per bulan (12 bulan) dan per hari (365 hari)
  const netInterestMonthly = netInterestYearly / 12;
  const netInterestDaily = netInterestYearly / 365;

  return {
    depositAmount: amountNum,
    interestRatePa: rateNum,
    taxRatePercent: taxNum,
    estimates: {
      daily: Math.round(netInterestDaily),
      monthly: Math.round(netInterestMonthly),
      yearly: Math.round(netInterestYearly),
    },
  };
};

module.exports = { calculateSavingsInterest };