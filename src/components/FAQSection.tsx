import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Mail, 
  Gift, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Tag
} from 'lucide-react';
import { FREQUENTLY_ASKED_QUESTIONS } from '../data/medicineCatalog';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="py-12 bg-[#01140e] border-t border-emerald-800/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* FAQs Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/40 text-emerald-300 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-emerald-400/80">
            Clear information about discrete UK shipping, payments, and prescription-free dispensing.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3">
          {FREQUENTLY_ASKED_QUESTIONS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  isOpen 
                    ? 'bg-[#031d14] border-emerald-500/60 shadow-lg' 
                    : 'bg-[#021811] border-emerald-800/40 hover:border-emerald-700'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm font-bold text-white">
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isOpen ? 'bg-emerald-500 text-emerald-950' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-emerald-300/90 leading-relaxed border-t border-emerald-800/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Newsletter / Instant 15% Discount Incentive */}
        <div className="bg-gradient-to-br from-[#04261a] to-[#021811] border border-emerald-600/50 rounded-2xl p-6 sm:p-8 text-center space-y-4 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Gift className="w-48 h-48 text-emerald-400" />
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mx-auto">
            <Gift className="w-6 h-6 text-amber-400" />
          </div>

          <div className="space-y-1 max-w-lg mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-heading text-white">
              Get £10 Off Your First Order
            </h3>
            <p className="text-xs sm:text-sm text-emerald-300/80">
              Join our discrete patient newsletter for private flash deals, refill alerts, and priority restock notifications.
            </p>
          </div>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/60 max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You're Subscribed!</span>
              </div>
              <p className="text-xs text-emerald-400/80">
                Use code <span className="font-mono font-extrabold text-amber-300 bg-[#01140e] px-2 py-1 rounded border border-amber-400/40">WELCOME15</span> at checkout for 15% off!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-[#021811] border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
                />
                <Mail className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer shrink-0"
              >
                Claim 15% Off
              </button>
            </form>
          )}

          <p className="text-[10px] text-emerald-500/70">
            🔒 We respect your privacy. Zero spam, unsubscribe with one click anytime.
          </p>
        </div>

      </div>
    </section>
  );
};
