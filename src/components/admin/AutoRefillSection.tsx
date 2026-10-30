import React, { useState } from 'react';
import {
  RefreshCw,
  Search,
  CheckCircle2,
  PauseCircle,
  XCircle,
  Calendar,
  Trash2,
  Edit3,
  Award,
  AlertTriangle,
  X,
  Save,
  Clock,
  User,
  MapPin,
  Pill
} from 'lucide-react';
import { AutoRefillSubscription, LoyaltyTier } from '../../types';
import { updateAutoRefillInFirestore, deleteAutoRefillFromFirestore, logAdminActivity } from '../../lib/firestoreService';

interface AutoRefillSectionProps {
  subscriptions: AutoRefillSubscription[];
  onRefreshSubscriptions: () => void;
}

export const AutoRefillSection: React.FC<AutoRefillSectionProps> = ({
  subscriptions,
  onRefreshSubscriptions
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'paused' | 'cancelled'>('All');
  
  // Date edit modal state
  const [editingSub, setEditingSub] = useState<AutoRefillSubscription | null>(null);
  const [editNextRefillDate, setEditNextRefillDate] = useState('');
  const [editIntervalDays, setEditIntervalDays] = useState<number>(30);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<AutoRefillSubscription | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Loyalty Program configuration overview
  const defaultLoyaltyTiers: LoyaltyTier[] = [
    { name: 'Bronze', minSpend: 0, discountPercent: 0, color: '#cd7f32', perks: ['Free Royal Mail Tracked 48 over £40', 'Standard prescription tracking'] },
    { name: 'Silver', minSpend: 150, discountPercent: 5, color: '#c0c0c0', perks: ['5% off every repeat order', 'Priority dispensing queue'] },
    { name: 'Gold', minSpend: 350, discountPercent: 10, color: '#ffd700', perks: ['10% off every repeat order', 'Free Sunday dispatch upgrade'] },
    { name: 'Platinum', minSpend: 700, discountPercent: 15, color: '#e5e4e2', perks: ['15% off every order', 'Dedicated clinical pharmacist line'] }
  ];

  const handleStatusChange = async (sub: AutoRefillSubscription, newStatus: 'active' | 'paused' | 'cancelled') => {
    try {
      await updateAutoRefillInFirestore(sub.id, { status: newStatus });
      await logAdminActivity(
        `Updated subscription status to ${newStatus} for ${sub.customerName}`,
        'Orders',
        sub.id
      );
      onRefreshSubscriptions();
    } catch (err) {
      console.error('Failed to change subscription status:', err);
    }
  };

  const handleOpenEdit = (sub: AutoRefillSubscription) => {
    setEditingSub(sub);
    setEditNextRefillDate(sub.nextRefillDate || '');
    setEditIntervalDays(sub.intervalDays || 30);
  };

  const handleSaveSubChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    setIsSaving(true);
    try {
      await updateAutoRefillInFirestore(editingSub.id, {
        nextRefillDate: editNextRefillDate,
        intervalDays: editIntervalDays
      });
      await logAdminActivity(
        `Adjusted refill date to ${editNextRefillDate} for ${editingSub.customerName}`,
        'Orders',
        editingSub.id
      );
      onRefreshSubscriptions();
      setEditingSub(null);
    } catch (err) {
      console.error('Error updating refill date:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSub = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await deleteAutoRefillFromFirestore(deleteCandidate.id);
      await logAdminActivity(
        `Deleted auto-refill subscription for ${deleteCandidate.customerName}`,
        'Orders',
        deleteCandidate.id
      );
      onRefreshSubscriptions();
      setDeleteCandidate(null);
    } catch (err) {
      console.error('Error deleting subscription:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSubs = subscriptions.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.customerName.toLowerCase().includes(q) ||
      (s.customerEmail && s.customerEmail.toLowerCase().includes(q)) ||
      (s.customerPhone && s.customerPhone.includes(q)) ||
      (s.productName && s.productName.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Auto-Refill & Loyalty Hub</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-semibold font-mono">
              {subscriptions.length} Subscriptions
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Manage scheduled patient prescription renewals, automatic interval dispatches, and tier-based loyalty benefits.
          </p>
        </div>
      </div>

      {/* Loyalty Program Summary Card */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Patient Loyalty Tiers & Spend Thresholds</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {defaultLoyaltyTiers.map((tier) => (
            <div
              key={tier.name}
              className="p-3 rounded-xl bg-[#01140e] border border-emerald-900/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{tier.name}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded">
                    {tier.discountPercent}% OFF
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400/80 font-mono mt-1">
                  Threshold: &ge;£{tier.minSpend}
                </div>
              </div>
              <div className="mt-2 text-[10px] text-emerald-500/80 space-y-0.5">
                {tier.perks.map((p, idx) => (
                  <div key={idx}>• {p}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscriptions by patient name, email, or medication..."
              className="w-full bg-[#01140e] border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
            />
            <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['All', 'active', 'paused', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#03261a] text-emerald-300/80 hover:text-white border border-emerald-800/50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl overflow-hidden shadow-sm">
        {filteredSubs.length === 0 ? (
          <div className="py-16 text-center text-emerald-400/80 space-y-2">
            <RefreshCw className="w-10 h-10 text-emerald-700 mx-auto" />
            <div className="text-sm font-bold text-white">No active refill subscriptions found</div>
            <p className="text-xs text-emerald-500/80 max-w-sm mx-auto">
              When patients opt-in for auto-refills at checkout, their repeat schedules appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#01140e] border-b border-emerald-800/50 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  <th className="p-4">Subscription & Patient</th>
                  <th className="p-4">Treatment & Pack</th>
                  <th className="p-4">Refill Cycle</th>
                  <th className="p-4">Next Delivery Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40 text-xs text-emerald-200">
                {filteredSubs.map((sub) => {
                  const isActive = sub.status === 'active';
                  const isPaused = sub.status === 'paused';

                  return (
                    <tr key={sub.id} className="hover:bg-[#032117] transition-colors">
                      {/* Patient */}
                      <td className="p-4">
                        <div className="font-bold text-white text-xs">{sub.customerName}</div>
                        <div className="text-[10px] text-emerald-400/80">{sub.customerEmail}</div>
                        {sub.customerPhone && (
                          <div className="text-[10px] text-emerald-500/80">{sub.customerPhone}</div>
                        )}
                        <div className="text-[9px] font-mono text-emerald-600 mt-0.5">ID: {sub.id}</div>
                      </td>

                      {/* Medication */}
                      <td className="p-4">
                        <div className="font-semibold text-white">{sub.productName}</div>
                        <div className="text-[10px] text-emerald-400/80">{sub.packLabel}</div>
                        <div className="text-[10px] font-mono font-bold text-emerald-300 mt-0.5">
                          £{(sub.packPrice || 0).toFixed(2)} / dispatch
                        </div>
                      </td>

                      {/* Interval */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-[#01140e] border border-emerald-800/60">
                          Every {sub.intervalDays || 30} days
                        </span>
                        <div className="text-[10px] text-emerald-500/80 mt-1">10% refill discount applied</div>
                      </td>

                      {/* Next Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-emerald-300 font-mono font-bold">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{sub.nextRefillDate || 'Scheduled'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : isPaused
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {isActive && <CheckCircle2 className="w-3 h-3" />}
                          {isPaused && <PauseCircle className="w-3 h-3" />}
                          {!isActive && !isPaused && <XCircle className="w-3 h-3" />}
                          <span>{sub.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isActive ? (
                            <button
                              onClick={() => handleStatusChange(sub, 'paused')}
                              className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-700/50 text-[10px] font-bold transition-colors cursor-pointer"
                              title="Pause auto-refill"
                            >
                              Pause
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(sub, 'active')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-[10px] font-bold transition-colors cursor-pointer"
                              title="Resume auto-refill"
                            >
                              Resume
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(sub)}
                            className="p-1.5 rounded-lg bg-[#03261a] hover:bg-[#053625] text-emerald-300 hover:text-white border border-emerald-700/50 transition-colors cursor-pointer"
                            title="Edit date"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidate(sub)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 transition-colors cursor-pointer"
                            title="Delete Subscription"
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
        )}
      </div>

      {/* Edit Date Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-emerald-600/50 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-serif-heading">Adjust Prescription Refill Date</h3>
              </div>
              <button
                onClick={() => setEditingSub(null)}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubChanges} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Patient:</label>
                <div className="p-2.5 rounded-xl bg-[#01140e] border border-emerald-800/60 text-white font-semibold">
                  {editingSub.customerName} ({editingSub.productName})
                </div>
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Next Refill Date:</label>
                <input
                  type="date"
                  required
                  value={editNextRefillDate}
                  onChange={(e) => setEditNextRefillDate(e.target.value)}
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Refill Interval (Days):</label>
                <select
                  value={editIntervalDays}
                  onChange={(e) => setEditIntervalDays(parseInt(e.target.value) || 30)}
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value={30}>Every 30 Days (Monthly)</option>
                  <option value={60}>Every 60 Days (Bi-Monthly)</option>
                  <option value={90}>Every 90 Days (Quarterly)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-800/40">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
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
                  <span>{isSaving ? 'Saving...' : 'Update Schedule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Subscription Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-rose-600/50 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Subscription</h3>
                <p className="text-[11px] text-rose-300/80">Permanent cancellation.</p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed bg-[#01140e] p-3 rounded-xl border border-rose-900/40">
              Are you sure you want to delete auto-refill subscription for <span className="font-bold text-white">{deleteCandidate.customerName}</span>? Automatic renewal dispatches will permanently cease.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 text-xs font-semibold border border-emerald-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSub}
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
