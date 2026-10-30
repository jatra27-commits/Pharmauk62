import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  FileText,
  Save,
  X,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  AlertCircle,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Send,
  Bell,
  Check,
  AlertTriangle,
  History,
  FileSpreadsheet
} from 'lucide-react';
import { OrderRecord, OrderTrackingStep, StaffRole } from '../../types';
import { updateOrderInFirestore, logAdminActivity } from '../../lib/firestoreService';

interface OrdersSectionProps {
  orders: OrderRecord[];
  onRefreshOrders?: () => void;
  onOrdersUpdated?: () => void;
  onViewInvoice: (order: OrderRecord) => void;
  selectedOrderFromDashboard?: OrderRecord | null;
  onClearSelectedOrder?: () => void;
  currentUserRole?: StaffRole;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  onRefreshOrders,
  onOrdersUpdated,
  onViewInvoice,
  selectedOrderFromDashboard,
  onClearSelectedOrder,
  currentUserRole = 'Super Admin'
}) => {
  const triggerRefresh = () => {
    if (onRefreshOrders) onRefreshOrders();
    if (onOrdersUpdated) onOrdersUpdated();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(selectedOrderFromDashboard || null);

  // Status editing state in modal
  const [editStatus, setEditStatus] = useState<string>('');
  const [editPaymentStatus, setEditPaymentStatus] = useState<string>('');
  const [editTrackingNumber, setEditTrackingNumber] = useState<string>('');
  const [editDeliveryNotes, setEditDeliveryNotes] = useState<string>('');
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Notification Resend state
  const [isSendingNotification, setIsSendingNotification] = useState<string | null>(null);
  const [notificationSentMsg, setNotificationSentMsg] = useState<string | null>(null);

  // Suspicious Order Review State
  const [reviewModalOrder, setReviewModalOrder] = useState<OrderRecord | null>(null);
  const [suspiciousReasonInput, setSuspiciousReasonInput] = useState('');

  // Refund Approval State
  const [refundModalOrder, setRefundModalOrder] = useState<OrderRecord | null>(null);
  const [refundAmountInput, setRefundAmountInput] = useState<number>(0);
  const [refundReasonInput, setRefundReasonInput] = useState<string>('Customer cancellation / Clinical adjustment');
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  // When opening modal
  const handleOpenOrder = (order: OrderRecord) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus || 'Paid');
    setEditTrackingNumber(order.trackingNumber || '');
    setEditDeliveryNotes(order.deliveryNotes || '');
    setSaveSuccessMsg(null);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    if (onClearSelectedOrder) onClearSelectedOrder();
  };

  // 1. Verify Payment Action
  const handleVerifyPayment = async (order: OrderRecord) => {
    const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ', ' +
                   new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const updatedHistory: OrderTrackingStep[] = [...(order.trackingHistory || [])];
    updatedHistory.push({
      title: 'Payment Verified',
      description: `Payment confirmed via ${order.paymentMethod?.replace('_', ' ').toUpperCase()} by Dispensary Officer`,
      timestamp: nowStr,
      completed: true,
      current: true
    });

    const updates: Partial<OrderRecord> = {
      paymentStatus: 'Paid',
      status: 'Payment Verified',
      trackingHistory: updatedHistory
    };

    const success = await updateOrderInFirestore(order.id, updates);
    if (success) {
      await logAdminActivity(
        'Verified Order Payment',
        'Orders',
        order.id,
        `Payment confirmed for £${(order.total || 0).toFixed(2)} (${order.paymentMethod})`
      );
      setNotificationSentMsg(`Payment verified for ${order.id}. Order status changed to Payment Verified.`);
      setTimeout(() => setNotificationSentMsg(null), 3500);
      triggerRefresh();
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder({ ...selectedOrder, ...updates });
        setEditPaymentStatus('Paid');
        setEditStatus('Payment Verified');
      }
    }
  };

  // 2. Resend Delivery Notification
  const handleResendDeliveryNotification = async (order: OrderRecord) => {
    setIsSendingNotification(order.id);
    const tracking = order.trackingNumber || `GB-RM-${Math.floor(100000000 + Math.random() * 900000000)}UK`;
    
    // Simulate Royal Mail Tracked API dispatch trigger
    await new Promise((resolve) => setTimeout(resolve, 700));

    const updates: Partial<OrderRecord> = {
      deliveryNotificationSent: true,
      lastNotificationSentAt: Date.now(),
      trackingNumber: tracking
    };

    await updateOrderInFirestore(order.id, updates);
    await logAdminActivity(
      'Resent Delivery Notification',
      'Orders',
      order.id,
      `Sent Royal Mail Tracked dispatch email to ${order.email || 'patient'} (${tracking})`
    );

    setIsSendingNotification(null);
    setNotificationSentMsg(`Royal Mail dispatch notification resent to ${order.email || 'patient'} with tracking: ${tracking}`);
    setTimeout(() => setNotificationSentMsg(null), 4000);
    triggerRefresh();
  };

  // 3. Suspicious Order Manual Review
  const handleOpenSuspiciousModal = (order: OrderRecord) => {
    setReviewModalOrder(order);
    setSuspiciousReasonInput(order.suspiciousReason || 'Unusually large strip quantity / address mismatch check');
  };

  const handleFlagAsSuspicious = async (order: OrderRecord) => {
    const updates: Partial<OrderRecord> = {
      isSuspicious: true,
      suspiciousReason: suspiciousReasonInput || 'Flagged for pharmacist review by officer',
      fraudRiskScore: 78,
      reviewStatus: 'Flagged Suspicious'
    };
    await updateOrderInFirestore(order.id, updates);
    await logAdminActivity('Flagged Order as Suspicious', 'Orders', order.id, updates.suspiciousReason);
    setReviewModalOrder(null);
    setNotificationSentMsg(`Order ${order.id} marked as Suspicious and quarantined for review.`);
    setTimeout(() => setNotificationSentMsg(null), 3500);
    triggerRefresh();
  };

  const handleClearSuspiciousOrder = async (order: OrderRecord) => {
    const updates: Partial<OrderRecord> = {
      isSuspicious: false,
      reviewStatus: 'Verified Safe',
      reviewedBy: currentUserRole,
      reviewedAt: Date.now()
    };
    await updateOrderInFirestore(order.id, updates);
    await logAdminActivity('Cleared Suspicious Order', 'Orders', order.id, 'Verified legitimate prescription order');
    setReviewModalOrder(null);
    setNotificationSentMsg(`Order ${order.id} verified as legitimate and cleared.`);
    setTimeout(() => setNotificationSentMsg(null), 3500);
    triggerRefresh();
  };

  // 4. Approve Refund Action
  const handleOpenRefundModal = (order: OrderRecord) => {
    setRefundModalOrder(order);
    setRefundAmountInput(order.refundAmount || order.total || 0);
    setRefundReasonInput(order.refundReason || 'Patient requested refund / clinical order cancellation');
  };

  const handleApproveRefund = async () => {
    if (!refundModalOrder) return;
    setIsProcessingRefund(true);

    const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ', ' +
                   new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const updatedHistory: OrderTrackingStep[] = [...(refundModalOrder.trackingHistory || [])];
    updatedHistory.push({
      title: 'Refund Approved & Settled',
      description: `Refund of £${refundAmountInput.toFixed(2)} approved by ${currentUserRole}. Reason: ${refundReasonInput}`,
      timestamp: nowStr,
      completed: true,
      current: true
    });

    const updates: Partial<OrderRecord> = {
      refundStatus: 'Approved',
      refundAmount: Number(refundAmountInput),
      refundReason: refundReasonInput,
      refundApprovedAt: Date.now(),
      refundApprovedBy: currentUserRole,
      paymentStatus: 'Refunded',
      trackingHistory: updatedHistory
    };

    const success = await updateOrderInFirestore(refundModalOrder.id, updates);
    if (success) {
      await logAdminActivity(
        'Approved Order Refund',
        'Orders',
        refundModalOrder.id,
        `Approved refund £${refundAmountInput.toFixed(2)} (${refundReasonInput})`
      );
      setNotificationSentMsg(`Refund of £${refundAmountInput.toFixed(2)} approved for order ${refundModalOrder.id}.`);
      setTimeout(() => setNotificationSentMsg(null), 4000);
      setRefundModalOrder(null);
      triggerRefresh();
      if (selectedOrder && selectedOrder.id === refundModalOrder.id) {
        setSelectedOrder({ ...selectedOrder, ...updates });
      }
    }
    setIsProcessingRefund(false);
  };

  // Save changes in Order Details Modal
  const handleSaveOrderChanges = async () => {
    if (!selectedOrder) return;
    setIsSavingOrder(true);
    setSaveSuccessMsg(null);

    try {
      const existingHistory = selectedOrder.trackingHistory || [];
      const updatedHistory: OrderTrackingStep[] = [...existingHistory];

      const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ', ' +
                     new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

      if (editStatus !== selectedOrder.status) {
        updatedHistory.push({
          title: editStatus,
          description: `Dispensary status advanced to: ${editStatus}`,
          timestamp: nowStr,
          completed: true,
          current: true
        });
      }

      const updates: Partial<OrderRecord> = {
        status: editStatus as any,
        paymentStatus: editPaymentStatus as any,
        trackingNumber: editTrackingNumber.trim(),
        deliveryNotes: editDeliveryNotes.trim(),
        trackingHistory: updatedHistory
      };

      const success = await updateOrderInFirestore(selectedOrder.id, updates);
      if (success) {
        setSaveSuccessMsg('Order updated in real-time database.');
        await logAdminActivity(
          `Updated order status to ${editStatus}`,
          'Orders',
          selectedOrder.id,
          `Tracking: ${editTrackingNumber}`
        );
        triggerRefresh();
        setSelectedOrder({ ...selectedOrder, ...updates });
      }
    } catch (err) {
      console.error('Error saving order changes:', err);
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      (order.email && order.email.toLowerCase().includes(query)) ||
      (order.phone && order.phone.includes(query)) ||
      (order.postcode && order.postcode.toLowerCase().includes(query)) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(query));

    let matchesStatus = true;
    if (statusFilter === 'Pending') {
      matchesStatus = order.status === 'Order Placed & Pending Payment' || order.paymentStatus === 'Pending Verification';
    } else if (statusFilter === 'Suspicious') {
      matchesStatus = !!order.isSuspicious;
    } else if (statusFilter === 'Refunds') {
      matchesStatus = order.refundStatus === 'Requested' || order.refundStatus === 'Approved' || order.paymentStatus === 'Refunded';
    } else if (statusFilter === 'Delivered') {
      matchesStatus = order.status === 'Delivered';
    } else if (statusFilter === 'Dispatched') {
      matchesStatus = order.status === 'Dispatched (Royal Mail Tracked)' || order.status === 'Out for Delivery';
    } else if (statusFilter === 'Verified') {
      matchesStatus = order.status === 'Payment Verified' || order.paymentStatus === 'Paid';
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Order Management & Verification</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-mono font-semibold">
              {orders.length} Total Orders
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Search orders by ID, verify payments, review suspicious transactions, approve refunds, and resend delivery notifications.
          </p>
        </div>
      </div>

      {notificationSentMsg && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-300 shadow-md animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationSentMsg}</span>
        </div>
      )}

      {/* Search Bar & Quick Filters */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Order ID Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID (e.g. REM-849201), Patient, Email, Tracking, Postcode..."
              className="w-full bg-[#01140e] border border-emerald-800/60 rounded-xl pl-9 pr-12 py-2.5 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
            {[
              { id: 'All', label: 'All Orders' },
              { id: 'Pending', label: 'Pending Payment' },
              { id: 'Suspicious', label: 'Suspicious (Fraud)' },
              { id: 'Refunds', label: 'Refund Requests' },
              { id: 'Verified', label: 'Verified & Paid' },
              { id: 'Dispatched', label: 'Dispatched' },
              { id: 'Delivered', label: 'Delivered' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#03261a] text-emerald-300/80 hover:text-white hover:bg-[#043323] border border-emerald-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-emerald-400/80 space-y-2">
            <ShoppingBag className="w-10 h-10 text-emerald-700 mx-auto" />
            <div className="text-sm font-bold text-white">No matching orders found</div>
            <p className="text-xs text-emerald-500/80 max-w-sm mx-auto">
              No prescription orders match the selected search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#01140e] border-b border-emerald-800/50 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Patient Details</th>
                  <th className="p-4">Items Dispensed</th>
                  <th className="p-4">Delivery & Tracking</th>
                  <th className="p-4">Total & Payment</th>
                  <th className="p-4">Status & Review</th>
                  <th className="p-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40 text-emerald-200">
                {filteredOrders.map((order) => {
                  const isPending =
                    order.status === 'Order Placed & Pending Payment' ||
                    order.paymentStatus === 'Pending Verification';
                  const isDelivered = order.status === 'Delivered';
                  const isCancelled = (order.status as string) === 'Cancelled' || order.paymentStatus === 'Failed';

                  return (
                    <tr key={order.id} className="hover:bg-[#032117] transition-colors">
                      {/* ID & Date */}
                      <td className="p-4 font-mono">
                        <div className="font-bold text-white text-xs">{order.id}</div>
                        <div className="text-[10px] text-emerald-400/70">{order.date || 'Today'}</div>
                      </td>

                      {/* Patient */}
                      <td className="p-4">
                        <div className="font-semibold text-white">{order.customerName}</div>
                        <div className="text-[10px] text-emerald-400/80 truncate max-w-[170px]">
                          {order.city ? `${order.city}, ` : ''}{order.postcode}
                        </div>
                        {order.phone && <div className="text-[10px] text-emerald-500/80">{order.phone}</div>}
                      </td>

                      {/* Items */}
                      <td className="p-4">
                        <div className="font-medium text-emerald-100">
                          {order.items?.length || 0} pack{order.items?.length === 1 ? '' : 's'}
                        </div>
                        <div className="text-[10px] text-emerald-400/70 truncate max-w-[180px]">
                          {order.items?.map((it) => `${it.product?.name} (${it.selectedPack?.label})`).join(', ')}
                        </div>
                      </td>

                      {/* Delivery */}
                      <td className="p-4">
                        <div className="text-[11px] text-white truncate max-w-[150px]">
                          {order.shippingMethod || 'Royal Mail Tracked'}
                        </div>
                        {order.trackingNumber ? (
                          <div className="font-mono text-[10px] text-cyan-300 font-bold">
                            {order.trackingNumber}
                          </div>
                        ) : (
                          <div className="text-[10px] text-amber-400/80">Pending Tracking</div>
                        )}
                      </td>

                      {/* Total */}
                      <td className="p-4">
                        <div className="font-mono font-bold text-white text-sm">
                          £{(order.total || 0).toFixed(2)}
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-600/40'
                          }`}
                        >
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </td>

                      {/* Status & Review Flags */}
                      <td className="p-4 space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isPending
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : isDelivered
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : isCancelled
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {isPending && <Clock className="w-3 h-3" />}
                          {isDelivered && <CheckCircle2 className="w-3 h-3" />}
                          {isCancelled && <XCircle className="w-3 h-3" />}
                          {!isPending && !isDelivered && !isCancelled && <Truck className="w-3 h-3" />}
                          <span>{order.status}</span>
                        </span>

                        {order.isSuspicious && (
                          <div className="flex items-center gap-1 text-[10px] text-purple-300 font-semibold">
                            <ShieldAlert className="w-3 h-3 text-purple-400" />
                            <span>Suspicious Flag</span>
                          </div>
                        )}

                        {order.refundStatus === 'Requested' && (
                          <div className="text-[10px] text-rose-300 font-semibold flex items-center gap-1">
                            <RotateCcw className="w-3 h-3 text-rose-400" />
                            <span>Refund Requested</span>
                          </div>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Verify Payment Button */}
                          {order.paymentStatus !== 'Paid' && (
                            <button
                              onClick={() => handleVerifyPayment(order)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                              title="Verify Bank / Crypto payment"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verify</span>
                            </button>
                          )}

                          {/* Resend Delivery Notification */}
                          <button
                            onClick={() => handleResendDeliveryNotification(order)}
                            disabled={isSendingNotification === order.id}
                            className="p-1.5 rounded-lg bg-[#01140e] hover:bg-emerald-900/40 text-emerald-400 hover:text-white border border-emerald-800/40 transition-colors cursor-pointer"
                            title="Resend Royal Mail delivery notification email"
                          >
                            <Send className={`w-3.5 h-3.5 ${isSendingNotification === order.id ? 'animate-spin' : ''}`} />
                          </button>

                          {/* Review Suspicious */}
                          <button
                            onClick={() => handleOpenSuspiciousModal(order)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              order.isSuspicious
                                ? 'bg-purple-950 text-purple-300 border-purple-700 hover:bg-purple-900'
                                : 'bg-[#01140e] text-slate-400 border-emerald-800/40 hover:text-white'
                            }`}
                            title="Manually review suspicious order"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>

                          {/* Approve Refund Button */}
                          {(order.refundStatus === 'Requested' || order.paymentStatus === 'Paid') && (
                            <button
                              onClick={() => handleOpenRefundModal(order)}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 transition-colors cursor-pointer"
                              title="Approve / process refund"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Details / History Modal */}
                          <button
                            onClick={() => handleOpenOrder(order)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#03261a] hover:bg-[#053625] text-emerald-300 hover:text-white border border-emerald-700/50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          {/* Invoice */}
                          <button
                            onClick={() => onViewInvoice(order)}
                            className="p-1.5 rounded-lg bg-[#01140e] hover:bg-emerald-950 text-emerald-400 hover:text-white border border-emerald-800/40 transition-colors cursor-pointer"
                            title="Print PDF Invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          COMPLETE ORDER HISTORY & DETAILS MODAL
         ───────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#021811] border border-emerald-600/50 rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                    {selectedOrder.id}
                  </span>
                  <span className="text-xs text-emerald-400">
                    {selectedOrder.date || 'Recent Order'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-serif-heading mt-1">
                  Complete Order History & Dispense Record
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Patient & Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#01140e] border border-emerald-900/60 rounded-xl p-4 text-xs">
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery Address</span>
                </div>
                <div className="text-white font-bold">{selectedOrder.customerName}</div>
                <div className="text-emerald-300/80">{selectedOrder.deliveryAddress}</div>
                <div className="text-emerald-300/80">
                  {selectedOrder.city ? `${selectedOrder.city}, ` : ''}{selectedOrder.postcode}
                </div>
                <div className="text-emerald-400 font-medium">{selectedOrder.country || 'United Kingdom'}</div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Contact & Payment</span>
                </div>
                {selectedOrder.email && (
                  <div className="text-emerald-300/90 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-emerald-500" />
                    <span>{selectedOrder.email}</span>
                  </div>
                )}
                {selectedOrder.phone && (
                  <div className="text-emerald-300/90 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-emerald-500" />
                    <span>{selectedOrder.phone}</span>
                  </div>
                )}
                <div className="text-emerald-300/90 mt-1">
                  Payment Method: <span className="font-bold text-white capitalize">{selectedOrder.paymentMethod?.replace('_', ' ')}</span>
                </div>
                <div className="text-emerald-300/90">
                  Shipping Service: <span className="font-semibold text-white">{selectedOrder.shippingMethod}</span>
                </div>
              </div>
            </div>

            {/* Prescribed Items Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-white">Prescription Medications:</div>
              <div className="border border-emerald-900/60 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#01140e] text-emerald-400 border-b border-emerald-900/60 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-2.5">Medication & Pack</th>
                      <th className="p-2.5">Denomination</th>
                      <th className="p-2.5">Qty</th>
                      <th className="p-2.5 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950 text-slate-200">
                    {selectedOrder.items?.map((it, idx) => (
                      <tr key={idx} className="hover:bg-emerald-950/20">
                        <td className="p-2.5">
                          <div className="font-bold text-white">{it.product?.name}</div>
                          <div className="text-[10px] text-emerald-400/80">{it.product?.genericName} • {it.product?.strength}</div>
                        </td>
                        <td className="p-2.5 font-medium text-emerald-300">{it.selectedPack?.label}</td>
                        <td className="p-2.5 font-mono">{it.quantity}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-white">
                          £{((it.selectedPack?.price || it.product?.basePrice || 0) * it.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chronological Audit Trail / Tracking History */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <History className="w-4 h-4 text-emerald-400" />
                <span>Complete Order History & Timeline</span>
              </div>
              <div className="p-3 rounded-xl bg-[#01140e] border border-emerald-800/60 space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar">
                {(selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0
                  ? selectedOrder.trackingHistory
                  : [
                      {
                        title: 'Order Placed',
                        description: 'Patient consultation submitted and prescription generated',
                        timestamp: selectedOrder.date || 'Recent',
                        completed: true
                      }
                    ]
                ).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <div>
                      <div className="font-bold text-white">{step.title}</div>
                      <div className="text-[11px] text-emerald-400/80">{step.description}</div>
                      <div className="text-[10px] text-emerald-500/70 font-mono">{step.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Editing Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#01140e] border border-emerald-800/60 text-xs">
              <div>
                <label className="block font-medium text-emerald-300 mb-1">Dispensary Fulfillment Status:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-[#021811] border border-emerald-700 rounded-xl p-2 text-white focus:outline-none"
                >
                  <option value="Order Placed & Pending Payment">Order Placed & Pending Payment</option>
                  <option value="Payment Verified">Payment Verified</option>
                  <option value="Dispensary Packaging">Dispensary Packaging</option>
                  <option value="Dispatched (Royal Mail Tracked)">Dispatched (Royal Mail Tracked)</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-emerald-300 mb-1">Payment Status:</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="w-full bg-[#021811] border border-emerald-700 rounded-xl p-2 text-white focus:outline-none"
                >
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-emerald-300 mb-1">Royal Mail Tracking Number:</label>
                <input
                  type="text"
                  value={editTrackingNumber}
                  onChange={(e) => setEditTrackingNumber(e.target.value)}
                  placeholder="GB-RM-928401928UK"
                  className="w-full bg-[#021811] border border-emerald-700 rounded-xl p-2 text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-emerald-800/40">
              <button
                type="button"
                onClick={() => onViewInvoice(selectedOrder)}
                className="px-3.5 py-2 rounded-xl bg-[#01140e] hover:bg-[#03261a] border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Invoice</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-[#01140e] hover:bg-[#03261a] text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveOrderChanges}
                  disabled={isSavingOrder}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingOrder ? 'Saving...' : 'Save Order Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUSPICIOUS ORDER MANUAL REVIEW MODAL
         ───────────────────────────────────────────────────────────── */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-purple-600/50 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white font-serif-heading">
                  Manual Fraud & Prescription Review
                </h3>
              </div>
              <button onClick={() => setReviewModalOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-purple-200/90">
              Order <strong>{reviewModalOrder.id}</strong> (£{reviewModalOrder.total?.toFixed(2)}) for patient <strong>{reviewModalOrder.customerName}</strong>.
            </p>

            <div>
              <label className="block text-xs font-medium text-purple-300 mb-1">
                Clinical / Fraud Review Assessment:
              </label>
              <textarea
                rows={3}
                value={suspiciousReasonInput}
                onChange={(e) => setSuspiciousReasonInput(e.target.value)}
                className="w-full bg-[#01140e] border border-purple-800/60 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-800/40">
              <button
                onClick={() => handleClearSuspiciousOrder(reviewModalOrder)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Mark Verified & Cleared
              </button>
              <button
                onClick={() => handleFlagAsSuspicious(reviewModalOrder)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Flag as Suspicious
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          APPROVE REFUND MODAL
         ───────────────────────────────────────────────────────────── */}
      {refundModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-rose-600/50 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-rose-800/40 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white font-serif-heading">
                  Approve Dispensary Refund
                </h3>
              </div>
              <button onClick={() => setRefundModalOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#01140e] border border-rose-900/40 text-xs text-rose-200">
              <div>Order: <strong>{refundModalOrder.id}</strong></div>
              <div>Customer: <strong>{refundModalOrder.customerName}</strong></div>
              <div>Original Total: <strong>£{(refundModalOrder.total || 0).toFixed(2)}</strong></div>
            </div>

            <div>
              <label className="block text-xs font-medium text-rose-300 mb-1">
                Refund Amount (£):
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={refundModalOrder.total || 1000}
                value={refundAmountInput}
                onChange={(e) => setRefundAmountInput(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#01140e] border border-rose-800/60 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-rose-300 mb-1">
                Refund Reason / Audit Note:
              </label>
              <input
                type="text"
                value={refundReasonInput}
                onChange={(e) => setRefundReasonInput(e.target.value)}
                className="w-full bg-[#01140e] border border-rose-800/60 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-800/40">
              <button
                type="button"
                onClick={() => setRefundModalOrder(null)}
                className="px-3.5 py-1.5 rounded-xl bg-[#01140e] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApproveRefund}
                disabled={isProcessingRefund || refundAmountInput <= 0}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {isProcessingRefund ? 'Processing...' : `Approve £${refundAmountInput.toFixed(2)} Refund`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
