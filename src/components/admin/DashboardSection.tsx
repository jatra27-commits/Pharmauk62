import React, { useMemo } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Pill,
  AlertTriangle,
  Boxes,
  Users,
  PoundSterling,
  ArrowRight,
  PlusCircle,
  Eye,
  RefreshCw,
  TrendingUp,
  Truck,
  RotateCcw,
  ShieldAlert,
  ArrowUpRight,
  Zap,
  Calendar,
  Lock,
  ExternalLink
} from 'lucide-react';
import { OrderRecord, MedicineProduct, SubscriberRecord, AdminMenuKey, StaffRole } from '../../types';

interface DashboardSectionProps {
  orders: OrderRecord[];
  products: MedicineProduct[];
  subscribers?: SubscriberRecord[];
  subscribersCount?: number;
  currentRole?: StaffRole;
  onNavigate: (tab: AdminMenuKey) => void;
  onViewOrderDetails?: (order: OrderRecord) => void;
  onViewInvoice?: (order: OrderRecord) => void;
  onOpenAddProduct?: () => void;
  onRefreshData?: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  orders = [],
  products = [],
  subscribers = [],
  subscribersCount,
  currentRole = 'Super Admin',
  onNavigate,
  onViewOrderDetails,
  onViewInvoice,
  onOpenAddProduct,
  onRefreshData
}) => {
  const safeSubscribersCount = typeof subscribersCount === 'number' ? subscribersCount : (subscribers?.length || 0);

  const handleInspectOrder = (order: OrderRecord) => {
    if (onViewOrderDetails) {
      onViewOrderDetails(order);
    } else if (onViewInvoice) {
      onViewInvoice(order);
    } else {
      onNavigate('orders');
    }
  };

  const handleAddProduct = () => {
    if (onOpenAddProduct) {
      onOpenAddProduct();
    } else {
      onNavigate('products');
    }
  };

  const handleRefresh = () => {
    if (onRefreshData) {
      onRefreshData();
    }
  };

  // 1. Total revenue (sum of non-cancelled/failed orders)
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => (o.status as string) !== 'Cancelled' && o.paymentStatus !== 'Failed')
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  // 2. Today's sales (orders created in last 24h or current calendar day)
  const todaySales = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const startMs = todayStart.getTime();

    const ordersToday = orders.filter((o) => {
      const isCancelled = (o.status as string) === 'Cancelled' || o.paymentStatus === 'Failed';
      if (isCancelled) return false;
      const orderTime = o.createdAt || 0;
      return orderTime >= startMs || orderTime >= Date.now() - 24 * 60 * 60 * 1000;
    });

    const sum = ordersToday.reduce((acc, o) => acc + (o.total || 0), 0);
    return {
      amount: sum,
      count: ordersToday.length
    };
  }, [orders]);

  // 3. Total orders
  const totalOrders = orders.length;

  // 4. Pending orders (awaiting payment or pharmacist verification)
  const pendingOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === 'Order Placed & Pending Payment' ||
        o.paymentStatus === 'Pending Verification'
    ).length;
  }, [orders]);

  // 5. Completed deliveries (delivered to patient)
  const completedDeliveries = useMemo(() => {
    return orders.filter((o) => o.status === 'Delivered').length;
  }, [orders]);

  // 6. Refund requests (orders with refund requested or approved)
  const refundRequests = useMemo(() => {
    const requested = orders.filter(
      (o) => o.refundStatus === 'Requested' || o.refundStatus === 'Approved' || o.paymentStatus === 'Refunded'
    );
    const pendingReviewRefunds = orders.filter((o) => o.refundStatus === 'Requested').length;
    return {
      total: requested.length,
      pendingReview: pendingReviewRefunds
    };
  }, [orders]);

  // 7. Low-stock products (stock count <= 15 or out of stock)
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stockCount <= 15 || !p.inStock);
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((p) => !p.inStock || p.stockCount === 0);
  }, [products]);

  // Suspicious orders awaiting review
  const suspiciousOrdersCount = useMemo(() => {
    return orders.filter((o) => o.isSuspicious && o.reviewStatus !== 'Verified Safe').length;
  }, [orders]);

  // Recent 5 orders
  const recentOrders = [...orders].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Dispensary Overview</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-mono font-semibold">
              Live Central Dispensary
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Real-time fulfillment metrics, revenue tracking, inventory alerts, and fraud surveillance.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#03261a] hover:bg-[#043323] text-emerald-300 hover:text-white border border-emerald-700/50 transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Data</span>
          </button>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          7 CORE DASHBOARD OVERVIEW METRICS (User Specified)
          1. Total revenue
          2. Today's sales
          3. Total orders
          4. Pending orders
          5. Completed deliveries
          6. Refund requests
          7. Low-stock products
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Revenue */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-gradient-to-br from-[#021811] to-[#032b1d] border border-emerald-600/50 hover:border-emerald-400 rounded-2xl p-5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
              <PoundSterling className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-heading mt-2">
            £{totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-300/80">
            <span>Cumulative gross revenue</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 2. Today's Sales */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-[#021811] border border-emerald-800/40 hover:border-emerald-600/60 rounded-2xl p-5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-serif-heading mt-2">
            £{todaySales.amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-300/80">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{todaySales.count} transactions in last 24h</span>
          </div>
        </div>

        {/* 3. Total Orders */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-[#021811] border border-emerald-800/40 hover:border-emerald-600/60 rounded-2xl p-5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-heading mt-2">
            {totalOrders}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400/80">
            <span>Prescription records logged</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 4. Pending Orders */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-[#021811] border border-amber-900/50 hover:border-amber-600 rounded-2xl p-5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-700/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif-heading mt-2">
            {pendingOrders}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-amber-400/80">
            <span>Awaiting verification / dispatch</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Row 2: Deliveries, Refunds, Low Stock & Suspicious Review */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 5. Completed Deliveries */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-[#021811] border border-emerald-800/40 hover:border-emerald-600/60 rounded-2xl p-5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Deliveries</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-300 font-serif-heading mt-2">
            {completedDeliveries}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400/80">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Delivered via Royal Mail Tracked</span>
          </div>
        </div>

        {/* 6. Refund Requests */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-[#021811] border border-rose-900/40 hover:border-rose-600/60 rounded-2xl p-5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Refund Requests</span>
            <div className="w-8 h-8 rounded-xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-300 font-serif-heading mt-2">
            {refundRequests.total}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-300/80">
            <span>{refundRequests.pendingReview} require approval action</span>
          </div>
        </div>

        {/* 7. Low-Stock Products */}
        <div
          onClick={() => onNavigate('inventory')}
          className="bg-[#021811] border border-amber-900/40 hover:border-amber-600/60 rounded-2xl p-5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Low-Stock Products</span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif-heading mt-2">
            {lowStockProducts.length}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400/80">
            <Boxes className="w-3.5 h-3.5" />
            <span>{outOfStockProducts.length} depleted (0 stock)</span>
          </div>
        </div>

        {/* Suspicious Orders / Security Watch */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-[#021811] border border-purple-900/40 hover:border-purple-600/60 rounded-2xl p-5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Suspicious Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-300 font-serif-heading mt-2">
            {suspiciousOrdersCount}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-purple-400/80">
            <span>Manual fraud review queue</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white text-sm font-bold font-serif-heading">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Administrative Command Center</span>
          </div>
          <span className="text-xs text-emerald-400/80">
            Logged as: <strong className="text-white">{currentRole}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => onNavigate('finance')}
            className="p-3 rounded-xl bg-[#03261a] hover:bg-[#053625] border border-emerald-700/40 text-left transition-all cursor-pointer group"
          >
            <PoundSterling className="w-4 h-4 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-white">Financials</div>
            <div className="text-[10px] text-emerald-400/70">Gross, fees, net</div>
          </button>

          <button
            onClick={() => onNavigate('orders')}
            className="p-3 rounded-xl bg-[#03261a] hover:bg-[#053625] border border-emerald-700/40 text-left transition-all cursor-pointer group"
          >
            <ShoppingBag className="w-4 h-4 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-white">Order Vault</div>
            <div className="text-[10px] text-emerald-400/70">{pendingOrders} awaiting check</div>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className="p-3 rounded-xl bg-[#03261a] hover:bg-[#053625] border border-emerald-700/40 text-left transition-all cursor-pointer group"
          >
            <Pill className="w-4 h-4 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-white">Catalog & Pricing</div>
            <div className="text-[10px] text-emerald-400/70">Tiers & denominations</div>
          </button>

          <button
            onClick={() => onNavigate('inventory')}
            className="p-3 rounded-xl bg-[#03261a] hover:bg-[#053625] border border-emerald-700/40 text-left transition-all cursor-pointer group"
          >
            <Boxes className="w-4 h-4 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-white">Inventory Stock</div>
            <div className="text-[10px] text-emerald-400/70">{lowStockProducts.length} stock alerts</div>
          </button>

          <button
            onClick={() => onNavigate('staff')}
            className="p-3 rounded-xl bg-[#03261a] hover:bg-[#053625] border border-emerald-700/40 text-left transition-all cursor-pointer group"
          >
            <Users className="w-4 h-4 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-white">Staff & RBAC</div>
            <div className="text-[10px] text-emerald-400/70">5 Role tiers</div>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="p-3 rounded-xl bg-[#03261a] hover:bg-[#053625] border border-emerald-700/40 text-left transition-all cursor-pointer group"
          >
            <Clock className="w-4 h-4 text-teal-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-white">Store Config</div>
            <div className="text-[10px] text-emerald-400/70">Royal Mail & PIN</div>
          </button>
        </div>
      </div>

      {/* Two Columns: Recent Orders + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white font-serif-heading">Recent Prescription Orders</h2>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-emerald-400 hover:text-emerald-200 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-emerald-500/70 text-xs">
              No orders placed yet. Real orders will populate here automatically.
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => {
                const isPending =
                  order.status === 'Order Placed & Pending Payment' ||
                  order.paymentStatus === 'Pending Verification';
                const isDelivered = order.status === 'Delivered';

                return (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-xl bg-[#01140e] border border-emerald-900/60 hover:border-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-300">{order.id}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isPending
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : isDelivered
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {order.status}
                        </span>
                        {order.isSuspicious && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-950 text-purple-300 border border-purple-800/60">
                            Flagged Review
                          </span>
                        )}
                        {order.refundStatus === 'Requested' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-950 text-rose-300 border border-rose-800/60">
                            Refund Req
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white font-medium flex items-center gap-2">
                        <span>{order.customerName}</span>
                        <span className="text-emerald-600">•</span>
                        <span className="text-emerald-400/80">{order.city || order.postcode}</span>
                      </div>
                      <div className="text-[11px] text-emerald-500/80">
                        {order.items?.length || 0} items • {order.paymentMethod?.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-white">
                          £{(order.total || 0).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-emerald-400/70">{order.date || 'Recent'}</div>
                      </div>
                      <button
                        onClick={() => handleInspectOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-[#03261a] hover:bg-[#053625] text-emerald-300 hover:text-white border border-emerald-700/50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white font-serif-heading">Inventory Alerts</h2>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs text-emerald-400 hover:text-emerald-200 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-emerald-400/80 text-xs flex flex-col items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <span>All dispensary medicines are currently well-stocked.</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              {outOfStockProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-rose-200 truncate">{p.name}</div>
                    <div className="text-[10px] text-rose-400/80">{p.strength} • {p.format}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 shrink-0">
                    OUT OF STOCK
                  </span>
                </div>
              ))}

              {lowStockProducts
                .filter((p) => p.stockCount > 0)
                .slice(0, 4)
                .map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-amber-200 truncate">{p.name}</div>
                      <div className="text-[10px] text-amber-400/80">{p.strength} • {p.format}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 shrink-0">
                      {p.stockCount} strips left
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
