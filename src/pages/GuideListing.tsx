import React, { useState, useEffect, useMemo } from 'react';
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
  Check
} from 'lucide-react';
import { fetchAllGuides, submitGuideRequest, type Guide } from '../api/guides';

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

const SPECIALTIES_LIST = [
  'All Specialties',
  'Mughal Architecture',
  'Heritage Walks',
  'Spiritual Philosophy',
  'Forts & Palaces',
  'Awadhi Royal Cuisine',
  'Backwaters Eco-Trails',
  'Photography'
];

// Shimmer Skeleton Card Component
const GuideCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs animate-pulse flex flex-col justify-between h-[480px]">
    <div>
      <div className="h-56 bg-stone-200" />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-4 bg-stone-200 rounded w-1/4" />
        </div>
        <div className="h-3 bg-stone-200 rounded w-full" />
        <div className="h-3 bg-stone-200 rounded w-4/5" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 bg-stone-200 rounded-md w-16" />
          <div className="h-5 bg-stone-200 rounded-md w-20" />
        </div>
      </div>
    </div>
    <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
      <div className="h-6 bg-stone-200 rounded w-20" />
      <div className="h-8 bg-stone-200 rounded-xl w-24" />
    </div>
  </div>
);

export const GuideListing: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All India');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price-low' | 'price-high'>('rating');

  // Booking / Inquiry Modal State
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState<Guide | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [travelersCount, setTravelersCount] = useState(2);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllGuides();
      setGuides(data);
    } catch (err) {
      console.warn('Error loading guides:', err);
      setError('Unable to load guides directory. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique languages
  const availableLanguages = useMemo(() => {
    const langSet = new Set<string>();
    guides.forEach(g => (g.languages || []).forEach(l => langSet.add(l)));
    return ['All Languages', ...Array.from(langSet)];
  }, [guides]);

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

      const matchesSpecialty = selectedSpecialty === 'All Specialties' || (
        guide.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))
      );

      const matchesLanguage = selectedLanguage === 'All Languages' || (
        guide.languages.includes(selectedLanguage)
      );

      return matchesSearch && matchesCity && matchesSpecialty && matchesLanguage;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'experience') return (b.experience || 0) - (a.experience || 0);
      if (sortBy === 'price-low') return (a.pricePerDay || 0) - (b.pricePerDay || 0);
      if (sortBy === 'price-high') return (b.pricePerDay || 0) - (a.pricePerDay || 0);
      return 0;
    });
  }, [guides, searchQuery, selectedDestination, selectedSpecialty, selectedLanguage, sortBy]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuideForBooking) return;

    setBookingSubmitting(true);
    try {
      await submitGuideRequest(
        selectedGuideForBooking._id,
        'official_booking',
        bookingMessage || `Interested in booking ${selectedGuideForBooking.name} on ${bookingDate || 'upcoming dates'} for ${travelersCount} travelers.`,
        localStorage.getItem('token') || '',
        {
          name: selectedGuideForBooking.name,
          email: selectedGuideForBooking.email,
          date: bookingDate,
          travelers: travelersCount
        }
      );
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedGuideForBooking(null);
        setBookingMessage('');
        setBookingDate('');
      }, 2200);
    } catch (err) {
      console.warn('Booking inquiry submit error:', err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-amber-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Hero Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-xs font-semibold shadow-2xs">
            <Award size={13} className="text-amber-700" />
            <span>Ministry of Tourism & Heritage Certified Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Certified Indian Local Guides
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Connect directly with licensed archaeologists, native historians, and storytellers who bring India's monuments, folklore, and living traditions to life.
          </p>
        </div>

        {/* Search & SaaS Filter Controls */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
          
          {/* Main Search Input */}
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Guide Name, Monument, City, Language (e.g. Agra, Taj Mahal, French, Awadhi Cuisine)..."
              className="w-full pl-12 pr-10 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Destination Quick Filters */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={13} className="text-amber-600" />
                Filter by Region / City:
              </span>
              <span className="text-stone-400 font-medium">
                {filteredGuides.length} Verified Guides Available
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest}
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedDestination === dest
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 border border-stone-200 text-slate-700'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Specialization</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                {SPECIALTIES_LIST.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Spoken Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="rating">Highest Rated (★ 5.0)</option>
                <option value="experience">Most Experienced</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Guides Grid / Shimmer Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <GuideCardSkeleton key={k} />
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-rose-200 p-8 space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <RotateCcw size={22} />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-900">Failed to Load Guides</h3>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
            <button
              onClick={loadGuides}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-xs">
            <MapPin size={36} className="text-amber-500/60 mx-auto" />
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-slate-900">No Guides Found</h3>
              <p className="text-xs text-slate-500">
                We couldn't find guides matching your exact filters. Try broadening your search or resetting filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDestination('All India');
                setSelectedSpecialty('All Specialties');
                setSelectedLanguage('All Languages');
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGuides.map((guide, idx) => (
              <motion.div
                key={guide._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Guide Card Header */}
                <div>
                  <div className="relative h-60 overflow-hidden bg-slate-900">
                    <img
                      src={guide.profileImage}
                      alt={guide.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    
                    {/* Govt Verified Shield Badge */}
                    <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <ShieldCheck size={12} />
                      <span>Govt Certified</span>
                    </div>

                    {/* Rating Pill */}
                    <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 shadow-sm">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{guide.rating.toFixed(2)}</span>
                      {guide.reviews > 0 && (
                        <span className="text-[10px] text-slate-300 font-normal">({guide.reviews})</span>
                      )}
                    </div>

                    {/* Photographer Attribution (Per Unsplash/Pexels API Guidelines) */}
                    {guide.photoAttribution && (
                      <div className="absolute top-12 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={guide.photoAttribution.photographerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] text-white/90 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md hover:underline flex items-center gap-1"
                        >
                          Photo by {guide.photoAttribution.photographerName} on {guide.photoAttribution.platform}
                        </a>
                      </div>
                    )}

                    {/* Name & Location Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 text-white space-y-0.5">
                      <h3 className="text-base sm:text-lg font-bold font-serif leading-tight">{guide.name}</h3>
                      <p className="text-xs text-slate-200 flex items-center gap-1 opacity-90 font-medium">
                        <MapPin size={12} className="text-amber-400 shrink-0" />
                        <span>{guide.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 space-y-3.5">
                    
                    {/* Bio */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {guide.bio}
                    </p>

                    {/* Specialties Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {guide.specialties.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-amber-50 border border-amber-200/60 text-amber-900 text-[10px] font-semibold rounded-md"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Tour Formats & Response Time Badge */}
                    <div className="space-y-1.5 pt-1">
                      {guide.tourFormats && guide.tourFormats.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Check size={12} className="text-emerald-600 shrink-0" />
                          <span className="truncate">{guide.tourFormats[0]}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Zap size={12} className="text-amber-600 shrink-0" />
                        <span>Responds in {guide.responseTime || '< 1 hour'}</span>
                      </div>
                    </div>

                    {/* Languages & Experience stats */}
                    <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1 truncate max-w-[130px]" title={guide.languages.join(', ')}>
                        <Languages size={13} className="text-stone-400 shrink-0" />
                        <span className="truncate">{guide.languages.join(', ')}</span>
                      </div>
                      {guide.experience && (
                        <div className="flex items-center gap-1 font-semibold text-slate-700 shrink-0">
                          <Clock size={12} className="text-amber-600" />
                          <span>{guide.experience}y exp</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer with Daily Rate & CTA */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">From</span>
                    <p className="text-sm font-bold text-slate-900">
                      ₹{guide.pricePerDay || 1500}
                      <span className="text-[11px] font-normal text-slate-500"> / day</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedGuideForBooking(guide)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Book Guide</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}

        {/* Become a Guide CTA Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full inline-block">
              For Certified Historians & Tour Leaders
            </span>
            <h3 className="text-2xl font-serif font-bold">Are you a Licensed Guide in India?</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join DarShana's verified heritage network. Showcase your storytelling credentials, set your daily rates, and connect with cultural travelers worldwide.
            </p>
          </div>
          <Link
            to="/become-guide"
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold text-xs rounded-2xl shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Register as Guide</span>
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>

      {/* Direct Booking & Inquiry Modal */}
      <AnimatePresence>
        {selectedGuideForBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={() => !bookingSubmitting && setSelectedGuideForBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedGuideForBooking.profileImage}
                    alt={selectedGuideForBooking.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <h4 className="font-bold text-base">{selectedGuideForBooking.name}</h4>
                    <p className="text-xs text-slate-300 flex items-center gap-1">
                      <MapPin size={11} className="text-amber-400" />
                      {selectedGuideForBooking.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGuideForBooking(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Form */}
              {bookingSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Inquiry Sent Successfully!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    {selectedGuideForBooking.name} has received your booking inquiry and will confirm availability via email/phone within {selectedGuideForBooking.responseTime || '1 hour'}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Travel Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Travelers Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={travelersCount}
                        onChange={(e) => setTravelersCount(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferences / Message for Guide
                    </label>
                    <textarea
                      rows={3}
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value)}
                      placeholder="e.g. Visiting Taj Mahal at sunrise, interested in architecture, acoustics, and heritage bazaar walk..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 placeholder:text-stone-400 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs text-amber-900">
                    <div>
                      <span className="font-semibold block">Official Guide Fee:</span>
                      <span className="text-[10px] text-amber-800 opacity-90">Govt ID: {selectedGuideForBooking.govtId}</span>
                    </div>
                    <span className="font-bold text-sm">₹{selectedGuideForBooking.pricePerDay || 1500} / day</span>
                  </div>

                  {/* Photo Attribution Footer */}
                  {selectedGuideForBooking.photoAttribution && (
                    <p className="text-[10px] text-slate-400 text-center">
                      Portrait photo by {selectedGuideForBooking.photoAttribution.photographerName} on {selectedGuideForBooking.photoAttribution.platform}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedGuideForBooking(null)}
                      className="px-4 py-2 border border-stone-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-stone-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingSubmitting}
                      className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>{bookingSubmitting ? 'Submitting...' : 'Confirm Inquiry'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GuideListing;
