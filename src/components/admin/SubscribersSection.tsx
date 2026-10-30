import React, { useState } from 'react';
import {
  Mail,
  Search,
  Download,
  Trash2,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  Calendar,
  Sparkles
} from 'lucide-react';
import { SubscriberRecord } from '../../types';
import {
  addSubscriberToFirestore,
  deleteSubscriberFromFirestore,
  logAdminActivity
} from '../../lib/firestoreService';

interface SubscribersSectionProps {
  subscribers: SubscriberRecord[];
  onSubscribersUpdated: () => void;
}

export const SubscribersSection: React.FC<SubscribersSectionProps> = ({
  subscribers,
  onSubscribersUpdated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState('Manual Admin Add');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<SubscriberRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;

    const headers = ['Email Address', 'Date Subscribed', 'Source Channel'];
    const rows = subscribers.map((s) => [
      s.email,
      new Date(s.subscribedAt).toISOString(),
      s.source || 'Website Footer'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `puresleep_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setIsSaving(true);
    setSaveMessage(null);
    try {
      const ok = await addSubscriberToFirestore(newEmail.trim(), newSource);
      if (ok) {
        setSaveMessage('Subscriber added successfully.');
        await logAdminActivity(
          `Added subscriber: ${newEmail.trim()}`,
          'Subscribers',
          newEmail.trim()
        );
        onSubscribersUpdated();
        setTimeout(() => {
          setIsAddModalOpen(false);
          setIsSaving(false);
          setNewEmail('');
        }, 600);
      } else {
        setSaveMessage('Please enter a valid email address.');
        setIsSaving(false);
      }
    } catch (err) {
      console.error('Error adding subscriber:', err);
      setIsSaving(false);
    }
  };

  const handleDeleteSubscriber = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await deleteSubscriberFromFirestore(deleteCandidate.id);
      await logAdminActivity(
        `Deleted subscriber: ${deleteCandidate.email}`,
        'Subscribers',
        deleteCandidate.id
      );
      onSubscribersUpdated();
      setDeleteCandidate(null);
    } catch (err) {
      console.error('Error deleting subscriber:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = subscribers.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || s.email.toLowerCase().includes(q) || s.source?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Newsletter Subscribers</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-semibold font-mono">
              {subscribers.length} Emails
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Audience list generated from footer newsletter opt-ins, checkout prescription vouchers, and promotional alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#03261a] hover:bg-[#043323] text-emerald-300 hover:text-white border border-emerald-700/50 transition-colors cursor-pointer disabled:opacity-50"
            title="Download CSV file"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => { setIsAddModalOpen(true); setSaveMessage(null); }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email address or channel..."
            className="w-full bg-[#01140e] border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
          />
          <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-emerald-400/80 space-y-2">
            <Mail className="w-10 h-10 text-emerald-700 mx-auto" />
            <div className="text-sm font-bold text-white">No subscribers found</div>
            <p className="text-xs text-emerald-500/80 max-w-sm mx-auto">
              Subscribers who register via the footer or newsletter forms on the website will be collected here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#01140e] border-b border-emerald-800/50 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Acquisition Source</th>
                  <th className="p-4">Subscription Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40 text-xs text-emerald-200">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[#032117] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="font-mono font-bold text-white text-xs">{s.email}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#01140e] text-emerald-300 border border-emerald-800">
                        {s.source || 'Website Footer'}
                      </span>
                    </td>

                    <td className="p-4 text-emerald-400/80 font-mono text-[11px]">
                      {new Date(s.subscribedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setDeleteCandidate(s)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 transition-colors cursor-pointer"
                        title="Remove Subscriber"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Subscriber Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-emerald-600/50 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-serif-heading">Add Subscriber</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
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

            <form onSubmit={handleAddSubscriber} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-emerald-300 mb-1">
                  Email Address <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="patient@example.co.uk"
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Acquisition Source:</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="e.g. Phone Call Inquiry"
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-800/40">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 text-xs font-semibold border border-emerald-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Add Subscriber'}
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
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Remove Subscriber</h3>
            </div>
            <p className="text-xs text-emerald-200">
              Are you sure you want to remove <span className="font-mono font-bold text-white">{deleteCandidate.email}</span> from the newsletter list?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl bg-[#03261a] text-emerald-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubscriber}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                {isDeleting ? 'Deleting...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
