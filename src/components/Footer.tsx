import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  RotateCcw, 
  MessageCircle, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  HeartHandshake,
  Pill,
  Award,
  Gift,
  Share2,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { NavigationTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab
}) => {
  const [copied, setCopied] = useState(false);

  const referralMessage = "Check out PureSleep Pharma for authentic UK medications with discreet next-day Royal Mail Tracked 24 delivery: https://puresleeppharma.uk";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <footer className="bg-[#080c14] border-t border-slate-800 text-slate-300 text-xs">
      
      {/* Refer & Save Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-[#0f172a] via-[#0b111e] to-[#080c14] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f1b33] via-[#142342] to-[#0d172e] border-2 border-cyan-500/30 p-6 sm:p-8 md:p-10 shadow-2xl shadow-cyan-950/60">
            {/* Background ambient glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              
              {/* Text & Icon Content */}
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Referral Rewards Program</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-heading tracking-tight flex items-center justify-center lg:justify-start gap-2.5">
                  <span>Refer & Save!</span>
                  <span className="text-3xl">🎁</span>
                </h3>

                <div className="space-y-2 text-sm sm:text-base text-slate-200 leading-relaxed">
                  <p>
                    Recommend our service to your friends, family, or anyone you know, and earn exclusive coupons as a reward.
                  </p>
                  <p>
                    You can use your coupons on future purchases to enjoy great savings and exclusive discounts.
                  </p>
                  <p className="font-semibold text-cyan-300">
                    The more you refer, the more you save!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("Hey! I recommend PureSleep Pharma for authentic UK medications with guaranteed discreet next-day Royal Mail delivery: https://puresleeppharma.uk")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/20 hover:scale-[1.02] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent("https://puresleeppharma.uk")}&text=${encodeURIComponent("Hey! Check out PureSleep Pharma for genuine UK medications with next-day confidential Royal Mail dispatch.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#0088cc]/20 hover:scale-[1.02] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Share on Telegram</span>
                </a>

                <button
                  onClick={handleCopy}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-300 font-bold">Link Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-cyan-400" />
                      <span>Copy Referral Link</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Trust Strip */}
      <div className="border-b border-slate-800 py-8 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Royal Mail Tracked 24</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Discreet unmarked boxes delivered straight through your letterbox.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">100% Genuine Pharma</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Directly sourced factory-sealed blister packs with UK batch tracking.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Lock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Bank & Crypto Privacy</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Discreet billing descriptors and 100% encrypted transactions.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                <HeartHandshake className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Live Pharmacist Care</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Real-time AI triage & direct WhatsApp consultation 7 days a week.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & GPhC credentials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white font-serif-heading font-extrabold text-base shadow-md">
                PS
              </div>
              <div>
                <span className="text-lg font-bold font-serif-heading text-white tracking-wide">
                  PURESLEEP PHARMA
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-cyan-400 font-semibold">
                  UK Online Pharmacy & Dispensary
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm text-xs">
              PureSleep Pharma is the premier UK digital pharmacy service providing genuine sleeping aids, anxiety relief, pain management, and focus nootropics with next-day confidential delivery.
            </p>

            <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1 text-[11px] max-w-sm">
              <p className="text-white font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                GPhC Pharmacy Registration #9012384
              </p>
              <p className="text-slate-400">Superintendent Pharmacist: Dr. Alistair Vance MRPharmS</p>
              <p className="text-slate-500 text-[10px]">14 Harley Street, Marylebone, London W1G 9PQ</p>
            </div>
          </div>

          {/* Quick Clinical Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Clinical & Services
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => setActiveTab('shop')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Online Dispensary Shop
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('triage')} className="hover:text-cyan-300 transition-colors cursor-pointer text-cyan-400 font-medium">
                  AI Clinical Consultation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bnf-checker')} className="hover:text-cyan-300 transition-colors cursor-pointer text-cyan-400 font-medium">
                  BNF Drug Interaction Checker
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('auto-refill')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Auto-Refill & Save (10% Off)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tracking')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                  Track Royal Mail Parcel
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-cyan-300 transition-colors cursor-pointer text-[11px] text-amber-400/80">
                  Staff Dispensary Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Treatments Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li><button onClick={() => setActiveTab('shop')} className="hover:text-cyan-300 transition-colors cursor-pointer">Sleep Aids (Zopiclone / Zolpidem)</button></li>
              <li><button onClick={() => setActiveTab('shop')} className="hover:text-cyan-300 transition-colors cursor-pointer">Anxiety Relief (Diazepam / Xanax)</button></li>
              <li><button onClick={() => setActiveTab('shop')} className="hover:text-cyan-300 transition-colors cursor-pointer">Pain Relief (OxyContin / Tramadol)</button></li>
              <li><button onClick={() => setActiveTab('shop')} className="hover:text-cyan-300 transition-colors cursor-pointer">Nootropics (Modafinil 200mg)</button></li>
              <li><button onClick={() => setActiveTab('shop')} className="hover:text-cyan-300 transition-colors cursor-pointer">Men's Health (Sildenafil / Tadalafil)</button></li>
            </ul>
          </div>

          {/* Instant Contact & Channels */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Instant Ordering
            </h4>
            <div className="space-y-2">
              <a
                href="https://wa.me/message/DCDJEBZXRXSHJ1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#0f172a] hover:bg-[#162238] border border-slate-700 text-slate-200 flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <div>
                  <span className="font-bold text-white block">WhatsApp Direct</span>
                  <span className="text-[10px] text-emerald-400 font-mono">07877 180391 (+44 7877 180391)</span>
                </div>
              </a>

              <a
                href="https://t.me/bossofbenzoo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#0f172a] hover:bg-[#162238] border border-slate-700 text-slate-200 flex items-center gap-2 transition-colors"
                title="Direct Telegram Chat: @bossofbenzoo"
              >
                <Send className="w-4 h-4 text-[#0088cc]" />
                <div>
                  <span className="font-bold text-white block">Telegram Direct</span>
                  <span className="text-[10px] text-cyan-400 font-mono">@bossofbenzoo</span>
                </div>
              </a>
            </div>

            <p className="text-[10px] text-slate-500 mt-2">
              Dispensary Hours: Monday – Sunday, 8:00 AM – 10:00 PM GMT
            </p>
          </div>

        </div>

        {/* Legal Disclaimer & GPhC Compliance Note */}
        <div className="border-t border-slate-800 mt-10 pt-6 space-y-3 text-[11px] text-slate-500">
          <p>
            <strong>Prescription & Medical Disclaimer:</strong> Medicines are dispensed in compliance with UK pharmacy regulations. Always read the patient information leaflet before use. If you experience severe symptoms or adverse drug reactions, call 999 or contact NHS 111 immediately.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
            <p>© {new Date().getFullYear()} PureSleep Pharma UK. All rights reserved. Registered in England & Wales.</p>
            <div className="flex items-center gap-3 text-slate-400 text-[10px]">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Sale</span>
              <span>•</span>
              <span>Discrete Packaging Guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
