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
  Sun,
  Moon,
  Compass
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

// Shimmer Skeleton Card Component matching Bento Layout
const GuideCardSkeleton: React.FC<{ isLarge?: boolean; isDarkMode?: boolean }> = ({ isLarge, isDarkMode }) => (
  <div className={`rounded-3xl border overflow-hidden shadow-xs animate-pulse flex flex-col justify-end p-6 relative ${
    isDarkMode 
      ? 'border-slate-800 bg-slate-900' 
      : 'border-stone-200 bg-stone-100'
  } ${isLarge ? 'md:col-span-2 h-[460px]' : 'h-[420px]'}`}>
    <div className="space-y-3 z-10 w-full">
      <div className={`h-4 rounded-full w-24 ${isDarkMode ? 'bg-slate-700' : 'bg-stone-300'}`} />
      <div className={`h-7 rounded-lg w-2/3 ${isDarkMode ? 'bg-slate-700' : 'bg-stone-300'}`} />
      <div className={`h-3.5 rounded-md w-full ${isDarkMode ? 'bg-slate-700' : 'bg-stone-300'}`} />
      <div className={`h-3.5 rounded-md w-4/5 ${isDarkMode ? 'bg-slate-700' : 'bg-stone-300'}`} />
      <div className="flex items-center justify-between pt-3 border-t border-stone-300/40">
        <div className={`h-5 rounded w-20 ${isDarkMode ? 'bg-slate-700' : 'bg-stone-300'}`} />
        <div className={`h-8 rounded-xl w-24 ${isDarkMode ? 'bg-slate-700' : 'bg-stone-300'}`} />
      </div>
    </div>
  </div>
);

export const GuideListing: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All India');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
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

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
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
        bookingMessage || `Interested in booking ${selectedGuide.name} on ${bookingDate || 'upcoming dates'} for ${travelersCount} travelers.`,
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
      }, 2200);
    } catch (err) {
      console.warn('Booking inquiry submit error:', err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans pb-20 ${
      isDarkMode ? 'bg-[#080c14] text-slate-100' : 'bg-[#faf9f6] text-slate-900'
    }`}>

      {/* TOP EDITORIAL HERO HEADER */}
      <div className={`relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b overflow-hidden ${
        isDarkMode 
          ? 'bg-[#080c14] border-slate-800' 
          : 'bg-white border-stone-200'
      }`}>
        
        {isDarkMode && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
        )}

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold ${
                isDarkMode 
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' 
                  : 'bg-amber-100 border border-amber-200 text-amber-900'
              }`}>
                <Sparkles size={13} className={isDarkMode ? 'text-amber-400' : 'text-amber-700'} />
                <span>Editorial Heritage Expeditions • Condé Nast & NatGeo Standard</span>
              </div>
              
              <h1 className={`text-3xl sm:text-6xl font-serif font-extrabold tracking-tight leading-[1.1] ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Stories Etched in Stone & Spirit
              </h1>
              
              <p className={`text-sm sm:text-base leading-relaxed max-w-2xl font-normal ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Discover private cultural journeys led by licensed archaeologists, royal historians, and native storytellers who unveil the living heartbeat of India.
              </p>
            </div>

            {/* Cinematic Night Mode & Action Bar */}
            <div className="flex items-center gap-3 self-start md:self-end">
              <button
                onClick={() => setIsDarkMode(prev => !prev)}
                className={`px-3.5 py-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold cursor-pointer shadow-xs ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800' 
                    : 'bg-stone-100 border-stone-200 text-slate-800 hover:bg-stone-200'
                }`}
                title={isDarkMode ? 'Switch to Ivory Light Mode' : 'Switch to Cinematic Dark Mode'}
              >
                {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
                <span>{isDarkMode ? 'Ivory Mode' : 'Cinematic Dark'}</span>
              </button>

              <Link
                to="/become-guide"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-2xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Join as Guide</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION: TRENDING GUIDES & EDITOR'S PICKS CAROUSEL */}
      {!loading && !error && trendingGuides.length > 0 && (
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                Curated Highlights
              </span>
              <h2 className={`text-xl sm:text-2xl font-serif font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Editor's Choice & Trending Storytellers
              </h2>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition shadow-xs cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800' 
                    : 'bg-white border-stone-200 text-slate-800 hover:bg-stone-100'
                }`}
                aria-label="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition shadow-xs cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800' 
                    : 'bg-white border-stone-200 text-slate-800 hover:bg-stone-100'
                }`}
                aria-label="Next Slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll-Snap Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingGuides.map((guide) => (
              <div
                key={`carousel-${guide._id}`}
                onClick={() => setSelectedGuide(guide)}
                className="snap-start shrink-0 w-[300px] sm:w-[350px] h-[440px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
              >
                {/* Full Bleed Image with Ken Burns Hover */}
                <img
                  src={guide.profileImage}
                  alt={guide.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform filter brightness-90"
                />
                
                {/* Dark Vignette Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-95" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                    Editor's Pick
                  </span>
                  <div className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold rounded-full flex items-center gap-1 border border-white/10">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{guide.rating.toFixed(2)}</span>
                  </div>
                </div>

                {/* Bottom Content Directly Overlaid in High-Contrast White */}
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-2 z-10">
                  <p className="text-[11px] font-mono tracking-widest text-amber-400 uppercase flex items-center gap-1">
                    <MapPin size={11} /> {guide.location}
                  </p>
                  
                  <h3 className="text-xl sm:text-2xl font-serif font-bold leading-snug tracking-tight text-white">
                    {guide.name}
                  </h3>

                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal">
                    {guide.bio}
                  </p>

                  <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-300 block font-normal">From</span>
                      <span className="font-bold text-white text-sm">₹{guide.pricePerDay || 1500} <span className="text-[10px] font-normal text-slate-300">/ day</span></span>
                    </div>
                    <span className="px-3.5 py-1.5 bg-white/20 hover:bg-white text-white hover:text-slate-950 text-xs font-bold rounded-xl backdrop-blur-md transition flex items-center gap-1 shadow-sm">
                      <span>Reserve</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STICKY FILTER & SEARCH BAR */}
      <div className={`sticky top-16 sm:top-20 z-30 backdrop-blur-md border-y transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#080c14]/95 border-slate-800' 
          : 'bg-[#faf9f6]/95 border-stone-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Guide Name, Monument, City, Language (e.g. Taj Mahal, French, Awadhi)..."
                className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs font-medium focus:outline-none transition border ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 focus:border-amber-400' 
                    : 'bg-white border-stone-300 text-slate-900 placeholder:text-stone-400 focus:border-amber-600 shadow-2xs'
                }`}
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

            {/* Quick Sort Filter */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`w-full sm:w-auto px-3.5 py-2.5 rounded-2xl text-xs font-semibold border focus:outline-none cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-700 text-white' 
                    : 'bg-white border-stone-300 text-slate-800 shadow-2xs'
                }`}
              >
                <option value="rating">Top Rated (★ 5.0)</option>
                <option value="experience">Most Experienced</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Destination Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest}
                onClick={() => setSelectedDestination(dest)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  selectedDestination === dest
                    ? isDarkMode
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                      ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border border-stone-200 text-slate-800 hover:bg-stone-100 shadow-2xs'
                }`}
              >
                {dest}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ASYMMETRIC BENTO GRID DIRECTORY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Count Bar */}
        <div className="flex items-center justify-between text-xs">
          <span className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <Compass size={14} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
            <span>Curated Heritage Storytellers</span>
          </span>
          <span className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {filteredGuides.length} Licensed Guides Available
          </span>
        </div>

        {/* Loading State: Bento Shimmer Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GuideCardSkeleton isLarge={true} isDarkMode={isDarkMode} />
            <GuideCardSkeleton isDarkMode={isDarkMode} />
            <GuideCardSkeleton isDarkMode={isDarkMode} />
            <GuideCardSkeleton isDarkMode={isDarkMode} />
          </div>
        ) : error ? (
          <div className={`py-20 text-center rounded-3xl border p-8 space-y-4 shadow-sm ${
            isDarkMode ? 'bg-slate-900 border-rose-900' : 'bg-white border-rose-200'
          }`}>
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <RotateCcw size={22} />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Failed to Load Guides
              </h3>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
            <button
              onClick={loadGuides}
              className="px-5 py-2 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className={`py-20 text-center rounded-3xl border p-8 space-y-4 shadow-sm ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200'
          }`}>
            <MapPin size={36} className="text-amber-500/60 mx-auto" />
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                No Guides Found
              </h3>
              <p className="text-xs text-slate-500">
                No verified guides match your exact search filters. Try switching destinations or resetting filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDestination('All India');
                setSelectedSpecialty('All Specialties');
                setSelectedLanguage('All Languages');
              }}
              className="px-5 py-2.5 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-semibold rounded-xl transition cursor-pointer shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* BENTO GRID: 1 FEATURED HERO CARD (2x1) + SMALLER ASYMMETRIC CARDS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. FEATURED BENTO HERO CARD */}
            {featuredGuide && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 relative h-[480px] group cursor-pointer border border-stone-200 dark:border-slate-800"
                onClick={() => setSelectedGuide(featuredGuide)}
              >
                <img
                  src={featuredGuide.profileImage}
                  alt={featuredGuide.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform filter brightness-90"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-95" />

                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-full shadow-md">
                      Featured Master Guide
                    </span>
                    <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[11px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                      <ShieldCheck size={12} />
                      <span>Govt Licensed</span>
                    </span>
                  </div>

                  <div className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold rounded-full flex items-center gap-1.5 border border-white/10">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{featuredGuide.rating.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-300 font-normal">({featuredGuide.reviews} reviews)</span>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-3 z-10">
                  <div className="flex items-center gap-3 text-xs text-amber-400 font-mono uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {featuredGuide.location}
                    </span>
                    <span>•</span>
                    <span>{featuredGuide.experience}y Heritage & Archaeology Exp</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-serif font-bold leading-tight text-white">
                    {featuredGuide.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-200 max-w-2xl line-clamp-2 leading-relaxed font-normal">
                    {featuredGuide.bio}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {featuredGuide.specialties.map((s, i) => (
                      <span key={i} className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold rounded-lg">
                        {s}
                      </span>
                    ))}
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold rounded-lg flex items-center gap-1">
                      <Zap size={11} /> Responds in {featuredGuide.responseTime || '< 1h'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Private Expedition Rate</span>
                      <p className="text-lg font-bold text-white">
                        ₹{featuredGuide.pricePerDay} <span className="text-xs font-normal text-slate-300">/ day</span>
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGuide(featuredGuide);
                      }}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>Explore & Book</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* 2. REMAINING EDITORIAL BENTO CARDS */}
            {bentoRemainingGuides.map((guide, idx) => (
              <motion.div
                key={guide._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
                onClick={() => setSelectedGuide(guide)}
                className="rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 relative h-[440px] group cursor-pointer border border-stone-200 dark:border-slate-800 flex flex-col justify-end"
              >
                <img
                  src={guide.profileImage}
                  alt={guide.name}
                  loading="lazy"
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform filter brightness-90"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-95" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1 border border-white/10 shadow-sm">
                    <ShieldCheck size={11} />
                    <span>Govt Certified</span>
                  </span>

                  <div className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold rounded-full flex items-center gap-1 border border-white/10">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{guide.rating.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-5 text-white space-y-2 relative z-10">
                  <p className="text-[11px] font-mono tracking-wider text-amber-400 uppercase flex items-center gap-1 font-bold">
                    <MapPin size={11} /> {guide.location}
                  </p>

                  <h3 className="text-xl font-serif font-bold leading-snug tracking-tight text-white">
                    {guide.name}
                  </h3>

                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal">
                    {guide.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {guide.specialties.slice(0, 2).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/20 backdrop-blur-xs text-white text-[10px] font-medium rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-300 uppercase block font-normal">From</span>
                      <span className="font-bold text-white text-sm">₹{guide.pricePerDay || 1500} <span className="text-[10px] font-normal text-slate-300">/ day</span></span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGuide(guide);
                      }}
                      className="px-4 py-1.5 bg-white/20 hover:bg-white text-white hover:text-slate-950 text-xs font-bold rounded-xl backdrop-blur-md transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Book</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}

          </div>
        )}

      </main>

      {/* DETAIL & BOOKING MODAL */}
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
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border my-8 ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-white' 
                  : 'bg-white border-stone-200 text-slate-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-64 sm:h-72 bg-slate-950 overflow-hidden">
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
                  <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={12} />
                    <span>Govt Certified</span>
                  </span>
                  <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold rounded-full flex items-center gap-1 border border-white/10">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{selectedGuide.rating.toFixed(2)}</span>
                  </span>
                </div>

                <div className="absolute bottom-4 left-6 right-6 text-white z-10 space-y-1">
                  <p className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1 font-bold">
                    <MapPin size={12} /> {selectedGuide.location}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-tight text-white">
                    {selectedGuide.name}
                  </h2>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
                
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Storytelling & Heritage Credentials
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed font-normal ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    {selectedGuide.bio}
                  </p>
                </div>

                {/* Facts 3-Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className={`p-3.5 rounded-2xl border space-y-1 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Govt Tourism ID</span>
                    <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{selectedGuide.govtId || 'MOT-IN-CERTIFIED'}</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl border space-y-1 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Spoken Languages</span>
                    <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{selectedGuide.languages.join(', ')}</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl border space-y-1 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Response Speed</span>
                    <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{selectedGuide.responseTime || '< 1 hour'}</p>
                  </div>
                </div>

                {/* Specialties */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Core Specializations & Circuits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuide.specialties.map((spec, i) => (
                      <span key={i} className={`px-3 py-1 border text-xs font-semibold rounded-xl ${
                        isDarkMode 
                          ? 'bg-amber-950/40 border-amber-800 text-amber-300' 
                          : 'bg-amber-100 border-amber-200 text-amber-900'
                      }`}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Booking Form */}
                {bookingSuccess ? (
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
                    <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Booking Inquiry Submitted!</h4>
                    <p className="text-xs text-slate-500">
                      {selectedGuide.name} will reach out via email/phone within {selectedGuide.responseTime || '1 hour'} to confirm schedule.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="pt-4 border-t border-stone-200 dark:border-slate-800 space-y-4">
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Request a Date with {selectedGuide.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Travel Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none ${
                            isDarkMode 
                              ? 'bg-slate-800 border-slate-700 text-white' 
                              : 'bg-stone-50 border-stone-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Travelers Count *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={travelersCount}
                          onChange={(e) => setTravelersCount(Number(e.target.value))}
                          className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none ${
                            isDarkMode 
                              ? 'bg-slate-800 border-slate-700 text-white' 
                              : 'bg-stone-50 border-stone-200 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Tour Preferences / Note for Guide
                      </label>
                      <textarea
                        rows={2}
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                        placeholder="e.g. Sunrise tour, private history walkthrough, dietary preferences..."
                        className={`w-full px-3 py-2 border rounded-xl text-xs placeholder:text-stone-400 focus:outline-none ${
                          isDarkMode 
                            ? 'bg-slate-800 border-slate-700 text-white' 
                            : 'bg-stone-50 border-stone-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className={`p-3.5 border rounded-xl flex items-center justify-between text-xs ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-amber-300' 
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}>
                      <div>
                        <span className="font-bold block">Official Tour Fee:</span>
                        <span className="text-[10px] opacity-80">Direct Guide Rate • No Middleman Markup</span>
                      </div>
                      <span className="font-extrabold text-sm">₹{selectedGuide.pricePerDay || 1500} / day</span>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedGuide(null)}
                        className={`px-4 py-2 border text-xs font-semibold rounded-xl transition cursor-pointer ${
                          isDarkMode 
                            ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                            : 'border-stone-200 text-slate-700 hover:bg-stone-50'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={bookingSubmitting}
                        className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>{bookingSubmitting ? 'Submitting...' : 'Confirm Reservation'}</span>
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
