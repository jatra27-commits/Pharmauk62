import React, { useState } from 'react';
import {
  Ticket,
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Save,
  Calendar,
  Percent,
  PoundSterling,
  Sparkles
} from 'lucide-react';
import { CouponDiscount } from '../../types';
import { saveCouponToFirestore, deleteCouponFromFirestore, logAdminActivity } from '../../lib/firestoreService';

interface CouponsSectionProps {
  coupons: CouponDiscount[];
  onCouponsUpdated: () => void;
}

export const CouponsSection: React.FC<CouponsSectionProps> = ({
  coupons,
  onCouponsUpdated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponDiscount | null>(null);

  // Form fields
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(30);
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [active, setActive] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<CouponDiscount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingCoupon(null);
    setCode('');
    setType('percentage');
    setValue(15);
    setMinSpend(30);
    setDescription('Prescription discount coupon');
    // Set default expiry 30 days from today
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setExpiryDate(d.toISOString().split('T')[0]);
    setUsageLimit(500);
    setActive(true);
    setSaveMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: CouponDiscount) => {
    setIsEditing(true);
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setType(coupon.type);
    setValue(coupon.value);
    setMinSpend(coupon.minSpend);
    setDescription(coupon.description || '');
    setExpiryDate(coupon.expiryDate || '');
    setUsageLimit(coupon.usageLimit || 100);
    setActive(coupon.active ?? true);
    setSaveMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const cleanCode = code.trim().toUpperCase();
      const updatedCoupon: CouponDiscount = {
        code: cleanCode,
        type,
        value: Number(value) || 0,
        minSpend: Number(minSpend) || 0,
        description: description.trim() || `${cleanCode} Voucher Code`,
        expiryDate: expiryDate || undefined,
        usageLimit: Number(usageLimit) || undefined,
        usedCount: editingCoupon?.usedCount || 0,
        active
      };

      await saveCouponToFirestore(updatedCoupon);
      setSaveMessage('Coupon saved to Firestore database.');
      await logAdminActivity(
        isEditing ? `Edited coupon: ${cleanCode}` : `Created coupon: ${cleanCode}`,
        'Coupons',
        cleanCode,
        `Type: ${type}, Value: ${value}`
      );
      onCouponsUpdated();
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSaving(false);
      }, 500);
    } catch (err) {
      console.error('Error saving coupon:', err);
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (coupon: CouponDiscount) => {
    const updated: CouponDiscount = {
      ...coupon,
      active: !(coupon.active ?? true)
    };
    await saveCouponToFirestore(updated);
    await logAdminActivity(
      `Toggled active status for coupon ${coupon.code}`,
      'Coupons',
      coupon.code
    );
    onCouponsUpdated();
  };

  const handleDeleteCoupon = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await deleteCouponFromFirestore(deleteCandidate.code);
      await logAdminActivity(
        `Deleted coupon: ${deleteCandidate.code}`,
        'Coupons',
        deleteCandidate.code
      );
      onCouponsUpdated();
      setDeleteCandidate(null);
    } catch (err) {
      console.error('Error deleting coupon:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || c.code.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Dispensary Coupon Vouchers</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-semibold font-mono">
              {coupons.length} Active Vouchers
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Create promotional codes, seasonal discounts, and minimum spend thresholds verified during customer checkout.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupons by code or description..."
            className="w-full bg-[#01140e] border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400 font-mono"
          />
          <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#01140e] border-b border-emerald-800/50 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Min. Spend</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Usage Limit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 text-xs text-emerald-200">
              {filteredCoupons.map((c) => {
                const isActive = c.active ?? true;
                const isExpired = c.expiryDate ? new Date(c.expiryDate) < new Date() : false;

                return (
                  <tr key={c.code} className="hover:bg-[#032117] transition-colors">
                    {/* Code */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-mono shrink-0">
                          <Ticket className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-white text-xs">{c.code}</div>
                          <div className="text-[10px] text-emerald-400/80">{c.description}</div>
                        </div>
                      </div>
                    </td>

                    {/* Value */}
                    <td className="p-4 font-mono font-bold text-white">
                      {c.type === 'percentage' ? `${c.value}% OFF` : `£${c.value.toFixed(2)} OFF`}
                    </td>

                    {/* Min Spend */}
                    <td className="p-4 font-mono text-emerald-300">
                      £{(c.minSpend || 0).toFixed(2)}
                    </td>

                    {/* Expiry */}
                    <td className="p-4">
                      <span className={`text-[11px] ${isExpired ? 'text-rose-400 font-bold' : 'text-emerald-400/80'}`}>
                        {c.expiryDate ? c.expiryDate : 'No Expiry'}
                      </span>
                      {isExpired && <span className="text-[9px] block text-rose-400">EXPIRED</span>}
                    </td>

                    {/* Usage */}
                    <td className="p-4 text-[11px] text-emerald-400/80 font-mono">
                      {c.usedCount || 0} / {c.usageLimit || '∞'} uses
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className="cursor-pointer"
                        title="Toggle active status"
                      >
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isActive && !isExpired
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {isActive && !isExpired ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{isActive && !isExpired ? 'Active' : isExpired ? 'Expired' : 'Disabled'}</span>
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg bg-[#03261a] hover:bg-[#053625] text-emerald-300 hover:text-white border border-emerald-700/50 transition-colors cursor-pointer"
                          title="Edit Coupon"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(c)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-emerald-600/50 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-serif-heading">
                  {isEditing ? `Edit Coupon: ${editingCoupon?.code}` : 'Create New Voucher'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveMessage && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Code */}
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">
                    Coupon Code <span className="text-rose-400">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SLEEP20"
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-400 disabled:opacity-60"
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Discount Type:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (£)</option>
                  </select>
                </div>

                {/* Value */}
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">
                    Discount Value {type === 'percentage' ? '(%)' : '(£)'} <span className="text-rose-400">*</span>:
                  </label>
                  <input
                    type="number"
                    min="1"
                    step={type === 'percentage' ? '1' : '0.01'}
                    required
                    value={value}
                    onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Minimum Spend */}
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Minimum Order Spend (£):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={minSpend}
                    onChange={(e) => setMinSpend(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Expiry Date:</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Usage Limit:</label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(parseInt(e.target.value) || 100)}
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Description / Customer Label:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 20% discount on all sleeping aids"
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 p-3 bg-[#01140e] border border-emerald-800/60 rounded-xl">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-[#021811] border-emerald-700 cursor-pointer"
                />
                <label htmlFor="couponActive" className="text-xs text-white font-medium cursor-pointer">
                  Activate this voucher code for immediate patient redemption
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-800/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 text-xs font-semibold border border-emerald-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Voucher'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-rose-600/50 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Coupon</h3>
                <p className="text-[11px] text-rose-300/80">Permanent removal.</p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed bg-[#01140e] p-3 rounded-xl border border-rose-900/40">
              Are you sure you want to delete coupon <span className="font-mono font-bold text-white">"{deleteCandidate.code}"</span>? Customers will immediately be prevented from redeeming it.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 text-xs font-semibold border border-emerald-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCoupon}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
