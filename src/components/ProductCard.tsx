import React, { useState } from 'react';
import { 
  Pill, 
  Star, 
  ShoppingBag, 
  Eye, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  Truck, 
  Flame,
  Share2,
  ExternalLink
} from 'lucide-react';
import { MedicineProduct, ProductPackOption } from '../types';

interface ProductCardProps {
  product: MedicineProduct;
  onAddToCart: (product: MedicineProduct, selectedPack: ProductPackOption, quantity: number) => void;
  onQuickView: (product: MedicineProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView
}) => {
  // Default selected pack is the popular one or the second pack option
  const initialPack = product.packOptions.find(p => p.popular) || product.packOptions[0];
  const [selectedPack, setSelectedPack] = useState<ProductPackOption>(initialPack);
  const [isAdded, setIsAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedPack, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/?med=${product.id}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1800);
    } catch (err) {
      console.error(err);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello PureSleep Pharma, I would like to order:\n- ${product.name} (${selectedPack.label})\n- Price: £${selectedPack.price.toFixed(2)}\n\nPlease provide payment and next-day delivery details.`
  );

  return (
    <div 
      className="bg-[#0f172a] border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/40 group relative"
      itemScope
      itemType="https://schema.org/Drug"
    >
      
      {/* Top Badges & Share button */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700 uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-200 border border-cyan-800/40">
              {product.strength}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {product.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {product.badge}
              </span>
            )}
            <button
              onClick={handleShare}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer text-[10px] flex items-center gap-0.5"
              title="Copy Medication Share Link"
            >
              {copiedLink ? (
                <Check className="w-3 h-3 text-cyan-300" />
              ) : (
                <Share2 className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Product Visual Icon & Image Thumbnail */}
        <div 
          onClick={() => onQuickView(product)}
          className="w-full h-32 rounded-xl bg-gradient-to-br from-[#111c30] to-[#0b0f19] border border-slate-800 flex flex-col items-center justify-center p-3 relative overflow-hidden group-hover:border-cyan-500/40 transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <Pill className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold text-slate-300 mt-2">
            {product.format} • {product.activeIngredient}
          </span>
          <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
            <Truck className="w-3 h-3" /> Next-Day Royal Mail 24
          </span>

          {/* Quick View Button Overlay */}
          <div className="absolute inset-0 bg-[#0b0f19]/80 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold flex items-center gap-1 shadow">
              <Eye className="w-3.5 h-3.5" /> Quick View & Info
            </span>
          </div>
        </div>

        {/* Product Title & Ratings */}
        <div className="mt-4">
          <div className="flex items-center gap-1 text-xs text-amber-400 mb-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
            <span className="text-white font-bold ml-1">{product.rating}</span>
            <span className="text-slate-400 text-[11px]">({product.reviewCount})</span>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="text-base font-bold text-white font-serif-heading hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
            itemProp="name"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed" itemProp="description">
            {product.description}
          </p>
        </div>

        {/* Strip Info & Multi-Pack Selector Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              Select Strips / Pack:
            </label>
            <span className="text-[10px] text-slate-300 font-medium bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
              {product.stripSize || `${product.unitsPerStrip || 10} Units/Strip`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
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
                  className={`p-2 rounded-lg text-left transition-all text-xs border relative cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/50'
                      : 'bg-[#0b0f19] border-slate-800 text-slate-300 hover:border-cyan-600 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px] truncate">{stripLabel}</span>
                    <span className="font-bold text-cyan-300">£{pack.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[9px] text-slate-400">{pack.tabletsCount} Units</span>
                    {pack.freeDelivery ? (
                      <span className="text-[9px] text-cyan-300 font-bold bg-cyan-950 px-1 rounded border border-cyan-600/40">
                        Free Del
                      </span>
                    ) : pack.discountPercentage && pack.discountPercentage > 0 ? (
                      <span className="text-[9px] text-amber-300 font-bold">
                        Save {pack.discountPercentage}%
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500">Standard</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing & CTA Actions */}
      <div className="mt-5 pt-3 border-t border-slate-800">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-white">
                £{selectedPack.price.toFixed(2)}
              </span>
              {selectedPack.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  £{selectedPack.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              Selected: {selectedPack.label}
            </span>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> In Stock
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={handleAdd}
            className={`col-span-4 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isAdded
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" /> Added to Basket
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
            title="Fast Order via WhatsApp"
            className="col-span-1 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>

    </div>
  );
};
