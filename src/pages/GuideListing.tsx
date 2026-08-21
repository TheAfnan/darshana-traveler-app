import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Languages, 
  Calendar, 
  Users, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Award, 
  Sparkles,
  Phone,
  Mail,
  Clock,
  Filter,
  ExternalLink,
  Zap,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass
} from 'lucide-react';
import { fetchAllApprovedGuidesSync, fetchAllGuides, submitGuideRequest, type Guide } from '../api/guides';

const POPULAR_DESTINATIONS = [
  'All India',
  'Agra',
  'Varanasi',
  'Jaipur',
  'Lucknow',
  'Delhi NCR',
  'Kerala',
  'Goa',
  'Hampi',
  'Kolkata'
];

export const GuideListing: React.FC = () => {
  // Initialize synchronously with instant data so user never sees blank or waiting screen!
  const [guides, setGuides] = useState<Guide[]>(() => fetchAllApprovedGuidesSync());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All India');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price-low' | 'price-high'>('rating');

  // Booking / Modal State
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [travelersCount, setTravelersCount] = useState(2);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const data = fetchAllApprovedGuidesSync();
    if (data && data.length > 0) {
      setGuides(data);
    }
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Filtered & Sorted Guides
  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        guide.name.toLowerCase().includes(q) ||
        guide.location.toLowerCase().includes(q) ||
        guide.bio.toLowerCase().includes(q) ||
        guide.specialties.some(s => s.toLowerCase().includes(q)) ||
        guide.languages.some(l => l.toLowerCase().includes(q))
      );

      const matchesCity = selectedDestination === 'All India' || (
        guide.location.toLowerCase().includes(selectedDestination.toLowerCase())
      );

      return matchesSearch && matchesCity;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'experience') return (b.experience || 0) - (a.experience || 0);
      if (sortBy === 'price-low') return (a.pricePerDay || 0) - (b.pricePerDay || 0);
      if (sortBy === 'price-high') return (b.pricePerDay || 0) - (a.pricePerDay || 0);
      return 0;
    });
  }, [guides, searchQuery, selectedDestination, sortBy]);

  const trendingGuides = useMemo(() => guides.slice(0, 5), [guides]);
  const featuredGuide = filteredGuides[0];
  const bentoRemainingGuides = filteredGuides.slice(1);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuide) return;

    setBookingSubmitting(true);
    try {
      await submitGuideRequest(
        selectedGuide._id,
        'official_booking',
        bookingMessage || `Booking inquiry for ${selectedGuide.name} on ${bookingDate || 'upcoming dates'} for ${travelersCount} travelers.`,
        localStorage.getItem('token') || '',
        {
          name: selectedGuide.name,
          email: selectedGuide.email,
          date: bookingDate,
          travelers: travelersCount
        }
      );
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedGuide(null);
        setBookingMessage('');
        setBookingDate('');
      }, 2000);
    } catch (err) {
      console.warn('Booking error:', err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans pb-20">

      {/* HEADER SECTION */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 border border-amber-200 text-amber-900">
                <ShieldCheck size={13} className="text-amber-700" />
                <span>Govt Certified Local Guides</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight leading-tight text-slate-900">
                Find Local Tour Guides in India
              </h1>
              
              <p className="text-sm sm:text-base leading-relaxed max-w-2xl text-slate-700 font-normal">
                Book verified local guides for monument tours, heritage walks, and city exploration across India.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 self-start md:self-end">
              <Link
                to="/become-guide"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-2xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Register as Guide</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* TOP RATED GUIDES CAROUSEL */}
      {trendingGuides.length > 0 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                Recommended
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Top Rated Guides
              </h2>
            </div>

            {/* Carousel Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-9 h-9 rounded-full border border-stone-200 bg-white text-slate-800 hover:bg-stone-100 flex items-center justify-center transition shadow-xs cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-9 h-9 rounded-full border border-stone-200 bg-white text-slate-800 hover:bg-stone-100 flex items-center justify-center transition shadow-xs cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingGuides.map((guide) => (
              <div
                key={`carousel-${guide._id}`}
                onClick={() => setSelectedGuide(guide)}
                className="snap-start shrink-0 w-[280px] sm:w-[320px] h-[400px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={guide.profileImage}
                  alt={guide.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-95" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded-full shadow-sm">
                    Top Rated
                  </span>
                  <div className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold rounded-full flex items-center gap-1 border border-white/10">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{guide.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white space-y-2 z-10">
                  <p className="text-[11px] text-amber-400 uppercase flex items-center gap-1 font-bold">
                    <MapPin size={11} /> {guide.location}
                  </p>
                  
                  <h3 className="text-xl font-serif font-bold text-white">
                    {guide.name}
                  </h3>

                  <p className="text-xs text-slate-200 line-clamp-2 font-normal">
                    {guide.bio}
                  </p>

                  <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-300 block">Rate</span>
                      <span className="font-bold text-white text-sm">₹{guide.pricePerDay || 1500} / day</span>
                    </div>
                    <span className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm">
                      <span>Book</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="sticky top-16 sm:top-20 z-30 backdrop-blur-md bg-[#faf9f6]/95 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guide by name, city, language, monument (e.g. Agra, Taj Mahal, French)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs font-medium focus:outline-none transition border bg-white border-stone-300 text-slate-900 placeholder:text-stone-400 focus:border-amber-600 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl text-xs font-semibold border border-stone-300 bg-white text-slate-800 shadow-2xs focus:outline-none cursor-pointer"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* City Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest}
                onClick={() => setSelectedDestination(dest)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  selectedDestination === dest
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-slate-800 hover:bg-stone-100 shadow-2xs'
                }`}
              >
                {dest}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* GUIDES DIRECTORY GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700">
            <Compass size={14} className="text-amber-600" />
            <span>Available Guides</span>
          </span>
          <span className="font-semibold text-slate-600">
            {filteredGuides.length} Guides Found
          </span>
        </div>

        {filteredGuides.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-stone-200 bg-white p-8 space-y-4 shadow-sm">
            <MapPin size={36} className="text-amber-500/60 mx-auto" />
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-slate-900">
                No Guides Found
              </h3>
              <p className="text-xs text-slate-500">
                Try searching for another city or clear the search filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDestination('All India');
              }}
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Featured Guide Card */}
            {featuredGuide && (
              <div
                onClick={() => setSelectedGuide(featuredGuide)}
                className="md:col-span-2 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative h-[440px] group cursor-pointer border border-stone-200"
              >
                <img
                  src={featuredGuide.profileImage}
                  alt={featuredGuide.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-95" />

                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold uppercase rounded-full shadow-md">
                      Featured Guide
                    </span>
                    <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[11px] font-bold rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} />
                      <span>Govt Verified</span>
                    </span>
                  </div>

                  <div className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold rounded-full flex items-center gap-1 border border-white/10">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{featuredGuide.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-300 font-normal">({featuredGuide.reviews} reviews)</span>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-3 z-10">
                  <div className="flex items-center gap-3 text-xs text-amber-400 font-bold">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {featuredGuide.location}
                    </span>
                    <span>•</span>
                    <span>{featuredGuide.experience} Years Experience</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {featuredGuide.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-200 max-w-2xl line-clamp-2 font-normal">
                    {featuredGuide.bio}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {featuredGuide.specialties.map((s, i) => (
                      <span key={i} className="px-2.5 py-0.5 bg-white/20 text-white text-[11px] font-medium rounded-lg">
                        {s}
                      </span>
                    ))}
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-medium rounded-lg flex items-center gap-1">
                      <Zap size={11} /> Replies in {featuredGuide.responseTime || '< 1h'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-300 uppercase block">Daily Rate</span>
                      <p className="text-lg font-bold text-white">
                        ₹{featuredGuide.pricePerDay} <span className="text-xs font-normal text-slate-300">/ day</span>
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGuide(featuredGuide);
                      }}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>Book Guide</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Other Guide Cards */}
            {bentoRemainingGuides.map((guide) => (
              <div
                key={guide._id}
                onClick={() => setSelectedGuide(guide)}
                className="rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative h-[420px] group cursor-pointer border border-stone-200 flex flex-col justify-end"
              >
                <img
                  src={guide.profileImage}
                  alt={guide.name}
                  loading="lazy"
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-95" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1 border border-white/10">
                    <ShieldCheck size={11} />
                    <span>Verified</span>
                  </span>

                  <div className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold rounded-full flex items-center gap-1 border border-white/10">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{guide.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-5 text-white space-y-2 relative z-10">
                  <p className="text-[11px] text-amber-400 uppercase flex items-center gap-1 font-bold">
                    <MapPin size={11} /> {guide.location}
                  </p>

                  <h3 className="text-xl font-serif font-bold text-white">
                    {guide.name}
                  </h3>

                  <p className="text-xs text-slate-200 line-clamp-2 font-normal">
                    {guide.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {guide.specialties.slice(0, 2).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-medium rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-300 uppercase block">Daily Rate</span>
                      <span className="font-bold text-white text-sm">₹{guide.pricePerDay || 1500} / day</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGuide(guide);
                      }}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Book</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}

      </main>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => !bookingSubmitting && setSelectedGuide(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 my-8 text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className="relative h-56 bg-slate-950 overflow-hidden">
                <img
                  src={selectedGuide.profileImage}
                  alt={selectedGuide.name}
                  className="w-full h-full object-cover filter brightness-90"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-6 flex flex-col justify-between" />

                <button
                  onClick={() => setSelectedGuide(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 backdrop-blur-md text-white hover:bg-white hover:text-slate-950 flex items-center justify-center transition shadow-md cursor-pointer z-10"
                >
                  <X size={16} />
                </button>

                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>Govt Certified</span>
                  </span>
                  <span className="px-2.5 py-1 bg-slate-950/80 text-amber-300 text-xs font-bold rounded-full flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{selectedGuide.rating.toFixed(1)}</span>
                  </span>
                </div>

                <div className="absolute bottom-4 left-6 right-6 text-white z-10 space-y-1">
                  <p className="text-xs text-amber-400 flex items-center gap-1 font-bold">
                    <MapPin size={12} /> {selectedGuide.location}
                  </p>
                  <h2 className="text-2xl font-serif font-bold text-white">
                    {selectedGuide.name}
                  </h2>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
                
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">
                    About the Guide
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                    {selectedGuide.bio}
                  </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 text-center">
                    <span className="text-[10px] text-slate-400 block">Experience</span>
                    <span className="font-bold">{selectedGuide.experience || 5} Years</span>
                  </div>
                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 text-center">
                    <span className="text-[10px] text-slate-400 block">Languages</span>
                    <span className="font-bold truncate block">{selectedGuide.languages.slice(0, 2).join(', ')}</span>
                  </div>
                  <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 text-center">
                    <span className="text-[10px] text-slate-400 block">Response</span>
                    <span className="font-bold">{selectedGuide.responseTime || '< 1h'}</span>
                  </div>
                </div>

                {/* Booking Form */}
                {bookingSuccess ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                    <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-base text-slate-900">Request Sent!</h4>
                    <p className="text-xs text-slate-500">
                      {selectedGuide.name} will contact you shortly to confirm your booking.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="pt-3 border-t border-stone-200 space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-900">
                      Book Tour with {selectedGuide.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          Tour Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none bg-stone-50 border-stone-200 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-700">
                          Number of Persons *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={travelersCount}
                          onChange={(e) => setTravelersCount(Number(e.target.value))}
                          className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none bg-stone-50 border-stone-200 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700">
                        Special Request / Places you want to visit
                      </label>
                      <textarea
                        rows={2}
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                        placeholder="e.g. Taj Mahal sunrise, local food tasting, photo spots..."
                        className="w-full px-3 py-2 border rounded-xl text-xs placeholder:text-stone-400 focus:outline-none bg-stone-50 border-stone-200 text-slate-900"
                      />
                    </div>

                    <div className="p-3 border rounded-xl flex items-center justify-between text-xs bg-amber-50 border-amber-200 text-amber-950">
                      <span className="font-bold">Guide Fee:</span>
                      <span className="font-extrabold text-sm">₹{selectedGuide.pricePerDay || 1500} / day</span>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedGuide(null)}
                        className="px-4 py-2 border text-xs font-semibold rounded-xl transition cursor-pointer border-stone-200 text-slate-700 hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={bookingSubmitting}
                        className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>{bookingSubmitting ? 'Sending...' : 'Confirm Booking'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </form>
                )}

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GuideListing;
