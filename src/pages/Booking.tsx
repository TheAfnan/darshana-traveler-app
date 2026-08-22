import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  Printer,
  ChevronRight,
  Phone,
  Mail,
  User,
  Heart,
  Check,
  CreditCard,
  Building,
  Plane,
  RotateCcw,
  Leaf,
  Key,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEcoRewards } from '../context/EcoRewardsContext';
import { bookingApi } from '../services/api';
import { 
  getRazorpayKey, 
  setCustomRazorpayKey, 
  launchRazorpayCheckout 
} from '../services/razorpay';

interface PackageOption {
  id: string;
  name: string;
  pricePerPerson: number;
  ecoPoints: number;
  badge?: string;
  badgeType?: 'popular' | 'premium' | 'value';
  description: string;
  perks: string[];
}

const PACKAGES: PackageOption[] = [
  {
    id: 'slot-hold',
    name: 'Quick Slot Hold',
    pricePerPerson: 500,
    ecoPoints: 30,
    badge: 'Best Value',
    badgeType: 'value',
    description: 'Lock in your travel dates immediately and finalize itinerary details later.',
    perks: ['48-hour confirmed slot lock', 'Free date reschedule once', 'Digital travel guide included']
  },
  {
    id: 'guided-day',
    name: 'Guided Cultural Day Tour',
    pricePerPerson: 1200,
    ecoPoints: 60,
    badge: 'Most Picked',
    badgeType: 'popular',
    description: 'Full day curated monument trails, local storytelling, and food walks.',
    perks: ['Govt-certified local guide', '2 curated heritage trails', 'Skip-the-line monument help', 'Curated street food stop']
  },
  {
    id: 'weekend-heritage',
    name: 'All-Inclusive Heritage Weekend',
    pricePerPerson: 2500,
    ecoPoints: 120,
    badge: 'Premium Experience',
    badgeType: 'premium',
    description: 'Immersive multi-day expedition with artisan workshops and evening riverfront/ghat walks.',
    perks: ['Private dedicated guide', 'Exclusive artisan interactions', 'Evening cultural performance', 'Priority hotel & dining concierge']
  }
];

const DESTINATIONS = [
  'Lucknow, Uttar Pradesh',
  'Agra, Uttar Pradesh',
  'Varanasi, Uttar Pradesh',
  'Jaipur, Rajasthan',
  'Udaipur, Rajasthan',
  'Goa Beach Circuit',
  'Delhi Historic Heart',
  'Kerala Backwaters',
  'Amritsar, Punjab',
  'Hampi, Karnataka'
];

export const Booking: React.FC = () => {
  const { user } = useAuth();
  const { earnPoints } = useEcoRewards();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Selected package
  const [selectedPkgId, setSelectedPkgId] = useState<string>('guided-day');
  
  // Traveler details form
  const [destination, setDestination] = useState<string>(
    searchParams.get('destination') || searchParams.get('city') || 'Lucknow, Uttar Pradesh'
  );
  const [travelDate, setTravelDate] = useState<string>(
    searchParams.get('date') || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [guestCount, setGuestCount] = useState<number>(
    parseInt(searchParams.get('guests') || '2') || 2
  );
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Add-on options
  const [addDedicatedGuide, setAddDedicatedGuide] = useState<boolean>(false);
  const [guideLanguage, setGuideLanguage] = useState<string>('Hindi & English');

  // Form Validation State
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment & Submission State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [bookingSuccessData, setBookingSuccessData] = useState<any>(null);

  // Razorpay API Setup Modal State
  const [showRzpModal, setShowRzpModal] = useState<boolean>(false);
  const [rzpKeyInput, setRzpKeyInput] = useState<string>(getRazorpayKey());
  const [rzpKeySaved, setRzpKeySaved] = useState<boolean>(false);

  // Validate form fields
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      errs.phone = 'Please enter your contact number';
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!travelDate) {
      errs.travelDate = 'Please select your travel date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  // Price Calculations
  const activePackage = PACKAGES.find(p => p.id === selectedPkgId) || PACKAGES[1];
  const basePrice = activePackage.pricePerPerson * guestCount;
  const guideAddonPrice = addDedicatedGuide ? 800 : 0;
  const subtotal = basePrice + guideAddonPrice;
  const taxesGst = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + taxesGst;

  // Main Checkout Flow
  const handleProceedToPay = async () => {
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      travelDate: true
    });

    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    await launchRazorpayCheckout({
      amount: grandTotal,
      packageName: activePackage.name,
      destination: destination,
      userName: fullName,
      userEmail: email,
      userPhone: `${countryCode}${phone}`,
      onSuccess: async (paymentId, orderId) => {
        await finalizeBooking(paymentId);
      },
      onFailure: (errorMsg) => {
        setIsProcessing(false);
        setPaymentError(errorMsg || 'Payment did not go through. Please try another card or UPI method.');
        setTimeout(() => {
          const banner = document.getElementById('booking-payment-error-banner');
          if (banner) banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      },
      onDismiss: () => {
        setIsProcessing(false);
        setPaymentError('Payment window was dismissed. You can review your details and try again anytime.');
        setTimeout(() => {
          const banner = document.getElementById('booking-payment-error-banner');
          if (banner) banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    });
  };

  const finalizeBooking = async (transactionId: string) => {
    const bookingCode = `DS-BK-${Math.floor(10000 + Math.random() * 90000)}`;

    const bookingPayload = {
      destination,
      checkIn: travelDate,
      checkOut: travelDate,
      guests: guestCount,
      roomType: activePackage.name,
      contactName: fullName,
      contactEmail: email,
      contactPhone: `${countryCode} ${phone}`,
      specialRequests: `${specialRequests} ${addDedicatedGuide ? `[Dedicated Guide in ${guideLanguage}]` : ''}`,
      totalAmount: grandTotal,
      transactionId: transactionId,
      bookingCode: bookingCode,
      createdAt: new Date().toISOString()
    };

    try {
      await bookingApi.create(bookingPayload);
    } catch (e) {
      console.warn('API sync warning, cached locally:', e);
    }

    // Award Eco Points upfront on successful booking!
    const earnedPts = activePackage.ecoPoints * guestCount;
    earnPoints(earnedPts, `Booked ${activePackage.name} (${guestCount} travelers)`, 'stay', earnedPts * 0.4);

    try {
      const existing = JSON.parse(localStorage.getItem('darshana_my_trips') || '[]');
      existing.unshift(bookingPayload);
      localStorage.setItem('darshana_my_trips', JSON.stringify(existing));
    } catch {
      // Ignored
    }

    setBookingSuccessData(bookingPayload);
    setIsProcessing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveRzpKey = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomRazorpayKey(rzpKeyInput);
    setRzpKeySaved(true);
    setTimeout(() => {
      setRzpKeySaved(false);
      setShowRzpModal(false);
    }, 1200);
  };

  const currentRzpKey = getRazorpayKey();

  // SUCCESS SCREEN
  if (bookingSuccessData) {
    return (
      <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Razorpay Payment & Reservation Confirmed</span>
              <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900">Your Journey is Booked!</h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{bookingSuccessData.contactName}</strong>. A confirmation voucher has been dispatched to <strong>{bookingSuccessData.contactEmail}</strong>.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl">
              <span className="text-xs text-slate-500 font-semibold">Booking ID:</span>
              <span className="font-mono font-bold text-base text-slate-900">{bookingSuccessData.bookingCode}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-orange-600" />
                <span>Reservation Summary</span>
              </h3>
              <button
                onClick={() => window.print()}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 p-2 rounded-xl hover:bg-stone-50 transition cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Voucher</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Destination</span>
                <p className="font-bold text-sm text-slate-900">{bookingSuccessData.destination}</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Package Choice</span>
                <p className="font-bold text-sm text-slate-900">{bookingSuccessData.roomType}</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Travel Date</span>
                <p className="font-bold text-sm text-slate-900">{bookingSuccessData.checkIn}</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Travelers</span>
                <p className="font-bold text-sm text-slate-900">{bookingSuccessData.guests} Guest(s)</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Amount Paid</span>
                <span className="text-xl font-extrabold text-emerald-950">₹{bookingSuccessData.totalAmount}</span>
              </div>
              <div className="text-right text-[11px] text-emerald-800 font-medium">
                <span>Verified via Razorpay</span>
                <p className="font-mono text-[10px] text-emerald-700">{bookingSuccessData.transactionId}</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/my-trips"
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>View in My Trips</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/rewards"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Leaf size={14} />
                <span>View Earned Eco Rewards</span>
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-slate-700 text-xs font-semibold rounded-xl transition text-center cursor-pointer"
              >
                Back to Home
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans pb-24">
      
      {/* Razorpay Setup Modal */}
      {showRzpModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 text-orange-700 rounded-xl">
                  <CreditCard size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Razorpay API Configuration</h3>
              </div>
              <button onClick={() => setShowRzpModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your Razorpay Key ID (starting with <code>rzp_test_...</code> or <code>rzp_live_...</code>) for live UPI QR, Debit/Credit Card, and NetBanking payments.
            </p>

            <form onSubmit={handleSaveRzpKey} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Razorpay Key ID</label>
                <input
                  type="text"
                  value={rzpKeyInput}
                  onChange={(e) => setRzpKeyInput(e.target.value)}
                  placeholder="e.g. rzp_test_1DP5mmOlF5G5ag"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="text-[11px] text-slate-500">
                <span>Get free test key: </span>
                <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noreferrer" className="text-orange-700 font-semibold underline inline-flex items-center gap-1">
                  <span>Razorpay Dashboard</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              {rzpKeySaved && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={15} />
                  <span>Razorpay key saved successfully!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRzpKeyInput('');
                    setCustomRazorpayKey('');
                    setRzpKeySaved(true);
                    setTimeout(() => { setRzpKeySaved(false); setShowRzpModal(false); }, 1000);
                  }}
                  className="px-3.5 py-2 border border-stone-200 text-xs font-semibold text-slate-600 rounded-xl hover:bg-stone-50"
                >
                  Reset Demo Mode
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Slim Context Header */}
      <div className="bg-white border-b border-stone-200 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-3">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <ChevronRight size={12} />
            <Link to="/travelhub" className="hover:text-slate-900">Travel Hub</Link>
            <ChevronRight size={12} />
            <span className="text-orange-700 font-semibold">Reserve Experience</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900">
                Book Your India Journey
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Curated cultural experiences with verified local guides & instant confirmation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Razorpay Config Pill */}
              <button
                onClick={() => setShowRzpModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-full text-xs font-semibold transition cursor-pointer shadow-2xs"
                title="Configure Razorpay Gateway Key"
              >
                <Key size={12} className={currentRzpKey ? 'text-emerald-600' : 'text-amber-600'} />
                <span>Razorpay Key</span>
                <span className={`w-2 h-2 rounded-full ${currentRzpKey ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold shrink-0">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>100% Guaranteed</span>
              </div>
            </div>
          </div>

          {/* 3-Step Indicator */}
          <div className="pt-3 flex items-center gap-2 sm:gap-4 text-xs font-semibold overflow-x-auto pb-1">
            <span className="flex items-center gap-1.5 text-orange-700 font-bold shrink-0">
              <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Package Selection</span>
            </span>
            <div className="w-6 h-0.5 bg-stone-200 shrink-0" />
            <span className="flex items-center gap-1.5 text-slate-700 font-bold shrink-0">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Traveler Details</span>
            </span>
            <div className="w-6 h-0.5 bg-stone-200 shrink-0" />
            <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
              <span className="w-5 h-5 rounded-full bg-stone-200 text-slate-600 flex items-center justify-center text-[10px]">3</span>
              <span>Razorpay Checkout</span>
            </span>
          </div>

        </div>
      </div>

      {/* Main 2-Column Booking Flow */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {paymentError && (
          <div id="booking-payment-error-banner" className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-rose-900">Payment Notice</p>
                <p className="text-xs text-rose-700 leading-relaxed mt-0.5">{paymentError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleProceedToPay}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-2xs transition cursor-pointer"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => setPaymentError('')}
                className="p-1.5 text-rose-500 hover:text-rose-800 rounded-lg hover:bg-rose-100 transition cursor-pointer"
                title="Dismiss Notice"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (65% width): Package Selection & Traveler Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Package Selection Cards */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-orange-600" />
                    <span>Step 1: Choose Your Experience Tier</span>
                  </h2>
                  <p className="text-xs text-slate-500">Select the package format that best suits your travel style.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-stretch">
                {PACKAGES.map((pkg) => {
                  const isSelected = selectedPkgId === pkg.id;
                  
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-orange-600 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      {/* Top Right Badge */}
                      {pkg.badge && (
                        <div className="mb-2 self-end">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            pkg.badgeType === 'popular'
                              ? 'bg-orange-600 text-white'
                              : pkg.badgeType === 'premium'
                              ? 'bg-slate-900 text-amber-300'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {pkg.badge}
                          </span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h3 className="font-bold text-sm text-slate-900 leading-snug">{pkg.name}</h3>
                        
                        <div>
                          <span className="text-xl font-extrabold text-slate-900">₹{pkg.pricePerPerson}</span>
                          <span className="text-[11px] text-slate-500 font-medium"> / person</span>
                        </div>

                        {/* Upfront Eco Point Badge */}
                        <div className="pt-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-md">
                            <Leaf size={11} className="text-emerald-600" />
                            <span>+{pkg.ecoPoints} pts · Eco Choice</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{pkg.description}</p>

                        <div className="pt-2 border-t border-stone-100 space-y-1">
                          {pkg.perks.map((perk, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                              <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition ${
                          isSelected
                            ? 'bg-orange-600 text-white shadow-2xs'
                            : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Select Package'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Traveler Details Form */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User size={16} className="text-orange-600" />
                  <span>Step 2: Traveler Information</span>
                </h2>
                <p className="text-xs text-slate-500">Provide the lead traveler contact details for voucher & coordination.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Destination Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination City / Region *
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-600"
                  >
                    {DESTINATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Travel Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Travel / Tour Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    onBlur={() => handleBlur('travelDate')}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-orange-600"
                  />
                  {touched.travelDate && errors.travelDate && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{errors.travelDate}</span>
                  )}
                </div>

                {/* Number of Travelers */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Guests / Travelers *
                  </label>
                  <div className="flex items-center gap-3 bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-200 text-slate-800 font-bold hover:bg-stone-100 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-xs text-slate-900">{guestCount} Traveler{guestCount > 1 ? 's' : ''}</span>
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-200 text-slate-800 font-bold hover:bg-stone-100 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lead Traveler Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="e.g. Aryan Sharma"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                  />
                  {touched.fullName && errors.fullName && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{errors.fullName}</span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (for instant voucher) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="e.g. aryan@traveler.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                  />
                  {touched.email && errors.email && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{errors.email}</span>
                  )}
                </div>

                {/* Phone Number with Country Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-20 px-2 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+61">🇦🇺 +61</option>
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="98765 43210"
                      className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{errors.phone}</span>
                  )}
                </div>

              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Requests / Dietary Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Vegetarian food preferences, senior citizen assistance, sunrise photography timing..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                />
              </div>

            </div>

            {/* Optional Add-on: Dedicated Certified Guide */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Add Certified Local Heritage Guide</h3>
                    <p className="text-xs text-slate-500">
                      Personalized 1-on-1 storytelling, history secrets & local hidden gem access.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-slate-900 block">+₹800</span>
                  <button
                    type="button"
                    onClick={() => setAddDedicatedGuide(!addDedicatedGuide)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      addDedicatedGuide
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                    }`}
                  >
                    {addDedicatedGuide ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              </div>

              {addDedicatedGuide && (
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Preferred Language:</span>
                  <select
                    value={guideLanguage}
                    onChange={(e) => setGuideLanguage(e.target.value)}
                    className="px-2.5 py-1 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-slate-900"
                  >
                    <option value="Hindi & English">Hindi & English</option>
                    <option value="English Only">English Only</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (35% width - Sticky): Price Summary & Razorpay Checkout */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5">
              
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Price Summary</span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">{activePackage.name}</h3>
                <p className="text-xs text-slate-500">{destination}</p>
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Base Price ({guestCount} Guest{guestCount > 1 ? 's' : ''})</span>
                  <span className="font-semibold text-slate-900">₹{basePrice}</span>
                </div>

                {addDedicatedGuide && (
                  <div className="flex justify-between text-amber-800">
                    <span>Certified Guide Add-on</span>
                    <span className="font-semibold">+₹{guideAddonPrice}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxes & GST (5%)</span>
                  <span className="font-semibold text-slate-900">₹{taxesGst}</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
                  <span className="font-bold text-sm text-slate-900">Grand Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-orange-600">₹{grandTotal}</span>
                    <span className="text-[10px] text-slate-400 block">All inclusive</span>
                  </div>
                </div>
              </div>

              {/* Upfront Eco Points Award Notice */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Leaf size={14} className="text-emerald-600" />
                  <span>Eco-Points You'll Earn:</span>
                </span>
                <span className="text-emerald-700 font-mono font-extrabold">+{activePackage.ecoPoints * guestCount} pts</span>
              </div>

              {/* Main Pay Button */}
              <button
                type="button"
                onClick={handleProceedToPay}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 text-white font-extrabold rounded-2xl transition shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw size={16} className="animate-spin" />
                    <span>Launching Razorpay Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Proceed to Pay • ₹{grandTotal}</span>
                  </>
                )}
              </button>

              {/* Trust & Badges */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center justify-between text-emerald-800 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                    <span>100% Safe via Razorpay</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {currentRzpKey ? 'LIVE/TEST KEY' : 'DEMO MODE'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-stone-200/60">
                  <span>UPI • QR • GPay • PhonePe</span>
                  <span>Cards • NetBanking</span>
                </div>
              </div>

            </div>

            {/* Free Cancellation Notice */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Free Cancellation Policy</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Full 100% refund on cancellations requested up to 24 hours before your tour date.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Mobile Sticky Bottom Pay Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 px-4 flex items-center justify-between z-40 shadow-lg">
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Grand Total</span>
          <span className="text-xl font-extrabold text-orange-600">₹{grandTotal}</span>
        </div>

        <button
          type="button"
          onClick={handleProceedToPay}
          disabled={isProcessing}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Lock size={13} />
          <span>{isProcessing ? 'Processing...' : 'Proceed to Pay'}</span>
        </button>
      </div>

    </div>
  );
};

export default Booking;
