import React, { useState, useRef, useEffect } from 'react';
import { 
  HeartHandshake, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  Pill, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles,
  MessageCircle,
  Clock,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { REST_EASY_PRODUCTS } from '../data/medicineCatalog';
import { saveConsultationMessage, getDeviceId } from '../lib/firestoreService';

interface TriageMessage {
  id: string;
  sender: 'pharmacist' | 'patient';
  text: string;
  timestamp: string;
  recommendedProductId?: string;
  warning?: string;
}

interface TriageConsultationProps {
  onSelectProduct: (productId: string) => void;
}

export const TriageConsultation: React.FC<TriageConsultationProps> = ({
  onSelectProduct
}) => {
  const [messages, setMessages] = useState<TriageMessage[]>([
    {
      id: 'msg-1',
      sender: 'pharmacist',
      text: "Hello, I am Dr. Alistair Vance, Superintendent Pharmacist at PureSleep Pharma UK. How can I assist you with your sleep, anxiety, pain relief, or focus requirements today?",
      timestamp: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading) return;

    const patientMsg: TriageMessage = {
      id: `p-${Date.now()}`,
      sender: 'patient',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, patientMsg]);
    if (!customText) setInputText('');
    setIsLoading(true);

    const sessionId = getDeviceId();
    saveConsultationMessage(sessionId, patientMsg);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({
            role: m.sender === 'pharmacist' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await response.json();
      
      // Check if text matches any product in catalog for recommended product attachment
      const lower = textToSend.toLowerCase();
      let matchedProductId: string | undefined;
      if (lower.includes('nitraz 10') || lower.includes('nitrazepam 10') || lower.includes('nitraz 10mg')) {
        matchedProductId = 'rem-nitraz-10';
      } else if (lower.includes('nitraz') || lower.includes('nitrazepam') || lower.includes('mogadon')) {
        matchedProductId = 'rem-nitraz-5';
      } else if (lower.includes('bromazepam') || lower.includes('lexotan')) {
        matchedProductId = 'rem-bromazepam-3';
      } else if (lower.includes('lorazepam') || lower.includes('ativan') || lower.includes('loraz')) {
        matchedProductId = 'rem-loraz-2';
      } else if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('zopiclone') || lower.includes('wake up')) {
        matchedProductId = 'rem-zopiclone-75';
      } else if (lower.includes('anxiety') || lower.includes('panic') || lower.includes('stress') || lower.includes('diazepam') || lower.includes('valium')) {
        matchedProductId = 'rem-sedil-diazepam';
      } else if (lower.includes('pain') || lower.includes('back') || lower.includes('oxycontin') || lower.includes('oxycodone') || lower.includes('tramadol')) {
        matchedProductId = 'rem-oxycontin-80';
      } else if (lower.includes('focus') || lower.includes('modafinil') || lower.includes('ritalin') || lower.includes('fatigue') || lower.includes('shift')) {
        matchedProductId = 'rem-modafinil-200';
      }

      const pharmacistMsg: TriageMessage = {
        id: `ph-${Date.now()}`,
        sender: 'pharmacist',
        text: data.reply || "Thank you for sharing your symptoms. Based on UK clinical guidance, we can recommend appropriate treatments with discreet next-day delivery.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductId: matchedProductId
      };

      setMessages(prev => [...prev, pharmacistMsg]);
      saveConsultationMessage(sessionId, pharmacistMsg);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback pharmacist response
      const fallbackMsg: TriageMessage = {
        id: `ph-${Date.now()}`,
        sender: 'pharmacist',
        text: "Thank you for explaining your symptoms. For acute sleep disruptions or severe anxiety, our licensed UK dispensary supplies genuine Zopiclone 7.5mg, Zolpidem 10mg, and Diazepam blister packs with discreet next-day Royal Mail Tracked 24 delivery.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductId: 'rem-zopiclone-75'
      };
      setMessages(prev => [...prev, fallbackMsg]);
      saveConsultationMessage(sessionId, fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const symptomPresets = [
    { title: "Severe Insomnia / Waking Up at 3 AM", text: "I have had chronic insomnia for 3 weeks and struggle to fall asleep or wake up repeatedly throughout the night. What is the most effective sleep aid you supply?" },
    { title: "Daytime Anxiety & Panic Episodes", text: "I am experiencing acute social anxiety and muscle tension before presentations. Which calming treatment is safest for daytime or situational use?" },
    { title: "Severe Back & Joint Pain Relief", text: "I have persistent lower back pain after injury. Over-the-counter paracetamol is not providing relief. What stronger pain relief do you recommend?" },
    { title: "Shift-Work Fatigue & Brain Fog", text: "I work long night shifts and suffer from extreme daytime brain fog. Is Modafinil 200mg suitable for alertness and mental clarity?" }
  ];

  return (
    <div className="py-10 bg-[#01140e] min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/40 text-emerald-300 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
            <span>GPhC Registered AI Clinical Triage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
            Direct Pharmacist Clinical Consultation
          </h1>
          <p className="text-xs sm:text-sm text-emerald-400/80">
            Get instant UK clinical advice on medication suitability, dosage recommendations, and interactions.
          </p>
        </div>

        {/* Quick Symptom Starter Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-emerald-400/80 uppercase tracking-wider block">
            Common Consultation Topics (Click to ask):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {symptomPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset.text)}
                className="p-3 rounded-xl bg-[#031d14] border border-emerald-800/40 hover:border-emerald-500 text-left transition-all text-xs text-emerald-200 group cursor-pointer"
              >
                <span className="font-bold text-white group-hover:text-emerald-300 block mb-0.5">
                  {preset.title}
                </span>
                <span className="text-[11px] text-emerald-400/70 line-clamp-1">
                  {preset.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Conversation Card */}
        <div className="bg-[#031d14] border border-emerald-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
          
          {/* Chat Top Banner */}
          <div className="p-4 bg-[#021811] border-b border-emerald-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#021811] absolute -bottom-0.5 -right-0.5"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Dr. Alistair Vance MRPharmS</h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Superintendent Pharmacist • Online
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/447877180391?text=Hello%20Dr.%20Vance%2C%20I%20would%20like%20a%20clinical%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Consultation: 07877 180391"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#05251a] hover:bg-[#073826] border border-emerald-700/60 text-emerald-300 text-xs font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp (07877 180391)</span>
            </a>

            <a
              href="https://t.me/bossofbenzoo"
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram Consultation: @bossofbenzoo"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#032030] hover:bg-[#053048] border border-cyan-700/60 text-cyan-300 text-xs font-semibold"
            >
              <Send className="w-3.5 h-3.5 text-[#0088cc]" />
              <span>Telegram (@bossofbenzoo)</span>
            </a>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isPharma = msg.sender === 'pharmacist';
              const recProduct = msg.recommendedProductId 
                ? REST_EASY_PRODUCTS.find(p => p.id === msg.recommendedProductId)
                : null;

              return (
                <div 
                  key={msg.id}
                  className={`flex items-start gap-3 ${isPharma ? 'justify-start' : 'justify-end'}`}
                >
                  {isPharma && (
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-xl space-y-2`}>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isPharma
                        ? 'bg-[#021811] border border-emerald-800/60 text-emerald-100'
                        : 'bg-emerald-600 text-white shadow-md'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className={`block text-[10px] mt-2 ${isPharma ? 'text-emerald-500' : 'text-emerald-200'} text-right`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Recommended Product Box if matched */}
                    {recProduct && (
                      <div className="p-3.5 rounded-xl bg-[#042419] border border-emerald-500/50 shadow-lg text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" /> Recommended Treatment
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">{recProduct.strength}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
                              <Pill className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white">{recProduct.name}</h4>
                              <p className="text-[10px] text-emerald-400">{recProduct.category} • From £{recProduct.packOptions[0].price.toFixed(2)}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => onSelectProduct(recProduct.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Basket</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isPharma && (
                    <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 pl-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[11px] text-emerald-500 ml-1">Dr. Vance is evaluating BNF guidelines...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-[#021811] border-t border-emerald-800/50 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your symptom or question (e.g. Can I take Zopiclone with Co-Codamol?)..."
              className="flex-1 bg-[#042017] border border-emerald-700/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

        </div>

        {/* Emergency Safety Notice */}
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p>
            <strong>NHS Red-Flag Protocol:</strong> If you are suffering from severe breathing difficulty, crushing chest pain, or suicidal thoughts, please call <strong>999</strong> or attend your nearest NHS A&E immediately.
          </p>
        </div>

      </div>
    </div>
  );
};
