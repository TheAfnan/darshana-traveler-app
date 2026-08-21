import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, Calendar, AlertCircle, Loader, Sparkles, PartyPopper, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { festivalApi } from '../services/api';

interface Festival {
  _id: string;
  name: string;
  region: string;
  date: string;
  description: string;
  subscribers: string[];
}

interface GroupedFestivals {
  past: Festival[];
  current: Festival[];
  upcoming: Festival[];
}

const FestivalAlerts: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [subscribedFestivals, setSubscribedFestivals] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    past: true,
    current: true,
    upcoming: true,
  });

  // Sample festivals data for demo (when API doesn't return data)
  const sampleFestivals: Festival[] = [
    // Past month (October 2025)
    {
      _id: 'durga-puja-2025',
      name: 'Durga Puja',
      region: 'East India',
      date: '2025-10-21',
      description: 'The grand festival celebrating Goddess Durga with elaborate pandals, cultural performances, and community gatherings across Kolkata and Bengal.',
      subscribers: []
    },
    {
      _id: 'dussehra-2025',
      name: 'Dussehra / Vijayadashami',
      region: 'North India',
      date: '2025-10-23',
      description: 'Victory of good over evil celebrated with Ramlila performances and burning of Ravana effigies in Delhi, Varanasi, and across India.',
      subscribers: []
    },
    // This month (November 2025)
    {
      _id: 'diwali-2025',
      name: 'Diwali - Festival of Lights',
      region: 'North India',
      date: '2025-11-12',
      description: 'The biggest festival of India! Celebrate with diyas, fireworks, rangoli, sweets, and family gatherings. Best experienced in Jaipur, Varanasi, and Amritsar.',
      subscribers: []
    },
    {
      _id: 'bhai-dooj-2025',
      name: 'Bhai Dooj',
      region: 'North India',
      date: '2025-11-14',
      description: 'A celebration of the bond between brothers and sisters, with tilak ceremonies and gift exchanges.',
      subscribers: []
    },
    {
      _id: 'chhath-puja-2025',
      name: 'Chhath Puja',
      region: 'East India',
      date: '2025-11-16',
      description: 'Ancient Hindu festival dedicated to Sun God. Devotees fast and offer prayers at riverbanks. Best seen in Bihar and Eastern UP.',
      subscribers: []
    },
    {
      _id: 'kartik-purnima-2025',
      name: 'Kartik Purnima',
      region: 'Central India',
      date: '2025-11-27',
      description: 'Sacred full moon day with Dev Deepawali celebrations in Varanasi. Thousands of diyas light up the ghats.',
      subscribers: []
    },
    // Next month (December 2025)
    {
      _id: 'hornbill-2025',
      name: 'Hornbill Festival',
      region: 'North-East India',
      date: '2025-12-01',
      description: 'The "Festival of Festivals" in Nagaland showcasing tribal culture, traditional dances, music, and local cuisine. A must-visit!',
      subscribers: []
    },
    {
      _id: 'rann-utsav-2025',
      name: 'Rann Utsav',
      region: 'West India',
      date: '2025-12-10',
      description: 'Experience the magical white desert of Kutch under full moon. Folk music, handicrafts, and luxury tent stays await.',
      subscribers: []
    },
    {
      _id: 'christmas-goa-2025',
      name: 'Christmas in Goa',
      region: 'West India',
      date: '2025-12-25',
      description: 'Celebrate Christmas with Portuguese-influenced traditions, midnight masses at heritage churches, and beach parties.',
      subscribers: []
    },
    {
      _id: 'konark-dance-2025',
      name: 'Konark Dance Festival',
      region: 'East India',
      date: '2025-12-20',
      description: 'Classical dance performances against the backdrop of the magnificent Sun Temple. Odissi, Bharatanatyam, and more.',
      subscribers: []
    }
  ];

  const groupedFestivals = useMemo<GroupedFestivals>(() => {
    // Use sample data if API returns empty
    const dataToGroup = festivals.length > 0 ? festivals : sampleFestivals;
    
    const now = new Date();
    const currentIndex = now.getFullYear() * 12 + now.getMonth();
    return dataToGroup.reduce<GroupedFestivals>(
      (acc, fest) => {
        const festDate = new Date(fest.date);
        if (Number.isNaN(festDate.getTime())) {
          acc.upcoming.push(fest);
          return acc;
        }
        const festIndex = festDate.getFullYear() * 12 + festDate.getMonth();
        const diff = festIndex - currentIndex;
        if (diff === -1) acc.past.push(fest);
        else if (diff === 0) acc.current.push(fest);
        else if (diff === 1) acc.upcoming.push(fest);
        else if (diff < -1) acc.past.push(fest);
        else acc.upcoming.push(fest);
        return acc;
      },
      { past: [], current: [], upcoming: [] }
    );
  }, [festivals, sampleFestivals]);

  const regions = [
    'All',
    'North India',
    'South India',
    'East India',
    'West India',
    'Central India',
    'North-East India'
  ];

  useEffect(() => {
    fetchFestivals();
  }, [selectedRegion]);

  const fetchFestivals = async () => {
    setIsLoading(true);
    setError('');
    const response = await festivalApi.getAlerts(selectedRegion);
    if (response.success && response.data) {
      const data = response.data as any;
      setFestivals(data.alerts || []);
    } else {
      setError((response as any).error || 'Failed to fetch festivals');
    }
    setIsLoading(false);
  };

  const handleSubscribe = async (festival: Festival) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const response = await festivalApi.subscribeToFestival(festival._id, selectedRegion);
    if (response.success) {
      setSubscribedFestivals([...subscribedFestivals, festival._id]);
    } else {
      setError((response as any).error || 'Failed to subscribe');
    }
  };

  const handleUnsubscribe = async (festival: Festival) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const response = await festivalApi.unsubscribeFromFestival(festival._id);
    if (response.success) {
      setSubscribedFestivals(subscribedFestivals.filter(id => id !== festival._id));
    } else {
      setError((response as any).error || 'Failed to unsubscribe');
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
            <Loader size={32} className="absolute inset-0 m-auto animate-spin text-white" />
          </div>
          <p className="text-purple-700 font-medium animate-pulse">Loading festivals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-20 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="relative z-10 py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          {/* ══════════════════════════════════════════════════════════════════════════════
              HEADER SECTION
          ══════════════════════════════════════════════════════════════════════════════ */}
          <div className="text-center mb-12 relative">
            {/* Floating icons */}
            <div className="absolute -top-4 left-1/4 animate-bounce delay-100">
              <Bell size={24} className="text-purple-300" />
            </div>
            <div className="absolute top-0 right-1/4 animate-bounce delay-300">
              <PartyPopper size={28} className="text-pink-300" />
            </div>
            <div className="absolute top-8 left-1/3 animate-bounce delay-500">
              <Sparkles size={20} className="text-orange-300" />
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-4 drop-shadow-sm">
              Festival Alerts
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Subscribe to festival notifications in your region and never miss a celebration
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════════
              ERROR ALERT (Glassmorphism)
          ══════════════════════════════════════════════════════════════════════════════ */}
          {error && (
            <div className="mb-8 animate-fade-in">
              <div className="backdrop-blur-xl bg-red-50/70 border border-red-200/50 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-red-100/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
                  <AlertCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-red-800">Something went wrong</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════════════
              REGION FILTER (Glassmorphism Card with Pill Chips)
          ══════════════════════════════════════════════════════════════════════════════ */}
          <div className="mb-10">
            <div className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-6 md:p-8 shadow-xl shadow-purple-100/30">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <MapPin size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Select Your Region</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {regions.map((region) => {
                  const isActive = (region === 'All' && selectedRegion === '') || selectedRegion === region;
                  return (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region === 'All' ? '' : region)}
                      className={`
                        px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform
                        ${isActive
                          ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white shadow-lg shadow-purple-300/50 scale-105'
                          : 'bg-white/80 text-gray-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-white border border-gray-100'
                        }
                      `}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════════
              FESTIVALS TIMELINE
          ══════════════════════════════════════════════════════════════════════════════ */}
          {festivals.length === 0 ? (
            /* Empty State */
            <div className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-16 text-center shadow-xl">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full animate-pulse" />
                <Bell size={48} className="absolute inset-0 m-auto text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">No festivals found</p>
              <p className="text-gray-500 max-w-sm mx-auto">
                Try selecting a different region to discover amazing cultural celebrations
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {[
                {
                  title: 'Past Month Alerts',
                  subtitle: 'Events that happened last month — catch up on recaps & highlights',
                  key: 'past' as const,
                  gradient: 'from-slate-500 to-gray-600',
                  bgGlow: 'bg-gray-200/30'
                },
                {
                  title: 'This Month',
                  subtitle: 'Live festivals currently happening across India',
                  key: 'current' as const,
                  gradient: 'from-green-500 to-teal-500',
                  bgGlow: 'bg-teal-200/30'
                },
                {
                  title: 'Next Month',
                  subtitle: 'Plan ahead for upcoming celebrations and destinations',
                  key: 'upcoming' as const,
                  gradient: 'from-purple-500 to-pink-500',
                  bgGlow: 'bg-purple-200/30'
                }
              ].map((section) => {
                const list = groupedFestivals[section.key];
                const isExpanded = expandedSections[section.key];

                return (
                  <div
                    key={section.key}
                    className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl shadow-xl overflow-hidden transition-all duration-500"
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-white/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg`}>
                          <Calendar size={24} className="text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                          <p className="text-gray-500 text-sm">{section.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                          {list.length} {list.length === 1 ? 'festival' : 'festivals'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={24} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={24} className="text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="mx-6 md:mx-8 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

                    {/* Section Content */}
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-6 md:p-8 pt-4">
                        {list.length === 0 ? (
                          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                            <Bell size={32} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">No festivals in this window</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {list.map((festival) => {
                              const isSubscribed = subscribedFestivals.includes(festival._id);
                              const mapQuery = encodeURIComponent(festival.region || festival.name);
                              const formattedDate = new Date(festival.date).toLocaleDateString(undefined, {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              });

                              return (
                                <div
                                  key={festival._id}
                                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-white/50"
                                >
                                  <div className="grid gap-0 md:grid-cols-10">
                                    {/* Left: Map (70%) */}
                                    <div className="md:col-span-7 relative">
                                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 z-10 pointer-events-none" />
                                      <iframe
                                        title={`Map of ${festival.name}`}
                                        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                                        loading="lazy"
                                        className="w-full h-64 md:h-80 lg:h-96"
                                        referrerPolicy="no-referrer-when-downgrade"
                                      />
                                    </div>

                                    {/* Right: Info Panel (30%) */}
                                    <div className="md:col-span-3 p-6 flex flex-col justify-between bg-gradient-to-br from-white to-purple-50/30">
                                      <div>
                                        {/* Travel Alert Badge */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
                                          <Bell size={12} className="animate-pulse" />
                                          Travel Alert
                                        </div>

                                        {/* Festival Name */}
                                        <h4 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-3 leading-tight">
                                          {festival.name}
                                        </h4>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                                          {festival.description}
                                        </p>

                                        {/* Metadata */}
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                              <MapPin size={16} className="text-purple-600" />
                                            </div>
                                            <span className="text-gray-700 font-medium text-sm">{festival.region}</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                                              <Calendar size={16} className="text-pink-600" />
                                            </div>
                                            <span className="text-gray-700 font-medium text-sm">{formattedDate}</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Subscribe Button */}
                                      <button
                                        onClick={() => {
                                          if (isSubscribed) {
                                            handleUnsubscribe(festival);
                                          } else {
                                            handleSubscribe(festival);
                                          }
                                        }}
                                        className={`
                                          mt-6 w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                                          transform hover:scale-[1.02] active:scale-[0.98]
                                          ${isSubscribed
                                            ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-600 hover:from-red-200 hover:to-red-300 shadow-lg shadow-red-100/50'
                                            : 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 shadow-lg shadow-purple-300/50'
                                          }
                                        `}
                                      >
                                        <Bell size={16} className={isSubscribed ? '' : 'animate-pulse'} />
                                        {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FestivalAlerts;
