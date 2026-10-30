import React, { useState, useMemo } from 'react';
import {
  PoundSterling,
  TrendingUp,
  CreditCard,
  RotateCcw,
  Download,
  Calendar,
  FileSpreadsheet,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Building2,
  Wallet,
  Clock,
  CheckCircle2,
  DollarSign,
  Filter,
  Layers,
  ChevronDown
} from 'lucide-react';
import { OrderRecord, StaffRole } from '../../types';

interface FinanceSectionProps {
  orders: OrderRecord[];
  currentUserRole?: StaffRole;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({
  orders,
  currentUserRole = 'Super Admin'
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'thisMonth' | 'all'>('30days');
  const [selectedGateway, setSelectedGateway] = useState<'all' | 'bank_transfer' | 'crypto' | 'card'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Time calculations
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  
  const currentMonthStart = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  // Filter orders by selected time range and gateway
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const orderTime = o.createdAt || 0;
      let matchesTime = true;
      if (timeRange === 'today') {
        matchesTime = orderTime >= oneDayAgo;
      } else if (timeRange === '7days') {
        matchesTime = orderTime >= sevenDaysAgo;
      } else if (timeRange === '30days') {
        matchesTime = orderTime >= thirtyDaysAgo;
      } else if (timeRange === 'thisMonth') {
        matchesTime = orderTime >= currentMonthStart;
      }

      const matchesGateway = selectedGateway === 'all' || o.paymentMethod === selectedGateway;
      return matchesTime && matchesGateway;
    });
  }, [orders, timeRange, selectedGateway, oneDayAgo, sevenDaysAgo, thirtyDaysAgo, currentMonthStart]);

  // Financial aggregates
  const financialMetrics = useMemo(() => {
    let grossSales = 0;
    let paymentFees = 0;
    let totalRefunds = 0;
    let refundCount = 0;
    let cardSales = 0;
    let cryptoSales = 0;
    let bankSales = 0;
    let verifiedOrdersCount = 0;

    filteredOrders.forEach((o) => {
      const isCancelled = (o.status as string) === 'Cancelled' || o.paymentStatus === 'Failed';
      if (isCancelled) return;

      const orderTotal = o.total || 0;
      grossSales += orderTotal;

      if (o.paymentStatus === 'Paid' || o.status === 'Payment Verified' || o.status === 'Dispatched (Royal Mail Tracked)' || o.status === 'Delivered') {
        verifiedOrdersCount++;
      }

      // Calculate realistic gateway fee if not explicitly recorded
      let fee = o.gatewayFee;
      if (typeof fee !== 'number') {
        if (o.paymentMethod === 'card') {
          fee = Number((orderTotal * 0.019 + 0.20).toFixed(2)); // Standard UK interchange 1.9% + 20p
        } else if (o.paymentMethod === 'crypto') {
          fee = Number((orderTotal * 0.005).toFixed(2)); // 0.5% exchange/network spread
        } else {
          fee = 0.0; // Bank Faster Payments zero surcharge
        }
      }
      paymentFees += fee;

      // Payment method breakdown
      if (o.paymentMethod === 'card') cardSales += orderTotal;
      else if (o.paymentMethod === 'crypto') cryptoSales += orderTotal;
      else bankSales += orderTotal;

      // Refunds
      if (o.refundStatus === 'Approved' || o.paymentStatus === 'Refunded') {
        const refAmount = o.refundAmount || orderTotal;
        totalRefunds += refAmount;
        refundCount++;
      }
    });

    const netRevenue = Math.max(0, grossSales - paymentFees - totalRefunds);
    const profitMargin = grossSales > 0 ? ((netRevenue / grossSales) * 100).toFixed(1) : '100.0';

    return {
      grossSales,
      paymentFees,
      totalRefunds,
      refundCount,
      netRevenue,
      profitMargin,
      cardSales,
      cryptoSales,
      bankSales,
      verifiedOrdersCount,
      totalTransactions: filteredOrders.length
    };
  }, [filteredOrders]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No financial transaction records found for the selected period.');
      return;
    }

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Customer Email',
      'Payment Method',
      'Payment Status',
      'Fulfillment Status',
      'Subtotal (£)',
      'Shipping Fee (£)',
      'Discount (£)',
      'Gross Total (£)',
      'Gateway Fee (£)',
      'Refund Amount (£)',
      'Net Revenue (£)',
      'Tracking Number'
    ];

    const rows = filteredOrders.map((o) => {
      const orderTotal = o.total || 0;
      let fee = o.gatewayFee;
      if (typeof fee !== 'number') {
        if (o.paymentMethod === 'card') fee = Number((orderTotal * 0.019 + 0.20).toFixed(2));
        else if (o.paymentMethod === 'crypto') fee = Number((orderTotal * 0.005).toFixed(2));
        else fee = 0;
      }
      const refAmt = (o.refundStatus === 'Approved' || o.paymentStatus === 'Refunded') ? (o.refundAmount || orderTotal) : 0;
      const net = Math.max(0, orderTotal - fee - refAmt);

      return [
        o.id,
        `"${o.date || new Date(o.createdAt).toLocaleDateString('en-GB')}"`,
        `"${o.customerName?.replace(/"/g, '""') || 'Patient'}"`,
        `"${o.email || ''}"`,
        `"${o.paymentMethod || 'bank_transfer'}"`,
        `"${o.paymentStatus || 'Paid'}"`,
        `"${o.status || 'Order Placed'}"`,
        (o.subtotal || 0).toFixed(2),
        (o.shippingFee || 0).toFixed(2),
        (o.discount || 0).toFixed(2),
        orderTotal.toFixed(2),
        fee.toFixed(2),
        refAmt.toFixed(2),
        net.toFixed(2),
        `"${o.trackingNumber || ''}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PureSleep_Dispensary_Financial_Report_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Financial Management</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-mono font-semibold">
              Treasury & Settlements
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Real-time reconciliation of gross transaction sales, payment gateway merchant fees, approved refunds, and net dispensory revenue.
          </p>
        </div>

        {/* Action Controls & Export */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Period selector */}
          <div className="flex items-center bg-[#01140e] border border-emerald-800/60 rounded-xl p-1">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                timeRange === 'today' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                timeRange === '7days' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                timeRange === '30days' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('thisMonth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                timeRange === 'thisMonth' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                timeRange === 'all' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
              }`}
            >
              All Time
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            title="Download CSV financial ledger"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Financial CSV export generated and downloaded to your device successfully.</span>
        </div>
      )}

      {/* 4 Core Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Gross Sales */}
        <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 hover:border-emerald-600/50 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400/80">Gross Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
              <PoundSterling className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-heading mt-2">
            £{financialMetrics.grossSales.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>{financialMetrics.totalTransactions} Total Transactions</span>
          </div>
        </div>

        {/* 2. Payment Gateway Fees */}
        <div className="bg-[#021811] border border-amber-900/40 rounded-2xl p-5 hover:border-amber-600/50 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400/80">Payment Gateway Fees</span>
            <div className="w-8 h-8 rounded-xl bg-amber-900/30 border border-amber-700/40 flex items-center justify-center text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-heading mt-2">
            £{financialMetrics.paymentFees.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-300/80">
            <span>Interchange, Crypto gas & processor fee</span>
          </div>
        </div>

        {/* 3. Refunds */}
        <div className="bg-[#021811] border border-rose-900/40 rounded-2xl p-5 hover:border-rose-600/50 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-400/80">Refunds Processed</span>
            <div className="w-8 h-8 rounded-xl bg-rose-900/30 border border-rose-700/40 flex items-center justify-center text-rose-400">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-heading mt-2">
            £{financialMetrics.totalRefunds.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-300">
            <span>{financialMetrics.refundCount} Approved Refunds</span>
          </div>
        </div>

        {/* 4. Net Revenue */}
        <div className="bg-gradient-to-br from-[#021811] to-[#042e1f] border border-emerald-500/50 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">Net Dispensary Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-heading mt-2 text-emerald-400">
            £{financialMetrics.netRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-200">
            <span>{financialMetrics.profitMargin}% Net Margin Retention</span>
          </div>
        </div>
      </div>

      {/* Gateway Breakdown & Channel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Channels Table */}
        <div className="lg:col-span-2 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white font-serif-heading">Settlement by Payment Gateway</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setSelectedGateway('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedGateway === 'all' ? 'bg-emerald-800 text-white font-semibold' : 'text-emerald-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedGateway('bank_transfer')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedGateway === 'bank_transfer' ? 'bg-emerald-800 text-white font-semibold' : 'text-emerald-400 hover:text-white'
                }`}
              >
                Bank
              </button>
              <button
                onClick={() => setSelectedGateway('crypto')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedGateway === 'crypto' ? 'bg-emerald-800 text-white font-semibold' : 'text-emerald-400 hover:text-white'
                }`}
              >
                Crypto
              </button>
              <button
                onClick={() => setSelectedGateway('card')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedGateway === 'card' ? 'bg-emerald-800 text-white font-semibold' : 'text-emerald-400 hover:text-white'
                }`}
              >
                Card
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-800/40 text-emerald-400 font-semibold">
                  <th className="pb-3">Gateway Channel</th>
                  <th className="pb-3">Gross Total</th>
                  <th className="pb-3">Avg Fee Rate</th>
                  <th className="pb-3">Estimated Fees</th>
                  <th className="pb-3 text-right">Net Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30 text-slate-200">
                <tr className="hover:bg-emerald-950/20">
                  <td className="py-3 font-medium flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Barclays Faster Payments (Bank Transfer)</span>
                  </td>
                  <td className="py-3 font-semibold text-white">
                    £{financialMetrics.bankSales.toFixed(2)}
                  </td>
                  <td className="py-3 text-emerald-400 font-mono">0.0% (Fee Free)</td>
                  <td className="py-3 text-slate-400">£0.00</td>
                  <td className="py-3 text-right font-bold text-emerald-400">
                    £{financialMetrics.bankSales.toFixed(2)}
                  </td>
                </tr>

                <tr className="hover:bg-emerald-950/20">
                  <td className="py-3 font-medium flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cryptocurrency (USDT TRC20 / BTC)</span>
                  </td>
                  <td className="py-3 font-semibold text-white">
                    £{financialMetrics.cryptoSales.toFixed(2)}
                  </td>
                  <td className="py-3 text-amber-400 font-mono">0.5% Flat</td>
                  <td className="py-3 text-amber-300">
                    £{(financialMetrics.cryptoSales * 0.005).toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-bold text-emerald-400">
                    £{(financialMetrics.cryptoSales * 0.995).toFixed(2)}
                  </td>
                </tr>

                <tr className="hover:bg-emerald-950/20">
                  <td className="py-3 font-medium flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                    <span>Credit & Debit Cards (Discreet Merchant)</span>
                  </td>
                  <td className="py-3 font-semibold text-white">
                    £{financialMetrics.cardSales.toFixed(2)}
                  </td>
                  <td className="py-3 text-blue-400 font-mono">1.9% + £0.20</td>
                  <td className="py-3 text-amber-300">
                    £{financialMetrics.cardSales > 0 ? (financialMetrics.cardSales * 0.019 + 2.0).toFixed(2) : '0.00'}
                  </td>
                  <td className="py-3 text-right font-bold text-emerald-400">
                    £{(financialMetrics.cardSales - (financialMetrics.cardSales > 0 ? (financialMetrics.cardSales * 0.019 + 2.0) : 0)).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispensary Payout & Settlement Rules */}
        <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm font-serif-heading mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Treasury & Settlement Compliance</span>
            </div>
            <p className="text-xs text-emerald-400/80 leading-relaxed mb-4">
              All UK prescription transactions adhere to standard financial audit controls. Bank transfers clear immediately with zero merchant interchange fees.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#01140e] border border-emerald-800/40">
                <span className="text-slate-300">Bank Reconciliation</span>
                <span className="text-emerald-400 font-semibold">T+0 Real-time</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#01140e] border border-emerald-800/40">
                <span className="text-slate-300">Crypto Confirmation</span>
                <span className="text-emerald-400 font-semibold">1 Network Block</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#01140e] border border-emerald-800/40">
                <span className="text-slate-300">Refund Window</span>
                <span className="text-emerald-400 font-semibold">14 Days GPhC standard</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-emerald-800/40 flex items-center justify-between text-xs text-emerald-400/70">
            <span>Accounting Currency: <strong>GBP (£)</strong></span>
            <span className="font-mono">VAT Exempt (Medicines)</span>
          </div>
        </div>
      </div>

      {/* Transaction Records Audit Table */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-serif-heading">Dispensary Financial Ledger</h3>
            <p className="text-xs text-emerald-400/80">
              Showing {filteredOrders.length} records for period ({timeRange})
            </p>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-emerald-400/60">
            No order transactions match the selected filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-800/40 text-emerald-400 font-semibold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Gateway</th>
                  <th className="pb-3">Gross</th>
                  <th className="pb-3">Gateway Fee</th>
                  <th className="pb-3">Refund Status</th>
                  <th className="pb-3 text-right">Net Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30 text-slate-200">
                {filteredOrders.slice(0, 15).map((o) => {
                  const gross = o.total || 0;
                  let fee = o.gatewayFee;
                  if (typeof fee !== 'number') {
                    if (o.paymentMethod === 'card') fee = Number((gross * 0.019 + 0.20).toFixed(2));
                    else if (o.paymentMethod === 'crypto') fee = Number((gross * 0.005).toFixed(2));
                    else fee = 0;
                  }
                  const refAmt = (o.refundStatus === 'Approved' || o.paymentStatus === 'Refunded') ? (o.refundAmount || gross) : 0;
                  const net = Math.max(0, gross - fee - refAmt);

                  return (
                    <tr key={o.id} className="hover:bg-emerald-950/20">
                      <td className="py-3 font-mono font-bold text-white">{o.id}</td>
                      <td className="py-3 text-slate-400">{o.date || new Date(o.createdAt).toLocaleDateString('en-GB')}</td>
                      <td className="py-3 text-slate-300 truncate max-w-[150px]">{o.customerName || 'Patient'}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#01140e] border border-emerald-800/40 text-emerald-300 capitalize">
                          {o.paymentMethod === 'bank_transfer' ? 'Bank' : o.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-white">£{gross.toFixed(2)}</td>
                      <td className="py-3 text-amber-400">£{fee.toFixed(2)}</td>
                      <td className="py-3">
                        {o.refundStatus === 'Approved' || o.paymentStatus === 'Refunded' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800/50">
                            Refunded -£{refAmt.toFixed(2)}
                          </span>
                        ) : o.refundStatus === 'Requested' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800/50">
                            Refund Requested
                          </span>
                        ) : (
                          <span className="text-emerald-500/80">No Refund</span>
                        )}
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-400">£{net.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
