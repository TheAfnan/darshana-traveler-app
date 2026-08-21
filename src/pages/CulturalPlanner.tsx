import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Utensils, 
  Home, 
  ArrowRight, 
  Download, 
  Share2, 
  Users, 
  CheckCircle2, 
  PhoneCall, 
  Clock, 
  Star,
  Award,
  Search
} from 'lucide-react';
import jsPDF from 'jspdf';
import { getCulturalTripPlan, type CulturalPlan } from '../data/culturalTripData';

const CulturalPlanner: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [fromCity, setFromCity] = useState(searchParams.get('from') || 'Lucknow');
  const [toCity, setToCity] = useState(searchParams.get('to') || 'Varanasi');
  const [travelDate, setTravelDate] = useState(searchParams.get('date') || '2026-11-15');
  const [passengers, setPassengers] = useState(Number(searchParams.get('passengers')) || 2);
  const [activeTab, setActiveTab] = useState<'all' | 'festivals' | 'gems' | 'food' | 'stays' | 'safety' | 'eco'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<CulturalPlan>(() => getCulturalTripPlan(toCity, travelDate));

  useEffect(() => {
    const dest = searchParams.get('to') || toCity;
    const date = searchParams.get('date') || travelDate;
    setPlan(getCulturalTripPlan(dest, date));
  }, [searchParams]);

  const handlePlanSearch = () => {
    if (!toCity.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setPlan(getCulturalTripPlan(toCity, travelDate));
      setIsGenerating(false);
    }, 600);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('DarShana - AI Cultural Travel Itinerary', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Destination: ${plan.destination} | Travel Date: ${travelDate} | Travelers: ${passengers}`, 14, 28);
    
    let y = 48;
    
    // Destination Tagline
    doc.setTextColor(234, 88, 12); // orange-600
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(plan.tagline, 14, y);
    y += 12;

    // 1. Festivals
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text('1. Festivals & Cultural Events:', 14, y);
    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    plan.festivals.forEach(f => {
      doc.text(`* ${f.name} (${f.dates}): ${f.description}`, 16, y, { maxWidth: 180 });
      y += 12;
    });

    // 2. Hidden Gems
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2. Hidden Cultural Gems & Heritage Trails:', 14, y);
    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    plan.hiddenGems.forEach(g => {
      doc.text(`* ${g.title} (${g.location}): ${g.description}`, 16, y, { maxWidth: 180 });
      y += 12;
    });

    // 3. Foods
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('3. Authentic Seasonal Foods & Street Delicacies:', 14, y);
    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    plan.seasonalFoods.forEach(f => {
      doc.text(`* ${f.name} @ ${f.famousSpot} (${f.priceRange}): ${f.description}`, 16, y, { maxWidth: 180 });
      y += 12;
    });

    // 4. Safety & Eco
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('4. Safety Helpline & Green Eco-Route:', 14, y);
    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`* Emergency: Police 112 | Tourist Safety Score: ${plan.safety[0].score}/10`, 16, y);
    y += 6;
    doc.text(`* Eco-Route: ${plan.sustainability.greenRoute} (${plan.sustainability.co2SavedKg} kg CO2 Saved)`, 16, y);

    // Save PDF
    doc.save(`DarShana_${plan.destination}_Cultural_Plan.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl p-8 sm:p-12">
          <img 
            src={plan.bgImage} 
            alt={plan.destination}
            className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-90"
          />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} /> AI Cultural Journey & Festival Matcher
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {plan.destination} Cultural Expedition
            </h1>
            <p className="text-slate-300 text-base sm:text-lg">
              {plan.tagline}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Clock size={14} className="text-amber-400" /> Best Time: {plan.bestMonths}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Leaf size={14} className="text-emerald-400" /> {plan.sustainability.co2SavedKg} kg CO2 Offset
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <ShieldCheck size={14} className="text-cyan-400" /> Safety Index: {plan.safety[0].score}/10
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Search Bar / Filter */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">FROM (ORIGIN)</label>
              <input 
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="e.g. Delhi, Lucknow"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">TO (DESTINATION)</label>
              <input 
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="e.g. Varanasi, Jaipur, Goa"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">TRAVEL DATES</label>
              <input 
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <button 
                onClick={handlePlanSearch}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 px-6 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
              >
                {isGenerating ? <Sparkles className="animate-spin" size={16} /> : <Search size={16} />}
                Generate Plan
              </button>
            </div>
          </div>
        </div>

        {/* Action Header & Quick Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: '🌟 All 6 Pillars' },
              { id: 'festivals', label: '🎪 Festivals & Events' },
              { id: 'gems', label: '🏛️ Hidden Gems' },
              { id: 'food', label: '🍽️ Seasonal Food' },
              { id: 'stays', label: '🏨 Budget & Eco Stays' },
              { id: 'safety', label: '🛡️ Safety & SOS' },
              { id: 'eco', label: '🌱 Green Route' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white text-slate-800 border border-slate-200 hover:border-orange-500 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition"
            >
              <Download size={15} className="text-orange-500" /> Download PDF Itinerary
            </button>
            <Link 
              to={`/guides`}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:scale-105 transition"
            >
              <Users size={15} /> Book Local Guide
            </Link>
          </div>
        </div>

        {/* 6-PILLAR INTERACTIVE GRID (PPT EXACT MATCH) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. FESTIVALS & LOCAL EVENTS */}
          {(activeTab === 'all' || activeTab === 'festivals') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">Pillar 1</span>
                    <h3 className="text-xl font-bold text-slate-900">Festivals & Cultural Events</h3>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {plan.festivals.map((f, idx) => (
                    <div key={idx} className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-900">{f.name}</h4>
                        <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">{f.dates}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                      <div className="text-[11px] text-orange-800 bg-orange-100/60 p-2 rounded-xl">
                        💡 <strong>Insider Tip:</strong> {f.insiderTip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Synced with Cultural Calendar</span>
                <Link to="/festivals" className="font-bold text-orange-600 hover:underline flex items-center gap-1">
                  View All Festivals <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* 2. CITIES/VILLAGES & HIDDEN GEMS */}
          {(activeTab === 'all' || activeTab === 'gems') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                    <Compass size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">Pillar 2</span>
                    <h3 className="text-xl font-bold text-slate-900">Cities, Villages & Hidden Gems</h3>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {plan.hiddenGems.map((g, idx) => (
                    <div key={idx} className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-900">{g.title}</h4>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">{g.category}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{g.description}</p>
                      <div className="text-[11px] text-slate-500 font-medium">
                        📍 {g.location} • ⏰ {g.bestTimeToVisit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Local Artisan Trails</span>
                <Link to="/ar-guide" className="font-bold text-purple-600 hover:underline flex items-center gap-1">
                  Launch AR Guide <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* 3. SEASONAL FOODS & STREET SPECIALTIES */}
          {(activeTab === 'all' || activeTab === 'food') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                    <Utensils size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">Pillar 3</span>
                    <h3 className="text-xl font-bold text-slate-900">Seasonal Foods & Street Eats</h3>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {plan.seasonalFoods.map((f, idx) => (
                    <div key={idx} className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-900">{f.name}</h4>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">{f.priceRange}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                      <div className="text-[11px] text-amber-900 font-medium bg-amber-100/50 px-2 py-1 rounded-lg">
                        📍 <strong>Iconic Spot:</strong> {f.famousSpot}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">100% Authentic Spots</span>
                <span className="font-bold text-amber-600">Gourmet Verified</span>
              </div>
            </motion.div>
          )}

          {/* 4. BUDGET & HERITAGE STAYS */}
          {(activeTab === 'all' || activeTab === 'stays') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 border border-blue-100 shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                    <Home size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Pillar 4</span>
                    <h3 className="text-xl font-bold text-slate-900">Budget & Heritage Eco-Stays</h3>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {plan.budgetStays.map((s, idx) => (
                    <div key={idx} className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                          <span className="text-[10px] font-semibold text-blue-600">{s.type}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-slate-900">₹{s.pricePerNight}</span>
                          <span className="text-[10px] text-slate-400 block">/night</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {s.amenities.map((a, i) => (
                          <span key={i} className="text-[10px] bg-white border border-blue-100 text-slate-700 px-2 py-0.5 rounded-md">
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold">
                        🌱 Eco Rating: {s.ecoScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Verified Homestays</span>
                <Link to="/booking" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
                  Check Booking <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* 5. SAFETY & CROWD INSIGHTS */}
          {(activeTab === 'all' || activeTab === 'safety') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">Pillar 5</span>
                    <h3 className="text-xl font-bold text-slate-900">Safety & Crowd Status</h3>
                  </div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Safety Rating</span>
                    <span className="text-sm font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                      ⭐ {plan.safety[0].score} / 10
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Current Crowd Status</span>
                    <span className="font-bold text-slate-800">{plan.safety[0].crowdLevel}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Emergency Numbers:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {plan.safety[0].emergencyContacts.map((c, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-slate-500 block">{c.service}</span>
                        <span className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1">
                          <PhoneCall size={12} className="text-emerald-600" /> {c.number}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                  <strong>Safety Insights:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500">
                    {plan.safety[0].insiderSafetyTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">24x7 Verified SOS Help</span>
                <Link to="/safety" className="font-bold text-emerald-600 hover:underline flex items-center gap-1">
                  Safety Dashboard <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* 6. SUSTAINABLE & RESPONSIBLE TOURISM */}
          {(activeTab === 'all' || activeTab === 'eco') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 border border-teal-100 shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-teal-100 text-teal-600 rounded-2xl">
                    <Leaf size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600">Pillar 6</span>
                    <h3 className="text-xl font-bold text-slate-900">Sustainable Tourism & Rewards</h3>
                  </div>
                </div>

                <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Carbon Emission Saved</span>
                      <span className="text-[11px] text-slate-500">vs Flight/Diesel Car</span>
                    </div>
                    <span className="text-base font-black text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
                      -{plan.sustainability.co2SavedKg} kg CO2
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-teal-100">
                    <span className="text-xs font-bold text-slate-700">DarShana Eco Points</span>
                    <span className="text-sm font-black text-amber-600 flex items-center gap-1">
                      <Award size={16} /> +{plan.sustainability.ecoRewardPoints} Pts
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Low-Emission Route:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{plan.sustainability.greenRoute}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Local Community Impact:</span>
                    <p className="text-slate-600 mt-0.5">{plan.sustainability.localInitiative}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Dekho Apna Desh Mission</span>
                <Link to="/rewards" className="font-bold text-teal-600 hover:underline flex items-center gap-1">
                  Redeem Rewards <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CulturalPlanner;
