import React, { useState, useEffect } from 'react';
import { fetchBanks, simulateDeposit } from '../services/api';
import { Landmark, Calculator, TrendingUp, Percent, Coins } from 'lucide-react';

const BankSimulator = () => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [amount, setAmount] = useState('10000000');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getBanks = async () => {
      try {
        const response = await fetchBanks();
        if (response.data.success && response.data.data.length > 0) {
          const dataBanks = response.data.data;
          setBanks(dataBanks);
          setSelectedBank(String(dataBanks[0].id));
        }
      } catch (err) {
        setError('Gagal memuat data master bank dari server.');
      }
    };
    getBanks();
  }, []);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedBank) {
      setError('Silakan pilih bank terlebih dahulu');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Masukkan nominal deposito yang valid');
      return;
    }

    setLoading(true);

    try {
      const response = await simulateDeposit({
        bankId: parseInt(selectedBank),
        amount: parseFloat(amount),
      });

      if (response.data.success) {
        const { bank, result: calc } = response.data;
        setResult({
          bankName: bank.name,
          interestRate: calc.interestRatePa,
          taxRate: calc.taxRatePercent,
          netEarningsDaily: calc.estimates.daily,
          netEarningsMonthly: calc.estimates.monthly,
          netEarningsYearly: calc.estimates.yearly,
        });
      } else {
        setError(response.data.message || 'Kalkulasi gagal');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghitung simulasi deposito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-4 w-full">
      {/* Header Card */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">Simulasi Deposito</h2>
          <p className="text-[11px] text-slate-500">Estimasi bunga bersih simpanan</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Form Input Stack Vertical untuk Layar HP */}
      <form onSubmit={handleSimulate} className="space-y-3 mb-6">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Bank / Platform
          </label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          >
            {banks.length === 0 && <option value="">Memuat bank...</option>}
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name} ({bank.interest_rate_pa ?? bank.interest_rate}% p.a)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Nominal Deposito (Rp)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Contoh: 10000000"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
        >
          <Calculator className="w-4 h-4" />
          {loading ? 'Menghitung...' : 'Hitung Simulasi'}
        </button>
      </form>

      {/* Hasil Simulasi (Vertikal Card List) */}
      {result && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Bank Dipilih</p>
              <h3 className="text-xs font-bold text-slate-800">{result.bankName}</h3>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold rounded-md text-[10px]">
                <Percent className="w-3 h-3" /> {result.interestRate}%
              </span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded-md text-[10px]">
                Pajak {result.taxRate}%
              </span>
            </div>
          </div>

          {/* Cards Imbal Hasil Harian, Bulanan, Tahunan */}
          <div className="space-y-2.5">
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Per Hari</span>
                <p className="text-base font-extrabold text-emerald-800">{formatIDR(result.netEarningsDaily)}</p>
              </div>
              <Coins className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase">Per Bulan</span>
                <p className="text-base font-extrabold text-indigo-800">{formatIDR(result.netEarningsMonthly)}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="p-3 bg-violet-50/60 border border-violet-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-violet-700 uppercase">Per Tahun</span>
                <p className="text-base font-extrabold text-violet-800">{formatIDR(result.netEarningsYearly)}</p>
              </div>
              <Landmark className="w-5 h-5 text-violet-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankSimulator;