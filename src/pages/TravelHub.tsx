import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Compass, 
  ArrowRight, 
  Calendar, 
  CheckCircle2
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

  const scrollToPackages = () => {
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (category: TourCategory) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-stone-50/60 font-sans">
      
      {/* 1. HERO HEADER SECTION */}
      <div className="relative bg-slate-950 text-white pt-24 pb-20 overflow-hidden border-b border-stone-800">
        {/* Background Image with Atmospheric Gradient */}
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <img 
            src="https://images.unsplash.com/photo-1548013146-72479768bbaa?w=1600&auto=format&fit=crop&q=80" 
            alt="DarShana Indian Heritage" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.15),_transparent_50%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/30 px-4 py-1.5 rounded-full backdrop-blur-md shadow-xs">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              DARSHANA TRAVEL HUB & EXPEDITIONS
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Authentic Indian Cultural Journeys & Heritage Tours
          </h1>

          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Reserve curated cultural packages, book certified local historians, and experience India through all-inclusive royal stays, sacred circuits, and culinary trails.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button 
              onClick={scrollToPackages}
              className="px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Tour Packages</span>
              <ArrowRight size={16} />
            </button>

            <Link 
              to="/planner"
              className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all duration-200 flex items-center gap-2"
            >
              <Compass size={16} className="text-amber-400" />
              <span>Custom AI Itinerary</span>
            </Link>
          </div>

          {/* Trust Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10 text-xs text-stone-300">
            <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
              <ShieldCheck size={16} className="text-amber-400" />
              <span>100% Verified Boutique Stays</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span>4.95/5 Traveler Satisfaction</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Transparent INR Pricing</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
              <Calendar size={16} className="text-amber-400" />
              <span>Free Date Rescheduling</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN CONTENT SECTIONS */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-16">
        
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
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 self-center">
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
