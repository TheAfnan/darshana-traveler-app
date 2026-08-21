import React, { useState } from 'react';
import { Star, Quote, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    id: '1',
    author: 'Priya Malhotra',
    location: 'Mumbai, Maharashtra',
    circuit: 'Kashmir Paradise Expedition',
    quote: 'Our Kashmir circuit combined serene Nigeen houseboat sunsets, Gulmarg gondola slots, and traditional Wazwan dinners effortlessly. The local guide was knowledgeable and punctual.',
    rating: 5,
  },
  {
    id: '2',
    author: 'Arjun Narayanan',
    location: 'Bengaluru, Karnataka',
    circuit: 'Royal Rajasthan Heritage',
    quote: 'Lake Pichola sunset boat ride and the desert camp under starlit Thar dunes were unforgettable. Genuine boutique stays and transparent pricing throughout.',
    rating: 4.9,
  },
  {
    id: '3',
    author: 'Meera Kapoor',
    location: 'New Delhi, Delhi NCR',
    circuit: 'Varanasi Sacred Heritage Trail',
    quote: 'Dawn hand-rowed boat on River Ganga and reserved Dashashwamedh Aarti seating made this trip deeply spiritual. Everything was verified and hassle-free.',
    rating: 5,
  },
];

const ReviewsSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitted(false);
    }, 1500);
  };

  return (
    <section id="reviews" className="pt-8 pb-4 relative font-sans">
      <div className="text-center space-y-2 max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 self-center shadow-2xs">
          <Sparkles size={13} className="text-amber-600" /> VERIFIED TRAVELER VOICES
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
          Loved by Cultural Explorers
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          Real feedback from travelers who booked our signature expeditions across India.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article 
            key={testimonial.id} 
            className="rounded-3xl border border-stone-200/80 bg-white shadow-xs p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Quote className="text-amber-500/40" size={28} />
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 text-xs">
                  <Star className="text-amber-500 fill-amber-500" size={13} />
                  <span className="font-bold text-stone-900">{testimonial.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed italic">
                "{testimonial.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-900 text-sm">{testimonial.author}</p>
                <p className="text-[11px] text-stone-500">{testimonial.location}</p>
              </div>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                {testimonial.circuit}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
        >
          <Star size={14} className="text-amber-400 fill-amber-400" /> Share Your Experience
        </button>
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-stone-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full text-stone-500 transition cursor-pointer"
            >
              <X size={18} />
            </button>
            
            {!submitted ? (
              <>
                <h3 className="text-xl font-bold font-serif text-stone-900 mb-1">Share Your Experience</h3>
                <p className="text-xs text-stone-500 mb-5">How was your journey with DarShana Expeditions?</p>
                
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1.5">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star 
                            size={26} 
                            className={star <= rating ? 'text-amber-400' : 'text-stone-200'} 
                            fill={star <= rating ? '#f59e0b' : 'none'} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:border-amber-600 outline-none transition text-xs"
                      placeholder="e.g. Aditi Sharma"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your Feedback / Review</label>
                    <textarea 
                      required
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:border-amber-600 outline-none transition text-xs resize-none"
                      placeholder="Tell us what made your trip special..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Send size={14} /> Submit Feedback
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold font-serif text-stone-900">Thank You!</h4>
                <p className="text-xs text-stone-600">Your review has been submitted successfully.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
