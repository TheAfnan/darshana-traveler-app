import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  ArrowLeft, 
  TreePine, 
  Wind, 
  Sparkles,
  Globe2
} from 'lucide-react';
import { RouteFormPanel, RouteResultCard, EcoMapPanel } from '../components/GreenRoute';
import useGeolocation from '../hooks/useGeolocation';
import type { RouteResult, LatLng } from '../types/greenRoute';

/**
 * GreenRoutePlannerPage - Premium eco-friendly route planning experience
 * Features:
 * - Split layout: Form on left, interactive map on right
 * - User geolocation integration
 * - CO2 emissions calculation
 * - Green score comparison across transport modes
 * - Beautiful animations and micro-interactions
 */
const GreenRoutePlannerPage: React.FC = () => {
  const { location: userLocation, loading: locationLoading } = useGeolocation();
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [originCoords, setOriginCoords] = useState<LatLng | null>(null);
  const [originLabel, setOriginLabel] = useState<string>('Your Location');

  const handleRouteCalculated = useCallback((result: RouteResult) => {
    setRouteResult(result);
  }, []);

  const handleOriginChange = useCallback((coords: LatLng | null, label: string) => {
    setOriginCoords(coords);
    setOriginLabel(label);
  }, []);

  const handleSaveRoute = useCallback(() => {
    // Save route to local storage or API
    if (routeResult) {
      const savedRoutes = JSON.parse(localStorage.getItem('savedGreenRoutes') || '[]');
      savedRoutes.push({
        ...routeResult,
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem('savedGreenRoutes', JSON.stringify(savedRoutes));
    }
  }, [routeResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/sustainable" 
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800">Green Route Planner</h1>
                  <p className="text-xs text-slate-500">Eco-friendly travel planning</p>
                </div>
              </div>
            </div>

            {/* Eco Stats Badge */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <TreePine className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-600">2.5T CO₂ saved by community</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wind className="w-4 h-4 text-blue-500" />
                <span className="text-slate-600">10K+ green routes planned</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-8 md:py-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium text-emerald-100">DarShana Eco Travel</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Plan Your Sustainable Journey
              </h2>
              <p className="text-emerald-100 max-w-xl">
                Compare transport modes, calculate your carbon footprint, and discover 
                greener ways to explore India's beautiful destinations.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Globe2 className="w-8 h-8 mx-auto mb-1 text-white" />
                <p className="text-2xl font-bold">50+</p>
                <p className="text-xs text-emerald-100">Cities</p>
              </div>
              <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Leaf className="w-8 h-8 mx-auto mb-1 text-white" />
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-emerald-100">Modes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Panel - Form & Results */}
          <div className="lg:col-span-5 space-y-6">
            <RouteFormPanel
              userLocation={userLocation}
              locationLoading={locationLoading}
              onCalculate={handleRouteCalculated}
              onOriginChange={handleOriginChange}
            />

            {/* Results Card */}
            {routeResult && (
              <RouteResultCard
                result={routeResult}
                onSaveRoute={handleSaveRoute}
              />
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 h-[500px] lg:h-[calc(100vh-12rem)]">
              <EcoMapPanel
                userLocation={userLocation}
                locationLoading={locationLoading}
                routeResult={routeResult}
                originCoords={originCoords}
                originLabel={originLabel}
              />
            </div>
          </div>
        </div>

        {/* Eco Tips Section */}
        <section className="mt-12 py-8 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
            🌿 Eco Travel Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🚂</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Choose Trains</h4>
              <p className="text-sm text-slate-600">
                Indian Railways is one of the greenest transport options. 
                Electric trains produce 80% less emissions than flights.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🚌</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Share Rides</h4>
              <p className="text-sm text-slate-600">
                Buses and shared transport reduce per-person emissions. 
                Consider sleeper buses for overnight journeys.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Offset Carbon</h4>
              <p className="text-sm text-slate-600">
                When flying is necessary, offset your emissions through 
                verified tree-planting or renewable energy programs.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        /* Custom marker styles for Leaflet */
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default GreenRoutePlannerPage;
