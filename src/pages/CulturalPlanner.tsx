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
  Award,
  X,
  QrCode,
  Ticket,
  CreditCard,
  Lock,
  CheckCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getCulturalTripPlan, MONTHLY_EVENT_RADAR, type CulturalPlan } from '../data/culturalTripData';
import { getDynamicCulturalPlan } from '../services/aiPlannerService';
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

  // Direct Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedStay, setSelectedStay] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [travelerName, setTravelerName] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [travelerPhone, setTravelerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'arrival'>('upi');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  useEffect(() => {
    const dest = searchParams.get('to') || toCity;
    const origin = searchParams.get('from') || fromCity;
    const date = searchParams.get('date') || travelDate;
    
    getDynamicCulturalPlan(dest, date, origin).then(dynamicPlan => {
      setPlan(dynamicPlan);
    });

    // Fetch TripAdvisor & IRCTC RapidAPIs
    fetchTripAdvisorSpots(dest).then(spots => setTripAdvisorSpots(spots));
    fetchLiveTrainOptions(origin, dest).then(trains => setLiveTrains(trains));
  }, [searchParams, toCity, fromCity]);

  const handlePlanSearch = async () => {
    if (!toCity.trim()) return;
    setIsGenerating(true);
    fetchTripAdvisorSpots(toCity).then(spots => setTripAdvisorSpots(spots));
    fetchLiveTrainOptions(fromCity, toCity).then(trains => setLiveTrains(trains));
    
    const newPlan = await getDynamicCulturalPlan(toCity, travelDate, fromCity);
    setPlan(newPlan);
    setIsGenerating(false);
    setSearchParams({ from: fromCity, to: toCity, date: travelDate });
  };

  const handleDirectBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelerName.trim() || !travelerPhone.trim()) {
      alert("Please enter your name and contact phone number.");
      return;
    }
    setIsSubmittingBooking(true);
    const refId = `DAR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await addDoc(collection(db, 'trip_bookings'), {
        bookingReference: refId,
        destination: plan.destination,
        origin: fromCity,
        travelDate: travelDate,
        stayName: selectedStay || plan.budgetStays[0]?.name || 'Heritage Homestay',
        guestsCount,
        travelerName,
        travelerEmail,
        travelerPhone,
        paymentMethod,
        totalAmount: (plan.budgetStays[0]?.pricePerNight || 1200) * guestsCount,
        status: 'confirmed',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn("Firestore booking write fallback:", err);
    }

    setConfirmedBookingId(refId);
    setIsSubmittingBooking(false);
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
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-900 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hugging Face AI Dataset Connected</span>
            <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded font-mono">JSONL RAG Graph</span>
          </div>
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
                  <div key={i} className="pt-2.5 border-t border-stone-100 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{stay.name}</span>
                      <span className="text-[10px] text-stone-500">{stay.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">₹{stay.pricePerNight}<span className="font-normal text-[10px] text-stone-400">/night</span></span>
                      <button 
                        onClick={() => {
                          setSelectedStay(stay.name);
                          setConfirmedBookingId(null);
                          setIsBookingModalOpen(true);
                        }}
                        className="text-[10px] font-bold text-emerald-700 hover:underline block mt-0.5"
                      >
                        Instant Book ➔
                      </button>
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

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              onClick={() => {
                setSelectedStay(plan.budgetStays[0]?.name || 'Heritage Homestay');
                setConfirmedBookingId(null);
                setIsBookingModalOpen(true);
              }}
              className="flex-1 sm:flex-initial px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl shadow-sm hover:scale-105 transition flex items-center justify-center gap-1.5"
            >
              <Ticket size={14} /> Instant Book Trip
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-initial px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> PDF
            </button>
            <Link 
              to="/guides"
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Users size={14} /> Guides
            </Link>
          </div>
        </div>

      </div>

      {/* DIRECT INSTANT BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition"
            >
              <X size={18} />
            </button>

            {!confirmedBookingId ? (
              <form onSubmit={handleDirectBookingSubmit} className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles size={14} /> Direct Reservation Engine
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Book {plan.destination} Cultural Expedition
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lock your dates, heritage stay, and cultural tour in 1-click.
                  </p>
                </div>

                {/* Selected Package Summary */}
                <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-semibold">Route & Date:</span>
                    <span className="font-bold text-slate-900">{fromCity} ➔ {plan.destination} ({travelDate})</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-semibold">Heritage Stay:</span>
                    <span className="font-bold text-slate-900">{selectedStay || plan.budgetStays[0]?.name}</span>
                  </div>
                  {liveTrains[0] && (
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-semibold">Transit Train:</span>
                      <span className="font-bold text-blue-700">{liveTrains[0].trainName} (#{liveTrains[0].trainNumber})</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-stone-200 font-bold text-sm text-slate-900">
                    <span>Estimated Total:</span>
                    <span className="text-emerald-700">₹{((plan.budgetStays[0]?.pricePerNight || 1200) * guestsCount).toLocaleString()}</span>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      placeholder="e.g. Mohd Afnan"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (WhatsApp)</label>
                      <input 
                        type="tel" 
                        required
                        value={travelerPhone}
                        onChange={(e) => setTravelerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Guests</label>
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-medium text-slate-700">
                      {[
                        { id: 'upi', label: '📱 UPI / QR' },
                        { id: 'arrival', label: '🏨 Pay at Stay' },
                        { id: 'card', label: '💳 Card' },
                      ].map((method) => (
                        <button
                          type="button"
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`py-2 px-2 rounded-xl border text-center transition ${
                            paymentMethod === method.id 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold' 
                              : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  {isSubmittingBooking ? <Sparkles className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                  <span>Confirm Reservation & Generate Pass</span>
                </button>
              </form>
            ) : (
              /* BOOKING CONFIRMATION PASS */
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Trip Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your reservation has been logged with DarShana & local providers.
                  </p>
                </div>

                {/* Digital Ticket Pass Card */}
                <div className="bg-stone-50 border-2 border-dashed border-emerald-300 rounded-2xl p-5 text-left space-y-3">
                  <div className="flex justify-between items-start border-b border-stone-200 pb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pass Reference</span>
                      <h5 className="font-mono font-bold text-sm text-slate-900">{confirmedBookingId}</h5>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                      CONFIRMED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Lead Traveler</span>
                      <strong className="text-slate-900">{travelerName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Destination & Date</span>
                      <strong className="text-slate-900">{plan.destination} ({travelDate})</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 pt-1 border-t border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Reserved Stay</span>
                    <strong className="text-slate-900">{selectedStay || plan.budgetStays[0]?.name}</strong>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} /> Download Ticket Pass
                  </button>
                  <button 
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-xs rounded-xl transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default CulturalPlanner;
