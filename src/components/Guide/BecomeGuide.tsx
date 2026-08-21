import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  FileText,
  Check,
  ArrowRight,
  Upload,
  AlertCircle,
  Briefcase,
  Globe,
  Award,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Sparkles
} from 'lucide-react';
import { registerNewGuide } from '../../api/guides';

const SPECIALTY_OPTIONS = [
  'Mughal Architecture',
  'Heritage Walks',
  'Ghats & Ancient Temples',
  'Spiritual Philosophy',
  'Forts & Palaces',
  'Awadhi Royal Cuisine',
  'Street Food & Culinary',
  'Photography',
  'Backwaters Eco-Trails',
  'Kathakali & Living Arts',
  'High-Altitude Trekking',
  'Wildlife & Birding'
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
  'Italian',
  'Japanese'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80'
];

export const BecomeGuide: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cityLocation, setCityLocation] = useState('Agra, Uttar Pradesh');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(['Heritage Walks', 'Mughal Architecture']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Hindi', 'English']);
  const [pricePerDay, setPricePerDay] = useState<number>(1500);
  const [experienceYears, setExperienceYears] = useState<number>(5);
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
        phone: phone || '+91 98765 00000',
        location: cityLocation,
        specialties: selectedSpecialties,
        languages: selectedLanguages,
        pricePerDay: Number(pricePerDay) || 1500,
        experience: Number(experienceYears) || 3,
        govtId: govtIdNumber || `MOT-IN-${Math.floor(1000 + Math.random() * 9000)}`,
        bio: bio || `Passionate local guide specializing in ${selectedSpecialties.join(', ')} with ${experienceYears} years of storytelling experience in ${cityLocation}.`,
        profileImage: selectedAvatar
      });
      setIsSubmitted(true);
    } catch (err) {
      console.warn('Registration submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-xs font-semibold shadow-2xs">
            <Award size={13} className="text-amber-700" />
            <span>DarShana Certified Guide Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Register as a Local Guide
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Join India's premier cultural tourism network. Showcase your historical expertise, set your own daily rates, and connect with verified travelers worldwide.
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          
          {/* Progress Step Bar */}
          {!isSubmitted && (
            <div className="bg-stone-50 border-b border-stone-100 p-4 flex items-center justify-between text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step >= 1 ? 'bg-slate-900 text-white' : 'bg-stone-200 text-slate-500'
                }`}>
                  1
                </span>
                <span className={step === 1 ? 'text-slate-900 font-bold' : ''}>Personal Profile</span>
              </div>
              <div className="w-12 h-0.5 bg-stone-200" />
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step >= 2 ? 'bg-slate-900 text-white' : 'bg-stone-200 text-slate-500'
                }`}>
                  2
                </span>
                <span className={step === 2 ? 'text-slate-900 font-bold' : ''}>Expertise & Languages</span>
              </div>
              <div className="w-12 h-0.5 bg-stone-200" />
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step >= 3 ? 'bg-slate-900 text-white' : 'bg-stone-200 text-slate-500'
                }`}>
                  3
                </span>
                <span className={step === 3 ? 'text-slate-900 font-bold' : ''}>Verification & Rates</span>
              </div>
            </div>
          )}

          {/* Submitted State */}
          {isSubmitted ? (
            <div className="p-8 sm:p-12 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-serif font-bold text-slate-900">Application Submitted!</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Thank you, <strong>{fullName}</strong>. Your guide profile has been registered and submitted to the <strong>DarShana Admin review queue</strong>.
                </p>
                <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 text-left space-y-1.5 mt-4">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck size={15} className="text-amber-700" />
                    <span>Admin Approval Workflow</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Once our verification team approves your Ministry ID / credentials in the Admin Dashboard, your profile will be published live with a Verified Guide badge on the public directory.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/admin"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <ShieldCheck size={14} />
                  <span>Open Admin Approval Panel</span>
                </Link>
                <Link
                  to="/guides"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <span>View Public Guides Directory</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              
              {/* STEP 1: Personal Profile */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Personal & Contact Details</h3>
                    <p className="text-xs text-slate-500">Provide your official name and primary destination region.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name (as per Govt ID) *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar Verma"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Operating City / Region *</label>
                      <input
                        type="text"
                        required
                        value={cityLocation}
                        onChange={(e) => setCityLocation(e.target.value)}
                        placeholder="e.g. Agra, Uttar Pradesh"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ramesh.guide@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-semibold text-slate-700">Select Profile Photograph Preset</label>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                      {PRESET_AVATARS.map((av, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setSelectedAvatar(av)}
                          className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                            selectedAvatar === av ? 'border-amber-600 scale-105 shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
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
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Continue to Specialties</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Specialties & Languages */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Specialties & Spoken Languages</h3>
                    <p className="text-xs text-slate-500">Highlight your domain expertise so travelers can discover you.</p>
                  </div>

                  {/* Specialties Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">Select Core Specialties</label>
                    <div className="flex flex-wrap gap-2">
                      {SPECIALTY_OPTIONS.map((spec) => (
                        <button
                          type="button"
                          key={spec}
                          onClick={() => toggleSpecialty(spec)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                            selectedSpecialties.includes(spec)
                              ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                              : 'bg-stone-50 hover:bg-stone-100 border border-stone-200 text-slate-700'
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Languages Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">Select Languages Spoken</label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <button
                          type="button"
                          key={lang}
                          onClick={() => toggleLanguage(lang)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                            selectedLanguages.includes(lang)
                              ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                              : 'bg-stone-50 hover:bg-stone-100 border border-stone-200 text-slate-700'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Professional Guide Bio & Storytelling Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. Certified archaeologist with 8 years guiding Taj Mahal sunrise tours, exploring hidden Mughal acoustics, and leading authentic Agra food walks..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 placeholder:text-stone-400 focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 border border-stone-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-stone-50 transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Continue to Verification</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Verification & Rates */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Govt Verification & Daily Fee</h3>
                    <p className="text-xs text-slate-500">Provide certification details and specify your standard tour rate.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Fee Rate (₹ / day) *</label>
                      <input
                        type="number"
                        min="500"
                        max="20000"
                        required
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none"
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
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Govt Tourism License / Certification ID *</label>
                      <input
                        type="text"
                        required
                        value={govtIdNumber}
                        onChange={(e) => setGovtIdNumber(e.target.value)}
                        placeholder="e.g. MOT-IN-UP-9421 or State Tourism Board ID"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      Verification Protocol
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      By submitting, your profile will be queued for Admin verification. Once verified, your status will turn active with the official Govt Certified badge.
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 border border-stone-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-stone-50 transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>{isSubmitting ? 'Submitting Application...' : 'Submit for Admin Approval'}</span>
                      <Check size={15} />
                    </button>
                  </div>
                </motion.div>
              )}

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default BecomeGuide;
