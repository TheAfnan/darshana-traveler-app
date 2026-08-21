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
import { getCulturalTripPlan, MONTHLY_EVENT_RADAR, type CulturalPlan } from '../data/culturalTripData';
import { fetchTripAdvisorSpots, type TripAdvisorSpot } from '../services/tripAdvisorApi';
import { fetchLiveTrainOptions, type LiveTrainOption } from '../services/irctcRapidApi';

const CulturalPlanner: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [fromCity, setFromCity] = useState(searchParams.get('from') || 'Delhi');
  const [toCity, setToCity] = useState(searchParams.get('to') || 'Lucknow');
  const [travelDate, setTravelDate] = useState(searchParams.get('date') || '2026-05-19'); // Default May to showcase Bada Mangal!
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<CulturalPlan>(() => getCulturalTripPlan(toCity, travelDate, fromCity));
  const [tripAdvisorSpots, setTripAdvisorSpots] = useState<TripAdvisorSpot[]>([]);
  const [liveTrains, setLiveTrains] = useState<LiveTrainOption[]>([]);

  useEffect(() => {
    const dest = searchParams.get('to') || toCity;
    const origin = searchParams.get('from') || fromCity;
    const date = searchParams.get('date') || travelDate;
    setPlan(getCulturalTripPlan(dest, date, origin));

    // Fetch TripAdvisor & IRCTC RapidAPIs
    fetchTripAdvisorSpots(dest).then(spots => setTripAdvisorSpots(spots));
    fetchLiveTrainOptions(origin, dest).then(trains => setLiveTrains(trains));
  }, [searchParams, toCity, fromCity]);

  const handlePlanSearch = () => {
    if (!toCity.trim()) return;
    setIsGenerating(true);
    fetchTripAdvisorSpots(toCity).then(spots => setTripAdvisorSpots(spots));
    fetchLiveTrainOptions(fromCity, toCity).then(trains => setLiveTrains(trains));
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
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Cultural Journey Planner
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
            Discover not just where to go, but the exact right moment to experience India’s living traditions, festivals, and local heritage.
          </p>
        </div>

        {/* Clean Search Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Departure City</label>
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5">
                <MapPin size={16} className="text-stone-400" />
                <input 
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="e.g. Delhi"
                  className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Destination</label>
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5">
                <MapPin size={16} className="text-amber-600" />
                <input 
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="e.g. Ayodhya, Lucknow, Varanasi"
                  className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Travel Date</label>
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5">
                <Calendar size={16} className="text-amber-600" />
                <input 
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-stone-100">
            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Featured Seasons:</span>
              {[
                { name: 'Ayodhya (Nov Deepotsav)', dest: 'Ayodhya', date: '2026-11-01' },
                { name: 'Lucknow (May Bada Mangal)', dest: 'Lucknow', date: '2026-05-19' },
                { name: 'Varanasi (Nov Dev Deepawali)', dest: 'Varanasi', date: '2026-11-15' },
                { name: 'Jaipur (Aug Teej)', dest: 'Jaipur', date: '2026-08-05' },
              ].map((chip) => (
                <button
                  key={chip.name}
                  onClick={() => {
                    setToCity(chip.dest);
                    setTravelDate(chip.date);
                    setPlan(getCulturalTripPlan(chip.dest, chip.date, fromCity));
                  }}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 rounded-lg transition"
                >
                  {chip.name}
                </button>
              ))}
            </div>

            <button 
              onClick={handlePlanSearch}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              {isGenerating ? <Sparkles className="animate-spin" size={14} /> : <Search size={14} />}
              <span>Update Itinerary</span>
            </button>
          </div>
        </div>

        {/* Season Radar - Simple Month-by-Month Explorer */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">
              When & Where: Peak Seasonal Moments in India
            </h3>
            <span className="text-xs text-slate-400">Select any month to view live event</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {Object.values(MONTHLY_EVENT_RADAR).map((radar) => (
              <button
                key={radar.monthNum}
                onClick={() => {
                  const top = radar.topDestinations[0];
                  setToCity(top.city);
                  setTravelDate(top.targetDate);
                  setPlan(getCulturalTripPlan(top.city, top.targetDate, fromCity));
                }}
                className="p-3 text-left bg-stone-50 hover:bg-amber-50/80 border border-stone-200 hover:border-amber-300 rounded-xl transition group flex flex-col justify-between h-24"
              >
                <div>
                  <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-900 block">
                    {radar.monthName}
                  </span>
                  <span className="text-xs font-semibold text-amber-700 block mt-0.5">
                    {radar.topDestinations[0].city}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 line-clamp-1">
                  {radar.topDestinations[0].event}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Destination Editorial Showcase Header */}
        <div className="relative rounded-2xl overflow-hidden shadow-md bg-slate-900 text-white">
          <img 
            src={plan.bgImage} 
            alt={plan.destination}
            className="w-full h-56 sm:h-64 object-cover opacity-40 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <div className="text-xs font-medium text-amber-300 mb-1">
              {fromCity} ➔ {plan.destination} • {travelDate}
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
              {plan.destination}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {plan.tagline}
            </p>
          </div>
        </div>

        {/* Month Highlight Card (Human-Curated Editorial Note) */}
        {plan.currentMonthHighlight && (
          <div className="bg-[#fffdfa] border border-amber-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-md">
                {plan.currentMonthHighlight.badge}
              </span>
              <h3 className="font-bold text-base text-slate-900">
                {plan.currentMonthHighlight.title}
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {plan.currentMonthHighlight.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-amber-100 text-xs text-slate-600">
              <div>
                <strong className="text-slate-800">Best place to experience:</strong> {plan.currentMonthHighlight.whereToExperience}
              </div>
              <div>
                <strong className="text-slate-800">Cultural significance:</strong> {plan.currentMonthHighlight.whySpecial}
              </div>
            </div>
          </div>
        )}

        {/* 3 Simple Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* 1. Festivals */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2.5 border-b border-stone-100">
                <Calendar size={18} className="text-amber-600" />
                <h4 className="font-bold text-sm text-slate-900">Festivals & Traditions</h4>
              </div>
              <div className="space-y-3.5 mt-3">
                {plan.festivals.map((f, i) => (
                  <div key={i} className="space-y-1.5 pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 leading-snug">{f.name}</h5>
                      <span className="inline-block mt-1 text-[10px] text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded font-semibold">
                        🗓️ {f.dates}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                    <div className="text-[11px] text-amber-900/90 bg-stone-50 p-2 rounded-lg leading-relaxed">
                      💡 <strong>Tip:</strong> {f.insiderTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">Verified cultural calendar</span>
          </div>

          {/* 2. Hidden Gems */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2.5 border-b border-stone-100">
                <MapPin size={18} className="text-amber-600" />
                <h4 className="font-bold text-sm text-slate-900">Local Hidden Gems</h4>
              </div>
              <div className="space-y-3.5 mt-3">
                {plan.hiddenGems.map((g, i) => (
                  <div key={i} className="space-y-1.5 pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 leading-snug">{g.title}</h5>
                      <span className="inline-block mt-1 text-[10px] text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded font-semibold">
                        ✨ {g.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{g.description}</p>
                    <span className="text-[11px] text-stone-500 font-medium block">📍 {g.location}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/guides" className="text-[11px] font-semibold text-amber-700 hover:underline pt-2 border-t border-stone-100 block">
              Hire a verified local guide ➔
            </Link>
          </div>

          {/* 3. Food & Stays */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2.5 border-b border-stone-100">
                <Utensils size={18} className="text-amber-600" />
                <h4 className="font-bold text-sm text-slate-900">Authentic Food & Stays</h4>
              </div>
              <div className="space-y-3 mt-3">
                {plan.seasonalFoods.slice(0, 2).map((food, i) => (
                  <div key={i} className="space-y-1 pb-2.5 border-b border-stone-100 last:border-0 last:pb-0">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 leading-snug">{food.name}</h5>
                      <span className="inline-block mt-1 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded font-semibold">
                        💰 {food.priceRange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{food.description}</p>
                    <span className="text-[11px] text-amber-900 font-semibold block">📍 {food.famousSpot}</span>
                  </div>
                ))}

                {plan.budgetStays.slice(0, 1).map((stay, i) => (
                  <div key={i} className="pt-2 border-t border-stone-100 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{stay.name}</span>
                      <span className="text-[10px] text-stone-500">{stay.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">₹{stay.pricePerNight}</span>
                      <span className="font-normal text-[10px] text-stone-400 block">/night</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">Authentic regional spots</span>
          </div>

        </div>

        {/* TripAdvisor Verified Reviews & Places (Powered by RapidAPI) */}
        {tripAdvisorSpots.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 pb-2.5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1">
                  🟢 TripAdvisor Verified Places
                </span>
                <span className="text-xs text-slate-400 font-medium">• Live via RapidAPI</span>
              </div>
              <span className="text-[11px] text-slate-400">Authentic Traveler Ratings & Real Reviews</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {tripAdvisorSpots.map((spot, idx) => (
                <div key={idx} className="bg-[#faf9f7] border border-stone-200/80 rounded-xl p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{spot.name}</h5>
                        <span className="text-[10px] text-stone-500">{spot.category} • {spot.priceLevel}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          ★ {spot.rating} / 5
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">({spot.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 italic leading-relaxed">{spot.topReviewSnippet}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 pt-1 block">
                    🏆 {spot.rankingText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IRCTC Live Trains & Green Transit (Powered by RapidAPI) */}
        {liveTrains.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 pb-2.5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold rounded-full flex items-center gap-1">
                  🚆 IRCTC Live Rail Transit
                </span>
                <span className="text-xs text-slate-400 font-medium">• Live via RapidAPI</span>
              </div>
              <span className="text-[11px] text-slate-400">Direct Low-Emission Express Routes ({fromCity} ➔ {toCity})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {liveTrains.map((train, idx) => (
                <div key={idx} className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{train.trainName} (#{train.trainNumber})</h5>
                      <span className="text-[10px] text-blue-700 font-semibold">{train.trainType} • Duration: {train.duration}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      -{train.co2SavedKg} kg CO2
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-700 pt-1">
                    <div>
                      <span className="font-bold text-slate-900 block">{train.departureTime}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{train.fromStationCode} (Origin)</span>
                    </div>
                    <div className="flex-1 mx-3 border-t border-dashed border-slate-300 relative text-center">
                      <span className="text-[9px] font-bold text-slate-400 bg-[#f8fafc] px-1 absolute -top-2 left-1/2 -translate-x-1/2 uppercase">Direct Rail</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">{train.arrivalTime}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{train.toStationCode} (Dest)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-500">
                    <span>Available Classes:</span>
                    {train.classes.map((cls, i) => (
                      <span key={i} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-700">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clean Practical Travel & Action Bar */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Safety: <strong>{plan.safety[0].score}/10</strong> (Emergency 112)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Leaf size={16} className="text-teal-600" />
              <span>Eco-Transit: <strong>-{plan.sustainability.co2SavedKg} kg CO2</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-initial px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Download size={14} /> Download PDF
            </button>
            <Link 
              to="/guides"
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Users size={14} /> Local Guides
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CulturalPlanner;
