import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  Clock, 
  CreditCard, 
  MessageCircle, 
  Send, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Pill, 
  Sparkles,
  Zap,
  Boxes
} from 'lucide-react';
import { NavigationTab } from '../types';

interface HeroSectionProps {
  setActiveTab?: (tab: NavigationTab) => void;
  onExploreClick?: () => void;
  onBrowseTreatments?: () => void;
  onStartTriage?: () => void;
  setIsSupportOpen?: (open: boolean) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  setActiveTab,
  onExploreClick,
  onBrowseTreatments,
  onStartTriage,
  setIsSupportOpen
}) => {
  const handleExplore = () => {
    if (typeof onBrowseTreatments === 'function') {
      onBrowseTreatments();
    } else if (typeof onExploreClick === 'function') {
      onExploreClick();
    } else {
      const el = document.getElementById('treatments-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTriage = () => {
    if (typeof onStartTriage === 'function') {
      onStartTriage();
    } else if (typeof setActiveTab === 'function') {
      setActiveTab('triage');
    }
  };

  const handleSupport = () => {
    if (typeof setIsSupportOpen === 'function') {
      setIsSupportOpen(true);
    } else if (typeof setActiveTab === 'function') {
      setActiveTab('triage');
    }
  };
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] border-b border-slate-800/80 py-12 md:py-16">
      {/* Subtle background ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Content */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Trustpill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>🇬🇧 UK Next-Day Delivery • 100% Discreet Unmarked Packaging</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-serif-heading leading-tight">
            PureSleep Pharma — The UK’s Most Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">Online Pharmacy</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Genuine Sleep Aids, Anxiety Relief, Pain Management & Nootropics delivered straight to your door. No doctor appointments or queues — discrete, fast, and reliable.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleExplore}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-950/80 border border-cyan-300/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/message/DCDJEBZXRXSHJ1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2 hover:text-white"
              title="Order via WhatsApp: 07877 180391"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp: 07877 180391</span>
            </a>

            <a
              href="https://t.me/bossofbenzoo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2 hover:text-white"
              title="Telegram: @bossofbenzoo"
            >
              <Send className="w-4 h-4 text-[#0088cc]" />
              <span>Telegram: @bossofbenzoo</span>
            </a>
          </div>

          {/* Trustpilot & Rating Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.9 / 5.0</span>
              <span className="text-slate-400">(3,420+ Verified UK Reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>MHRA & GPhC Regulated Standards</span>
            </div>
          </div>
        </div>

        {/* 5 Core Trust Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mt-12 pt-8 border-t border-slate-800/80">
          
          <div className="p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <Truck className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs font-bold text-white">Royal Mail Tracked 24</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Next-day direct to your letterbox</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs font-bold text-white">100% Plain Packaging</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Zero markings or logos for privacy</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs font-bold text-white">100% Genuine Stock</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Blister-sealed batch-tested meds</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs font-bold text-white">Bank Transfer & Crypto</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Secure, Anonymous & Fast</p>
          </div>

          <div className="col-span-2 md:col-span-1 p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-xs font-bold text-white">24/7 Clinical Support</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">On-call dispensary pharmacists</p>
          </div>

        </div>

        {/* Bulk Purchase Inquiry Banner */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0c1527] via-[#111e38] to-[#0d162b] border border-cyan-500/30 shadow-xl shadow-cyan-950/40 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span>Interested in purchasing in bulk?</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider">
                  Bulk & Wholesale
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
                Please contact us directly via WhatsApp or Telegram to discuss quantities and receive our best bulk pricing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-center">
            <a
              href="https://wa.me/message/DCDJEBZXRXSHJ1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-200 hover:text-white border border-[#25D366]/50 font-semibold text-xs transition-all flex items-center gap-2 shadow-sm"
              title="WhatsApp Wholesale: 07877 180391"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp (07877 180391)</span>
            </a>

            <a
              href="https://t.me/bossofbenzoo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-cyan-200 hover:text-white border border-[#0088cc]/50 font-semibold text-xs transition-all flex items-center gap-2 shadow-sm"
              title="Telegram Wholesale: @bossofbenzoo"
            >
              <Send className="w-4 h-4 text-[#0088cc]" />
              <span>Telegram (@bossofbenzoo)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
