import React from 'react';
import BankSimulator from './components/BankSimulator';
import { Wallet, Landmark, BarChart3, Home } from 'lucide-react';

function App() {
  return (
    // Outer Wrapper: Latar gelap netral di desktop untuk menyorot bingkai HP
    <div className="min-h-screen bg-slate-900 flex justify-center items-center md:py-6 sm:px-4 font-sans">
      
      {/* Container Layar Handphone / Tablet */}
      <div className="w-full min-h-screen md:min-h-[850px] md:max-w-[420px] md:rounded-[40px] md:shadow-2xl md:border-[8px] md:border-slate-800 bg-slate-50 flex flex-col overflow-hidden relative">
        
        {/* Status Bar Simulasi HP (Hanya Tampil di Laptop/Desktop) */}
        <div className="hidden md:flex justify-between items-center px-6 pt-3 pb-1 bg-white text-[11px] text-slate-500 font-semibold z-20">
          <span>09:41</span>
          <div className="w-20 h-4 bg-slate-800 rounded-full"></div> {/* Dynamic Island Notch */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-4 h-2 bg-slate-700 rounded-xs"></div>
          </div>
        </div>

        {/* Header Mobile */}
        <header className="bg-white px-5 py-3.5 border-b border-slate-100 shadow-xs sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight">
              Finance Tracker
            </h1>
            <p className="text-[11px] text-slate-500">Portofolio Keuangan Pribadi</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
            AF
          </div>
        </header>

        {/* Main Content (Bisa di-scroll di dalam bingkai HP) */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          <BankSimulator />
        </main>

        {/* Bottom Navigation Bar (Khas Tampilan Mobile) */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-6 py-2.5 flex justify-around items-center text-slate-400 text-[10px] font-medium z-10">
          <button className="flex flex-col items-center gap-1 text-indigo-600">
            <Home className="w-5 h-5" />
            <span>Beranda</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-slate-600 transition-colors">
            <Landmark className="w-5 h-5" />
            <span>Deposito</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-slate-600 transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span>Grafik</span>
          </button>
        </nav>

      </div>
    </div>
  );
}

export default App;