import React, { useState } from 'react';
import { ShieldCheck, Lock, Delete, ArrowRight } from 'lucide-react';

interface AdminAuthModalProps {
  correctPin: string;
  onUnlock: () => void;
  onCancel: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  correctPin,
  onUnlock,
  onCancel
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const verifyPin = (candidate: string) => {
    if (candidate === correctPin) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => {
        setPin('');
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (/^[0-9]$/.test(e.key)) {
      handleDigitClick(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Enter' && pin.length === 4) {
      verifyPin(pin);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      <div className="bg-[#021811] border border-emerald-600/50 rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/60 text-white">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-serif-heading">Dispensary Staff Access</h2>
          <p className="text-xs text-emerald-400/80 mt-1">
            Enter 4-digit dispensary PIN to unlock the admin panel.
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center gap-3 my-4">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                error
                  ? 'border-rose-500 bg-rose-500 animate-shake'
                  : index < pin.length
                  ? 'border-emerald-400 bg-emerald-400 scale-110 shadow-sm shadow-emerald-400/50'
                  : 'border-emerald-700/60 bg-transparent'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-semibold animate-shake">
            Incorrect PIN. Please try again.
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitClick(digit)}
              className="h-12 rounded-xl bg-[#01140e] hover:bg-[#03281b] active:bg-emerald-800 text-white font-mono font-bold text-lg border border-emerald-800/50 transition-colors shadow-sm cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-xl text-emerald-400 hover:text-white text-xs font-semibold flex items-center justify-center cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleDigitClick('0')}
            className="h-12 rounded-xl bg-[#01140e] hover:bg-[#03281b] active:bg-emerald-800 text-white font-mono font-bold text-lg border border-emerald-800/50 transition-colors shadow-sm cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-[#01140e] hover:bg-[#03281b] active:bg-emerald-800 text-emerald-300 flex items-center justify-center border border-emerald-800/50 transition-colors cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] text-emerald-500/70 pt-2">
          PureSleep UK Dispensary Portal • GPhC Protected
        </p>
      </div>
    </div>
  );
};
