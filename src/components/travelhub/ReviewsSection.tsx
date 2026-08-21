import { useState } from 'react';
import { Star, Quote, X, Send } from 'lucide-react';

const testimonials = [
  {
    id: '1',
    author: 'Priya Malhotra',
    location: 'Mumbai, India',
    quote: 'Their Kashmir circuit combined shikara sunsets, Gulmarg gondola slots, and Srinagar cafes without me lifting a finger.',
    rating: 5,
  },
  {
    id: '2',
    author: 'Arjun Narayanan',
    location: 'Bengaluru, India',
    quote: 'Expense calculator + train/flight sync kept our Coorg workcation within ₹60k. Support team responded on WhatsApp in 3 minutes.',
    rating: 4.9,
  },
  {
    id: '3',
    author: 'Meera Kapoor',
    location: 'New Delhi, India',
    quote: 'Booked an all-girls Meghalaya trip—permits, homestays, and guides verified inside the app. Parents tracked us live.',
    rating: 5,
  },
];

const ReviewsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your feedback!');
    setIsModalOpen(false);
  };

  return (
    <section id="reviews" className="pt-16 relative">
      <div className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reviews & ratings</p>
        <h2 className="text-3xl font-semibold text-[#0f172a]">Loved by explorers</h2>
        <p className="text-slate-500">Pull in Google reviews via API and showcase curated testimonials.</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.id} className="rounded-3xl border border-slate-100 bg-white shadow-sm p-6 flex flex-col gap-4">
            <Quote className="text-[#06b6d4]/40" size={32} />
            <p className="text-slate-600">{testimonial.quote}</p>
            <div>
              <p className="font-semibold text-[#0f172a]">{testimonial.author}</p>
              <p className="text-sm text-slate-400">{testimonial.location}</p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  size={18}
                  className={idx < Math.round(testimonial.rating) ? 'text-[#fbbf24]' : 'text-slate-200'}
                  fill={idx < Math.round(testimonial.rating) ? '#fbbf24' : 'none'}
                />
              ))}
              <span className="text-sm text-slate-500">{testimonial.rating.toFixed(1)}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
        >
          <Star size={18} fill="currentColor" /> Rate Your Experience
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
            
            <h3 className="text-2xl font-bold text-[#0f172a] mb-2">Share Feedback</h3>
            <p className="text-slate-500 mb-6">How was your experience with DarShana?</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={32} 
                        className={star <= rating ? 'text-[#fbbf24]' : 'text-slate-200'} 
                        fill={star <= rating ? '#fbbf24' : 'none'} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20 outline-none transition-all resize-none"
                  placeholder="Tell us what you liked..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full py-3 bg-[#0f172a] text-white rounded-xl font-semibold hover:bg-[#0f172a]/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} /> Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
