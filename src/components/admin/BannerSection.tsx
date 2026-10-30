import React, { useState } from 'react';
import {
  Megaphone,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  ExternalLink
} from 'lucide-react';
import { BannerItem } from '../../types';
import { saveBannerToFirestore, deleteBannerFromFirestore, logAdminActivity } from '../../lib/firestoreService';

interface BannerSectionProps {
  banners: BannerItem[];
  onBannersUpdated: () => void;
}

export const BannerSection: React.FC<BannerSectionProps> = ({
  banners,
  onBannersUpdated
}) => {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [buttonText, setButtonText] = useState('Order Online');
  const [targetTab, setTargetTab] = useState('store');
  const [gradient, setGradient] = useState('from-emerald-900/80 to-teal-900/80');
  const [active, setActive] = useState(true);
  const [orderNum, setOrderNum] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<BannerItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setBadge('Special Promotion');
    setButtonText('Shop Treatment');
    setTargetTab('store');
    setGradient('from-emerald-900/80 to-teal-900/80');
    setActive(true);
    setOrderNum(banners.length + 1);
    setSaveMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (b: BannerItem) => {
    setIsEditing(true);
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setBadge(b.badge || '');
    setButtonText(b.buttonText || 'Order Online');
    setTargetTab(b.targetTab || 'store');
    setGradient(b.gradient || 'from-emerald-900/80 to-teal-900/80');
    setActive(b.active ?? true);
    setOrderNum(b.order ?? 1);
    setSaveMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const bannerId = isEditing && editingBanner ? editingBanner.id : `banner-${Date.now()}`;
      const updatedBanner: BannerItem = {
        id: bannerId,
        title: title.trim(),
        subtitle: subtitle.trim(),
        badge: badge.trim() || undefined,
        buttonText: buttonText.trim() || 'Order Online',
        targetTab: targetTab.trim() || 'store',
        gradient: gradient.trim() || 'from-emerald-900/80 to-teal-900/80',
        active,
        order: Number(orderNum) || 1
      };

      await saveBannerToFirestore(updatedBanner);
      setSaveMessage('Banner saved to Firestore.');
      await logAdminActivity(
        isEditing ? `Edited banner: ${title}` : `Created banner: ${title}`,
        'Banners',
        bannerId
      );
      onBannersUpdated();
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSaving(false);
      }, 500);
    } catch (err) {
      console.error('Error saving banner:', err);
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (b: BannerItem) => {
    const updated: BannerItem = {
      ...b,
      active: !(b.active ?? true)
    };
    await saveBannerToFirestore(updated);
    await logAdminActivity(
      `Toggled banner active status for: ${b.title}`,
      'Banners',
      b.id
    );
    onBannersUpdated();
  };

  const handleMoveOrder = async (b: BannerItem, direction: 'up' | 'down') => {
    const currentOrder = b.order ?? 1;
    const newOrder = direction === 'up' ? Math.max(1, currentOrder - 1) : currentOrder + 1;
    const updated: BannerItem = {
      ...b,
      order: newOrder
    };
    await saveBannerToFirestore(updated);
    onBannersUpdated();
  };

  const handleDeleteBanner = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await deleteBannerFromFirestore(deleteCandidate.id);
      await logAdminActivity(
        `Deleted banner: ${deleteCandidate.title}`,
        'Banners',
        deleteCandidate.id
      );
      onBannersUpdated();
      setDeleteCandidate(null);
    } catch (err) {
      console.error('Error deleting banner:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Sort banners by order
  const sortedBanners = [...banners].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Promotional Banners</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-semibold font-mono">
              {banners.length} Banners
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Display promotional notices, delivery dispatch updates, and clinic announcements on the customer website.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Banner</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {sortedBanners.length === 0 ? (
          <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl py-16 text-center text-emerald-400/80 space-y-2">
            <Megaphone className="w-10 h-10 text-emerald-700 mx-auto" />
            <div className="text-sm font-bold text-white">No promotional banners configured</div>
            <p className="text-xs text-emerald-500/80 max-w-sm mx-auto">
              Create a banner to announce holiday delivery schedules or special discount promotions.
            </p>
          </div>
        ) : (
          sortedBanners.map((b) => {
            const isActive = b.active ?? true;

            return (
              <div
                key={b.id}
                className="bg-[#021811] border border-emerald-800/50 hover:border-emerald-700 rounded-2xl p-4 sm:p-5 transition-all shadow-sm space-y-3"
              >
                {/* Live Preview Bar */}
                <div
                  className={`rounded-xl p-4 bg-gradient-to-r ${b.gradient || 'from-emerald-950 to-teal-950'} border border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                >
                  <div className="space-y-1">
                    {b.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {b.badge}
                      </span>
                    )}
                    <h4 className="text-sm sm:text-base font-bold text-white">{b.title}</h4>
                    <p className="text-xs text-emerald-200/90 max-w-xl">{b.subtitle}</p>
                  </div>
                  {b.buttonText && (
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-white text-emerald-950 font-bold text-xs shrink-0 self-start sm:self-center shadow"
                    >
                      {b.buttonText} &rarr;
                    </button>
                  )}
                </div>

                {/* Banner Meta & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1 border-t border-emerald-900/40">
                  <div className="flex items-center gap-4 text-emerald-400">
                    <span className="font-mono text-[11px]">Priority Order: #{b.order ?? 1}</span>
                    <span>Target Tab: <strong className="text-white">{b.targetTab || 'store'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Reorder buttons */}
                    <button
                      onClick={() => handleMoveOrder(b, 'up')}
                      className="p-1.5 rounded bg-[#01140e] hover:bg-emerald-900 text-emerald-300 border border-emerald-800"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(b, 'down')}
                      className="p-1.5 rounded bg-[#01140e] hover:bg-emerald-900 text-emerald-300 border border-emerald-800"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Active toggle */}
                    <button
                      onClick={() => handleToggleActive(b)}
                      className="cursor-pointer"
                      title="Toggle active status"
                    >
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isActive ? 'Active on Store' : 'Inactive'}</span>
                      </span>
                    </button>

                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1.5 rounded-lg bg-[#03261a] hover:bg-[#053625] text-emerald-300 hover:text-white border border-emerald-700/50"
                      title="Edit Banner"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(b)}
                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-emerald-600/50 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-serif-heading">
                  {isEditing ? 'Edit Promotional Banner' : 'Create New Banner'}
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

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-emerald-300 mb-1">
                  Banner Headline <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Mail Tracked 24: Order before 3 PM for Next-Day Delivery"
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Subtitle / Details:</label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Authentic UK pharmacy registered blister strips dispatched in plain, unbranded packaging."
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Badge Tag:</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Same-Day Dispatch"
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Button Call to Action:</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="e.g. Shop All Sleeping Aids"
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Target Page/Tab:</label>
                  <select
                    value={targetTab}
                    onChange={(e) => setTargetTab(e.target.value)}
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="store">Store Catalog</option>
                    <option value="tracking">Track Order</option>
                    <option value="refill">Auto-Refill</option>
                    <option value="checker">Drug Interaction Checker</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Priority Order:</label>
                  <input
                    type="number"
                    min="1"
                    value={orderNum}
                    onChange={(e) => setOrderNum(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#01140e] border border-emerald-800/60 rounded-xl">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-[#021811] border-emerald-700 cursor-pointer"
                />
                <label htmlFor="bannerActive" className="text-xs text-white font-medium cursor-pointer">
                  Activate banner immediately on the customer website
                </label>
              </div>

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
                  <span>{isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Banner'}</span>
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
                <h3 className="text-sm font-bold text-white">Delete Promotional Banner</h3>
                <p className="text-[11px] text-rose-300/80">Permanent removal.</p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed bg-[#01140e] p-3 rounded-xl border border-rose-900/40">
              Are you sure you want to remove banner <span className="font-bold text-white">"{deleteCandidate.title}"</span>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 text-xs font-semibold border border-emerald-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBanner}
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
