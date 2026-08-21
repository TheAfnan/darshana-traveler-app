import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Phone,
  Mail,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { getStoredGuides, type Guide } from '../api/guides';

interface BookingRequest {
  id: string;
  travelerName: string;
  travelerEmail: string;
  date: string;
  travelers: number;
  totalFee: number;
  status: 'confirmed' | 'pending' | 'completed';
  notes: string;
}

const SAMPLE_BOOKING_REQUESTS: BookingRequest[] = [
  {
    id: 'req-101',
    travelerName: 'Sarah Jenkins',
    travelerEmail: 'sarah.j@travel.com',
    date: '2026-09-15',
    travelers: 2,
    totalFee: 3600,
    status: 'pending',
    notes: 'Visiting Taj Mahal sunrise, interested in architecture and heritage street food.'
  },
  {
    id: 'req-102',
    travelerName: 'David Miller',
    travelerEmail: 'david.m@uktravel.co.uk',
    date: '2026-09-22',
    travelers: 4,
    totalFee: 7200,
    status: 'confirmed',
    notes: 'Family walking tour of historic monuments and traditional artisans.'
  }
];

export const LocalGuideDashboard: React.FC = () => {
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);
  const [bookings, setBookings] = useState<BookingRequest[]>(SAMPLE_BOOKING_REQUESTS);
  const [dailyRate, setDailyRate] = useState<number>(1800);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Load first verified guide or user's registered guide
    const stored = getStoredGuides();
    const verified = stored.find(g => g.status === 'approved') || stored[0];
    if (verified) {
      setActiveGuide(verified);
      setDailyRate(verified.pricePerDay || 1800);
    }
  }, []);

  const handleUpdateRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeGuide) {
      activeGuide.pricePerDay = Number(dailyRate);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleStatusChange = (reqId: string, newStatus: 'confirmed' | 'completed') => {
    setBookings(prev => prev.map(b => b.id === reqId ? { ...b, status: newStatus } : b));
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans pb-20">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-stone-200 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold font-serif text-lg shadow-sm">
              GP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Guide Partner Portal</h1>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                  Verified Partner
                </span>
              </div>
              <p className="text-xs text-slate-500">Manage your daily rate, bookings, and verified public profile.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/guides"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Public Directory</span>
              <ExternalLink size={13} />
            </Link>
            <Link
              to="/become-guide"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
            >
              + Register New Guide
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* 4-Column KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Earnings</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">₹42,800</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">+18% this month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tours Guided</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">28</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">100% Completed</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Guide Rating</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-amber-600 flex items-center gap-1">
                <Star size={18} className="fill-amber-500" />
                4.98
              </span>
              <span className="text-xs text-slate-500 font-medium">214 reviews</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Partner Status</span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck size={16} />
                Govt Verified
              </span>
              <span className="text-xs text-slate-400 font-mono">MOT-CERTIFIED</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Active Booking Inquiries */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar size={18} className="text-amber-600" />
                    <span>Traveler Booking Inquiries</span>
                  </h3>
                  <p className="text-xs text-slate-500">Confirm tour requests from cultural travelers.</p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs rounded-full">
                  {bookings.length} Bookings
                </span>
              </div>

              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{booking.travelerName}</h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{booking.travelerEmail}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900">₹{booking.totalFee}</span>
                        <p className="text-[10px] text-slate-500">{booking.travelers} Travelers</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-stone-200">
                      "{booking.notes}"
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <Clock size={12} className="text-amber-600" />
                        <span>Tour Date: <strong>{booking.date}</strong></span>
                      </span>

                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                          >
                            Accept Request
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Right: Daily Rate & Availability Settings */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Rate Settings Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign size={16} className="text-amber-600" />
                <span>Tour Fee Settings</span>
              </h3>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Daily rate updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleUpdateRate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Standard Daily Rate (₹ / day)</label>
                  <input
                    type="number"
                    min="500"
                    max="20000"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-slate-600">
                  <span className="font-semibold block text-slate-800">100% Direct Payouts:</span>
                  You receive full tour fees directly from travelers on the day of the excursion.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                >
                  Save Rate Changes
                </button>
              </form>
            </div>

            {/* Profile Snapshot */}
            {activeGuide && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeGuide.profileImage}
                    alt={activeGuide.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{activeGuide.name}</h4>
                    <p className="text-xs text-slate-500">{activeGuide.location}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 text-xs text-slate-600 space-y-1">
                  <p><strong>License:</strong> {activeGuide.govtId || 'MOT-CERTIFIED'}</p>
                  <p><strong>Languages:</strong> {activeGuide.languages.join(', ')}</p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default LocalGuideDashboard;
