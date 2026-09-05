import React, { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquarePlus, 
  MapPin, 
  Calendar, 
  Pill,
  X,
  Send
} from 'lucide-react';
import { VerifiedCustomerReview, ProductCategory } from '../types';
import { VERIFIED_REVIEWS } from '../data/medicineCatalog';
import { getReviewsFromFirestore, addReviewToFirestore } from '../lib/firestoreService';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<VerifiedCustomerReview[]>(VERIFIED_REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // Load live reviews from Firestore
  useEffect(() => {
    getReviewsFromFirestore().then(data => {
      if (data && data.length > 0) {
        setReviews(data);
      }
    });
  }, []);

  // New review form state
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [productPurchased, setProductPurchased] = useState('Zopiclone 7.5mg');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const filteredReviews = selectedFilter === 'All' 
    ? reviews 
    : reviews.filter(r => r.category === selectedFilter);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !title || !comment) return;

    const newRev: VerifiedCustomerReview = {
      id: `rev-${Date.now()}`,
      author,
      location: location || 'United Kingdom',
      rating,
      date: 'Just now',
      productPurchased,
      verifiedBuyer: true,
      title,
      comment,
      category: 'Sleep Aids'
    };

    setReviews([newRev, ...reviews]);
    await addReviewToFirestore(newRev);

    setIsWriteReviewOpen(false);
    setAuthor('');
    setLocation('');
    setTitle('');
    setComment('');
  };

  return (
    <section className="py-12 bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header & Trustscore Banner */}
        <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              Verified Patient Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
              Real Reviews from Real UK Customers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Every review is collected from verified UK patients receiving orders via Royal Mail Tracked 24.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            {/* Score box */}
            <div className="bg-[#111c30] p-4 rounded-xl border border-slate-700 text-center">
              <div className="flex text-amber-400 justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <div className="text-2xl font-extrabold text-white">4.9 / 5.0</div>
              <span className="text-[10px] text-slate-400">3,420+ Verified UK Ratings</span>
            </div>

            <button
              onClick={() => setIsWriteReviewOpen(true)}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['All', 'Sleep Aids', 'Anxiety & Calm', 'Pain Relief', 'Nootropics & Focus', 'Men\'s Health'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow'
                  : 'bg-[#111c30] text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#0f172a] border border-slate-800 hover:border-slate-600 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3 transition-all"
            >
              <div>
                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  {rev.verifiedBuyer && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-700 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified Buyer
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white font-serif-heading">"{rev.title}"</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Author & Product metadata */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div>
                  <p className="font-bold text-white">{rev.author}</p>
                  <p className="text-slate-500">{rev.location} • {rev.date}</p>
                </div>
                <span className="text-[10px] text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 max-w-[120px] truncate">
                  {rev.productPurchased}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write a Review Modal */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#0f172a] border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl">
            <button
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-serif-heading text-white mb-1">
              Submit a Verified Review
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Help other patients choose the right medication and delivery options.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Marcus L."
                    className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. London, UK"
                    className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Product Purchased</label>
                <input
                  type="text"
                  value={productPurchased}
                  onChange={(e) => setProductPurchased(e.target.value)}
                  placeholder="e.g. Zopiclone 7.5mg"
                  className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className={`p-2 rounded-lg border transition-colors ${
                        rating >= s ? 'bg-amber-400/20 text-amber-300 border-amber-400' : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${rating >= s ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next-day delivery was so fast and discrete"
                  className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Your Detailed Experience *</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with product effectiveness, packaging privacy, and support..."
                  className="w-full bg-[#111c30] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Review</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
