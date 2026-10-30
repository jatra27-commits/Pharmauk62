import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PoundSterling,
  ShoppingBag,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Pill,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { OrderRecord, MedicineProduct } from '../../types';

interface AnalyticsSectionProps {
  orders: OrderRecord[];
  products: MedicineProduct[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  orders,
  products
}) => {
  // Compute metrics strictly from real orders
  const totalOrders = orders.length;

  const validOrders = orders.filter(
    (o) => (o.status as string) !== 'Cancelled' && o.paymentStatus !== 'Failed'
  );

  const totalRevenue = validOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  const averageOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

  // Status breakdown
  const statusCounts: { [status: string]: number } = {};
  orders.forEach((o) => {
    const s = o.status || 'Pending';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  // Top selling products aggregated from actual order items
  const productSalesMap: { [prodName: string]: { count: number; revenue: number } } = {};
  orders.forEach((o) => {
    if ((o.status as string) === 'Cancelled' || o.paymentStatus === 'Failed') return;
    o.items?.forEach((it) => {
      const name = it.product?.name || 'Unknown Product';
      const qty = it.quantity || 1;
      const price = (it.selectedPack?.price || it.product?.basePrice || 0) * qty;

      if (!productSalesMap[name]) {
        productSalesMap[name] = { count: 0, revenue: 0 };
      }
      productSalesMap[name].count += qty;
      productSalesMap[name].revenue += price;
    });
  });

  const topProducts = Object.entries(productSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  // Category performance
  const categorySalesMap: { [cat: string]: { count: number; revenue: number } } = {};
  orders.forEach((o) => {
    if ((o.status as string) === 'Cancelled' || o.paymentStatus === 'Failed') return;
    o.items?.forEach((it) => {
      const cat = it.product?.category || 'Other';
      const qty = it.quantity || 1;
      const price = (it.selectedPack?.price || it.product?.basePrice || 0) * qty;

      if (!categorySalesMap[cat]) {
        categorySalesMap[cat] = { count: 0, revenue: 0 };
      }
      categorySalesMap[cat].count += qty;
      categorySalesMap[cat].revenue += price;
    });
  });

  const categoryPerformance = Object.entries(categorySalesMap)
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Sales & Dispense Analytics</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-semibold font-mono">
              Live Database Metrics
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Deterministic business reports calculated directly from authentic Firestore database orders and prescription fulfillment.
          </p>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-[#032318] to-[#01140e] border border-emerald-700/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold">Total Verified Revenue</span>
            <PoundSterling className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">
            £{totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-emerald-400/70 mt-1">
            Calculated across {validOrders.length} successful order{validOrders.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold">Average Order Value (AOV)</span>
            <TrendingUp className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">
            £{averageOrderValue.toFixed(2)}
          </div>
          <p className="text-xs text-emerald-400/70 mt-1">Average patient prescription spend</p>
        </div>

        {/* Total Prescriptions Dispensed */}
        <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold">Total Orders Processed</span>
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{totalOrders}</div>
          <p className="text-xs text-emerald-400/70 mt-1">
            {orders.filter((o) => o.status === 'Delivered').length} delivered successfully
          </p>
        </div>
      </div>

      {totalOrders === 0 ? (
        <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-12 text-center text-emerald-400/80 space-y-3">
          <BarChart3 className="w-12 h-12 text-emerald-700 mx-auto" />
          <h3 className="text-base font-bold text-white">No Order Analytics Recorded Yet</h3>
          <p className="text-xs text-emerald-400/70 max-w-md mx-auto leading-relaxed">
            As patients place orders and prescriptions on the customer website, sales trends, top-selling medications, and fulfillment stage breakdowns will populate here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Breakdown */}
          <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Fulfillment Status Distribution</h3>
              <span className="text-xs text-emerald-400 font-mono">{totalOrders} Total</span>
            </div>

            <div className="space-y-3">
              {Object.entries(statusCounts).map(([statusName, count]) => {
                const pct = Math.round((count / totalOrders) * 100);
                return (
                  <div key={statusName} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-200 font-medium">{statusName}</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#01140e] rounded-full h-2 overflow-hidden border border-emerald-900/60">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Selling Medications */}
          <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Top Selling Medications</h3>
              <span className="text-xs text-emerald-400">By Revenue</span>
            </div>

            {topProducts.length === 0 ? (
              <p className="text-xs text-emerald-500/80 py-4">No product sales captured yet.</p>
            ) : (
              <div className="space-y-2.5">
                {topProducts.map((p, idx) => (
                  <div
                    key={p.name}
                    className="p-3 rounded-xl bg-[#01140e] border border-emerald-900/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-800/80 flex items-center justify-center font-mono text-xs font-bold text-emerald-300">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white">{p.name}</div>
                        <div className="text-[10px] text-emerald-400/80">{p.count} packs dispensed</div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-xs text-emerald-300">
                      £{p.revenue.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Performance Breakdown */}
          {categoryPerformance.length > 0 && (
            <div className="lg:col-span-2 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Revenue by Clinical Category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {categoryPerformance.map((c) => (
                  <div
                    key={c.category}
                    className="p-4 rounded-xl bg-[#01140e] border border-emerald-900/60 space-y-1"
                  >
                    <div className="text-xs font-bold text-white">{c.category}</div>
                    <div className="text-xl font-bold font-mono text-emerald-300">
                      £{c.revenue.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-emerald-400/80">{c.count} items ordered</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
