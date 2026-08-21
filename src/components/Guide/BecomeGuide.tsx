import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Check,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Star,
  Clock,
  Languages,
  DollarSign,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  Building,
  Calendar
} from 'lucide-react';
import { registerNewGuide } from '../../api/guides';

const SPECIALTY_OPTIONS = [
  'Taj Mahal Sunrise Tour',
  'Heritage Walks',
  'Ghats & Ancient Temples',
  'Mughal History & Architecture',
  'Forts & Palaces',
  'Old City Food Walk',
  'Culinary & Street Food',
  'Photography Tours',
  'Backwaters Canoe Trail',
  'Mountain Treks',
  'Village Culture'
];

const LANGUAGE_OPTIONS = [
  'Hindi',
  'English',
  'Urdu',
  'Bengali',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Malayalam',
  'Kannada',
  'French',
  'German',
  'Spanish',
  'Japanese'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80'
];

export const BecomeGuide: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cityLocation, setCityLocation] = useState('Agra, Uttar Pradesh');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(['Taj Mahal Sunrise Tour', 'Heritage Walks']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English', 'Hindi']);
  const [pricePerDay, setPricePerDay] = useState<number>(1800);
  const [experienceYears, setExperienceYears] = useState<number>(6);
  const [govtIdNumber, setGovtIdNumber] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await registerNewGuide({
        name: fullName,
        email,
        phone: phone || '+91 98765 43210',
        location: cityLocation,
        specialties: selectedSpecialties,
        languages: selectedLanguages,
        pricePerDay: Number(pricePerDay) || 1500,
        experience: Number(experienceYears) || 3,
        govtId: govtIdNumber || `MOT-IN-UP-${Math.floor(1000 + Math.random() * 9000)}`,
        bio: bio || `Certified local guide with ${experienceYears} years of experience leading tours across ${cityLocation}.`,
        profileImage: selectedAvatar
      });
      setIsSubmitted(true);
    } catch (err) {
      console.warn('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans pb-20">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-stone-200 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-100 border border-amber-200 text-amber-900 rounded-full text-xs font-bold">
              <ShieldCheck size={14} className="text-amber-700" />
              <span>Ministry of Tourism & State Certified Partner Program</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-slate-900">
              Join India's Verified Guide Network
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Get direct traveler bookings, set your daily tour rate, and grow your local storytelling practice with 0% middleman commission.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 max-w-4xl mx-auto">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 block">₹35,000+</span>
              <span className="text-xs text-slate-500 font-medium">Avg Monthly Earnings</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center">
              <span className="text-xl sm:text-2xl font-bold text-amber-600 block">100%</span>
              <span className="text-xs text-slate-500 font-medium">Direct Guide Payouts</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 block">10,000+</span>
              <span className="text-xs text-slate-500 font-medium">Monthly Travelers</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center">
              <span className="text-xl sm:text-2xl font-bold text-emerald-600 block">Govt Verified</span>
              <span className="text-xs text-slate-500 font-medium">Official Shield Badge</span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {isSubmitted ? (
          /* SUCCESS STATE */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Application Submitted!</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Welcome, <strong>{fullName}</strong>. Your guide profile has been submitted to the DarShana Admin verification queue.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left text-xs space-y-2 text-amber-950">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldCheck size={16} className="text-amber-700" />
                <span>Verification Workflow</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                Once our verification team approves your license credentials in the Admin Dashboard, your profile will be published with the <strong>Govt Verified</strong> badge on the public directory.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/admin"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <ShieldCheck size={15} />
                <span>Open Admin Approval Panel</span>
              </Link>
              <Link
                to="/guides"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>View Public Guides</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* FORM + LIVE PREVIEW 2-COLUMN LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: 3-Step SaaS Registration Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              
              {/* Progress Steps Header */}
              <div className="bg-stone-50 border-b border-stone-200 p-4 flex items-center justify-between text-xs font-semibold">
                <div className={`flex items-center gap-2 ${step === 1 ? 'text-amber-700 font-bold' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= 1 ? 'bg-slate-900 text-white' : 'bg-stone-200 text-slate-600'
                  }`}>
                    1
                  </span>
                  <span>Personal</span>
                </div>
                <div className="w-8 h-0.5 bg-stone-200" />
                <div className={`flex items-center gap-2 ${step === 2 ? 'text-amber-700 font-bold' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= 2 ? 'bg-slate-900 text-white' : 'bg-stone-200 text-slate-600'
                  }`}>
                    2
                  </span>
                  <span>Tours & Lang</span>
                </div>
                <div className="w-8 h-0.5 bg-stone-200" />
                <div className={`flex items-center gap-2 ${step === 3 ? 'text-amber-700 font-bold' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= 3 ? 'bg-slate-900 text-white' : 'bg-stone-200 text-slate-600'
                  }`}>
                    3
                  </span>
                  <span>Rate & License</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                
                {/* STEP 1: Personal Profile */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900">Personal & Contact Info</h3>
                      <p className="text-xs text-slate-500">Provide your official name and main operating city.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Vikramaditya Sharma"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Operating City / Region *</label>
                        <input
                          type="text"
                          required
                          value={cityLocation}
                          onChange={(e) => setCityLocation(e.target.value)}
                          placeholder="e.g. Agra, Uttar Pradesh"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. guide@darshana.com"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 00000"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>

                    {/* Avatar Selection */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-semibold text-slate-700">Choose Profile Photo</label>
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                        {PRESET_AVATARS.map((av, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setSelectedAvatar(av)}
                            className={`w-13 h-13 rounded-2xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                              selectedAvatar === av ? 'border-amber-600 scale-105 shadow-sm' : 'border-stone-200 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={!fullName.trim() || !email.trim()}
                        onClick={() => setStep(2)}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <span>Next: Tours & Languages</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Specialties & Languages */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900">Tour Specialties & Languages</h3>
                      <p className="text-xs text-slate-500">Select what tours you lead and what languages you speak.</p>
                    </div>

                    {/* Specialties */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">Specialized Tours</label>
                      <div className="flex flex-wrap gap-1.5">
                        {SPECIALTY_OPTIONS.map((spec) => (
                          <button
                            type="button"
                            key={spec}
                            onClick={() => toggleSpecialty(spec)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                              selectedSpecialties.includes(spec)
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'bg-stone-50 hover:bg-stone-100 border border-stone-300 text-slate-700'
                            }`}
                          >
                            {spec}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-semibold text-slate-700">Spoken Languages</label>
                      <div className="flex flex-wrap gap-1.5">
                        {LANGUAGE_OPTIONS.map((lang) => (
                          <button
                            type="button"
                            key={lang}
                            onClick={() => toggleLanguage(lang)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                              selectedLanguages.includes(lang)
                                ? 'bg-slate-900 text-white shadow-2xs'
                                : 'bg-stone-50 hover:bg-stone-100 border border-stone-300 text-slate-700'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="pt-1">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Short Storytelling Bio
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="e.g. Certified guide with 8 years leading sunrise tours of Taj Mahal, Agra Fort architecture, and local food markets..."
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 border border-stone-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-stone-50 transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <span>Next: Rate & License</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Rate & Verification */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900">Daily Rate & Verification</h3>
                      <p className="text-xs text-slate-500">Set your standard daily fee and provide government certification.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Fee Rate (₹ / day) *</label>
                        <input
                          type="number"
                          min="500"
                          max="20000"
                          required
                          value={pricePerDay}
                          onChange={(e) => setPricePerDay(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience *</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          required
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Govt Tourism License / Certification ID *</label>
                        <input
                          type="text"
                          required
                          value={govtIdNumber}
                          onChange={(e) => setGovtIdNumber(e.target.value)}
                          placeholder="e.g. MOT-IN-UP-8842 or State Tourism Board ID"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-700 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-slate-900">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        Verification Protocol
                      </span>
                      <p className="text-[11px] leading-relaxed text-slate-600">
                        After submitting, your profile enters the Admin verification panel. Once verified, your status turns active on the public Local Guides directory.
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-4 py-2 border border-stone-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-stone-50 transition cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-7 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>{isSubmitting ? 'Submitting Application...' : 'Submit Profile for Approval'}</span>
                        <Check size={15} />
                      </button>
                    </div>
                  </motion.div>
                )}

              </form>

            </div>

            {/* Right: Real-Time Live Card Preview */}
            <div className="lg:col-span-5 sticky top-24 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-600" />
                  <span>Live Public Card Preview</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Updates in real time</span>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-md">
                <div className="relative h-56 bg-slate-900 overflow-hidden">
                  <img
                    src={selectedAvatar}
                    alt="Preview"
                    className="w-full h-full object-cover filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={11} />
                    <span>Govt Certified</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-slate-950/80 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>5.0 (New)</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-[11px] text-amber-400 uppercase font-bold flex items-center gap-1">
                      <MapPin size={11} /> {cityLocation || 'Your City, State'}
                    </p>
                    <h3 className="text-lg font-serif font-bold leading-snug">
                      {fullName || 'Your Full Name'}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {bio || `Certified local guide with ${experienceYears} years of experience leading tours across ${cityLocation}.`}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {selectedSpecialties.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-semibold rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[150px]">{selectedLanguages.join(', ')}</span>
                    <span className="font-semibold text-slate-700">{experienceYears}y exp</span>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Daily Rate</span>
                    <span className="font-bold text-slate-900 text-sm">₹{pricePerDay || 1500} / day</span>
                  </div>
                  <span className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xs">
                    Book Guide
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default BecomeGuide;
