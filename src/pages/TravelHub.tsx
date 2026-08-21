import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Compass, 
  ArrowRight, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

import DestinationsSection from '../components/travelhub/DestinationsSection';
import ReviewsSection from '../components/travelhub/ReviewsSection';
import TourPackagesSection, { TourCategory } from '../components/travelhub/TourPackagesSection';

const TravelHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TourCategory>('all');

  const scrollToPackages = () => {
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (category: TourCategory) => {
    setActiveCategory(category);
    scrollToPackages();
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#faf8f5] text-stone-800 font-sans">
      
      {/* 1. CINEMATIC TRAVEL HERO (Dynamic Visual Landscape + Luxury Glassmorphism) */}
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        
        {/* Dynamic Cinematic Landscape Layer (Rich High-Def Backdrop with Ambient Motion) */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 transform hover:scale-105 scale-100 opacity-60"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&auto=format&fit=crop&q=85')`
          }}
        />

        {/* Secondary Scenic Blend Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bbaa?w=1920&auto=format&fit=crop&q=85')`
          }}
        />

        {/* Cinematic Gradient Overlays (Never pitch black, warm atmospheric lighting) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(2,6,23,0.7)_100%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-16 pb-16">
          
          {/* Top Golden Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              EXTRAORDINARY INDIAN JOURNEYS
            </span>
          </div>

          {/* Main Cinematic Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif text-white tracking-tight leading-[1.12] drop-shadow-lg">
            Discover India with <span className="text-amber-400">DarShana</span> Travel Hub
          </h1>

          {/* Subtitle */}
          <p className="text-stone-200 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Handcrafted cultural itineraries, boutique royal stays, private AC transit, and authentic culinary trails across India.
          </p>

          {/* Floating Glassmorphism Theme Bar */}
          <div className="pt-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-stone-700/80 p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-2xl flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'All Expeditions' },
                { id: 'royal', label: '👑 Royal Heritage' },
                { id: 'spiritual', label: '🪔 Sacred Circuits' },
                { id: 'himalayan', label: '🏔️ Himalayan' },
                { id: 'wellness', label: '🌿 Wellness' },
                { id: 'workcation', label: '💻 Workcation' },
                { id: 'family', label: '🐅 Wildlife & Family' }
              ].map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectCategory(tab.id as TourCategory)}
                    className={`px-4 py-2 rounded-xl sm:rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/25 scale-105'
                        : 'bg-black/40 text-stone-200 border-stone-700 hover:bg-black/70 hover:text-white hover:border-stone-500'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs text-stone-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={15} className="text-amber-400" /> 100% Verified Boutique Stays
            </span>
            <span className="hidden sm:inline text-stone-600">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Star size={14} className="text-amber-400 fill-amber-400" /> 4.95/5 Traveler Rating
            </span>
            <span className="hidden sm:inline text-stone-600">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={15} className="text-emerald-400" /> Free Date Rescheduling
            </span>
          </div>

        </div>

        {/* Bottom Scroll Indicator */}
        <div 
          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-stone-400 flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition cursor-pointer" 
          onClick={scrollToPackages}
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold text-amber-300">Explore Packages</span>
          <ChevronDown size={16} className="animate-bounce text-amber-400" />
        </div>
      </div>

      {/* 2. MAIN FOCUSED CONTENT SECTIONS */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-16">
        
        {/* 1. Curated Tour Packages with Real Booking Engine & Reactive Filtering */}
        <TourPackagesSection 
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* 2. Popular Destinations */}
        <DestinationsSection />

        {/* 3. Verified Traveler Reviews */}
        <ReviewsSection />

      </div>

    </div>
  );
};

export default TravelHub;
