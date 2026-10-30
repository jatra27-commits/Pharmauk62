import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Bell,
  RefreshCw,
  Lock,
  Shield,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import {
  OrderRecord,
  MedicineProduct,
  CategoryDefinition,
  CouponDiscount,
  AutoRefillSubscription,
  BannerItem,
  VerifiedCustomerReview,
  FAQItem,
  SubscriberRecord,
  StoreSettings,
  StaffRole,
  StaffMember,
  AdminMenuKey
} from '../types';
import {
  getOrdersFromFirestore,
  listenToOrdersFromFirestore,
  getProductsFromFirestore,
  getCategoriesFromFirestore,
  getCouponsFromFirestore,
  getAutoRefillsFromFirestore,
  getBannersFromFirestore,
  getReviewsFromFirestore,
  getFAQsFromFirestore,
  getSubscribersFromFirestore,
  getStoreSettingsFromFirestore,
  getStaffMembersFromFirestore,
  seedInitialFirestoreData
} from '../lib/firestoreService';
import { canAccessTab, ROLE_PERMISSIONS } from '../utils/staffPermissions';

import { AdminSidebar } from './admin/AdminSidebar';
import { DashboardSection } from './admin/DashboardSection';
import { OrdersSection } from './admin/OrdersSection';
import { ProductsSection } from './admin/ProductsSection';
import { CategoriesSection } from './admin/CategoriesSection';
import { InventorySection } from './admin/InventorySection';
import { FinanceSection } from './admin/FinanceSection';
import { StaffSection } from './admin/StaffSection';
import { CouponsSection } from './admin/CouponsSection';
import { AutoRefillSection } from './admin/AutoRefillSection';
import { BannerSection } from './admin/BannerSection';
import { ReviewsFAQSection } from './admin/ReviewsFAQSection';
import { SubscribersSection } from './admin/SubscribersSection';
import { AnalyticsSection } from './admin/AnalyticsSection';
import { SettingsSection } from './admin/SettingsSection';
import { AdminAuthModal } from './admin/AdminAuthModal';

interface AdminPortalProps {
  onViewInvoice: (order: OrderRecord) => void;
  products: MedicineProduct[];
  onProductsUpdated?: () => void;
  onBackToStore?: () => void;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'PureSleep Dispensary UK',
  licenseNumber: 'GPhC #9012384',
  contactEmail: 'dispensary@puresleep.co.uk',
  contactPhone: '+44 7877 180391',
  whatsappNumber: '+44 7877 180391',
  physicalAddress: 'Harley Street Medical Quarter, London W1G 9QD',
  shippingTracked48Fee: 2.99,
  shippingTracked24Fee: 4.99,
  shippingSpecialDeliveryFee: 8.99,
  freeShippingThreshold: 40.0,
  adminPin: '2026',
  bankName: 'Barclays UK Commercial',
  accountName: 'PURE SLEEP DISPENSARY LTD',
  sortCode: '20-45-78',
  accountNumber: '83920184',
  cryptoUsdtWallet: 'TYZ9xL7p89kQW3m2VBNm71xK8fLq9J',
  cryptoBtcWallet: 'bc1q9pxm2k89vwl7zqp08m3xl09n71v'
};

const ALL_ROLES: StaffRole[] = [
  'Super Admin',
  'Finance Manager',
  'Order Manager',
  'Customer Support',
  'Inventory Manager'
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onViewInvoice,
  products: initialProducts,
  onProductsUpdated,
  onBackToStore
}) => {
  // Navigation state
  const [activeMenu, setActiveMenu] = useState<AdminMenuKey>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active Staff Role for RBAC
  const [currentRole, setCurrentRole] = useState<StaffRole>(() => {
    const saved = sessionStorage.getItem('puresleep_admin_active_role');
    return (saved as StaffRole) || 'Super Admin';
  });

  // Security Auth state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('puresleep_admin_session_unlocked') === 'true';
  });

  // Master Data collections from Firestore
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<MedicineProduct[]>(initialProducts || []);
  const [categories, setCategories] = useState<CategoryDefinition[]>([]);
  const [coupons, setCoupons] = useState<CouponDiscount[]>([]);
  const [subscriptions, setSubscriptions] = useState<AutoRefillSubscription[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [reviews, setReviews] = useState<VerifiedCustomerReview[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

  // Loading state
  const [isMasterLoading, setIsMasterLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync initial products if passed down
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  // Initial load
  useEffect(() => {
    fetchAllAdminData();

    // Set up real-time listener for orders
    const unsubscribeOrders = listenToOrdersFromFirestore((newOrders) => {
      setOrders(newOrders);
    });

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  const handleRoleChanged = (newRole: StaffRole) => {
    setCurrentRole(newRole);
    sessionStorage.setItem('puresleep_admin_active_role', newRole);
    // If current tab is restricted, redirect to dashboard
    if (!canAccessTab(newRole, activeMenu)) {
      setActiveMenu('dashboard');
    }
  };

  const fetchAllAdminData = async () => {
    setIsMasterLoading(true);
    try {
      await seedInitialFirestoreData(false);

      const [
        ordersData,
        productsData,
        categoriesData,
        couponsData,
        subsData,
        bannersData,
        reviewsData,
        faqsData,
        subsRecords,
        settingsData,
        staffData
      ] = await Promise.all([
        getOrdersFromFirestore(),
        getProductsFromFirestore(),
        getCategoriesFromFirestore(),
        getCouponsFromFirestore(),
        getAutoRefillsFromFirestore(),
        getBannersFromFirestore(),
        getReviewsFromFirestore(),
        getFAQsFromFirestore(),
        getSubscribersFromFirestore(),
        getStoreSettingsFromFirestore(),
        getStaffMembersFromFirestore()
      ]);

      setOrders(ordersData);
      if (productsData && productsData.length > 0) setProducts(productsData);
      setCategories(categoriesData);
      setCoupons(couponsData);
      setSubscriptions(subsData);
      setBanners(bannersData);
      setReviews(reviewsData);
      setFaqs(faqsData);
      setSubscribers(subsRecords);
      if (settingsData) setSettings(settingsData);
      if (staffData) setStaffMembers(staffData);
    } catch (err) {
      console.error('Error fetching admin portal data:', err);
    } finally {
      setIsMasterLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllAdminData();
    if (onProductsUpdated) onProductsUpdated();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleUnlock = () => {
    sessionStorage.setItem('puresleep_admin_session_unlocked', 'true');
    setIsUnlocked(true);
  };

  const handleLockSession = () => {
    sessionStorage.removeItem('puresleep_admin_session_unlocked');
    setIsUnlocked(false);
  };

  // Specific refresh helpers
  const handleRefreshOrders = async () => {
    const freshOrders = await getOrdersFromFirestore();
    setOrders(freshOrders);
  };

  const handleRefreshProducts = async () => {
    const freshProducts = await getProductsFromFirestore();
    setProducts(freshProducts);
    if (onProductsUpdated) onProductsUpdated();
  };

  const handleRefreshCategories = async () => {
    const freshCats = await getCategoriesFromFirestore();
    setCategories(freshCats);
  };

  const handleRefreshCoupons = async () => {
    const freshCoupons = await getCouponsFromFirestore();
    setCoupons(freshCoupons);
  };

  const handleRefreshSubscriptions = async () => {
    const freshSubs = await getAutoRefillsFromFirestore();
    setSubscriptions(freshSubs);
  };

  const handleRefreshBanners = async () => {
    const freshBanners = await getBannersFromFirestore();
    setBanners(freshBanners);
  };

  const handleRefreshReviews = async () => {
    const freshReviews = await getReviewsFromFirestore();
    setReviews(freshReviews);
  };

  const handleRefreshFAQs = async () => {
    const freshFAQs = await getFAQsFromFirestore();
    setFaqs(freshFAQs);
  };

  const handleRefreshSubscribers = async () => {
    const freshSubs = await getSubscribersFromFirestore();
    setSubscribers(freshSubs);
  };

  const handleRefreshStaff = async () => {
    const freshStaff = await getStaffMembersFromFirestore();
    setStaffMembers(freshStaff);
  };

  const handleSettingsUpdated = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  // Badges calculation
  const pendingOrdersCount = orders.filter((o) => o.status === 'Order Placed & Pending Payment' || o.paymentStatus === 'Pending Verification').length;
  const lowStockProductsCount = products.filter((p) => (p.stockCount ?? 100) <= 15).length;

  // Header Title mapping
  const menuTitles: Record<AdminMenuKey, string> = {
    dashboard: 'Executive Dispensary Overview',
    orders: 'Order Management & Verification',
    products: 'Product Catalog & Denominations',
    finance: 'Financial Management & Reconciliation',
    inventory: 'Stockroom & Inventory Reserves',
    staff: 'Staff & Role-Based Access Control',
    categories: 'Clinical Categories & Grouping',
    coupons: 'Discount Vouchers & Promotions',
    autorefill: 'Repeat Subscriptions & Loyalty',
    banners: 'Promotional Storefront Banners',
    reviews: 'Patient Reviews & FAQ Support',
    subscribers: 'Audience & Newsletter Subscribers',
    analytics: 'Financial & Dispensing Analytics',
    settings: 'Dispensary Configurations & Security'
  };

  // If locked, render PIN Auth modal
  if (!isUnlocked) {
    return (
      <AdminAuthModal
        correctPin={settings.adminPin || '2026'}
        onUnlock={handleUnlock}
        onCancel={() => {
          if (onBackToStore) onBackToStore();
        }}
      />
    );
  }

  const isCurrentTabAllowed = canAccessTab(currentRole, activeMenu);

  return (
    <div className="min-h-screen bg-[#010e0a] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-white">
      {/* 1. Desktop & Mobile Sidebar */}
      <AdminSidebar
        activeMenu={activeMenu}
        onSelectMenu={(key) => {
          setActiveMenu(key);
          setIsMobileSidebarOpen(false);
        }}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockProductsCount}
        onBackToStore={onBackToStore}
        onLockSession={handleLockSession}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentUserRole={currentRole}
      />

      {/* 2. Main Administration Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Operational Bar */}
        <header className="sticky top-0 z-30 bg-[#021811]/95 backdrop-blur-md border-b border-emerald-800/40 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 hover:text-white border border-emerald-800/60 transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs text-emerald-400/80 font-medium">
                PureSleep Dispensary Admin
              </div>
              <div className="text-base sm:text-lg font-bold text-white font-serif-heading leading-tight truncate">
                {menuTitles[activeMenu]}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher Pill in Top Navbar */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#01140e] border border-emerald-700/50">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={currentRole}
                onChange={(e) => handleRoleChanged(e.target.value as StaffRole)}
                className="bg-transparent text-xs text-emerald-300 font-bold focus:outline-none cursor-pointer pr-1"
                title="Switch active operating staff role"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r} className="bg-[#021811] text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-[#03261a] hover:bg-[#053625] text-emerald-300 hover:text-white border border-emerald-800/60 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Back to Customer Store */}
            {onBackToStore && (
              <button
                onClick={onBackToStore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
              >
                <span>Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Section View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isMasterLoading ? (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
              <div className="text-sm font-bold text-white">Connecting to Firestore Database...</div>
              <p className="text-xs text-emerald-400/80">Loading authentic prescription records and clinical inventory</p>
            </div>
          ) : !isCurrentTabAllowed ? (
            /* Restricted Access Warning for Current Role */
            <div className="bg-[#021811] border border-amber-800/50 rounded-2xl p-8 max-w-xl mx-auto my-12 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-600/50 flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif-heading">Access Restricted</h3>
                <p className="text-xs text-emerald-400/80 mt-1">
                  Your active role (<strong>{currentRole}</strong>) does not have authorization to view or modify <strong>{menuTitles[activeMenu]}</strong>.
                </p>
              </div>
              <div className="p-3 bg-[#01140e] rounded-xl border border-emerald-800/40 text-xs text-emerald-300">
                Granted Capabilities: {ROLE_PERMISSIONS[currentRole].description}
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveMenu('dashboard')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => handleRoleChanged('Super Admin')}
                  className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#053625] text-emerald-300 text-xs font-semibold border border-emerald-700/50 cursor-pointer"
                >
                  Switch to Super Admin
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeMenu === 'dashboard' && (
                <DashboardSection
                  orders={orders}
                  products={products}
                  subscribers={subscribers}
                  subscribersCount={subscribers.length}
                  currentRole={currentRole}
                  onNavigate={(menu) => setActiveMenu(menu)}
                  onViewInvoice={onViewInvoice}
                  onViewOrderDetails={onViewInvoice}
                  onOpenAddProduct={() => setActiveMenu('products')}
                  onRefreshData={handleManualRefresh}
                />
              )}

              {activeMenu === 'orders' && (
                <OrdersSection
                  orders={orders}
                  onRefreshOrders={handleRefreshOrders}
                  onOrdersUpdated={handleRefreshOrders}
                  onViewInvoice={onViewInvoice}
                  currentUserRole={currentRole}
                />
              )}

              {activeMenu === 'products' && (
                <ProductsSection
                  products={products}
                  categories={categories}
                  onProductsUpdated={handleRefreshProducts}
                  currentUserRole={currentRole}
                />
              )}

              {activeMenu === 'finance' && (
                <FinanceSection
                  orders={orders}
                  currentUserRole={currentRole}
                />
              )}

              {activeMenu === 'staff' && (
                <StaffSection
                  staffMembers={staffMembers}
                  currentRole={currentRole}
                  onRoleChanged={handleRoleChanged}
                  onStaffUpdated={handleRefreshStaff}
                />
              )}

              {activeMenu === 'categories' && (
                <CategoriesSection
                  categories={categories}
                  products={products}
                  onCategoriesUpdated={handleRefreshCategories}
                />
              )}

              {activeMenu === 'inventory' && (
                <InventorySection
                  products={products}
                  onProductsUpdated={handleRefreshProducts}
                  onInventoryUpdated={handleRefreshProducts}
                />
              )}

              {activeMenu === 'coupons' && (
                <CouponsSection
                  coupons={coupons}
                  onCouponsUpdated={handleRefreshCoupons}
                />
              )}

              {activeMenu === 'autorefill' && (
                <AutoRefillSection
                  subscriptions={subscriptions}
                  onRefreshSubscriptions={handleRefreshSubscriptions}
                />
              )}

              {activeMenu === 'banners' && (
                <BannerSection
                  banners={banners}
                  onBannersUpdated={handleRefreshBanners}
                />
              )}

              {activeMenu === 'reviews' && (
                <ReviewsFAQSection
                  reviews={reviews}
                  faqs={faqs}
                  onReviewsUpdated={handleRefreshReviews}
                  onFAQsUpdated={handleRefreshFAQs}
                />
              )}

              {activeMenu === 'subscribers' && (
                <SubscribersSection
                  subscribers={subscribers}
                  onSubscribersUpdated={handleRefreshSubscribers}
                />
              )}

              {activeMenu === 'analytics' && (
                <AnalyticsSection
                  orders={orders}
                  products={products}
                />
              )}

              {activeMenu === 'settings' && (
                <SettingsSection
                  settings={settings}
                  onSettingsUpdated={handleSettingsUpdated}
                  onRefreshData={fetchAllAdminData}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
