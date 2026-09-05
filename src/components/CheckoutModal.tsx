import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Building, 
  Coins, 
  Banknote, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { CartItem, CouponDiscount, OrderRecord, PaymentMethodType } from '../types';
import { createOrderInFirestore } from '../lib/firestoreService';
import { sendTelegramOrderNotificationClient } from '../lib/telegramService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCoupon: CouponDiscount | null;
  onOrderCreated: (order: OrderRecord) => void;
  onViewInvoice: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onOrderCreated,
  onViewInvoice
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  // Customer Delivery Info State
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Shipping Method State
  const [shippingMethod, setShippingMethod] = useState<'Royal Mail Tracked 24 Express'>('Royal Mail Tracked 24 Express');

  // Payment Method State (Only Bank Transfer & Cryptocurrency)
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'crypto'>('bank_transfer');

  // Pricing Calculations
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const rawSubtotal = safeCartItems.reduce(
    (acc, item) => acc + ((item?.selectedPack?.price || 0) * (item?.quantity || 0)), 
    0
  );

  const autoRefillDiscount = safeCartItems.reduce((acc, item) => {
    if (item?.isAutoRefill && item?.selectedPack) {
      return acc + (item.selectedPack.price * (item.quantity || 1) * 0.10);
    }
    return acc;
  }, 0);

  const loyaltyDiscount = rawSubtotal * 0.05; // 5% default loyalty discount

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    couponDiscountAmount = appliedCoupon.type === 'percentage' 
      ? (rawSubtotal * appliedCoupon.value) / 100 
      : appliedCoupon.value;
  }

  // Royal Mail Shipping Fee £12.00 (or FREE if eligible bulk pack or Free Delivery product selected)
  const hasFreeDelivery = safeCartItems.some(
    i => Boolean(
      i?.selectedPack?.freeDelivery || 
      i?.selectedPack?.id === 'sedil-500box' ||
      i?.product?.id === 'rem-zopiclone-75' ||
      i?.product?.id === 'rem-zopi-10' ||
      i?.product?.id === 'rem-zopiclone-20' ||
      i?.product?.id === 'rem-ritalin-10' ||
      i?.product?.name?.toLowerCase().includes('zopiclone') ||
      i?.product?.name?.toLowerCase().includes('ritalin')
    )
  );
  const shippingFee = hasFreeDelivery ? 0.00 : 12.00;

  const totalDiscount = autoRefillDiscount + loyaltyDiscount + couponDiscountAmount;
  const finalTotal = Math.max(0, rawSubtotal - totalDiscount + shippingFee);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    const orderPayload = {
      items: safeCartItems,
      subtotal: rawSubtotal,
      discount: totalDiscount,
      couponCode: appliedCoupon?.code,
      loyaltyDiscount,
      autoRefillDiscount,
      shippingFee,
      shippingMethod,
      total: finalTotal,
      customerName,
      email,
      phone,
      deliveryAddress,
      city,
      postcode: postcode.toUpperCase(),
      country: "United Kingdom",
      deliveryNotes,
      paymentMethod,
      hasAutoRefill: safeCartItems.some(i => i?.isAutoRefill)
    };

    const localOrderId = `REM-${Math.floor(100000 + Math.random() * 900000)}`;
    const localTracking = `GB-RM-${Math.floor(100000000 + Math.random() * 900000000)}UK`;
    const newOrder: OrderRecord = {
      ...orderPayload,
      id: localOrderId,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: Date.now(),
      status: 'Order Placed & Pending Payment',
      paymentStatus: 'Pending Verification',
      trackingNumber: localTracking,
      trackingHistory: [
        { title: "Order Received", description: "Order confirmed for discrete dispatch", timestamp: "Just now", completed: true, current: true },
        { title: "Clinical Verification", description: "Pharmacist packaging approval", timestamp: "Pending", completed: false }
      ]
    };

    try {
      // 1. Concurrently save to Firebase Firestore, notify backend server, and trigger Telegram Bot
      await Promise.allSettled([
        createOrderInFirestore(newOrder),
        sendTelegramOrderNotificationClient(newOrder)
      ]);

      setCompletedOrder(newOrder);
      onOrderCreated(newOrder);
      setStep(4);
    } catch (err) {
      console.error('Order creation handler error:', err);
      // Failsafe Telegram dispatch even if previous operations had error
      sendTelegramOrderNotificationClient(newOrder).catch(() => {});
      setCompletedOrder(newOrder);
      onOrderCreated(newOrder);
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-[#0f172a] border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Progress Bar */}
        <div className="border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 mb-2">
            <span className={step >= 1 ? 'text-white' : 'text-slate-600'}>1. Delivery</span>
            <span className={step >= 2 ? 'text-white' : 'text-slate-600'}>2. Shipping</span>
            <span className={step >= 3 ? 'text-white' : 'text-slate-600'}>3. Payment</span>
            <span className={step === 4 ? 'text-white' : 'text-slate-600'}>4. Done</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: UK DELIVERY DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold font-serif-heading text-white">UK Delivery Information</h3>
              <p className="text-xs text-slate-400">
                Shipped in 100% unmarked, discrete plain packaging with zero pharma labels.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. David Henderson"
                    className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">UK Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 07700 900821"
                    className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-medium">Email Address (Optional)</label>
                  <span className="text-[10px] text-slate-500 font-medium">Optional</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.co.uk (Optional for digital invoice & dispatch updates)"
                  className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Leave blank if you prefer SMS/WhatsApp tracking only.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Flat 4, 14 Belgrave Crescent"
                  className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Manchester"
                    className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">UK Postcode *</label>
                  <input
                    type="text"
                    required
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="e.g. M4 5AB"
                    className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Leave in porch / safe place behind gate"
                  className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!customerName || !phone || !deliveryAddress || !city || !postcode) {
                  alert('Please fill in all required delivery fields.');
                  return;
                }
                setStep(2);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Continue to Shipping Method</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: SHIPPING SELECTION */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold font-serif-heading text-white">Select Shipping Speed</h3>
              <p className="text-xs text-slate-400">
                Guaranteed next-day UK courier dispatch with Royal Mail tracked barcode & plain discrete packaging.
              </p>
            </div>

            <div className="space-y-2.5">
              <label
                className="p-4 rounded-xl border bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400 text-white flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={true}
                    readOnly
                    className="text-cyan-500 focus:ring-cyan-400"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">Royal Mail Tracked 24 Express</p>
                      <span className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded font-semibold border border-slate-700">
                        Priority Courier
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Next-Day Guaranteed UK Delivery with live SMS parcel tracking & discreet unbranded box.
                    </p>
                    <span className="text-[11px] text-cyan-300 font-semibold mt-1 inline-block">
                      ⚡ Dispatched within 2-4 hours of payment verification
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-base font-extrabold text-cyan-400 font-mono">
                    {hasFreeDelivery ? "FREE" : `£${shippingFee.toFixed(2)}`}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {hasFreeDelivery ? "Bulk Special" : "Flat rate"}
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Payment Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT METHOD */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold font-serif-heading text-white">Select Payment Method</h3>
              <p className="text-xs text-slate-400">
                Encrypted & secure. Discreet bank billing descriptor without pharmaceutical reference.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: UK Faster Bank Transfer */}
              <label
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400'
                    : 'bg-[#111c30] border-slate-700 hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 text-cyan-500 focus:ring-cyan-400"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-cyan-400" />
                      Instant UK Bank Transfer (Faster Payments)
                    </span>
                    <span className="text-[10px] bg-slate-900 text-cyan-300 px-1.5 py-0.5 rounded font-semibold border border-slate-700">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Direct transfer via any UK banking app (Barclays, HSBC, Monzo, Revolut, Lloyds, NatWest). Dispatched immediately upon instant confirmation.
                  </p>
                </div>
              </label>

              {/* Option 2: Cryptocurrency */}
              <label
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'crypto'
                    ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400'
                    : 'bg-[#111c30] border-slate-700 hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'crypto'}
                  onChange={() => setPaymentMethod('crypto')}
                  className="mt-1 text-cyan-500 focus:ring-cyan-400"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-400" />
                      Cryptocurrency (BTC / USDT / ETH)
                    </span>
                    <span className="text-[10px] bg-slate-900 text-cyan-300 border border-slate-700 px-1.5 py-0.5 rounded font-bold">
                      100% Anonymous
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Direct decentralized payment via Bitcoin (BTC), Tether USDT (TRC-20), or Ethereum (ETH). Instant on-chain confirmation.
                  </p>
                </div>
              </label>
            </div>

            {/* Total Summary */}
            <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Shipping (Royal Mail Tracked 24):</span>
                <span className={hasFreeDelivery ? "text-cyan-300 font-bold" : "text-white font-semibold"}>
                  {hasFreeDelivery ? "FREE" : `£${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <div>
                  <span className="text-slate-400">Total Payable:</span>
                  <p className="text-lg font-extrabold text-cyan-300">£{finalTotal.toFixed(2)}</p>
                </div>
                <span className="text-[11px] text-slate-300 font-medium">
                  {safeCartItems.length} item(s) • Royal Mail Tracked 24
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-950/80 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Dispatch...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Complete Order (£{finalTotal.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMATION & INVOICE */}
        {step === 4 && completedOrder && (
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 border border-cyan-400/40 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-cyan-950 font-bold">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Order Confirmed & Logged
              </span>
              <h3 className="text-2xl font-bold font-serif-heading text-white mt-0.5">
                Thank You, {completedOrder.customerName}!
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                Your order <span className="font-mono font-bold text-white">{completedOrder.id}</span> has been scheduled for discreet packaging and Royal Mail Tracked dispatch.
              </p>
            </div>

            {/* Bank Transfer Instructions if Selected */}
            {completedOrder.paymentMethod === 'bank_transfer' && (
              <div className="bg-[#111c30] border border-slate-700 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-cyan-400" />
                    UK Bank Transfer Details
                  </span>
                  <span className="text-[10px] text-amber-300 font-semibold">Faster Payments</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400">Bank Name:</span>
                    <p className="font-semibold text-white">Barclays UK</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Account Name:</span>
                    <p className="font-semibold text-white">RE Logistics Ltd</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Sort Code:</span>
                    <p className="font-mono font-bold text-cyan-300">04-00-04</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Account Number:</span>
                    <p className="font-mono font-bold text-cyan-300">84920194</p>
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-300">
                    Payment Reference: <strong className="text-white font-mono">{completedOrder.id}</strong>
                  </span>
                  <button
                    onClick={() => copyToClipboard(completedOrder.id, 'ref')}
                    className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-1 rounded flex items-center gap-1 hover:bg-slate-700"
                  >
                    {copiedField === 'ref' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Crypto Transfer Instructions if Selected */}
            {completedOrder.paymentMethod === 'crypto' && (
              <div className="bg-[#111c30] border border-amber-600/50 rounded-xl p-4 text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    Cryptocurrency Payment Wallets
                  </span>
                  <span className="text-[10px] text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    20% Discount Applied
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-300">
                  Please send your payment to any of the supported cryptocurrency addresses below using reference <strong className="text-white font-mono">{completedOrder.id}</strong>:
                </p>

                {/* USDT TRC-20 */}
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">USDT (TRC-20 Network):</span>
                    <button
                      onClick={() => copyToClipboard('TX9824nL9842019482109482104928104', 'usdt')}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === 'usdt' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                      Copy USDT
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-white break-all select-all">
                    TX9824nL9842019482109482104928104
                  </p>
                </div>

                {/* Bitcoin (BTC) */}
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Bitcoin (BTC):</span>
                    <button
                      onClick={() => copyToClipboard('bc1q9x4p7u2d4k8v6w0y2e1z5s3a8m9n0p1q2r3s4t', 'btc')}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === 'btc' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                      Copy BTC
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-white break-all select-all">
                    bc1q9x4p7u2d4k8v6w0y2e1z5s3a8m9n0p1q2r3s4t
                  </p>
                </div>

                {/* Ethereum (ETH) */}
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Ethereum (ETH / ERC-20):</span>
                    <button
                      onClick={() => copyToClipboard('0x71C2a3D8F5e902b4d93910c83aFe1092e01B93A1', 'eth')}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === 'eth' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                      Copy ETH
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-white break-all select-all">
                    0x71C2a3D8F5e902b4d93910c83aFe1092e01B93A1
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onViewInvoice(completedOrder)}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>View & Print Official Pharmacy Invoice</span>
              </button>

              <a
                href={`https://wa.me/447700900892?text=Hello%20PureSleep%20Pharma%2C%20I%20have%20completed%20Order%20${completedOrder.id}%20for%20%C2%A3${completedOrder.total.toFixed(2)}.%20Please%20confirm%20dispatch.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Confirm Payment via WhatsApp (+44 7700 900892)</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2 text-xs text-slate-400 hover:text-cyan-300 cursor-pointer"
              >
                Return to Store
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
