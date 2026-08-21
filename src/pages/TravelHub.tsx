import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Compass, 
  MapPin, 
  ArrowRight, 
  Calendar, 
  Search,
  CheckCircle2,
  Users,
  Award,
  Clock,
  Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';

import BlogHighlightsSection from '../components/travelhub/BlogHighlightsSection';
import ContactSupportSection from '../components/travelhub/ContactSupportSection';
import DestinationsSection from '../components/travelhub/DestinationsSection';
import GallerySection from '../components/travelhub/GallerySection';
import ReviewsSection from '../components/travelhub/ReviewsSection';
import RouteMapSection from '../components/travelhub/RouteMapSection';
import SpecialFeaturesSection from '../components/travelhub/SpecialFeaturesSection';
import TourPackagesSection, { TourCategory } from '../components/travelhub/TourPackagesSection';
import TravelCategoriesSection from '../components/travelhub/TravelCategoriesSection';

const TravelHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TourCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const scrollToPackages = () => {
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (category: TourCategory) => {
    setActiveCategory(category);
  };

  const handleQuickTagClick = (category: TourCategory) => {
    setActiveCategory(category);
    scrollToPackages();
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#faf8f5] text-stone-800 font-sans">
      
      {/* 1. EDITORIAL TRAVEL HUB HERO (Clean, Premium, High-End Layout) */}
      <div className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80 bg-gradient-to-b from-amber-50/50 via-stone-50/30 to-[#faf8f5]">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08),_transparent_70%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto space-y-8">
          
          {/* Top Pill & Trust Stamp */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="inline-flex items-center gap-2 bg-amber-100/70 border border-amber-300/80 px-3.5 py-1.5 rounded-full shadow-2xs">
              <Sparkles size={13} className="text-amber-800" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-900">
                DarShana Curated Indian Travel Hub
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                <strong className="text-stone-800 font-bold">4.95 / 5</strong> rating
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-700" />
                Verified Local Scholars
              </span>
            </div>
          </div>

          {/* Editorial Headline & Value Proposition */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-stone-900 tracking-tight leading-[1.15]">
              Experience India with Curated Expeditions & Bespoke Stays
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal max-w-3xl">
              From dawn boat rituals on the sacred Ganga to Dal Lake luxury houseboats and royal Rajput desert camps — explore authentic cultural tour packages handcrafted with boutique heritage stays, private AC transit, and certified historians.
            </p>
          </div>

          {/* Interactive Quick-Theme Search Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-stone-200/50 border border-stone-200/80 space-y-4">
            
            {/* Quick Filter Tags */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-bold text-stone-400 uppercase tracking-wider shrink-0 text-[11px]">Popular Circuits:</span>
              {[
                { label: '🏔️ Kashmir Houseboats', cat: 'himalayan' as TourCategory },
                { label: '👑 Rajasthan Palaces', cat: 'royal' as TourCategory },
                { label: '🪔 Varanasi & Ayodhya', cat: 'spiritual' as TourCategory },
                { label: '🌿 Kerala Ayurveda', cat: 'wellness' as TourCategory },
                { label: '🐅 Jim Corbett Safari', cat: 'family' as TourCategory },
                { label: '💻 Goa Nomad Co-Living', cat: 'workcation' as TourCategory }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleQuickTagClick(item.cat)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeCategory === item.cat
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" /> All-Inclusive INR Pricing
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" /> Free Date Rescheduling
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" /> 24/7 YatraSahayak SOS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/planner"
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Compass size={14} className="text-amber-700" />
                  <span>Custom AI Planner</span>
                </Link>

                <button
                  onClick={scrollToPackages}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Browse 12 Packages</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. MAIN CONTENT SECTIONS */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 space-y-16">
        
        {/* Travel Themes with Active Filter State */}
        <TravelCategoriesSection 
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
        
        {/* Curated Tour Packages with Real Booking Engine & Reactive Filtering */}
        <TourPackagesSection 
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Popular Destinations */}
        <DestinationsSection />

        {/* Route Map & Visuals */}
        <RouteMapSection />
        <GallerySection />
        <SpecialFeaturesSection />

        {/* Interactive India Map */}
        <section id="map" className="pt-8">
          <div className="text-center space-y-2 mb-8 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 self-center shadow-2xs">
              📍 NATIONAL EXPLORER
            </span>
            <h2 className="text-3xl font-bold font-serif text-stone-900">Explore India Live Interactive Map</h2>
            <p className="text-xs sm:text-sm text-stone-500">Pan and zoom across historical routes and cultural stops</p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
            <iframe
              title="TravelHub Destinations Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30711283.003947686!2d64.43760646358283!3d20.01140817566828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1689612345678!5m2!1sen!2sin"
              className="h-[420px] w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        {/* Social Proof & Reviews */}
        <ReviewsSection />
        <BlogHighlightsSection />
        <ContactSupportSection />
      </div>

    </div>
  );
};

export default TravelHub;
