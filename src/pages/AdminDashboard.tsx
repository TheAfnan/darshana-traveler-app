import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Bell,
  BookOpenCheck,
  Globe2,
  Layers3,
  MenuSquare,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  MapPin,
  Clock,
  Award
} from 'lucide-react';
import { 
  fetchPendingGuides, 
  fetchAllGuides, 
  approveGuideApplication, 
  rejectGuideApplication, 
  type Guide 
} from '../api/guides';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guides' | 'overview' | 'bookings'>('guides');
  const [pendingGuides, setPendingGuides] = useState<Guide[]>([]);
  const [approvedGuides, setApprovedGuides] = useState<Guide[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    loadGuideData();
  }, []);

  const loadGuideData = async () => {
    try {
      const pending = await fetchPendingGuides();
      const all = await fetchAllGuides();
      setPendingGuides(pending);
      setApprovedGuides(all);
    } catch (err) {
      console.warn('Error loading admin guide data:', err);
    }
  };

  const handleApprove = async (guideId: string, guideName: string) => {
    const res = await approveGuideApplication(guideId);
    if (res.success) {
      setActionNotice(`✅ Guide "${guideName}" approved! They are now live on the public Local Guides directory.`);
      await loadGuideData();
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  const handleReject = async (guideId: string, guideName: string) => {
    const res = await rejectGuideApplication(guideId);
    if (res.success) {
      setActionNotice(`❌ Application for "${guideName}" has been rejected.`);
      await loadGuideData();
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans pb-16">
      
      {/* Top Admin Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              DT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">DarShana Admin Console</h1>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-500">Manage verified Indian local guides, bookings, and cultural expeditions.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/guides"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Public Directory</span>
              <ExternalLink size={13} />
            </Link>
            <Link
              to="/become-guide"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>+ Add Guide Application</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Global Action Toast Notification */}
        {actionNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-lg flex items-center justify-between gap-3 border border-amber-500/30"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Metric KPI Status Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Applications</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-amber-600">{pendingGuides.length}</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Action Needed</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Verified Guides</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{approvedGuides.length}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Live in Directory</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Platform Inquiries</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">48</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">100% Response</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Safety & Verification</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-emerald-600">100%</span>
              <span className="text-xs font-semibold text-slate-600 bg-stone-100 px-2 py-0.5 rounded-md">Govt ID Checked</span>
            </div>
          </div>
        </div>

        {/* Main Guide Approvals Console */}
        <div className="space-y-6">

          {/* Section: Pending Guide Approvals */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-amber-600" />
                  <span>Pending Guide Registration Applications</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review applicant credentials, Govt ID certifications, and approve them to publish live on the public directory.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs rounded-full">
                {pendingGuides.length} Pending
              </span>
            </div>

            {pendingGuides.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">All Guide Applications Processed</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  There are no pending guide registrations. New submissions from <Link to="/become-guide" className="text-amber-700 underline font-semibold">/become-guide</Link> will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingGuides.map((applicant) => (
                  <div
                    key={applicant._id}
                    className="p-5 bg-stone-50/80 border border-stone-200 rounded-2xl space-y-4 shadow-2xs hover:shadow-xs transition"
                  >
                    {/* Header with Photo & Info */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={applicant.profileImage}
                        alt={applicant.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-stone-200 shrink-0"
                      />
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{applicant.name}</h4>
                          <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                            Pending Review
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <MapPin size={11} className="text-amber-600 shrink-0" />
                          <span>{applicant.location}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {applicant.email} • {applicant.phone}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200/60 line-clamp-2">
                      {applicant.bio}
                    </p>

                    {/* Tags & Credentials */}
                    <div className="space-y-2 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {applicant.specialties.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white border border-stone-200 text-slate-700 text-[10px] font-semibold rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span><strong>Govt ID:</strong> {applicant.govtId || 'Verification Pending'}</span>
                        <span><strong>Fee:</strong> ₹{applicant.pricePerDay || 1500}/day</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-stone-200/80 flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => handleReject(applicant._id, applicant.name)}
                        className="px-3.5 py-1.5 border border-stone-300 hover:bg-rose-50 hover:border-rose-200 text-rose-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(applicant._id, applicant.name)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 size={13} />
                        <span>Approve & Publish Live</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Live Approved Guides Directory */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users size={18} className="text-slate-900" />
                  <span>Currently Live Verified Guides ({approvedGuides.length})</span>
                </h3>
                <p className="text-xs text-slate-500">Active guides visible on the public directory with instant booking enabled.</p>
              </div>
              <Link
                to="/guides"
                className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
              >
                <span>View Full Page</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-stone-100">
              {approvedGuides.slice(0, 6).map((guide) => (
                <div key={guide._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={guide.profileImage}
                      alt={guide.name}
                      className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{guide.name}</h4>
                      <p className="text-[11px] text-slate-500">{guide.location} • {guide.languages.join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-semibold text-slate-800">₹{guide.pricePerDay || 1500}/day</span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
