import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Utensils, 
  Home, 
  ArrowRight, 
  Download, 
  Users, 
  Clock, 
  Search,
  CheckCircle2,
  PhoneCall,
  Flame,
  Award
} from 'lucide-react';
import jsPDF from 'jspdf';
import { getCulturalTripPlan, type CulturalPlan } from '../data/culturalTripData';

const CulturalPlanner: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [fromCity, setFromCity] = useState(searchParams.get('from') || 'Delhi');
  const [toCity, setToCity] = useState(searchParams.get('to') || 'Lucknow');
  const [travelDate, setTravelDate] = useState(searchParams.get('date') || '2026-05-19'); // Default May to showcase Bada Mangal!
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<CulturalPlan>(() => getCulturalTripPlan(toCity, travelDate, fromCity));

  useEffect(() => {
    const dest = searchParams.get('to') || toCity;
    const origin = searchParams.get('from') || fromCity;
    const date = searchParams.get('date') || travelDate;
    setPlan(getCulturalTripPlan(dest, date, origin));
  }, [searchParams]);

  const handlePlanSearch = () => {
    if (!toCity.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setPlan(getCulturalTripPlan(toCity, travelDate, fromCity));
      setIsGenerating(false);
      setSearchParams({ from: fromCity, to: toCity, date: travelDate });
    }, 400);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 36, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DarShana - Authentic Cultural Travel Plan', 14, 16);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Journey: ${fromCity} -> ${plan.destination} | Date: ${travelDate}`, 14, 26);
    
    let y = 46;
    
    // Month Highlight
    if (plan.currentMonthHighlight) {
      doc.setTextColor(234, 88, 12); // orange-600
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`SPECIAL: ${plan.currentMonthHighlight.title}`, 14, y);
      y += 6;
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(plan.currentMonthHighlight.description, 14, y, { maxWidth: 180 });
      y += 14;
    }

    // 1. Festivals
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Local Festivals & Living Culture:', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    plan.festivals.forEach(f => {
      doc.text(`* ${f.name} (${f.dates}): ${f.description}`, 16, y, { maxWidth: 180 });
      y += 10;
    });

    // 2. Hidden Gems
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2. Authentic Hidden Gems & Artisan Trails:', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    plan.hiddenGems.forEach(g => {
      doc.text(`* ${g.title} (${g.location}): ${g.description}`, 16, y, { maxWidth: 180 });
      y += 10;
    });

    // 3. Foods
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('3. Authentic Street Foods & Must-Try Cuisines:', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    plan.seasonalFoods.forEach(f => {
      doc.text(`* ${f.name} @ ${f.famousSpot} (${f.priceRange}): ${f.description}`, 16, y, { maxWidth: 180 });
      y += 10;
    });

    // Save PDF
    doc.save(`DarShana_${plan.destination}_Trip_Plan.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Top Search Bar */}
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100/60 p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">From</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5">
                  <MapPin size={16} className="text-slate-400" />
                  <input 
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="Departure (e.g. Delhi)"
                    className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Destination</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5">
                  <MapPin size={16} className="text-orange-500" />
                  <input 
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="Destination (e.g. Lucknow)"
                    className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Travel Date</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5">
                  <Calendar size={16} className="text-amber-500" />
                  <input 
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handlePlanSearch}
              disabled={isGenerating}
              className="w-full md:w-auto mt-2 md:mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow-orange-500/20 hover:scale-105 transition-all"
            >
              {isGenerating ? <Sparkles className="animate-spin" size={16} /> : <Search size={16} />}
              <span>Plan Cultural Journey</span>
            </button>
          </div>

          {/* Quick Destination Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Popular:</span>
            {[
              { name: 'Lucknow (May Bada Mangal)', dest: 'Lucknow', date: '2026-05-19' },
              { name: 'Varanasi (Dev Deepawali)', dest: 'Varanasi', date: '2026-11-15' },
              { name: 'Jaipur (Teej Festival)', dest: 'Jaipur', date: '2026-08-05' },
              { name: 'Goa (Viva Carnival)', dest: 'Goa', date: '2026-02-14' },
            ].map((chip) => (
              <button
                key={chip.name}
                onClick={() => {
                  setToCity(chip.dest);
                  setTravelDate(chip.date);
                  setPlan(getCulturalTripPlan(chip.dest, chip.date, fromCity));
                }}
                className="px-3 py-1 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-full transition-colors"
              >
                {chip.name}
              </button>
            ))}
          </div>
        </div>

        {/* HERO TITLE & MONTH HIGHLIGHT (GOLDEN CARD) */}
        {plan.currentMonthHighlight && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-1 text-white shadow-xl"
          >
            <div className="bg-slate-950/90 backdrop-blur-md rounded-[22px] p-6 sm:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 rounded-full text-xs font-extrabold tracking-wide uppercase">
                  <Flame size={14} className="text-amber-400" /> {plan.currentMonthHighlight.badge}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span>Journey: <strong className="text-white">{fromCity} ➔ {plan.destination}</strong></span>
                  <span>•</span>
                  <span>Date: <strong className="text-white">{travelDate}</strong></span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                {plan.currentMonthHighlight.title}
              </h2>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
                {plan.currentMonthHighlight.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <span className="text-amber-300 font-bold block mb-1">📍 Where to experience:</span>
                  <span className="text-slate-200">{plan.currentMonthHighlight.whereToExperience}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <span className="text-emerald-300 font-bold block mb-1">✨ Cultural Significance:</span>
                  <span className="text-slate-200">{plan.currentMonthHighlight.whySpecial}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3 CORE PILLARS (CLEAN & ELEGANT) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 1. LIVING CULTURE & FESTIVALS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Local Festivals & Traditions</h3>
                  <p className="text-xs text-slate-400">Authentic regional celebrations</p>
                </div>
              </div>

              <div className="space-y-3">
                {plan.festivals.map((f, i) => (
                  <div key={i} className="bg-orange-50/40 border border-orange-100 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-slate-900">{f.name}</h4>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">{f.dates}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                    <div className="text-[11px] text-orange-900 bg-orange-100/60 p-2 rounded-xl">
                      💡 <strong>Tip:</strong> {f.insiderTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex justify-between items-center">
              <span>Verified Cultural Calendar</span>
              <span className="font-bold text-orange-600">Dekho Apna Desh</span>
            </div>
          </div>

          {/* 2. HIDDEN GEMS & SECRET TRAILS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-2xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Hidden Gems & Artisan Trails</h3>
                  <p className="text-xs text-slate-400">Beyond common tourist spots</p>
                </div>
              </div>

              <div className="space-y-3">
                {plan.hiddenGems.map((g, i) => (
                  <div key={i} className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-slate-900">{g.title}</h4>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">{g.category}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{g.description}</p>
                    <div className="text-[11px] text-slate-500 font-medium">
                      📍 {g.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex justify-between items-center">
              <span>Artisans & Heritage</span>
              <Link to="/guides" className="font-bold text-purple-600 hover:underline">
                Hire Local Guide ➔
              </Link>
            </div>
          </div>

          {/* 3. ICONIC FOOD & BUDGET STAYS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-2xl">
                  <Utensils size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Authentic Food & Stays</h3>
                  <p className="text-xs text-slate-400">Legendary flavors & eco homestays</p>
                </div>
              </div>

              {/* Foods */}
              <div className="space-y-2.5">
                <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Must-Try Food Spots:</h5>
                {plan.seasonalFoods.slice(0, 2).map((food, i) => (
                  <div key={i} className="bg-amber-50/40 border border-amber-100 rounded-2xl p-3 space-y-1">
                    <div className="flex justify-between items-start">
                      <h6 className="font-bold text-xs text-slate-900">{food.name}</h6>
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{food.priceRange}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{food.description}</p>
                    <span className="text-[10px] text-amber-900 font-bold block">📍 {food.famousSpot}</span>
                  </div>
                ))}
              </div>

              {/* Stays */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Recommended Homestay:</h5>
                {plan.budgetStays.slice(0, 1).map((stay, i) => (
                  <div key={i} className="bg-blue-50/40 border border-blue-100 rounded-2xl p-3 flex justify-between items-center">
                    <div>
                      <h6 className="font-bold text-xs text-slate-900">{stay.name}</h6>
                      <span className="text-[10px] text-blue-600 block">{stay.type} • {stay.ecoScore}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-sm text-slate-900">₹{stay.pricePerNight}</span>
                      <span className="text-[10px] text-slate-400 block">/night</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex justify-between items-center">
              <span>Local Awadhi Cuisine</span>
              <span className="font-bold text-amber-600">Gourmet Verified</span>
            </div>
          </div>

        </div>

        {/* BOTTOM UTILITY BAR: SAFETY, ECO TRANSIT & PDF DOWNLOAD */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl font-semibold border border-emerald-100">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Safety Index: <strong>{plan.safety[0].score}/10</strong> (Police: 112 / Women Helpline: 1090)</span>
            </div>
            <div className="flex items-center gap-2 bg-teal-50 text-teal-800 px-4 py-2 rounded-xl font-semibold border border-teal-100">
              <Leaf size={16} className="text-teal-600" />
              <span>Eco-Transit: <strong>-{plan.sustainability.co2SavedKg} kg CO2</strong> (+{plan.sustainability.ecoRewardPoints} DarShana Pts)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleDownloadPDF}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition"
            >
              <Download size={14} className="text-orange-400" /> Download PDF Itinerary
            </button>
            <Link 
              to="/guides"
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md hover:scale-105 transition"
            >
              <Users size={14} /> Book Local Guide
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CulturalPlanner;
