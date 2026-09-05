import React, { useState } from 'react';
import { 
  X, 
  Pill, 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  MessageCircle, 
  Send,
  Plus,
  Minus,
  Sparkles,
  Share2,
  Check,
  ExternalLink,
  Lock
} from 'lucide-react';
import { MedicineProduct, ProductPackOption } from '../types';

interface ProductQuickViewModalProps {
  product: MedicineProduct | null;
  onClose: () => void;
  onAddToCart: (product: MedicineProduct, selectedPack: ProductPackOption, quantity: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [selectedPack, setSelectedPack] = useState<ProductPackOption>(
    product.packOptions.find(p => p.popular) || product.packOptions[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'dosage' | 'cautions'>('info');
  const [isAdded, setIsAdded] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const totalPrice = selectedPack.price * quantity;
  const productUrl = `${window.location.origin}/?med=${product.id}`;

  const handleAdd = () => {
    onAddToCart(product, selectedPack, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(productUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello PureSleep Pharma, I'd like to order:\n- Product: ${product.name}\n- Pack: ${selectedPack.label}\n- Quantity: ${quantity}\n- Total Price: £${totalPrice.toFixed(2)}\n\nPlease dispatch via Royal Mail Tracked 24.`
  );

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      itemScope
      itemType="https://schema.org/Drug"
    >
      <div 
        className="relative bg-[#0f172a] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Toolbar */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
            title="Copy Direct Medication Link"
          >
            {linkCopied ? (
              <>
                <Check className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-medium pr-1 text-cyan-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="text-[11px] font-medium pr-1 hidden sm:inline">Share Link</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breadcrumb Header */}
        <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1.5 overflow-x-auto pb-1">
          <span>Home</span>
          <span className="text-slate-600">/</span>
          <span>Treatments</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-300 font-semibold">{product.category}</span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-800 pb-4 pr-16 sm:pr-24">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 border border-cyan-400/40 flex items-center justify-center text-slate-950 font-bold shadow-lg shrink-0">
            <Pill className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700 uppercase">
                {product.category}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-200 border border-cyan-800/40">
                {product.strength}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                SKU: <span itemProp="sku">{product.sku}</span>
              </span>
            </div>
            <h1 itemProp="name" className="text-xl sm:text-2xl font-bold font-serif-heading text-white mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400">
              Brand: <span itemProp="brand" className="text-slate-200">{product.brand}</span> • Active Ingredient: <span itemProp="activeIngredient" className="text-slate-200">{product.activeIngredient}</span>
            </p>
          </div>
        </div>

        {/* Ratings & Trust Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-white font-bold">{product.rating} / 5.0</span>
            <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
          </div>
          <span className="text-cyan-300 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            Royal Mail Tracked 24 Discrete Delivery
          </span>
        </div>

        {/* Pack Selector */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
              1. Select Strips / Pack Size (Priced per strip):
            </label>
            <span className="text-[11px] font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
              {product.stripSize || `${product.unitsPerStrip || 10} Units / Strip`}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {product.packOptions.map((pack) => {
              const isSelected = selectedPack.id === pack.id;
              const stripLabel = pack.id === 'sedil-500box'
                ? '1 Box (500 Pcs)'
                : (pack.stripsCount 
                  ? `${pack.stripsCount} Strip${pack.stripsCount > 1 ? 's' : ''}`
                  : `${pack.tabletsCount} Tab`);
              return (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPack(pack)}
                  className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400'
                      : 'bg-[#0b0f19] border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold text-white truncate">{stripLabel}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{pack.tabletsCount} Units</p>
                  <p className="text-sm font-extrabold text-cyan-400 mt-1">£{pack.price.toFixed(2)}</p>
                  {pack.freeDelivery ? (
                    <span className="text-[9px] font-bold text-cyan-300 bg-cyan-950 px-1 py-0.5 rounded border border-cyan-600/40 inline-block mt-0.5">
                      FREE Delivery
                    </span>
                  ) : pack.discountPercentage && pack.discountPercentage > 0 ? (
                    <span className="text-[9px] font-bold text-amber-300 block mt-0.5">
                      Save {pack.discountPercentage}%
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-500 block mt-0.5">Base Rate</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Tabs */}
        <div className="border-t border-slate-800 pt-3">
          <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'info' 
                  ? 'border-cyan-400 text-cyan-300' 
                  : 'border-transparent text-slate-400 hover:text-cyan-300'
              }`}
            >
              Overview & BNF Indication
            </button>
            <button
              onClick={() => setActiveTab('dosage')}
              className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'dosage' 
                  ? 'border-cyan-400 text-cyan-300' 
                  : 'border-transparent text-slate-400 hover:text-cyan-300'
              }`}
            >
              Dosage & Usage
            </button>
            <button
              onClick={() => setActiveTab('cautions')}
              className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'cautions' 
                  ? 'border-cyan-400 text-cyan-300' 
                  : 'border-transparent text-slate-400 hover:text-cyan-300'
              }`}
            >
              Cautions & Side Effects
            </button>
          </div>

          <div className="py-3 text-xs text-slate-300 min-h-[100px] leading-relaxed">
            {activeTab === 'info' && (
              <div className="space-y-2">
                <p>{product.description}</p>
                <div className="p-2.5 rounded-lg bg-[#111c30] border border-slate-700">
                  <span className="font-bold text-cyan-300 block mb-0.5">BNF Clinical Indication:</span>
                  <p className="text-slate-300">{product.bnfIndication}</p>
                </div>
              </div>
            )}

            {activeTab === 'dosage' && (
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[#111c30] border border-slate-700">
                  <span className="font-bold text-cyan-300 block mb-0.5">Adult Dosage Guide:</span>
                  <p className="text-slate-100">{product.dosageAdult}</p>
                </div>
                <div>
                  <span className="font-bold text-cyan-300 block mb-1">Administration Instructions:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {product.usageInstructions.map((ins, i) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'cautions' && (
              <div className="space-y-2">
                <div>
                  <span className="font-bold text-rose-300 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Contraindications & Warnings:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {product.cautions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-1">
                  <span className="font-bold text-cyan-300 block mb-0.5">Common Side Effects:</span>
                  <p className="text-slate-400">{product.commonSideEffects.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quantity & Order Footer */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Quantity Stepper & Price */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
            <div className="flex items-center gap-2 bg-[#111c30] border border-slate-700 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <p className="text-[10px] text-slate-400">Total Amount</p>
              <p className="text-2xl font-extrabold text-white">£{totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAdd}
              className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                isAdded
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-cyan-950/80'
              }`}
            >
              {isAdded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Added to Basket
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Basket
                </>
              )}
            </button>

            <a
              href={`https://wa.me/447700900892?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
