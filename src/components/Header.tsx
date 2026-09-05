import React, { useState, useRef, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Star, 
  HelpCircle, 
  UserCheck, 
  Menu, 
  X, 
  ChevronRight,
  MessageSquare,
  Sparkles,
  Award,
  Type,
  Check,
  Sliders
} from 'lucide-react';
import { NavigationTab, MedicineProduct, CartItem } from '../types';
import { REST_EASY_PRODUCTS } from '../data/medicineCatalog';

export type TextFormat = 'modern' | 'clean' | 'lexend' | 'classic';
export type TextSize = 'compact' | 'normal' | 'large';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  cartItems?: CartItem[];
  cartCount?: number;
  setIsCartOpen?: (open: boolean) => void;
  onOpenCart?: () => void;
  onSelectProduct?: (product: MedicineProduct) => void;
  setIsSupportOpen?: (open: boolean) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartItems = [],
  cartCount,
  setIsCartOpen,
  onOpenCart,
  onSelectProduct,
  setIsSupportOpen,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTextFormatOpen, setIsTextFormatOpen] = useState(false);
  const [textFormat, setTextFormat] = useState<TextFormat>(() => {
    return (localStorage.getItem('pure_pharma_text_format') as TextFormat) || 'modern';
  });
  const [textSize, setTextSize] = useState<TextSize>(() => {
    return (localStorage.getItem('pure_pharma_text_size') as TextSize) || 'normal';
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const textFormatRef = useRef<HTMLDivElement>(null);

  // Sync text formatting to document root & body
  useEffect(() => {
    const classesToRemove = [
      'text-format-modern',
      'text-format-clean',
      'text-format-lexend',
      'text-format-classic',
      'text-scale-compact',
      'text-scale-normal',
      'text-scale-large'
    ];
    document.documentElement.classList.remove(...classesToRemove);
    document.body.classList.remove(...classesToRemove);

    document.documentElement.classList.add(`text-format-${textFormat}`);
    document.documentElement.classList.add(`text-scale-${textSize}`);
    document.body.classList.add(`text-format-${textFormat}`);
    document.body.classList.add(`text-scale-${textSize}`);

    try {
      localStorage.setItem('pure_pharma_text_format', textFormat);
      localStorage.setItem('pure_pharma_text_size', textSize);
    } catch (e) {
      // Ignore storage errors in restricted contexts
    }
  }, [textFormat, textSize]);

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const updateSearchQuery = (val: string) => {
    if (externalSetSearchQuery) {
      externalSetSearchQuery(val);
    } else {
      setInternalSearchQuery(val);
    }
  };

  const handleSupportClick = () => {
    if (typeof setIsSupportOpen === 'function') {
      setIsSupportOpen(true);
    } else if (typeof setActiveTab === 'function') {
      setActiveTab('triage');
    }
  };

  const handleCartClick = () => {
    if (typeof onOpenCart === 'function') {
      onOpenCart();
    } else if (typeof setIsCartOpen === 'function') {
      setIsCartOpen(true);
    }
  };

  const handleProductSelect = (product: MedicineProduct) => {
    if (typeof onSelectProduct === 'function') {
      onSelectProduct(product);
    } else if (typeof setActiveTab === 'function') {
      setActiveTab('shop');
      updateSearchQuery(product.name);
    }
    setIsSearchOpen(false);
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const calculatedCount = safeCartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0);
  const totalCartCount = typeof cartCount === 'number' ? cartCount : calculatedCount;
  const totalCartValue = safeCartItems.reduce(
    (acc, item) => acc + ((item?.selectedPack?.price || 0) * (item?.quantity || 0)), 
    0
  );

  // Search filter results
  const searchResults = searchQuery.trim() === '' ? [] : REST_EASY_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.bnfIndication.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  // Close search and text format dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (textFormatRef.current && !textFormatRef.current.contains(event.target as Node)) {
        setIsTextFormatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Notification / Trust Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0d1527] to-slate-950 border-b border-slate-800/60 text-xs py-1.5 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-cyan-200">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              🇬🇧 UK Royal Mail Tracked 24 • Next-Day Delivery
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> 100% Discrete Plain Packaging Guaranteed
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Text Format / Accessibility Dropdown */}
            <div ref={textFormatRef} className="relative">
              <button 
                onClick={() => setIsTextFormatOpen(!isTextFormatOpen)}
                className="hover:text-cyan-200 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer text-xs bg-slate-900/80 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700/80"
                title="Customize Typography & Text Format"
              >
                <Type className="w-3 h-3 text-cyan-400" />
                <span className="font-semibold text-[11px]">Text Format</span>
              </button>

              {isTextFormatOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-3 text-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-cyan-400" />
                      Text & Font Format
                    </span>
                    <button
                      onClick={() => setIsTextFormatOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Font Presets */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      Font Family Style
                    </label>
                    <div className="grid grid-cols-1 gap-1">
                      <button
                        onClick={() => setTextFormat('modern')}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors ${
                          textFormat === 'modern'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400 font-bold'
                            : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        <div>
                          <p className="text-xs">✨ Modern Geometric</p>
                          <span className="text-[10px] text-slate-400 block font-normal">Outfit + Plus Jakarta Sans</span>
                        </div>
                        {textFormat === 'modern' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>

                      <button
                        onClick={() => setTextFormat('clean')}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors ${
                          textFormat === 'clean'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400 font-bold'
                            : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        <div>
                          <p className="text-xs">⚡ Minimalist Clean</p>
                          <span className="text-[10px] text-slate-400 block font-normal">Inter Clinical Standard</span>
                        </div>
                        {textFormat === 'clean' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>

                      <button
                        onClick={() => setTextFormat('lexend')}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors ${
                          textFormat === 'lexend'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400 font-bold'
                            : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        <div>
                          <p className="text-xs">📖 High Legibility</p>
                          <span className="text-[10px] text-slate-400 block font-normal">Lexend Reading Clarity</span>
                        </div>
                        {textFormat === 'lexend' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>

                      <button
                        onClick={() => setTextFormat('classic')}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition-colors ${
                          textFormat === 'classic'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400 font-bold'
                            : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        <div>
                          <p className="text-xs">🏛️ Classic Editorial</p>
                          <span className="text-[10px] text-slate-400 block font-normal">Source Serif 4 Apothecary</span>
                        </div>
                        {textFormat === 'classic' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Size Scaling */}
                  <div className="border-t border-slate-800 pt-2 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      Text Sizing
                    </label>
                    <div className="grid grid-cols-3 gap-1 text-center">
                      <button
                        onClick={() => setTextSize('compact')}
                        className={`py-1 rounded text-[11px] font-medium border ${
                          textSize === 'compact'
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        Compact
                      </button>
                      <button
                        onClick={() => setTextSize('normal')}
                        className={`py-1 rounded text-[11px] font-medium border ${
                          textSize === 'normal'
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setTextSize('large')}
                        className={`py-1 rounded text-[11px] font-medium border ${
                          textSize === 'large'
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <span className="text-slate-700">|</span>

            <button 
              onClick={() => setActiveTab('track-order')}
              className="hover:text-cyan-200 transition-colors flex items-center gap-1 cursor-pointer text-xs text-slate-300"
            >
              <Truck className="w-3 h-3 text-cyan-400" /> Track Parcel
            </button>
            <span className="text-slate-700">|</span>
            <a 
              href="https://wa.me/447700900892?text=Hello%20PureSleep%20Pharma%2C%20I%20would%20like%20to%20order" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> WhatsApp Order
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-950/80 border border-cyan-400/40 group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-serif-heading">PureSleep</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 tracking-wide uppercase">
                  Pharma
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">UK Premier Online Pharmacy</p>
            </div>
          </button>

          {/* Search Input Bar */}
          <div ref={searchRef} className="relative hidden md:flex flex-1 max-w-lg mx-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  updateSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search Zopiclone, Diazepam, Modafinil, Pain Relief..."
                className="w-full bg-[#0f172a] border border-slate-700/70 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button 
                  onClick={() => updateSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchOpen && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                <div className="p-2 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                  <span>Found {searchResults.length} Products</span>
                  <span className="text-slate-400">Press product to view</span>
                </div>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-800/70">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="w-full p-3 text-left hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-700/30 flex items-center justify-center text-cyan-400">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {product.category} • {product.strength}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-cyan-400">
                            from £{product.basePrice.toFixed(2)}
                          </p>
                          <span className="text-[10px] text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                            In Stock
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No medications found matching "{searchQuery}". Try searching for Zopiclone, Diazepam, or Modafinil.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'shop' 
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'categories' 
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('track-order')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'track-order' || activeTab === 'tracking'
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              Track Order
            </button>
            <button
              onClick={() => setActiveTab('auto-refill')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'auto-refill' 
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              Auto-Refill
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'reviews' 
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                activeTab === 'admin' 
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50' 
                  : 'text-amber-400/80 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-800/40'
              }`}
            >
              Admin
            </button>
          </nav>

          {/* Right Action Icons: Live Chat & Cart */}
          <div className="flex items-center gap-2.5">
            {/* Live Support Trigger */}
            <button
              onClick={handleSupportClick}
              className="p-2 rounded-xl bg-[#0f172a] border border-slate-700 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all cursor-pointer relative group flex items-center gap-1.5"
              title="Pharmacist Live Chat"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium">Pharmacist</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-1 right-1 sm:static"></span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={handleCartClick}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-950/70 border border-cyan-300/40 transition-all cursor-pointer relative group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-slate-900 text-cyan-300 border border-cyan-400 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold">
                {totalCartValue > 0 ? `£${totalCartValue.toFixed(2)}` : 'Basket'}
              </span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0f172a] border border-slate-700 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateSearchQuery(e.target.value)}
              placeholder="Search Zopiclone, Diazepam, Modafinil..."
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0b1324] border-b border-slate-800 px-4 py-4 space-y-2">
          <button
            onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800/60 text-sm font-medium"
          >
            Home
          </button>
          <button
            onClick={() => { setActiveTab('shop'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800/60 text-sm font-medium"
          >
            All Products
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800/60 text-sm font-medium"
          >
            Categories & Conditions
          </button>
          <button
            onClick={() => { setActiveTab('track-order'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800/60 text-sm font-medium flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-cyan-400" />
            Track Parcel Status
          </button>
          <button
            onClick={() => { setActiveTab('auto-refill'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800/60 text-sm font-medium flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            Auto-Refill & Save
          </button>
          <button
            onClick={() => { setActiveTab('reviews'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800/60 text-sm font-medium flex items-center gap-2"
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Verified Customer Reviews
          </button>
          <button
            onClick={() => { setActiveTab('support'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800/60 text-sm font-medium flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            FAQ & Support
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-amber-300 bg-amber-950/40 border border-amber-600/30 text-sm font-medium"
          >
            Admin Management Portal
          </button>

          {/* Mobile Text Format Quick Controls */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
              Text & Font Format
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setTextFormat('modern')}
                className={`px-2.5 py-1.5 rounded-lg text-xs text-left border ${
                  textFormat === 'modern' ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                ✨ Modern
              </button>
              <button
                onClick={() => setTextFormat('clean')}
                className={`px-2.5 py-1.5 rounded-lg text-xs text-left border ${
                  textFormat === 'clean' ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                ⚡ Clean Inter
              </button>
              <button
                onClick={() => setTextFormat('lexend')}
                className={`px-2.5 py-1.5 rounded-lg text-xs text-left border ${
                  textFormat === 'lexend' ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                📖 Legibility
              </button>
              <button
                onClick={() => setTextFormat('classic')}
                className={`px-2.5 py-1.5 rounded-lg text-xs text-left border ${
                  textFormat === 'classic' ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                🏛️ Serif
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
