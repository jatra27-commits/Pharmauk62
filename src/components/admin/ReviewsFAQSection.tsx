import React, { useState } from 'react';
import {
  MessageSquareText,
  Star,
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Save,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  ShieldCheck
} from 'lucide-react';
import { VerifiedCustomerReview, FAQItem, ProductCategory } from '../../types';
import {
  addReviewToFirestore,
  deleteReviewFromFirestore,
  saveFAQToFirestore,
  deleteFAQFromFirestore,
  logAdminActivity
} from '../../lib/firestoreService';

interface ReviewsFAQSectionProps {
  reviews: VerifiedCustomerReview[];
  faqs: FAQItem[];
  onReviewsUpdated: () => void;
  onFAQsUpdated: () => void;
}

export const ReviewsFAQSection: React.FC<ReviewsFAQSectionProps> = ({
  reviews,
  faqs,
  onReviewsUpdated,
  onFAQsUpdated
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'reviews' | 'faq'>('reviews');
  const [searchQuery, setSearchQuery] = useState('');

  // -------------------------------------------------------------
  // REVIEWS STATE
  // -------------------------------------------------------------
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewLocation, setReviewLocation] = useState('London, UK');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewProductName, setReviewProductName] = useState('Zopiclone 7.5mg');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCategory, setReviewCategory] = useState<ProductCategory>('Sleep Aids');
  const [reviewVerified, setReviewVerified] = useState(true);
  const [isSavingReview, setIsSavingReview] = useState(false);

  const [deleteReviewCandidate, setDeleteReviewCandidate] = useState<VerifiedCustomerReview | null>(null);
  const [isDeletingReview, setIsDeletingReview] = useState(false);

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    setIsSavingReview(true);
    try {
      const newReview: VerifiedCustomerReview = {
        id: `rev-${Date.now()}`,
        author: reviewAuthor.trim(),
        location: reviewLocation.trim(),
        rating: Number(reviewRating) || 5,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        verifiedBuyer: reviewVerified,
        productName: reviewProductName.trim(),
        title: reviewTitle.trim() || 'Verified Patient Feedback',
        comment: reviewComment.trim(),
        category: reviewCategory
      };

      await addReviewToFirestore(newReview);
      await logAdminActivity(
        `Added verified review from ${reviewAuthor} (${reviewProductName})`,
        'Reviews',
        newReview.id
      );
      onReviewsUpdated();
      setIsReviewModalOpen(false);
    } catch (err) {
      console.error('Error saving review:', err);
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleToggleVerifiedBuyer = async (r: VerifiedCustomerReview) => {
    const updated: VerifiedCustomerReview = {
      ...r,
      verifiedBuyer: !r.verifiedBuyer
    };
    await addReviewToFirestore(updated);
    await logAdminActivity(
      `Toggled verified buyer status for review by ${r.author}`,
      'Reviews',
      r.id
    );
    onReviewsUpdated();
  };

  const handleDeleteReview = async () => {
    if (!deleteReviewCandidate) return;
    setIsDeletingReview(true);
    try {
      await deleteReviewFromFirestore(deleteReviewCandidate.id);
      await logAdminActivity(
        `Deleted review by ${deleteReviewCandidate.author}`,
        'Reviews',
        deleteReviewCandidate.id
      );
      onReviewsUpdated();
      setDeleteReviewCandidate(null);
    } catch (err) {
      console.error('Failed to delete review:', err);
    } finally {
      setIsDeletingReview(false);
    }
  };

  // -------------------------------------------------------------
  // FAQ STATE
  // -------------------------------------------------------------
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [isEditingFAQ, setIsEditingFAQ] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('Prescription & Delivery');
  const [faqOrder, setFaqOrder] = useState<number>(1);
  const [faqActive, setFaqActive] = useState(true);
  const [isSavingFAQ, setIsSavingFAQ] = useState(false);

  const [deleteFAQCandidate, setDeleteFAQCandidate] = useState<FAQItem | null>(null);
  const [isDeletingFAQ, setIsDeletingFAQ] = useState(false);

  const openAddFAQModal = () => {
    setIsEditingFAQ(false);
    setEditingFAQ(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('Prescription & Delivery');
    setFaqOrder(faqs.length + 1);
    setFaqActive(true);
    setIsFAQModalOpen(true);
  };

  const openEditFAQModal = (item: FAQItem) => {
    setIsEditingFAQ(true);
    setEditingFAQ(item);
    setFaqQuestion(item.question);
    setFaqAnswer(item.answer);
    setFaqCategory(item.category || 'General');
    setFaqOrder(item.order ?? 1);
    setFaqActive(item.active ?? true);
    setIsFAQModalOpen(true);
  };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    setIsSavingFAQ(true);
    try {
      const faqId = isEditingFAQ && editingFAQ ? editingFAQ.id : `faq-${Date.now()}`;
      const item: FAQItem = {
        id: faqId,
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        category: faqCategory.trim(),
        order: Number(faqOrder) || 1,
        active: faqActive
      };

      await saveFAQToFirestore(item);
      await logAdminActivity(
        isEditingFAQ ? `Edited FAQ: ${faqQuestion}` : `Created FAQ: ${faqQuestion}`,
        'FAQ',
        faqId
      );
      onFAQsUpdated();
      setIsFAQModalOpen(false);
    } catch (err) {
      console.error('Error saving FAQ:', err);
    } finally {
      setIsSavingFAQ(false);
    }
  };

  const handleToggleActiveFAQ = async (item: FAQItem) => {
    const updated: FAQItem = {
      ...item,
      active: !(item.active ?? true)
    };
    await saveFAQToFirestore(updated);
    onFAQsUpdated();
  };

  const handleMoveFAQ = async (item: FAQItem, dir: 'up' | 'down') => {
    const curr = item.order ?? 1;
    const newOrder = dir === 'up' ? Math.max(1, curr - 1) : curr + 1;
    const updated: FAQItem = { ...item, order: newOrder };
    await saveFAQToFirestore(updated);
    onFAQsUpdated();
  };

  const handleDeleteFAQ = async () => {
    if (!deleteFAQCandidate) return;
    setIsDeletingFAQ(true);
    try {
      await deleteFAQFromFirestore(deleteFAQCandidate.id);
      await logAdminActivity(
        `Deleted FAQ: ${deleteFAQCandidate.question}`,
        'FAQ',
        deleteFAQCandidate.id
      );
      onFAQsUpdated();
      setDeleteFAQCandidate(null);
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    } finally {
      setIsDeletingFAQ(false);
    }
  };

  // Filter logic
  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || r.author.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q) || r.productName.toLowerCase().includes(q);
  });

  const sortedFAQs = [...faqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const filteredFAQs = sortedFAQs.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#021811] border border-emerald-800/40 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">Patient Reviews & Clinical FAQ</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-semibold font-mono">
              Moderation Desk
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Moderate authentic patient testimonials, verify buyer status, and maintain clinical questions on the patient portal.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-[#01140e] p-1 rounded-xl border border-emerald-800/60 shrink-0">
          <button
            onClick={() => { setActiveSubTab('reviews'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'reviews'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-300/80 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews ({reviews.length})</span>
          </button>
          <button
            onClick={() => { setActiveSubTab('faq'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'faq'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-300/80 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQs ({faqs.length})</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: REVIEWS */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-4">
          {/* Action & Search */}
          <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews by patient, product, or keywords..."
                className="w-full bg-[#01140e] border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
              />
              <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-md cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Verified Review</span>
            </button>
          </div>

          {/* Reviews Table */}
          <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl overflow-hidden shadow-sm">
            {filteredReviews.length === 0 ? (
              <div className="py-16 text-center text-emerald-400/80 space-y-2">
                <Star className="w-10 h-10 text-emerald-700 mx-auto" />
                <div className="text-sm font-bold text-white">No reviews found</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#01140e] border-b border-emerald-800/50 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      <th className="p-4">Author & Location</th>
                      <th className="p-4">Rating & Product</th>
                      <th className="p-4">Review Content</th>
                      <th className="p-4">Buyer Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/40 text-xs text-emerald-200">
                    {filteredReviews.map((r) => (
                      <tr key={r.id} className="hover:bg-[#032117] transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white text-xs">{r.author}</div>
                          <div className="text-[10px] text-emerald-400/80">{r.location}</div>
                          <div className="text-[9px] text-emerald-600 font-mono mt-0.5">{r.date}</div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1 text-amber-400 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-emerald-900'}`}
                              />
                            ))}
                          </div>
                          <div className="font-semibold text-white text-xs">{r.productName}</div>
                          <div className="text-[10px] text-emerald-500/80">{r.category}</div>
                        </td>

                        <td className="p-4 max-w-md">
                          <div className="font-bold text-white text-xs mb-0.5">{r.title}</div>
                          <p className="text-[11px] text-emerald-300/80 leading-relaxed line-clamp-3">
                            "{r.comment}"
                          </p>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => handleToggleVerifiedBuyer(r)}
                            className="cursor-pointer"
                            title="Toggle Verified Buyer status"
                          >
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                r.verifiedBuyer
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>{r.verifiedBuyer ? 'Verified Buyer' : 'Unverified'}</span>
                            </span>
                          </button>
                        </td>

                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setDeleteReviewCandidate(r)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 transition-colors cursor-pointer"
                            title="Delete Review"
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
        </div>
      )}

      {/* Sub-tab 2: FAQ */}
      {activeSubTab === 'faq' && (
        <div className="space-y-4">
          <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clinical FAQs by question or answer..."
                className="w-full bg-[#01140e] border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
              />
              <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={openAddFAQModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-md cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New FAQ</span>
            </button>
          </div>

          <div className="bg-[#021811] border border-emerald-800/40 rounded-2xl overflow-hidden shadow-sm">
            {filteredFAQs.length === 0 ? (
              <div className="py-16 text-center text-emerald-400/80 space-y-2">
                <HelpCircle className="w-10 h-10 text-emerald-700 mx-auto" />
                <div className="text-sm font-bold text-white">No FAQ entries found</div>
              </div>
            ) : (
              <div className="divide-y divide-emerald-900/40">
                {filteredFAQs.map((f) => {
                  const isActive = f.active ?? true;

                  return (
                    <div
                      key={f.id}
                      className="p-4 sm:p-5 hover:bg-[#032117] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {f.category}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-500">Order: #{f.order ?? 1}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{f.question}</h4>
                        <p className="text-xs text-emerald-300/80 leading-relaxed max-w-2xl">{f.answer}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-start pt-1">
                        <button
                          onClick={() => handleMoveFAQ(f, 'up')}
                          className="p-1.5 rounded bg-[#01140e] hover:bg-emerald-900 text-emerald-300 border border-emerald-800 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveFAQ(f, 'down')}
                          className="p-1.5 rounded bg-[#01140e] hover:bg-emerald-900 text-emerald-300 border border-emerald-800 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleToggleActiveFAQ(f)}
                          className="cursor-pointer"
                          title="Toggle Active"
                        >
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {isActive ? 'Active' : 'Hidden'}
                          </span>
                        </button>
                        <button
                          onClick={() => openEditFAQModal(f)}
                          className="p-1.5 rounded-lg bg-[#03261a] hover:bg-[#053625] text-emerald-300 hover:text-white border border-emerald-700/50 cursor-pointer"
                          title="Edit FAQ"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteFAQCandidate(f)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 cursor-pointer"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-emerald-600/50 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-serif-heading">Record Verified Patient Review</h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">
                    Patient Name <span className="text-rose-400">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="e.g. David M."
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">UK Location:</label>
                  <input
                    type="text"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    placeholder="e.g. Manchester, UK"
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Rating (1 to 5 Stars):</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value) || 5)}
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Great</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Subpar</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Product Dispensed:</label>
                  <input
                    type="text"
                    required
                    value={reviewProductName}
                    onChange={(e) => setReviewProductName(e.target.value)}
                    placeholder="e.g. Zopiclone 7.5mg"
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Review Title:</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Prompt dispatch, genuine blister strips"
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">Review Comment / Feedback:</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Clinical experience, packaging discretion, and delivery time..."
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-800/40">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 text-xs font-semibold border border-emerald-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingReview}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingReview ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit FAQ Modal */}
      {isFAQModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-emerald-600/50 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-serif-heading">
                  {isEditingFAQ ? 'Edit FAQ Item' : 'Create New FAQ Item'}
                </h3>
              </div>
              <button
                onClick={() => setIsFAQModalOpen(false)}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFAQ} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-emerald-300 mb-1">
                  Question <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="e.g. How does discrete blister packaging work?"
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-300 mb-1">
                  Answer <span className="text-rose-400">*</span>:
                </label>
                <textarea
                  rows={4}
                  required
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Provide precise, reassuring pharmaceutical and delivery details..."
                  className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Category:</label>
                  <select
                    value={faqCategory}
                    onChange={(e) => setFaqCategory(e.target.value)}
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Prescription & Delivery">Prescription & Delivery</option>
                    <option value="Payment & Verification">Payment & Verification</option>
                    <option value="Safety & Quality">Safety & Quality</option>
                    <option value="Returns & Cancellation">Returns & Cancellation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-emerald-300 mb-1">Sort Order:</label>
                  <input
                    type="number"
                    min="1"
                    value={faqOrder}
                    onChange={(e) => setFaqOrder(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#01140e] border border-emerald-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-800/40">
                <button
                  type="button"
                  onClick={() => setIsFAQModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#03261a] hover:bg-[#043323] text-emerald-300 text-xs font-semibold border border-emerald-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingFAQ}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingFAQ ? 'Saving...' : isEditingFAQ ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation */}
      {deleteReviewCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-rose-600/50 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-sm font-bold text-white">Delete Review</h3>
            </div>
            <p className="text-xs text-emerald-200">
              Permanently remove review from <span className="font-bold text-white">{deleteReviewCandidate.author}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteReviewCandidate(null)}
                className="px-4 py-2 rounded-xl bg-[#03261a] text-emerald-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                disabled={isDeletingReview}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                {isDeletingReview ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete FAQ Confirmation */}
      {deleteFAQCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#021811] border border-rose-600/50 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-sm font-bold text-white">Delete FAQ</h3>
            </div>
            <p className="text-xs text-emerald-200">
              Permanently delete FAQ: <span className="font-bold text-white">"{deleteFAQCandidate.question}"</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteFAQCandidate(null)}
                className="px-4 py-2 rounded-xl bg-[#03261a] text-emerald-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFAQ}
                disabled={isDeletingFAQ}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                {isDeletingFAQ ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
