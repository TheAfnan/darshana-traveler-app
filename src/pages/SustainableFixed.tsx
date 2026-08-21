import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Leaf, Plane, Train, Bus, Car, Loader2, AlertCircle, Bike, MapPin, Zap, TrendingDown, Award, ArrowRight } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { searchLocations, formatLocationLabel } from '../services/locationApi';
import type { LocationSuggestion } from '../services/locationApi';

interface RouteOption {
  mode: string;
  time: string;
  durationMinutes: number;
  distance: number;
  cost: number;
  co2: number;
  greenScore: number;
  rewards: number;
  description: string;
  isGreenest?: boolean;
  isFastest?: boolean;
  isCheapest?: boolean;
  ecoRating?: number;
  ecoReward?: number;
  duration?: string;
  durationHours?: number;
}

interface RouteResponse {
  from: { name: string; coordinates?: { lat: number; lon: number } };
  to: { name: string; coordinates?: { lat: number; lon: number } };
  distance: number;
  durationMinutes?: number;
  options?: RouteOption[];
  routes?: RouteOption[];
  summary?: any;
}

const formatDuration = (minutes?: number): string => {
  if (!minutes || minutes <= 0) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} hrs`;
  return `${hours}h ${mins}m`;
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.abs(value) < 10 ? (Math.round(value * 10) / 10).toString() : Math.round(value).toString();
};

const SustainableFixed: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [searchingField, setSearchingField] = useState<'from' | 'to' | null>(null);
  const refRoot = useRef<HTMLDivElement>(null);

  const runSearch = useCallback(async (field: 'from' | 'to', value: string) => {
    setSearchingField(field);
    const q = value.trim();
    if (!q) {
      field === 'from' ? setFromSuggestions([]) : setToSuggestions([]);
      setSearchingField(null);
      return;
    }
    try {
      const res = await searchLocations(q);
      field === 'from' ? setFromSuggestions(res) : setToSuggestions(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSearchingField(null);
    }
  }, []);

  useEffect(() => {
    if (activeField !== 'from') return;
    const t = window.setTimeout(() => runSearch('from', from), 250);
    return () => clearTimeout(t);
  }, [from, activeField, runSearch]);

  useEffect(() => {
    if (activeField !== 'to') return;
    const t = window.setTimeout(() => runSearch('to', to), 250);
    return () => clearTimeout(t);
  }, [to, activeField, runSearch]);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return setError('Enter both origin and destination');
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(API_ENDPOINTS.ROUTES, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: from.trim(), to: to.trim() }) });
      if (!r.ok) throw new Error(r.statusText);
      const j = await r.json();
      setRouteData(j.data || null);
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to fetch routes';
      if (errorMsg.includes('Failed to fetch')) {
        setError('⚠️ Backend server not running. Start with: cd backend && node complete-server.cjs');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (mode: string) => {
    const m = mode.toLowerCase();
    if (m.includes('flight') || m.includes('air')) return <Plane size={20} />;
    if (m.includes('train') || m.includes('rail')) return <Train size={20} />;
    if (m.includes('bus')) return <Bus size={20} />;
    if (m.includes('bike') || m.includes('cycle')) return <Bike size={20} />;
    if (m.includes('walk')) return <Zap size={20} />;
    if (m.includes('metro')) return <Train size={20} />;
    return <Car size={20} />;
  };

  const getEcoColor = (rating: number = 5) => {
    if (rating >= 8) return 'from-emerald-500 to-green-400';
    if (rating >= 6) return 'from-lime-500 to-emerald-400';
    if (rating >= 4) return 'from-amber-500 to-yellow-400';
    return 'from-orange-500 to-red-400';
  };

  const routes = routeData?.routes || routeData?.options || [];

  return (
    <div className="min-h-screen bg-[#0a1625] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(6,214,160,0.1),_transparent_50%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12" ref={refRoot}>
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Leaf className="text-[#06d6a0]" size={18} />
            <span className="text-sm uppercase tracking-[0.3em] text-white/70">Eco-Friendly Travel</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Green Route <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06d6a0] to-[#06b6d4]">Planner</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Compare routes by carbon footprint, cost, and time. Make sustainable travel choices and earn eco-rewards.
          </p>
        </div>

        {/* Search Card */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl mb-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.2),_transparent_50%)]" />
          
          <div className="relative p-8 md:p-10">
            <form onSubmit={handlePlan} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Origin Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-white/70 mb-2 uppercase tracking-wide">Origin</label>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-4 focus-within:border-[#06b6d4] transition-colors">
                    <MapPin className="text-[#06b6d4] shrink-0" size={20} />
                    <input 
                      value={from} 
                      onChange={(e) => setFrom(e.target.value)} 
                      onFocus={() => setActiveField('from')}
                      onBlur={() => setTimeout(() => setActiveField(null), 200)}
                      placeholder="Enter city (e.g., Delhi)"
                      className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-lg"
                    />
                  </div>
                  {activeField === 'from' && (fromSuggestions.length > 0 || searchingField === 'from') && (
                    <div className="absolute z-20 w-full mt-2 bg-[#0f1d30] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                      {searchingField === 'from' && <div className="px-4 py-3 text-white/50 text-sm">Searching...</div>}
                      {fromSuggestions.map(s => (
                        <button 
                          key={s.id} 
                          type="button" 
                          onMouseDown={(e) => { e.preventDefault(); setFrom(s.value); setActiveField(null); }} 
                          className="w-full text-left px-4 py-3 hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-3"
                        >
                          <MapPin size={16} className="text-[#06b6d4]" />
                          {formatLocationLabel(s)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-white/70 mb-2 uppercase tracking-wide">Destination</label>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-4 focus-within:border-[#06b6d4] transition-colors">
                    <MapPin className="text-[#fb923c] shrink-0" size={20} />
                    <input 
                      value={to} 
                      onChange={(e) => setTo(e.target.value)} 
                      onFocus={() => setActiveField('to')}
                      onBlur={() => setTimeout(() => setActiveField(null), 200)}
                      placeholder="Enter city (e.g., Mumbai)"
                      className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-lg"
                    />
                  </div>
                  {activeField === 'to' && (toSuggestions.length > 0 || searchingField === 'to') && (
                    <div className="absolute z-20 w-full mt-2 bg-[#0f1d30] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                      {searchingField === 'to' && <div className="px-4 py-3 text-white/50 text-sm">Searching...</div>}
                      {toSuggestions.map(s => (
                        <button 
                          key={s.id} 
                          type="button" 
                          onMouseDown={(e) => { e.preventDefault(); setTo(s.value); setActiveField(null); }} 
                          className="w-full text-left px-4 py-3 hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-3"
                        >
                          <MapPin size={16} className="text-[#fb923c]" />
                          {formatLocationLabel(s)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#06d6a0] to-[#0ea5e9] font-semibold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    Calculating Routes...
                  </>
                ) : (
                  <>
                    <Leaf size={22} />
                    Calculate Green Impact
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#06d6a0]">80+</p>
                <p className="text-sm text-white/50">Indian Cities</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#06b6d4]">8</p>
                <p className="text-sm text-white/50">Transport Modes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#fb923c]">Real-time</p>
                <p className="text-sm text-white/50">CO₂ Tracking</p>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-4">
            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-semibold text-red-300">Connection Error</p>
              <p className="text-red-200/80 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Route Results */}
        {routeData && routes.length > 0 && (
          <div className="space-y-6">
            {/* Journey Summary */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/50 text-sm">From:</span>
                  <span className="ml-2 font-semibold">{typeof routeData.from === 'string' ? routeData.from : routeData.from?.name}</span>
                </div>
                <ArrowRight className="text-[#06b6d4]" size={20} />
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/50 text-sm">To:</span>
                  <span className="ml-2 font-semibold">{typeof routeData.to === 'string' ? routeData.to : routeData.to?.name}</span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-[#06d6a0]/10 border border-[#06d6a0]/30">
                <span className="text-[#06d6a0] font-semibold">{routeData.distance} km</span>
              </div>
            </div>

            {/* Route Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((opt, i) => (
                <div 
                  key={i} 
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border transition-all hover:scale-[1.02] hover:shadow-xl ${
                    opt.isGreenest ? 'border-[#06d6a0]/50 shadow-[#06d6a0]/20' : 
                    opt.isFastest ? 'border-[#06b6d4]/50 shadow-[#06b6d4]/20' : 
                    opt.isCheapest ? 'border-[#fb923c]/50 shadow-[#fb923c]/20' : 
                    'border-white/10'
                  }`}
                >
                  {/* Badge */}
                  {(opt.isGreenest || opt.isFastest || opt.isCheapest) && (
                    <div className={`absolute top-0 right-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-bl-2xl ${
                      opt.isGreenest ? 'bg-[#06d6a0] text-[#0a1625]' :
                      opt.isFastest ? 'bg-[#06b6d4] text-[#0a1625]' :
                      'bg-[#fb923c] text-[#0a1625]'
                    }`}>
                      {opt.isGreenest ? '🌿 Greenest' : opt.isFastest ? '⚡ Fastest' : '💰 Cheapest'}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Mode Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${getEcoColor(opt.ecoRating || opt.greenScore)}`}>
                        {getIcon(opt.mode)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{opt.mode}</h3>
                        <p className="text-white/50 text-sm">{opt.duration || opt.time || formatDuration(opt.durationMinutes)}</p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-white/5">
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1">CO₂ Emission</p>
                        <p className="text-lg font-bold text-[#06d6a0]">{formatNumber(opt.co2)} kg</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Cost</p>
                        <p className="text-lg font-bold text-[#fb923c]">₹{Math.round(opt.cost)}</p>
                      </div>
                    </div>

                    {/* Eco Rating Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-white/50 mb-2">
                        <span>Eco Rating</span>
                        <span className="text-[#06d6a0]">{opt.ecoRating || opt.greenScore || 5}/10</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${getEcoColor(opt.ecoRating || opt.greenScore)}`}
                          style={{ width: `${((opt.ecoRating || opt.greenScore || 5) / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Eco Reward */}
                    {(opt.ecoReward || opt.rewards) && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-[#06d6a0]/10 border border-[#06d6a0]/20">
                        <Award className="text-[#06d6a0]" size={18} />
                        <span className="text-sm text-[#06d6a0]">+{opt.ecoReward || opt.rewards} Eco Points</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Environmental Impact Summary */}
            <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-[#06d6a0]/10 to-[#06b6d4]/10 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="text-[#06d6a0]" size={24} />
                <h3 className="text-xl font-bold">Environmental Impact</h3>
              </div>
              <p className="text-white/70">
                By choosing the greenest option, you can save up to{' '}
                <span className="text-[#06d6a0] font-bold">
                  {formatNumber(Math.max(...routes.map(r => r.co2)) - Math.min(...routes.map(r => r.co2)))} kg CO₂
                </span>{' '}
                compared to the highest emission alternative. Every sustainable choice counts! 🌍
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!routeData && !loading && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
              <Leaf className="text-[#06d6a0]" size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Plan Your Green Journey</h3>
            <p className="text-white/50 max-w-md mx-auto">
              Enter your origin and destination to compare eco-friendly travel options and see your carbon footprint.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SustainableFixed;
