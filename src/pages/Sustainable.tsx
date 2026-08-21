import {
  AlertCircle,
  ArrowRight,
  Bike,
  Bus,
  Car,
  Leaf,
  Loader2,
  Map,
  MapPin,
  Plane,
  Sparkles,
  Train,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LocationSuggestion } from '../services/locationApi';
import { formatLocationLabel, searchLocations } from '../services/locationApi';

interface RouteOption {
  mode: string;
  duration: string;
  durationHours: number;
  distance: number;
  cost: number;
  co2: number;
  ecoRating: number;
  ecoReward: number;
  isGreenest?: boolean;
  isFastest?: boolean;
  isCheapest?: boolean;
}

interface RouteResponse {
  from: { name: string; coordinates: { lat: number; lon: number } };
  to: { name: string; coordinates: { lat: number; lon: number } };
  distance: number;
  routes: RouteOption[];
}

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  return Math.abs(value) < 10 ? (Math.round(value * 10) / 10).toString() : Math.round(value).toString();
};

const formatCurrency = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  });
  return formatter.format(Math.round(value));
};

// Get summary from routes
const getRouteSummary = (routes: RouteOption[]) => {
  if (!routes || routes.length === 0) return null;
  
  const greenest = routes.find(r => r.isGreenest) || routes[0];
  const baseline = routes.find(r => r.mode.toLowerCase().includes('car')) || routes[routes.length - 1];
  
  return {
    distanceKm: routes[0]?.distance || 0,
    bestMode: greenest,
    emissions: {
      baseline: baseline?.co2 || 0,
      best: greenest?.co2 || 0,
      savings: (baseline?.co2 || 0) - (greenest?.co2 || 0),
      savingsPercentage: baseline?.co2 ? Math.round(((baseline.co2 - greenest.co2) / baseline.co2) * 100) : 0
    }
  };
};

const Sustainable: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [searchingField, setSearchingField] = useState<'from' | 'to' | null>(null);
  const plannerRef = useRef<HTMLDivElement>(null);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const closeSuggestions = () => {
    setActiveField(null);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (plannerRef.current && !plannerRef.current.contains(event.target as Node)) {
        closeSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const runSearch = useCallback(async (field: 'from' | 'to', value: string) => {
    const query = value.trim();

    if (!query) {
      if (field === 'from') {
        setFromSuggestions([]);
      } else {
        setToSuggestions([]);
      }
      return;
    }

    setSearchingField(field);
    try {
      const results = await searchLocations(query);
      if (field === 'from') {
        setFromSuggestions(results);
      } else {
        setToSuggestions(results);
      }
    } catch (searchError) {
      console.error('Location search error:', searchError);
    } finally {
      setSearchingField((current) => (current === field ? null : current));
    }
  }, []);

  useEffect(() => {
    if (activeField !== 'from') return;
    const handle = window.setTimeout(() => runSearch('from', from), 250);
    return () => window.clearTimeout(handle);
  }, [from, activeField, runSearch]);

  useEffect(() => {
    if (activeField !== 'to') return;
    const handle = window.setTimeout(() => runSearch('to', to), 250);
    return () => window.clearTimeout(handle);
  }, [to, activeField, runSearch]);

  const handleSelectSuggestion = (field: 'from' | 'to', suggestion: LocationSuggestion) => {
    if (field === 'from') {
      setFrom(suggestion.value);
      setFromSuggestions([]);
    } else {
      setTo(suggestion.value);
      setToSuggestions([]);
    }
    setActiveField(null);
    setError(null);
  };

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const origin = from.trim();
    const destination = to.trim();

    if (!origin || !destination) {
      setError('Please enter both origin and destination');
      return;
    }

    if (origin.toLowerCase() === destination.toLowerCase()) {
      setError('Origin and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError(null);
    setRouteData(null);
    closeSuggestions();

    try {
      // Simulate a successful response with fake data
      const fakeData: RouteResponse = {
        from: { name: origin, coordinates: { lat: 28.6139, lon: 77.209 } },
        to: { name: destination, coordinates: { lat: 26.9124, lon: 75.7873 } },
        distance: 250,
        routes: [
          {
            mode: 'Train',
            duration: '5h 30m',
            durationHours: 5.5,
            distance: 250,
            cost: 500,
            co2: 20,
            ecoRating: 9,
            ecoReward: 50,
            isGreenest: true,
          },
          {
            mode: 'Bus',
            duration: '6h 45m',
            durationHours: 6.75,
            distance: 250,
            cost: 300,
            co2: 30,
            ecoRating: 7,
            ecoReward: 30,
          },
          {
            mode: 'Car',
            duration: '4h 30m',
            durationHours: 4.5,
            distance: 250,
            cost: 1500,
            co2: 100,
            ecoRating: 5,
            ecoReward: 10,
          },
        ],
      };

      setRouteData(fakeData);
    } catch (err) {
      console.error('Error planning route:', err);
      setError('Failed to calculate routes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (mode: string) => {
    const m = mode.toLowerCase();
    if (m.includes('flight') || m.includes('air')) return <Plane size={24} />;
    if (m.includes('train') || m.includes('rail')) return <Train size={24} />;
    if (m.includes('bus')) return <Bus size={24} />;
    if (m.includes('bike')) return <Bike size={24} />;
    return <Car size={24} />;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Back to TravelHub Link */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link 
          to="/travelhub" 
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Travel Hub</span>
        </Link>
        <Link 
          to="/travelhub#packages" 
          className="text-sm text-stone-500 hover:text-teal-600 transition-colors"
        >
          Browse trips & packages in TravelHub →
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-teal-100 p-3 rounded-full text-teal-700">
          <Leaf size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Green Route Planner</h1>
          <p className="text-stone-500">Calculate your footprint, earn rewards, and travel sustainably.</p>
        </div>
      </div>

      {/* Premium Route Planner Banner */}
      <Link 
        to="/green-route-planner"
        className="block mb-8 p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Map className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium text-emerald-100">NEW PREMIUM FEATURE</span>
              </div>
              <h3 className="text-xl font-bold text-white">Interactive Green Route Planner</h3>
              <p className="text-emerald-100 text-sm">
                Live map • Real-time CO₂ tracking • Compare all transport modes
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-5 py-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
            <span className="font-semibold text-white">Try Now</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Search Form */}
      <div ref={plannerRef} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-10">
        <form onSubmit={handlePlan} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full relative">
            <label htmlFor="origin-input" className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Origin</label>
            <input 
              id="origin-input"
              type="text" 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              onFocus={() => {
                setActiveField('from');
                runSearch('from', from);
              }}
              placeholder="e.g., New Delhi"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
            {activeField === 'from' && (
              <div className="absolute z-30 mt-2 w-full rounded-lg border border-stone-200 bg-white shadow-lg max-h-72 overflow-y-auto">
                {searchingField === 'from' && (
                  <div className="px-4 py-3 text-sm text-stone-500 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Searching...
                  </div>
                )}
                {searchingField !== 'from' && fromSuggestions.length === 0 && from.trim().length > 2 && (
                  <div className="px-4 py-3 text-sm text-stone-500">No matches found</div>
                )}
                {fromSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-teal-50 flex items-start gap-3"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelectSuggestion('from', suggestion);
                    }}
                  >
                    <span className="mt-0.5 text-teal-600">
                      <MapPin size={16} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium text-stone-800">{formatLocationLabel(suggestion)}</span>
                      <span className="block text-xs uppercase tracking-wide text-stone-400">{suggestion.type}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleSwap}
              className="bg-stone-100 hover:bg-teal-100 text-stone-600 hover:text-teal-700 p-3 rounded-full transition border border-stone-200 hover:border-teal-300"
              title="Swap origin and destination"
            >
              <Car size={20} />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <label htmlFor="destination-input" className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Destination</label>
            <input 
              id="destination-input"
              type="text" 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              onFocus={() => {
                setActiveField('to');
                runSearch('to', to);
              }}
              placeholder="e.g., Jaipur"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
            {activeField === 'to' && (
              <div className="absolute z-30 mt-2 w-full rounded-lg border border-stone-200 bg-white shadow-lg max-h-72 overflow-y-auto">
                {searchingField === 'to' && (
                  <div className="px-4 py-3 text-sm text-stone-500 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Searching...
                  </div>
                )}
                {searchingField !== 'to' && toSuggestions.length === 0 && to.trim().length > 2 && (
                  <div className="px-4 py-3 text-sm text-stone-500">No matches found</div>
                )}
                {toSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-teal-50 flex items-start gap-3"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelectSuggestion('to', suggestion);
                    }}
                  >
                    <span className="mt-0.5 text-teal-600">
                      <MapPin size={16} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium text-stone-800">{formatLocationLabel(suggestion)}</span>
                      <span className="block text-xs uppercase tracking-wide text-stone-400">{suggestion.type}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-teal-700 hover:bg-teal-800 disabled:bg-stone-400 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md w-full md:w-auto flex items-center justify-center gap-2 h-[50px]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Calculate Impact'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Results Header */}
      {routeData && routeData.routes && routeData.routes.length > 0 && (
        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              Routes from {routeData.from.name} to {routeData.to.name}
            </h2>
            <p className="text-stone-600 flex flex-wrap items-center gap-2 text-sm md:text-base">
              <span className="flex items-center gap-1"><MapPin size={16} /> {formatNumber(routeData.distance)} km</span>
            </p>
          </div>

          {(() => {
            const summary = getRouteSummary(routeData.routes);
            if (!summary) return null;
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white text-teal-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-teal-900">Distance</p>
                    <p className="text-sm text-teal-700">{formatNumber(summary.distanceKm)} km</p>
                    <p className="text-xs text-teal-700">{routeData.routes.length} transport options available</p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white text-emerald-600">
                    <Leaf size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">Emission Savings</p>
                    <p className="text-sm text-emerald-700">Save up to {formatNumber(summary.emissions.savings)} kg CO₂</p>
                    <p className="text-xs text-emerald-700">{formatNumber(summary.emissions.savingsPercentage)}% lower than car ({formatNumber(summary.emissions.baseline)} → {formatNumber(summary.emissions.best)} kg)</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white text-amber-600">
                    <Leaf size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Greenest Option</p>
                    <p className="text-sm text-amber-700">{summary.bestMode.mode}</p>
                    <p className="text-xs text-amber-700">{summary.bestMode.duration} • ₹{formatCurrency(summary.bestMode.cost)}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Results Grid */}
      {routeData && routeData.routes && routeData.routes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {routeData.routes.map((opt, idx) => (
            <div
              key={idx}
              className={`relative bg-white p-6 rounded-xl shadow-sm border-2 transition hover:shadow-md ${
                opt.isGreenest
                  ? 'border-emerald-400'
                  : opt.ecoRating >= 8
                  ? 'border-teal-500'
                  : 'border-stone-200'
              }`}
            >
              {opt.isGreenest ? (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg flex items-center gap-1">
                  <Leaf size={12} /> Greenest
                </div>
              ) : opt.isFastest ? (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg flex items-center gap-1">
                  ⚡ Fastest
                </div>
              ) : opt.isCheapest ? (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg flex items-center gap-1">
                  💰 Cheapest
                </div>
              ) : null}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${opt.ecoRating >= 8 ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-stone-600'}`}>
                  {getIcon(opt.mode)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-800">{opt.mode}</h3>
                  <p className="text-xs text-stone-500 flex flex-wrap gap-2">
                    <span>{opt.duration}</span>
                    <span>• {formatNumber(opt.distance)} km</span>
                    <span>• ₹{formatCurrency(opt.cost)}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg">
                <div>
                    <span className="block text-xs text-stone-500 mb-1">CO₂ Emissions</span>
                    <span className={`font-bold text-lg ${opt.co2 < 50 ? 'text-teal-600' : 'text-orange-600'}`}>
                        {formatNumber(opt.co2)} <span className="text-xs text-stone-500 font-normal">kg</span>
                    </span>
                </div>
                <div className="text-right">
                     <span className="block text-xs text-stone-500 mb-1">Eco Rewards</span>
                     <span className="font-bold text-lg text-emerald-600 flex items-center justify-end gap-1">
                         <Leaf size={16} /> +{formatNumber(opt.ecoReward)}
                     </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-stone-200 flex justify-between items-center">
                    <span className="text-xs text-stone-500">Eco Rating</span>
                    <div className="flex items-center gap-2">
                         <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full ${opt.ecoRating >= 7 ? 'bg-teal-500' : opt.ecoRating >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${(opt.ecoRating / 10) * 100}%` }}
                             ></div>
                         </div>
                         <span className="font-bold text-stone-800 text-sm">{opt.ecoRating}/10</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin text-teal-600 mb-4" size={40} />
          <p className="text-stone-600 font-semibold">Calculating sustainable routes...</p>
        </div>
      )}

      {/* No Results Message */}
      {!loading && !routeData && !error && from && to && (
        <div className="text-center py-12">
          <p className="text-stone-500">Enter locations and click "Calculate Impact" to see available routes</p>
        </div>
      )}

      {/* Footer Navigation to TravelHub */}
      <div className="mt-16 pt-8 border-t border-stone-200">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-stone-800">Looking for complete travel packages?</h3>
              <p className="text-stone-500 text-sm">Explore destinations, tour packages, hotels & more in our Travel Hub</p>
            </div>
            <Link 
              to="/travelhub"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all group"
            >
              <span>Explore Travel Hub</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainable;