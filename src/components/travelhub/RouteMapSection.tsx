import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Search, Route, Clock, Car, Loader2, X, Leaf, ArrowRight } from 'lucide-react';

interface RouteInfo {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
}

const RouteMapSection: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Popular routes for quick selection
  const popularRoutes = [
    { from: 'Delhi', to: 'Lucknow' },
    { from: 'Mumbai', to: 'Pune' },
    { from: 'Bangalore', to: 'Mysore' },
    { from: 'Chennai', to: 'Pondicherry' },
    { from: 'Jaipur', to: 'Udaipur' },
    { from: 'Kolkata', to: 'Darjeeling' },
  ];

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setRouteInfo({
        origin: origin.trim(),
        destination: destination.trim(),
        distance: `${Math.floor(Math.random() * 500 + 100)} km`,
        duration: `${Math.floor(Math.random() * 8 + 2)}h ${Math.floor(Math.random() * 60)}m`
      });
      setShowMap(true);
      setLoading(false);
    }, 800);
  }, [origin, destination]);

  const handleQuickRoute = (from: string, to: string) => {
    setOrigin(from);
    setDestination(to);
    setLoading(true);
    
    setTimeout(() => {
      setRouteInfo({
        origin: from,
        destination: to,
        distance: `${Math.floor(Math.random() * 500 + 100)} km`,
        duration: `${Math.floor(Math.random() * 8 + 2)}h ${Math.floor(Math.random() * 60)}m`
      });
      setShowMap(true);
      setLoading(false);
    }, 800);
  };

  const clearRoute = () => {
    setOrigin('');
    setDestination('');
    setRouteInfo(null);
    setShowMap(false);
  };

  // Generate Google Maps embed URL with directions
  const getMapUrl = () => {
    if (!routeInfo) return '';
    const originEncoded = encodeURIComponent(routeInfo.origin + ', India');
    const destEncoded = encodeURIComponent(routeInfo.destination + ', India');
    return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${originEncoded}&destination=${destEncoded}&mode=driving`;
  };

  return (
    <section id="route-planner" className="scroll-mt-20">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0a1625] to-[#0f1d30] text-white shadow-2xl">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.2),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(6,214,160,0.15),_transparent_50%)]" />
        </div>

        <div className="relative p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <Route className="text-[#06d6a0]" size={18} />
              <span className="text-sm uppercase tracking-[0.3em] text-white/70">Route Planner</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06d6a0] to-[#06b6d4]">Journey</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Enter your origin and destination to see the route on Google Maps with distance and estimated travel time.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Origin Input */}
              <div className="relative">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-4 focus-within:border-[#06b6d4] transition-colors">
                  <MapPin className="text-[#06d6a0] shrink-0" size={20} />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Origin (e.g., Delhi)"
                    className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* Destination Input */}
              <div className="relative">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-4 focus-within:border-[#fb923c] transition-colors">
                  <Navigation className="text-[#fb923c] shrink-0" size={20} />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Destination (e.g., Lucknow)"
                    className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="submit"
                disabled={loading || !origin.trim() || !destination.trim()}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#06d6a0] to-[#0ea5e9] font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Finding Route...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Show Route on Map
                  </>
                )}
              </button>
              
              {showMap && (
                <button
                  type="button"
                  onClick={clearRoute}
                  className="px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <X size={20} />
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Popular Routes */}
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-center text-white/50 text-sm mb-3">Popular Routes</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularRoutes.map((route, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickRoute(route.from, route.to)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                >
                  {route.from} → {route.to}
                </button>
              ))}
            </div>
          </div>

          {/* Route Info & Map */}
          {showMap && routeInfo && (
            <div className="max-w-5xl mx-auto">
              {/* Route Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <MapPin className="mx-auto text-[#06d6a0] mb-2" size={24} />
                  <p className="text-xs text-white/50 uppercase tracking-wide">From</p>
                  <p className="font-semibold">{routeInfo.origin}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <Navigation className="mx-auto text-[#fb923c] mb-2" size={24} />
                  <p className="text-xs text-white/50 uppercase tracking-wide">To</p>
                  <p className="font-semibold">{routeInfo.destination}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <Car className="mx-auto text-[#06b6d4] mb-2" size={24} />
                  <p className="text-xs text-white/50 uppercase tracking-wide">Distance</p>
                  <p className="font-semibold text-[#06b6d4]">{routeInfo.distance}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <Clock className="mx-auto text-[#a855f7] mb-2" size={24} />
                  <p className="text-xs text-white/50 uppercase tracking-wide">Est. Time</p>
                  <p className="font-semibold text-[#a855f7]">{routeInfo.duration}</p>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="aspect-video md:aspect-[21/9]">
                  <iframe
                    src={getMapUrl()}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Route Map"
                    className="w-full h-full"
                  />
                </div>
                
                {/* Map Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="px-4 py-2 rounded-xl bg-black/70 backdrop-blur-sm text-sm">
                    🗺️ {routeInfo.origin} → {routeInfo.destination}
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/${encodeURIComponent(routeInfo.origin + ', India')}/${encodeURIComponent(routeInfo.destination + ', India')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#06d6a0] text-[#0a1625] font-semibold text-sm hover:bg-[#05c493] transition-colors"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 rounded-2xl bg-[#06d6a0]/10 border border-[#06d6a0]/20">
                <p className="text-sm text-[#06d6a0]">
                  💡 <strong>Pro Tip:</strong> Click "Open in Google Maps" to get turn-by-turn navigation, traffic updates, and alternate routes on your device.
                </p>
              </div>

              {/* Eco Route Planner CTA */}
              <Link 
                to="/sustainable"
                className="mt-6 block p-5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 hover:border-emerald-400/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Want full CO₂ data and mode comparison?</p>
                      <p className="text-sm text-white/60">Compare Train, Bus, Flight emissions • Earn green rewards • Track your carbon footprint</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span className="font-medium">Open Eco Travel Planner</span>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Always visible Eco Banner (when no route shown) */}
          {!showMap && (
            <div className="max-w-3xl mx-auto mt-8">
              <Link 
                to="/sustainable"
                className="block p-6 rounded-2xl bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 border border-emerald-500/30 hover:border-emerald-400/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Leaf className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">🌱 View Detailed CO₂ Route Planner</p>
                      <p className="text-sm text-white/60">Compare emissions across Car, Train, Bus, Flight • Get sustainability scores • Earn eco rewards</p>
                    </div>
                  </div>
                  <ArrowRight className="hidden md:block w-6 h-6 text-emerald-400 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RouteMapSection;
