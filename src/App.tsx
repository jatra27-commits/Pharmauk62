import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  NavigationTab, 
  ProductCategory, 
  MedicineProduct, 
  ProductPackOption, 
  CartItem, 
  CouponDiscount, 
  OrderRecord 
} from './types';
import { REST_EASY_PRODUCTS } from './data/medicineCatalog';
import { 
  getProductSEOMetadata, 
  getCategorySEOMetadata, 
  getTabSEOMetadata, 
  SEOMetadata 
} from './utils/seoData';
import { 
  seedInitialFirestoreData, 
  saveCartToFirestore, 
  loadCartFromFirestore, 
  getDeviceId,
  listenToProductsFromFirestore,
  getProductsFromFirestore
} from './lib/firestoreService';

// Components
import { Header } from './components/Header';
import { SEOHead } from './components/SEOHead';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { ShoppingCartDrawer } from './components/ShoppingCartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TriageConsultation } from './components/TriageConsultation';
import { BNFInteractionChecker } from './components/BNFInteractionChecker';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AutoRefillPortal } from './components/AutoRefillPortal';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { AdminPortal } from './components/AdminPortal';
import { InvoiceModal } from './components/InvoiceModal';
import { Footer } from './components/Footer';

// Icons for filter bar
import { 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Pill, 
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Send,
  Truck
} from 'lucide-react';

export function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<NavigationTab>('shop');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Dynamic Products State synchronized from Firebase Firestore
  const [products, setProducts] = useState<MedicineProduct[]>(REST_EASY_PRODUCTS);

  // Subscribe to real-time Products in Firestore
  useEffect(() => {
    const unsubscribe = listenToProductsFromFirestore((liveProducts) => {
      if (liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
      }
    });
    return () => unsubscribe();
  }, []);

  // Modals & Active Selections
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<MedicineProduct | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderRecord | null>(null);
  const [activeTrackingId, setActiveTrackingId] = useState<string>('REM-849201');

  // Parse Initial URL for deep-linking (Medicines, Categories, Tabs, Tracking)
  useEffect(() => {
    const handleUrlRouting = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const medParam = params.get('med') || params.get('medication') || params.get('product');
        const categoryParam = params.get('category');
        const tabParam = params.get('tab') as NavigationTab | null;
        const trackParam = params.get('track');

        if (medParam) {
          const found = products.find(
            p => p.id.toLowerCase() === medParam.toLowerCase() || 
                 p.slug?.toLowerCase() === medParam.toLowerCase() ||
                 p.sku.toLowerCase() === medParam.toLowerCase()
          );
          if (found) {
            setQuickViewProduct(found);
            return;
          }
        }

        if (categoryParam) {
          const validCat = [
            'Sleep Aids',
            'Anxiety & Calm',
            'Pain Relief',
            'Nootropics & Focus',
            'Men\'s Health',
            'Weight & Wellness',
            'Digestive & Gut Health',
            'Allergy & Hayfever'
          ].find(c => c.toLowerCase() === categoryParam.toLowerCase()) as ProductCategory | undefined;

          if (validCat) {
            setSelectedCategory(validCat);
            setActiveTab('shop');
          }
        } else if (tabParam) {
          const validTabs: NavigationTab[] = ['shop', 'home', 'categories', 'triage', 'bnf-checker', 'tracking', 'auto-refill', 'reviews', 'faq', 'support', 'admin'];
          if (validTabs.includes(tabParam)) {
            setActiveTab(tabParam);
          }
        }

        if (trackParam) {
          setActiveTrackingId(trackParam);
          setActiveTab('tracking');
        }
      } catch (err) {
        console.error('URL parse error:', err);
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [products]);

  // Synchronize URL query params with state changes without reloading page
  useEffect(() => {
    try {
      let newUrl = window.location.pathname;
      if (quickViewProduct) {
        newUrl += `?med=${encodeURIComponent(quickViewProduct.id)}`;
      } else if (activeTab === 'shop' || activeTab === 'home' || activeTab === 'categories') {
        if (selectedCategory !== 'All') {
          newUrl += `?category=${encodeURIComponent(selectedCategory)}`;
        }
      } else {
        newUrl += `?tab=${encodeURIComponent(activeTab)}`;
      }

      if (window.location.search !== (newUrl.includes('?') ? newUrl.substring(newUrl.indexOf('?')) : '')) {
        window.history.replaceState({}, '', newUrl);
      }
    } catch (e) {
      console.error('Failed to update URL state', e);
    }
  }, [quickViewProduct, activeTab, selectedCategory]);

  // Compute Active SEO Metadata
  const currentSEO: SEOMetadata = useMemo(() => {
    if (quickViewProduct) {
      return getProductSEOMetadata(quickViewProduct);
    }
    if (activeTab === 'shop' || activeTab === 'home' || activeTab === 'categories') {
      return getCategorySEOMetadata(selectedCategory);
    }
    return getTabSEOMetadata(activeTab);
  }, [quickViewProduct, activeTab, selectedCategory]);

  // Initialize Firestore collections with updated 1-Strip Catalog & live records
  useEffect(() => {
    seedInitialFirestoreData(true).catch(err => {
      console.warn('Initial Firestore seeding check:', err);
    });
  }, []);

  // Cart State (Synchronized with Firestore session, zero localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const defaultProd = REST_EASY_PRODUCTS[0];
    const defaultPack = defaultProd.packOptions.find(p => p.popular) || defaultProd.packOptions[1];
    return [
      {
        id: `cart-${defaultProd.id}-${defaultPack.id}`,
        product: defaultProd,
        selectedPack: defaultPack,
        quantity: 1,
        isAutoRefill: false
      }
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<CouponDiscount | null>(null);

  // Load cart from Firestore on startup
  useEffect(() => {
    const deviceId = getDeviceId();
    loadCartFromFirestore(deviceId).then(items => {
      if (items && items.length > 0) {
        setCartItems(items);
      }
    });
  }, []);

  // Sync cart to Firestore
  useEffect(() => {
    const deviceId = getDeviceId();
    saveCartToFirestore(deviceId, cartItems);
  }, [cartItems]);

  // Cart Handlers
  const handleAddToCart = (product: MedicineProduct, selectedPack: ProductPackOption, quantity: number) => {
    if (!product.inStock) return;
    setCartItems(prev => {
      const itemId = `cart-${product.id}-${selectedPack.id}`;
      const existingIndex = prev.findIndex(item => item.id === itemId);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: itemId,
            product,
            selectedPack,
            quantity,
            isAutoRefill: false
          }
        ];
      }
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
    } else {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    }
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleAutoRefill = (id: string, intervalDays: 30 | 60 | 90) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isAutoRefill: !item.isAutoRefill,
          autoRefillInterval: intervalDays
        };
      }
      return item;
    }));
  };

  const handleOrderCreated = (order: OrderRecord) => {
    setCartItems([]);
    setAppliedCoupon(null);
    setActiveTrackingId(order.id);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = 
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.bnfIndication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return (a.packOptions?.[0]?.price || 0) - (b.packOptions?.[0]?.price || 0);
      }
      if (sortBy === 'price-high') {
        return ((b.packOptions?.[b.packOptions.length - 1]?.price) || 0) - ((a.packOptions?.[a.packOptions.length - 1]?.price) || 0);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Quick categories for filter pills
  const categoryList: (ProductCategory | 'All')[] = [
    'All',
    'Sleep Aids',
    'Anxiety & Calm',
    'Pain Relief',
    'Nootropics & Focus'
  ];

  return (
    <div className="min-h-screen bg-[#101827] text-white flex flex-col selection:bg-[#2563EB] selection:text-white">
      
      {/* 1. Master Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItems={cartItems}
        cartCount={(cartItems || []).reduce((acc, i) => acc + (i?.quantity || 0), 0)}
        setIsCartOpen={setIsCartOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectProduct={(product) => setQuickViewProduct(product)}
        setIsSupportOpen={(open) => {
          if (open) setActiveTab('triage');
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (activeTab !== 'shop' && activeTab !== 'home') setActiveTab('shop');
        }}
      />

      {/* SEO Breadcrumb Bar, Document Title Sync, OpenGraph & Schema Structured Data */}
      <SEOHead seo={currentSEO} showShareBadge={true} />

      {/* 2. Main Page Content Routed by Tab */}
      <main className="flex-1">
        {(activeTab === 'shop' || activeTab === 'home' || activeTab === 'categories') && (
          <div>
            {/* Hero Section */}
            <HeroSection
              setActiveTab={setActiveTab}
              onStartTriage={() => setActiveTab('triage')}
              onBrowseTreatments={() => {
                const el = document.getElementById('treatments-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              setIsSupportOpen={(open) => {
                if (open) setActiveTab('triage');
              }}
            />

            {/* Category Grid Section */}
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                const el = document.getElementById('treatments-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Dispensary Treatments Catalog Section */}
            <section id="treatments-section" className="py-10 bg-[#101827]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                
                {/* Catalog Controls Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#60A5FA] uppercase tracking-widest">
                        Online Dispensary
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#172339] text-[#60A5FA] border border-[#60A5FA]/30">
                        {filteredProducts.length} treatments found
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-heading mt-0.5">
                      {selectedCategory === 'All' ? 'All Licensed Medications' : `${selectedCategory} Range`}
                    </h2>
                  </div>

                  {/* Filter & Sort Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#172339] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#60A5FA]" />
                      <span className="text-slate-400 font-medium">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="featured" className="bg-[#101827]">Featured & Best Sellers</option>
                        <option value="rating" className="bg-[#101827]">Highest Rated (4.9+)</option>
                        <option value="price-low" className="bg-[#101827]">Price: Low to High</option>
                        <option value="price-high" className="bg-[#101827]">Price: High to Low</option>
                      </select>
                    </div>

                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-800/60 px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Clear search "{searchQuery}"
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Horizontal Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categoryList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#2563EB] text-white border-[#60A5FA] shadow-md shadow-blue-900/40 font-bold'
                          : 'bg-[#172339] text-slate-300 border-slate-700/80 hover:border-[#60A5FA]/50 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Product Cards Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center bg-[#172339] rounded-2xl border border-slate-800 space-y-3">
                    <Pill className="w-12 h-12 text-slate-500 mx-auto" />
                    <h3 className="text-base font-bold text-white">No medications match your search</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try searching for generic terms like "Zopiclone", "Diazepam", "Modafinil", or "Sleep".
                    </p>
                    <button
                      onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                      className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-600 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onQuickView={(p) => setQuickViewProduct(p)}
                      />
                    ))}
                  </div>
                )}

              </div>
            </section>

            {/* Verified Patient Reviews */}
            <ReviewsSection />

            {/* FAQs and Newsletter capture */}
            <FAQSection />
          </div>
        )}

        {/* AI Clinical Consultation Triage View */}
        {activeTab === 'triage' && (
          <TriageConsultation
            onSelectProduct={(productId) => {
              const product = products.find(p => p.id === productId);
              if (product) {
                const popularPack = product.packOptions.find(pk => pk.popular) || product.packOptions[0];
                handleAddToCart(product, popularPack, 1);
                setIsCartOpen(true);
              }
            }}
          />
        )}

        {/* BNF Drug-Drug Interaction Checker */}
        {activeTab === 'bnf-checker' && (
          <BNFInteractionChecker />
        )}

        {/* Order Tracking View */}
        {(activeTab === 'tracking' || activeTab === 'track-order') && (
          <OrderTrackingView
            initialTrackingCode={activeTrackingId}
            onViewInvoice={(order) => setSelectedInvoiceOrder(order)}
          />
        )}

        {/* Auto-Refill Management Portal */}
        {activeTab === 'auto-refill' && (
          <AutoRefillPortal
            setActiveTab={setActiveTab}
          />
        )}

        {/* Verified Customer Reviews Section */}
        {activeTab === 'reviews' && (
          <div className="py-6">
            <ReviewsSection />
          </div>
        )}

        {/* FAQ & Support Section */}
        {(activeTab === 'support' || activeTab === 'faq') && (
          <div className="py-6">
            <FAQSection />
          </div>
        )}

        {/* Dispensary Staff Admin View */}
        {activeTab === 'admin' && (
          <AdminPortal
            onViewInvoice={(order) => setSelectedInvoiceOrder(order)}
            products={products}
            onProductsUpdated={() => {
              getProductsFromFirestore().then(p => {
                if (p && p.length > 0) setProducts(p);
              });
            }}
            onBackToStore={() => setActiveTab('shop')}
          />
        )}
      </main>

      {/* 3. Global Modals & Drawers */}

      {/* Shopping Cart Drawer */}
      <ShoppingCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onToggleAutoRefill={handleToggleAutoRefill}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        appliedCoupon={appliedCoupon}
        onOrderCreated={handleOrderCreated}
        onViewInvoice={(order) => {
          setIsCheckoutOpen(false);
          setSelectedInvoiceOrder(order);
        }}
      />

      {/* Product Quick View & Dosage Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Printable Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* 4. Master Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* 5. Floating Quick Contact Channels (WhatsApp + Telegram) */}
      <aside aria-label="Quick contact channels" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        <a
          id="floating-telegram-btn"
          href="https://t.me/bossofbenzoo"
          target="_blank"
          rel="noopener noreferrer"
          title="Direct Telegram Chat: @bossofbenzoo"
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#072635]/95 backdrop-blur-sm hover:bg-[#0b384f] border border-cyan-500/60 shadow-xl text-white font-semibold text-xs transition-all duration-200 group"
        >
          <div className="w-6 h-6 rounded-full bg-[#0088cc] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-sm">
            <Send className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-[9px] text-cyan-300 font-medium">Telegram Direct</span>
            <span className="font-bold text-white text-[11px] font-mono">@bossofbenzoo</span>
          </div>
        </a>

        <a
          id="floating-whatsapp-btn"
          href="https://wa.me/message/DCDJEBZXRXSHJ1"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat with Pharmacist on WhatsApp: 07877 180391"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#073623]/95 backdrop-blur-sm hover:bg-[#0a4b31] border border-emerald-500/60 shadow-2xl hover:shadow-emerald-500/25 text-white font-semibold text-xs transition-all duration-200 group"
        >
          <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-md">
            <MessageCircle className="w-4 h-4 fill-white" />
          </div>
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              WhatsApp Online
            </span>
            <span className="font-bold text-white text-xs font-mono">07877 180391</span>
          </div>
        </a>
      </aside>

    </div>
  );
}

export default App;
