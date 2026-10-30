import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Tag, 
  ShieldCheck, 
  RotateCcw, 
  ArrowRight, 
  Check, 
  MessageCircle, 
  Send,
  Award,
  Sparkles,
  Percent
} from 'lucide-react';
import { CartItem, CouponDiscount, LoyaltyTier } from '../types';
import { COUPON_CODES, LOYALTY_TIERS } from '../data/medicineCatalog';

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onToggleAutoRefill: (id: string, intervalDays: 30 | 60 | 90) => void;
  appliedCoupon: CouponDiscount | null;
  onApplyCoupon: (coupon: CouponDiscount | null) => void;
  onProceedToCheckout: () => void;
}

export const ShoppingCartDrawer: React.FC<ShoppingCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onToggleAutoRefill,
  appliedCoupon,
  onApplyCoupon,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Calculations
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const rawSubtotal = safeCartItems.reduce(
    (acc, item) => acc + ((item?.selectedPack?.price || 0) * (item?.quantity || 0)), 
    0
  );

  // Auto-Refill Discount (10% on items marked for auto-refill)
  const autoRefillDiscount = safeCartItems.reduce((acc, item) => {
    if (item?.isAutoRefill && item?.selectedPack) {
      return acc + (item.selectedPack.price * (item.quantity || 1) * 0.10);
    }
    return acc;
  }, 0);

  // Loyalty Tier calculation based on subtotal (or customer historical spend)
  const currentLoyaltyTier: LoyaltyTier = 
    rawSubtotal >= 500 ? LOYALTY_TIERS[3] : // Platinum
    rawSubtotal >= 250 ? LOYALTY_TIERS[2] : // Gold
    rawSubtotal >= 100 ? LOYALTY_TIERS[1] : // Silver
    LOYALTY_TIERS[0]; // Bronze

  const loyaltyDiscount = (rawSubtotal * currentLoyaltyTier.discountPercent) / 100;

  // Coupon discount calculation
  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      couponDiscountAmount = (rawSubtotal * appliedCoupon.value) / 100;
    } else {
      couponDiscountAmount = appliedCoupon.value;
    }
  }

  // Royal Mail Tracked 24 Shipping (£12.00 flat rate for next-day discreet delivery, or FREE if any item includes free delivery)
  const hasFreeDelivery = safeCartItems.some(i => i?.selectedPack?.freeDelivery);
  const shippingFee = hasFreeDelivery ? 0 : 12.00;

  const totalDiscount = autoRefillDiscount + loyaltyDiscount + couponDiscountAmount;
  const finalTotal = Math.max(0, rawSubtotal - totalDiscount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const found = COUPON_CODES.find(
      c => c.code.toUpperCase() === couponInput.trim().toUpperCase()
    );

    if (!found) {
      setCouponError('Invalid coupon code. Try WELCOME15 or PURESLEEP10');
      return;
    }

    if (rawSubtotal < found.minSpend) {
      setCouponError(`Minimum spend of £${found.minSpend} required for code ${found.code}`);
      return;
    }

    onApplyCoupon(found);
    setCouponSuccess(`Coupon ${found.code} applied successfully!`);
    setCouponInput('');
  };

  // WhatsApp formatted order text
  const formattedItemsText = safeCartItems.map(
    (i, idx) => `${idx + 1}. ${i?.product?.name || 'Item'} - ${i?.selectedPack?.label || 'Pack'} (Qty: ${i?.quantity || 1}) - £${((i?.selectedPack?.price || 0) * (i?.quantity || 1)).toFixed(2)}${i?.isAutoRefill ? ' [Auto-Refill 30d]' : ''}`
  ).join('%0A');

  const whatsappCheckoutUrl = `https://wa.me/447877180391?text=Hello%20PureSleep%20Pharma%2C%20I%20would%20like%20to%20place%20an%20order%20for%3A%0A%0A${formattedItemsText}%0A%0ASubtotal%3A%20%C2%A3${rawSubtotal.toFixed(2)}%0ADiscount%3A%20-%C2%A3${totalDiscount.toFixed(2)}%0AShipping%3A%20%C2%A3${shippingFee.toFixed(2)}%0ATotal%3A%20%C2%A3${finalTotal.toFixed(2)}%0A%0APlease%20provide%20payment%20details%20for%20discreet%20next-day%20dispatch.`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#0f172a] border-l border-slate-800 h-full flex flex-col shadow-2xl text-white relative animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0b0f19]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif-heading">Your Medicine Basket</h2>
              <p className="text-[11px] text-slate-400">{safeCartItems.length} unique treatment item(s)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Royal Mail Shipping Indicator */}
        <div className="bg-[#111c30] px-4 py-2.5 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Royal Mail Tracked 24 Express UK Delivery</span>
            </span>
            <span className="text-[11px] text-slate-300 font-extrabold bg-slate-900 px-2 py-0.5 rounded border border-slate-700 font-mono">
              £{shippingFee.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Loyalty Tier Badge Progress */}
        <div className="bg-[#0b0f19] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Tier: {currentLoyaltyTier.name} ({currentLoyaltyTier.discountPercent}% Off)</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Saved: £{loyaltyDiscount.toFixed(2)}
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800">
          {safeCartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Your basket is empty</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Explore our catalog for genuine sleep aids, anxiety treatments, nootropics, and pain relief.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors"
              >
                Browse Treatments
              </button>
            </div>
          ) : (
            safeCartItems.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                        {item.product.category}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {item.product.strength}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-0.5">{item.product.name}</h4>
                    <p className="text-[11px] text-slate-300">{item.selectedPack.label}</p>
                    <p className="text-xs font-bold text-cyan-400 mt-1">
                      £{item.selectedPack.price.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Stepper & Subtotal */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 bg-[#111c30] border border-slate-700 rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-slate-900 text-slate-300 flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-slate-900 text-slate-300 flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-xs font-extrabold text-white">
                    £{(item.selectedPack.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Auto-Refill & Save 10% Checkbox */}
                <div className="bg-[#0b0f19] p-2 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                  <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isAutoRefill || false}
                      onChange={(e) => onToggleAutoRefill(item.id, e.target.checked ? 30 : 30)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span className="flex items-center gap-1 font-medium">
                      <RotateCcw className="w-3 h-3 text-cyan-400" />
                      Auto-Refill Every 30 Days
                    </span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                    Extra 10% Off
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon, Calculations, and Actions */}
        {safeCartItems.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-[#0b0f19] space-y-3">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code (e.g. WELCOME15)"
                  className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 uppercase"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-600 transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {couponError && <p className="text-[10px] text-rose-400">{couponError}</p>}
            {couponSuccess && <p className="text-[10px] text-cyan-400">{couponSuccess}</p>}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs border-t border-slate-800 pt-2 text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-white font-semibold">£{rawSubtotal.toFixed(2)}</span>
              </div>

              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Loyalty Discount ({currentLoyaltyTier.name}):</span>
                  <span>-£{loyaltyDiscount.toFixed(2)}</span>
                </div>
              )}

              {autoRefillDiscount > 0 && (
                <div className="flex justify-between text-cyan-400">
                  <span>Auto-Refill Savings (10%):</span>
                  <span>-£{autoRefillDiscount.toFixed(2)}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-cyan-400">
                  <span>Promo Code ({appliedCoupon.code}):</span>
                  <span>-£{couponDiscountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Royal Mail Tracked 24 Delivery:</span>
                <span className={`font-semibold font-mono ${shippingFee === 0 ? 'text-emerald-400' : 'text-white'}`}>
                  {shippingFee === 0 ? 'FREE' : `£${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-white border-t border-slate-800 pt-1.5">
                <span>Total Payable:</span>
                <span className="text-cyan-400 text-base">£{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTAs */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Discreet Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={whatsappCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Direct WhatsApp Order: 07877 180391"
                  className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Order</span>
                </a>

                <a
                  href="https://t.me/bossofbenzoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Direct Telegram Chat: @bossofbenzoo"
                  className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-[#0088cc]" />
                  <span>Telegram (@bossofbenzoo)</span>
                </a>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
