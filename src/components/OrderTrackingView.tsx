import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Pill,
  Send
} from 'lucide-react';
import { OrderRecord } from '../types';
import { getOrderByIdFromFirestore, getOrdersFromFirestore } from '../lib/firestoreService';

interface OrderTrackingViewProps {
  initialTrackingCode?: string;
  onViewInvoice: (order: OrderRecord) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialTrackingCode = '',
  onViewInvoice
}) => {
  const [searchInput, setSearchInput] = useState(initialTrackingCode || 'REM-849201');
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const qNorm = query.trim().toUpperCase();
      // 1. Try Firestore direct lookup
      const direct = await getOrderByIdFromFirestore(qNorm);
      if (direct) {
        setOrder(direct);
        return;
      }

      // Check all orders in Firestore if searched by tracking number
      const allOrders = await getOrdersFromFirestore();
      const match = allOrders.find(
        o => o.id.toUpperCase() === qNorm || (o.trackingNumber && o.trackingNumber.toUpperCase() === qNorm)
      );
      if (match) {
        setOrder(match);
        return;
      }

      // 2. Fallback to API endpoint
      const res = await fetch(`/api/orders/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'No order found with provided reference code');
        setOrder(null);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to contact tracking server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingCode) {
      setSearchInput(initialTrackingCode);
      fetchOrder(initialTrackingCode);
    } else {
      fetchOrder('REM-849201');
    }
  }, [initialTrackingCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  return (
    <div className="py-10 bg-[#01140e] min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/40 text-emerald-300 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Royal Mail Live Tracked Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
            Track Your Discrete Order
          </h1>
          <p className="text-xs sm:text-sm text-emerald-400/80">
            Enter your PureSleep Pharma Order ID (e.g. <span className="font-mono text-emerald-200">REM-849201</span>) or Royal Mail tracking number.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. REM-849201 or GB-RM-948210492UK"
              className="w-full bg-[#051c14] border border-emerald-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400 uppercase font-mono shadow-inner"
            />
            <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Track Parcel'}
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 max-w-xl mx-auto">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details Card */}
        {order && (
          <div className="bg-[#031d14] border border-emerald-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
            
            {/* Top Status & Tracking Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/40 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400/80">Order Ref:</span>
                  <span className="text-sm font-mono font-bold text-white bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {order.id}
                  </span>
                  <span className="text-xs text-emerald-500">• {order.date}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  Status: <span className="text-emerald-300">{order.status}</span>
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onViewInvoice(order)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-700 hover:border-emerald-500 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>View Printable Invoice</span>
                </button>

                <a
                  href={`https://wa.me/447877180391?text=Hello%20PureSleep%20Pharma%2C%20checking%20status%20for%20order%20${order.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#05251a] hover:bg-[#073826] border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="WhatsApp Pharmacist: 07877 180391"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Pharmacist</span>
                </a>

                <a
                  href="https://t.me/bossofbenzoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#032030] hover:bg-[#053048] border border-cyan-700/60 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Telegram Support: @bossofbenzoo"
                >
                  <Send className="w-4 h-4 text-[#0088cc]" />
                  <span>Telegram (@bossofbenzoo)</span>
                </a>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                Royal Mail Tracked 24 Timeline
              </h3>

              <div className="space-y-4 relative pl-6 border-l-2 border-emerald-800/60 ml-3">
                {(order.trackingHistory || []).map((step, index) => {
                  return (
                    <div key={index} className="relative">
                      {/* Step Circle Pin */}
                      <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        step.completed
                          ? 'bg-emerald-500 border-emerald-400 text-emerald-950'
                          : 'bg-[#01140e] border-emerald-800'
                      }`}>
                        {step.completed && <CheckCircle2 className="w-3 h-3 text-emerald-950" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${step.completed ? 'text-white' : 'text-emerald-500/70'}`}>
                            {step.title}
                          </span>
                          <span className="text-[10px] text-emerald-400/70 bg-emerald-950 px-1.5 py-0.5 rounded font-mono">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-400/80 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery & Package Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-emerald-800/40 text-xs">
              
              {/* Recipient Box */}
              <div className="p-4 rounded-xl bg-[#042017] border border-emerald-800/50 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>UK Letterbox Destination</span>
                </div>
                <p className="text-white font-semibold">{order.customerName}</p>
                <p className="text-emerald-400/90">{order.deliveryAddress}</p>
                <p className="text-emerald-400/90">{order.city}, <strong className="text-white">{order.postcode}</strong></p>
                <p className="text-emerald-500 text-[11px]">Phone: {order.phone}</p>
                {order.deliveryNotes && (
                  <p className="text-[11px] text-amber-300 bg-amber-950/40 p-1.5 rounded border border-amber-500/30">
                    Notes: {order.deliveryNotes}
                  </p>
                )}
              </div>

              {/* Package Contents Breakdown */}
              <div className="p-4 rounded-xl bg-[#042017] border border-emerald-800/50 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>Blister-Sealed Contents ({(order.items || []).length} item(s))</span>
                </div>

                <div className="divide-y divide-emerald-900/40 max-h-32 overflow-y-auto">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="py-1.5 first:pt-0 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{item?.product?.name || 'Medication'}</p>
                        <p className="text-[11px] text-emerald-400/80">
                          {item?.selectedPack?.label || 'Standard Pack'} • Qty: {item?.quantity || 1}
                        </p>
                      </div>
                      <span className="font-mono text-emerald-300">
                        £{((item?.selectedPack?.price || 0) * (item?.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-emerald-800/40 pt-2 flex items-center justify-between text-xs font-bold text-white">
                  <span>Total Paid:</span>
                  <span className="text-emerald-400 text-sm">£{(order.total || 0).toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Plain Packaging Declaration Badge */}
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700/40 flex items-center gap-3 text-xs text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-white block">100% Discrete Packaging Certificate</strong>
                <span>All items are sealed in plain, heavy-gauge protective packaging with zero mention of pharmaceutical contents.</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
