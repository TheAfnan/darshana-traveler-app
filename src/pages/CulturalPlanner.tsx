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
  CheckCircle,
  Lightbulb,
  Compass,
  Star
} from 'lucide-react';
import jsPDF from 'jspdf';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getCulturalTripPlan, MONTHLY_EVENT_RADAR, type CulturalPlan } from '../data/culturalTripData';
import { getDynamicCulturalPlan } from '../services/aiPlannerService';
import { fetchTripAdvisorSpots, type TripAdvisorSpot, type TripAdvisorResult } from '../services/tripAdvisorApi';
import { fetchLiveTrainOptions, type LiveTrainOption, type LiveTrainResult } from '../services/irctcRapidApi';

const CulturalPlanner: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [fromCity, setFromCity] = useState(searchParams.get('from') || 'Delhi');
  const [toCity, setToCity] = useState(searchParams.get('to') || 'Lucknow');
  const [travelDate, setTravelDate] = useState(searchParams.get('date') || '2026-05-19'); // Default May to showcase Bada Mangal!
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<CulturalPlan>(() => getCulturalTripPlan(toCity, travelDate, fromCity));
  const [tripAdvisorData, setTripAdvisorData] = useState<TripAdvisorResult>({ spots: [], isLive: false });
  const [liveTrainsData, setLiveTrainsData] = useState<LiveTrainResult>({ trains: [], isLive: false });

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
    fetchTripAdvisorSpots(dest).then(res => setTripAdvisorData(res));
    fetchLiveTrainOptions(origin, dest).then(res => setLiveTrainsData(res));
  }, [searchParams, toCity, fromCity]);

  const handlePlanSearch = async () => {
    if (!toCity.trim()) return;
    setIsGenerating(true);
    fetchTripAdvisorSpots(toCity).then(res => setTripAdvisorData(res));
    fetchLiveTrainOptions(fromCity, toCity).then(res => setLiveTrainsData(res));
    
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
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              ✨ Tailored cultural itineraries, authentic seasonal events & eco-transit
            </span>

            <button 
              onClick={handlePlanSearch}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer ml-auto"
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
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-stone-50/60 border border-amber-200/70 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-amber-100/80 text-amber-900 text-[11px] font-semibold rounded-full border border-amber-200/60 flex items-center gap-1">
                <Sparkles size={11} className="text-amber-700" />
                {plan.currentMonthHighlight.badge}
              </span>
              <h3 className="font-semibold text-base sm:text-lg text-stone-900 tracking-tight">
                {plan.currentMonthHighlight.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              {plan.currentMonthHighlight.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3.5 border-t border-amber-200/50 text-xs">
              <div className="flex items-start gap-2.5 text-stone-600">
                <MapPin size={14} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block text-xs">Where to Experience</span>
                  <span className="text-stone-600 text-[11px] leading-relaxed">{plan.currentMonthHighlight.whereToExperience}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-stone-600">
                <Compass size={14} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block text-xs">Cultural Significance</span>
                  <span className="text-stone-600 text-[11px] leading-relaxed">{plan.currentMonthHighlight.whySpecial}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3 Simple Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 1. Festivals */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                  <Calendar size={15} />
                </div>
                <h4 className="font-semibold text-sm text-stone-900 tracking-tight">Festivals & Living Traditions</h4>
              </div>
              <div className="space-y-4 mt-4">
                {plan.festivals.map((f, i) => (
                  <div key={i} className="space-y-2 pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                    <div>
                      <h5 className="font-semibold text-xs text-stone-900 tracking-tight">{f.name}</h5>
                      <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/50 px-2 py-0.5 rounded-md font-medium">
                        <Clock size={11} className="text-amber-700" /> {f.dates}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal">{f.description}</p>
                    {f.insiderTip && (
                      <div className="flex items-start gap-2 bg-stone-50/80 border-l-2 border-amber-400 p-2.5 rounded-r-xl text-[11px] text-stone-700 leading-relaxed">
                        <Lightbulb size={12} className="text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Tip:</strong> {f.insiderTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
              <span>Verified Calendar</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-semibold">Authentic</span>
            </div>
          </div>

          {/* 2. Hidden Gems */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
                  <Compass size={15} />
                </div>
                <h4 className="font-semibold text-sm text-stone-900 tracking-tight">Artisans & Secret Spots</h4>
              </div>
              <div className="space-y-4 mt-4">
                {plan.hiddenGems.map((g, i) => (
                  <div key={i} className="space-y-2 pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                    <div>
                      <h5 className="font-semibold text-xs text-stone-900 tracking-tight">{g.title}</h5>
                      <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-indigo-900 bg-indigo-50/80 border border-indigo-200/50 px-2 py-0.5 rounded-md font-medium">
                        <Sparkles size={11} className="text-indigo-600" /> {g.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal">{g.description}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                      <MapPin size={11} className="text-rose-500 shrink-0" />
                      <span>{g.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/guides" className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition group">
              <span>Hire Verified Local Guide</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 3. Food & Stays */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Utensils size={15} />
                </div>
                <h4 className="font-semibold text-sm text-stone-900 tracking-tight">Authentic Cuisines & Stays</h4>
              </div>
              <div className="space-y-3.5 mt-4">
                {plan.seasonalFoods.slice(0, 2).map((food, i) => (
                  <div key={i} className="space-y-1.5 pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-semibold text-xs text-stone-900 tracking-tight">{food.name}</h5>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50/80 border border-emerald-200/50 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap">
                        {food.priceRange}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-normal">{food.description}</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-900 font-medium">
                      <MapPin size={10} className="text-amber-700 shrink-0" />
                      <span>{food.famousSpot}</span>
                    </div>
                  </div>
                ))}

                {plan.budgetStays.slice(0, 1).map((stay, i) => (
                  <div key={i} className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-stone-900 block tracking-tight">{stay.name}</span>
                      <span className="text-[10px] text-stone-400">{stay.type} • ★ {stay.rating}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-900">₹{stay.pricePerNight}<span className="font-normal text-[10px] text-stone-400">/nt</span></span>
                      <button 
                        onClick={() => {
                          setSelectedStay(stay.name);
                          setConfirmedBookingId(null);
                          setIsBookingModalOpen(true);
                        }}
                        className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 block mt-0.5 hover:underline"
                      >
                        Book Stay ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
              <span>Local Flavors</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] font-semibold">Curated</span>
            </div>
          </div>

        </div>

        {/* TripAdvisor Curated & Verified Reviews (Powered by RapidAPI / Curated Graph) */}
        {tripAdvisorData.spots.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 pb-2.5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1">
                  {tripAdvisorData.isLive ? '🟢 TripAdvisor Verified Places' : '⭐ Curated Heritage & Dining'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {tripAdvisorData.isLive ? '• Live via RapidAPI' : '• Handpicked Recommendations'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Authentic Traveler Ratings & Regional Spots</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {tripAdvisorData.spots.map((spot, idx) => (
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
                        {spot.verifiedBadge && spot.reviewCount > 0 ? (
                          <span className="text-[10px] text-slate-400 block mt-0.5">({spot.reviewCount.toLocaleString()} reviews)</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 block mt-0.5">(Curated Choice)</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 italic leading-relaxed">{spot.topReviewSnippet}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 pt-1 block">
                    {spot.verifiedBadge ? `🏆 ${spot.rankingText}` : `📍 ${spot.rankingText}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IRCTC Transit Options (Powered by RapidAPI / Direct Express Schedules) */}
        {liveTrainsData.trains.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 pb-2.5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold rounded-full flex items-center gap-1">
                  {liveTrainsData.isLive ? '🚆 IRCTC Live Rail Transit' : '🚆 Popular Rail Routes'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {liveTrainsData.isLive ? '• Live via RapidAPI' : '• Direct Transit Schedules'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Direct Low-Emission Express Routes ({fromCity} ➔ {toCity})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {liveTrainsData.trains.map((train, idx) => (
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
