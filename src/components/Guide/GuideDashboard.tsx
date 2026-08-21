import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Globe2,
  LogOut,
  MessageSquare,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import type { GuideRequest, GuideStats, LocalGuide } from '../../types';

const GuideDashboard: React.FC = () => {
  const [guide, setGuide] = useState<LocalGuide | null>(null);
  const [stats, setStats] = useState<GuideStats | null>(null);
  const [requests, setRequests] = useState<GuideRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'profile' | 'earnings'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuideData();
  }, []);

  const fetchGuideData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const [guideRes, statsRes, requestsRes] = await Promise.all([
        fetch('/api/guides/me', { headers }),
        fetch('/api/guides/stats', { headers }),
        fetch('/api/guides/requests', { headers }),
      ]);

      if (guideRes.ok) setGuide(await guideRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (requestsRes.ok) setRequests(await requestsRes.json());
    } catch (error) {
      console.error('Failed to fetch guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/guide-requests/${requestId}/accept`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r)));
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/guide-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r)));
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const derived = useMemo(() => {
    const totalEarnings = stats?.totalEarnings || 0;
    const completedTrips = stats?.completedTrips || 0;
    const avgPerTrip = completedTrips ? Math.round(totalEarnings / completedTrips) : 0;
    const responseRate = stats?.responseRate || 0;
    const acceptanceRate = stats?.acceptedRequests && stats?.totalRequests
      ? Math.round((stats.acceptedRequests / stats.totalRequests) * 100)
      : 0;

    return {
      totalEarnings,
      completedTrips,
      avgPerTrip,
      responseRate,
      acceptanceRate,
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-white to-teal-50">
        <div className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur rounded-full shadow-lg border border-stone-100">
          <BarChart3 size={28} className="text-teal-600 animate-pulse" />
          <span className="text-stone-700 font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    badge,
    icon: Icon,
    accent,
    helper,
  }: {
    title: string;
    value: string | number;
    badge?: string;
    icon: React.ComponentType<any>;
    accent: string;
    helper?: string;
  }) => (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-100 p-5">
      <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-br from-white to-transparent" />
      <div className={`absolute inset-y-0 left-0 w-1.5 rounded-full ${accent}`} />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-stone-500">{title}</p>
          <p className="text-3xl font-bold text-stone-900 leading-tight">{value}</p>
          {helper && <p className="text-xs text-stone-500">{helper}</p>}
        </div>
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
          <Icon size={22} className="text-teal-600" />
        </div>
      </div>
      {badge && (
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          <Sparkles size={14} />
          {badge}
        </span>
      )}
    </div>
  );

  const TabPill = ({ id, label, icon: Icon }: { id: 'overview' | 'requests' | 'profile' | 'earnings'; label: string; icon: React.ComponentType<any> }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
          isActive
            ? 'bg-teal-600 text-white border-teal-700 shadow-md shadow-teal-100'
            : 'bg-white text-stone-600 border-stone-200 hover:border-teal-200 hover:text-stone-900'
        }`}
      >
        <Icon size={18} />
        {label}
      </button>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Total Requests"
              value={stats?.totalRequests ?? 0}
              badge={derived.acceptanceRate ? `${derived.acceptanceRate}% acceptance` : undefined}
              icon={Users}
              accent="bg-teal-500/80"
              helper={`${stats?.acceptedRequests || 0} accepted`}
            />
            <StatCard
              title="Completed Trips"
              value={stats?.completedTrips ?? 0}
              badge={derived.responseRate ? `${derived.responseRate}% response rate` : undefined}
              icon={CheckCircle}
              accent="bg-emerald-500/80"
              helper={guide?.responseTime || 'Fast replies'}
            />
            <StatCard
              title="Total Earnings"
              value={`₹${derived.totalEarnings.toLocaleString()}`}
              badge="Momentum"
              icon={DollarSign}
              accent="bg-amber-500/80"
              helper="Fiscal YTD"
            />
            <StatCard
              title="Rating"
              value={stats?.rating ? stats.rating.toFixed(1) : '–'}
              badge={`${stats?.reviewCount || 0} reviews`}
              icon={Star}
              accent="bg-indigo-500/80"
              helper="Consistency matters"
            />
          </div>

          <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-stone-500">Engagement pulse</p>
                <p className="text-xl font-semibold text-stone-900">Keep momentum with fast replies</p>
                <p className="text-sm text-stone-600 mt-1">Respond quickly to lift acceptance and ratings.</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200">
                  <Clock size={16} className="text-teal-600" />
                  <span className="text-sm text-stone-700">{guide?.responseTime || '1h avg response'}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200">
                  <TrendingUp size={16} className="text-emerald-600" />
                  <span className="text-sm text-stone-700">{derived.acceptanceRate || 0}% acceptance</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[{
                label: 'Active requests',
                value: requests.filter((r) => r.status === 'pending').length,
                tone: 'text-teal-700 bg-teal-50 border-teal-100',
              }, {
                label: 'Confirmed trips',
                value: stats?.acceptedRequests || 0,
                tone: 'text-emerald-700 bg-emerald-50 border-emerald-100',
              }, {
                label: 'Upcoming departures',
                value: requests.filter((r) => r.status === 'accepted').length,
                tone: 'text-indigo-700 bg-indigo-50 border-indigo-100',
              }].map(({ label, value, tone }) => (
                <div key={label} className={`flex items-center justify-between px-4 py-3 rounded-xl border shadow-xs ${tone}`}>
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-lg font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/80">Profile strength</p>
                <p className="text-3xl font-semibold mt-1">{guide?.verified ? 'Verified' : 'Pending'}</p>
                <p className="text-sm text-white/80 mt-1">Show availability and update docs to stay trusted.</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                <Globe2 size={26} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="px-3 py-2 bg-white text-teal-800 font-semibold rounded-xl shadow-sm hover:shadow-md transition">Update profile</button>
              <button className="px-3 py-2 border border-white/40 text-white rounded-xl hover:bg-white/10 transition">Share availability</button>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">Service quality</p>
                <p className="text-lg font-semibold text-stone-900">Guard your response rate</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">
                {derived.responseRate}%
              </div>
            </div>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-600" /> Reply within 30 minutes to new requests</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-600" /> Keep calendar updated for accurate availability</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-600" /> Encourage reviews after each trip</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-stone-500">Earnings snapshot</p>
              <p className="text-xl font-semibold text-stone-900">This month performance</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 px-3 py-2 rounded-xl border border-teal-100">
              View statements
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{
              label: 'Total earned',
              value: `₹${derived.totalEarnings.toLocaleString()}`,
              tone: 'text-stone-900',
            }, {
              label: 'Avg per trip',
              value: `₹${derived.avgPerTrip.toLocaleString()}`,
              tone: 'text-emerald-700',
            }, {
              label: 'Projected month',
              value: `₹${Math.round(derived.totalEarnings * 0.3).toLocaleString()}`,
              tone: 'text-indigo-700',
            }].map(({ label, value, tone }) => (
              <div key={label} className="rounded-xl border border-stone-200 px-4 py-3 bg-gradient-to-br from-stone-50 to-white">
                <p className="text-xs text-stone-500">{label}</p>
                <p className={`text-xl font-semibold mt-1 ${tone}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 h-40 rounded-xl bg-gradient-to-br from-teal-50 via-white to-emerald-50 border border-dashed border-teal-200 flex items-center justify-center text-sm text-stone-500">
            Earnings chart placeholder — connect analytics to visualize trends.
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl bg-white border border-stone-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">Operations</p>
              <p className="text-lg font-semibold text-stone-900">Quick actions</p>
            </div>
            <Sparkles size={18} className="text-teal-600" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[{
              label: 'Create offer',
              helper: 'Send a tailored plan',
            }, {
              label: 'Broadcast availability',
              helper: 'Update your slots',
            }, {
              label: 'Share profile',
              helper: 'Copy public link',
            }, {
              label: 'Download payout CSV',
              helper: 'Export settlements',
            }].map(({ label, helper }) => (
              <button key={label} className="text-left px-3 py-3 rounded-xl border border-stone-200 bg-stone-50 hover:border-teal-200 hover:bg-white transition shadow-xs">
                <p className="text-sm font-semibold text-stone-900">{label}</p>
                <p className="text-xs text-stone-500 mt-1">{helper}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-stone-500">Pipeline</p>
          <p className="text-2xl font-semibold text-stone-900">Recent traveler requests</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchGuideData} className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:border-teal-200">Refresh</button>
          <button className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold shadow-sm hover:bg-teal-700">New offer</button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
          <MessageSquare size={42} className="mx-auto text-stone-300 mb-3" />
          <p className="font-semibold text-stone-800">No requests yet</p>
          <p className="text-sm text-stone-500">Share your profile to start receiving requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-stone-500">Traveler</p>
                  <p className="text-lg font-semibold text-stone-900">{request.userId}</p>
                  <p className="text-sm text-stone-500">{request.destination || 'Destination TBD'}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">{request.startDate ? `${new Date(request.startDate).toLocaleDateString()} - ${request.endDate ? new Date(request.endDate).toLocaleDateString() : ''}` : 'Dates TBD'}</span>
                  <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">{request.travelers || 1} traveler(s)</span>
                  <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${
                    request.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                      : request.status === 'accepted'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>

              {request.message && (
                <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-100 text-sm text-stone-700">
                  {request.message}
                </div>
              )}

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-stone-500">Requested {new Date(request.createdAt).toLocaleString()}</p>
                {request.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleAcceptRequest(request.id)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 flex items-center gap-2">
                      <CheckCircle size={16} />
                      Accept
                    </button>
                    <button onClick={() => handleRejectRequest(request.id)} className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Decline
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <BarChart3 size={16} className="text-teal-600" />
                    Keep traveler updated with quick replies
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-stone-500">Profile overview</p>
            <p className="text-2xl font-semibold text-stone-900">{guide?.name || 'Your profile'}</p>
            <p className="text-sm text-stone-600">{guide?.location || 'Add your primary location'}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 flex items-center gap-2">
              <Edit size={16} />
              Edit profile
            </button>
            <button className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:border-teal-200">Preview</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{
            label: 'Email',
            value: guide?.email || 'Not provided',
          }, {
            label: 'Phone',
            value: guide?.phone || 'Not provided',
          }, {
            label: 'Experience',
            value: guide?.experience ? `${guide.experience} years` : 'Add experience',
          }, {
            label: 'Daily rate',
            value: guide?.pricePerDay ? `₹${guide.pricePerDay}` : 'Set your rate',
          }, {
            label: 'Languages',
            value: guide?.languages?.length ? guide.languages.join(', ') : 'Add languages',
          }, {
            label: 'Specialties',
            value: guide?.specialties?.length ? guide.specialties.join(', ') : 'Add specialties',
          }].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
              <p className="text-sm font-semibold text-stone-900 mt-1">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm font-semibold text-stone-900 mb-2">Bio</p>
            <p className="text-sm text-stone-600 leading-relaxed">{guide?.bio || 'Tell travelers why you are the right local guide for them.'}</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-sm font-semibold text-stone-900 mb-2">Verification</p>
            <div className="flex items-center gap-2">
              {guide?.verified ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle size={16} /> Verified
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-sm font-semibold flex items-center gap-2">
                  <AlertCircle size={16} /> Pending
                </span>
              )}
              <p className="text-sm text-stone-600">Add ID and licenses to complete verification.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5">
          <p className="text-sm text-emerald-700 font-semibold">Total earnings</p>
          <p className="text-3xl font-bold text-stone-900 mt-1">₹{derived.totalEarnings.toLocaleString()}</p>
          <p className="text-sm text-stone-500 mt-1">All time</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-5">
          <p className="text-sm text-indigo-700 font-semibold">Avg per trip</p>
          <p className="text-3xl font-bold text-stone-900 mt-1">₹{derived.avgPerTrip.toLocaleString()}</p>
          <p className="text-sm text-stone-500 mt-1">Based on completed trips</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-5">
          <p className="text-sm text-amber-700 font-semibold">Projected month</p>
          <p className="text-3xl font-bold text-stone-900 mt-1">₹{Math.round(derived.totalEarnings * 0.3).toLocaleString()}</p>
          <p className="text-sm text-stone-500 mt-1">If pace continues</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-stone-500">Payment method</p>
            <p className="text-xl font-semibold text-stone-900">Bank transfer</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:border-teal-200">Update</button>
        </div>
        <div className="p-4 rounded-xl border border-dashed border-stone-200 bg-stone-50 text-sm text-stone-600">
          XXX XXX 12345 — payouts every Friday. Add UPI or secondary account for redundancy.
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold text-stone-900">Recent transactions</p>
          <button className="text-sm text-teal-700 font-semibold hover:underline">Download CSV</button>
        </div>
        <div className="space-y-3">
          {[
            { date: 'Nov 24, 2025', amount: 5000, trip: 'Goa Beach Tour', status: 'Settled' },
            { date: 'Nov 20, 2025', amount: 3500, trip: 'Kerala Backwater Tour', status: 'Settled' },
            { date: 'Nov 15, 2025', amount: 4200, trip: 'Rajasthan Desert Safari', status: 'Pending' },
          ].map((transaction, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200"
            >
              <div>
                <p className="text-sm font-semibold text-stone-900">{transaction.trip}</p>
                <p className="text-xs text-stone-500">{transaction.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  transaction.status === 'Settled'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {transaction.status}
                </span>
                <p className="font-bold text-emerald-700">+₹{transaction.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-teal-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm p-6">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-teal-100 rounded-full blur-3xl opacity-70" />
            <div className="absolute bottom-0 left-10 h-28 w-28 bg-emerald-100 rounded-full blur-2xl opacity-60" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">Welcome back</p>
              <p className="text-3xl font-bold text-stone-900">{guide?.name || 'Guide Dashboard'}</p>
              <p className="text-sm text-stone-600 mt-1">Run your operations, track earnings, and respond to travelers swiftly.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <TabPill id="overview" label="Overview" icon={BarChart3} />
              <TabPill id="requests" label="Requests" icon={MessageSquare} />
              <TabPill id="profile" label="Profile" icon={Users} />
              <TabPill id="earnings" label="Earnings" icon={DollarSign} />
              <button className="px-4 py-3 rounded-xl bg-white border border-stone-200 text-stone-700 hover:border-teal-200 flex items-center gap-2">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'requests' && renderRequests()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'earnings' && renderEarnings()}
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
