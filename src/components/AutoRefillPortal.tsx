import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Calendar, 
  CheckCircle2, 
  Pause, 
  Play, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Pill,
  ArrowRight
} from 'lucide-react';
import { AutoRefillSubscription, NavigationTab } from '../types';
import { 
  getAutoRefillsFromFirestore, 
  updateAutoRefillInFirestore 
} from '../lib/firestoreService';

interface AutoRefillPortalProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const AutoRefillPortal: React.FC<AutoRefillPortalProps> = ({
  setActiveTab
}) => {
  const [subscriptions, setSubscriptions] = useState<AutoRefillSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const fsSubs = await getAutoRefillsFromFirestore();
      if (fsSubs && fsSubs.length > 0) {
        setSubscriptions(fsSubs);
      } else {
        const res = await fetch('/api/auto-refills');
        const data = await res.json();
        if (data.subscriptions) {
          setSubscriptions(data.subscriptions);
        }
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    try {
      await updateAutoRefillInFirestore(id, { status: newStatus as any });
      fetch(`/api/auto-refills/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      }).catch(e => console.warn(e));

      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleIntervalChange = async (id: string, intervalDays: 30 | 60 | 90) => {
    try {
      await updateAutoRefillInFirestore(id, { intervalDays });
      fetch(`/api/auto-refills/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intervalDays })
      }).catch(e => console.warn(e));

      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, intervalDays } : s));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-10 bg-[#01140e] min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/40 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/40 text-emerald-300 text-xs font-semibold mb-2">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-Refill & Save (10% Off Every Dispatch)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
              Scheduled Auto-Refill Subscriptions
            </h1>
            <p className="text-xs sm:text-sm text-emerald-400/80 mt-1">
              Never run out of essential sleep aids, anxiety treatments, or daily vitamins. Pause or cancel anytime in 1 click.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('shop')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication to Auto-Refill</span>
          </button>
        </div>

        {/* Benefits Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-[#031d14] border border-emerald-800/50 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Guaranteed 10% Extra Discount</h3>
              <p className="text-[11px] text-emerald-400/70 mt-0.5">Applied on top of multi-pack bulk savings on every single recurring cycle.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#031d14] border border-emerald-800/50 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Priority Royal Mail Tracked 24</h3>
              <p className="text-[11px] text-emerald-400/70 mt-0.5">Automated discrete dispatch straight to your letterbox 2 days before your supply runs out.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#031d14] border border-emerald-800/50 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Zero Lock-In Commitment</h3>
              <p className="text-[11px] text-emerald-400/70 mt-0.5">Skip, pause, change interval days, or cancel immediately at any time with no fees.</p>
            </div>
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white font-serif-heading">
            Your Active Subscriptions ({subscriptions.length})
          </h2>

          {subscriptions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#031d14] border border-emerald-800/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-500 mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No active auto-refill subscriptions</h3>
              <p className="text-xs text-emerald-400/70 max-w-sm mx-auto">
                When adding any item to your basket, tick the "Auto-Refill & Save" checkbox to schedule automatic next-day dispatches with 10% discount.
              </p>
              <button
                onClick={() => setActiveTab('shop')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Browse Treatments
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {subscriptions.map((sub) => (
                <div 
                  key={sub.id}
                  className="bg-[#031d14] border border-emerald-700/50 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          sub.status === 'Active' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                            : 'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}>
                          {sub.status}
                        </span>
                        <span className="text-xs text-emerald-500 font-mono">Ref: {sub.id}</span>
                      </div>

                      <h3 className="text-base font-bold text-white mt-1">{sub.productName}</h3>
                      <p className="text-xs text-emerald-300/80">{sub.packLabel}</p>

                      <div className="flex items-center gap-3 text-xs text-emerald-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          Next Dispatch: <strong className="text-white ml-1">{sub.nextRefillDate}</strong>
                        </span>
                        <span>•</span>
                        <span>Price: <strong className="text-emerald-300">£{sub.pricePerRefill.toFixed(2)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Interval & Status Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-emerald-800/40">
                    
                    {/* Interval Selector */}
                    <div>
                      <label className="text-[10px] font-semibold text-emerald-400/80 block mb-1">
                        Dispatch Frequency:
                      </label>
                      <select
                        value={sub.intervalDays}
                        onChange={(e) => handleIntervalChange(sub.id, Number(e.target.value) as any)}
                        className="bg-[#021811] border border-emerald-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                      >
                        <option value={30}>Every 30 Days (Recommended)</option>
                        <option value={60}>Every 60 Days</option>
                        <option value={90}>Every 90 Days</option>
                      </select>
                    </div>

                    {/* Pause / Resume Button */}
                    <button
                      onClick={() => handleToggleStatus(sub.id, sub.status)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        sub.status === 'Active'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-700/50 hover:bg-amber-900/60'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60'
                      }`}
                    >
                      {sub.status === 'Active' ? (
                        <>
                          <Pause className="w-3.5 h-3.5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" /> Resume
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
