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
  Filter
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

export const GuideListing: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
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
    try {
      const data = await fetchAllGuides();
      setGuides(data);
    } catch (err) {
      console.warn('Error loading guides:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique languages from all guides
  const availableLanguages = useMemo(() => {
    const langSet = new Set<string>();
    guides.forEach(g => (g.languages || []).forEach(l => langSet.add(l)));
    return ['All Languages', ...Array.from(langSet)];
  }, [guides]);

  // Filtered & Sorted Guides
  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      // 1. Search Query (matches name, location, specialties, bio, or languages)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        guide.name.toLowerCase().includes(q) ||
        guide.location.toLowerCase().includes(q) ||
        guide.bio.toLowerCase().includes(q) ||
        guide.specialties.some(s => s.toLowerCase().includes(q)) ||
        guide.languages.some(l => l.toLowerCase().includes(q))
      );

      // 2. City / Destination Filter
      const matchesCity = selectedDestination === 'All India' || (
        guide.location.toLowerCase().includes(selectedDestination.toLowerCase())
      );

      // 3. Specialty Filter
      const matchesSpecialty = selectedSpecialty === 'All Specialties' || (
        guide.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))
      );

      // 4. Language Filter
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
        bookingMessage || `Interested in hiring ${selectedGuideForBooking.name} on ${bookingDate || 'upcoming dates'} for ${travelersCount} travelers.`,
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
      }, 2400);
    } catch (err) {
      console.warn('Booking inquiry submit error:', err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
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
            Connect directly with licensed archaeologists, native historians, and storytellers who bring India's monuments, folklore, and street culture to life.
          </p>
        </div>

        {/* Search & Comprehensive Filters Bar */}
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
              <span className="text-stone-400">{filteredGuides.length} Verified Guides Available</span>
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

          {/* Secondary Filters: Specialty, Language, Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
            {/* Specialty Dropdown */}
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

            {/* Language Dropdown */}
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

            {/* Sort Order */}
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

        {/* Guides Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading verified Indian guides directory...</p>
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <MapPin size={36} className="text-amber-500/60 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Guides Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find guides matching your exact filters. Try clearing your search or switching regions.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDestination('All India');
                setSelectedSpecialty('All Specialties');
                setSelectedLanguage('All Languages');
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <motion.div
                key={guide._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Guide Card Header */}
                <div>
                  <div className="relative h-60 overflow-hidden bg-slate-900">
                    <img
                      src={guide.profileImage}
                      alt={guide.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {/* Govt Verified Badge */}
                    <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <ShieldCheck size={12} />
                      <span>Govt Certified</span>
                    </div>

                    {/* Rating Pill */}
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 shadow-sm">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{guide.rating.toFixed(1)}</span>
                      {guide.reviews > 0 && (
                        <span className="text-[10px] text-slate-300 font-normal">({guide.reviews})</span>
                      )}
                    </div>

                    {/* Name & Location Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-lg font-bold font-serif leading-tight">{guide.name}</h3>
                      <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5 opacity-90">
                        <MapPin size={12} className="text-amber-400 shrink-0" />
                        <span>{guide.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4">
                    {/* Bio */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {guide.bio}
                    </p>

                    {/* Specialties Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {guide.specialties.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 bg-amber-50 border border-amber-200/60 text-amber-900 text-[11px] font-medium rounded-lg"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Languages & Experience stats */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Languages size={13} className="text-stone-400" />
                        <span className="truncate max-w-[140px]">{guide.languages.join(', ')}</span>
                      </div>
                      {guide.experience && (
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <Clock size={12} className="text-amber-600" />
                          <span>{guide.experience} yrs exp</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer with Price & Booking Button */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Daily Rate</span>
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
              For Certified Historians & Local Experts
            </span>
            <h3 className="text-2xl font-serif font-bold">Are you a Certified Tour Guide in India?</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join DarShana's verified heritage network. Register your profile, connect with global cultural travelers, and manage your bookings seamlessly.
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

      {/* Direct Booking Modal */}
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
                    {selectedGuideForBooking.name} has received your booking request and will confirm availability via email/phone shortly.
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
                      placeholder="e.g. We are visiting the Taj Mahal at sunrise, interested in architecture and local food trails..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 placeholder:text-stone-400 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs text-amber-900">
                    <span className="font-medium">Estimated Guide Fee:</span>
                    <span className="font-bold text-sm">₹{selectedGuideForBooking.pricePerDay || 1500} / day</span>
                  </div>

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
                      <span>{bookingSubmitting ? 'Sending Request...' : 'Confirm Inquiry'}</span>
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
