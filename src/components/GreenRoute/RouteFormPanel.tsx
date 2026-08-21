import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Train, 
  Bus, 
  Plane, 
  Leaf, 
  Flame, 
  Search, 
  ChevronDown,
  Loader2
} from 'lucide-react';
import type { 
  RouteMode, 
  RouteResult,
  LatLng 
} from '../../types/greenRoute';
import { 
  INDIAN_CITIES, 
  getCityByName,
  calculateDistance,
  calculateEmissions,
  calculateGreenScore,
  estimateDuration,
  generateRouteCoordinates,
  getModeComparison
} from '../../types/greenRoute';

interface RouteFormPanelProps {
  userLocation: LatLng | null;
  locationLoading: boolean;
  onCalculate: (result: RouteResult) => void;
  onOriginChange: (coords: LatLng | null, label: string) => void;
}

const transportModes: { mode: RouteMode; icon: React.ElementType; label: string; color: string }[] = [
  { mode: 'car', icon: Car, label: 'Car', color: 'orange' },
  { mode: 'bus', icon: Bus, label: 'Bus', color: 'blue' },
  { mode: 'train', icon: Train, label: 'Train', color: 'green' },
  { mode: 'flight', icon: Plane, label: 'Flight', color: 'purple' },
];

const RouteFormPanel: React.FC<RouteFormPanelProps> = ({
  userLocation,
  locationLoading,
  onCalculate,
  onOriginChange,
}) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<RouteMode>('train');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter cities based on input
  const filteredOriginCities = useMemo(() => {
    if (!originInput) return INDIAN_CITIES.slice(0, 8);
    return INDIAN_CITIES.filter(city =>
      city.name.toLowerCase().includes(originInput.toLowerCase()) ||
      city.state.toLowerCase().includes(originInput.toLowerCase())
    ).slice(0, 8);
  }, [originInput]);

  const filteredDestCities = useMemo(() => {
    if (!destinationInput) return INDIAN_CITIES.slice(0, 8);
    return INDIAN_CITIES.filter(city =>
      city.name.toLowerCase().includes(destinationInput.toLowerCase()) ||
      city.state.toLowerCase().includes(destinationInput.toLowerCase())
    ).slice(0, 8);
  }, [destinationInput]);

  const handleOriginSelect = (cityName: string) => {
    setOriginInput(cityName);
    setShowOriginDropdown(false);
    const city = getCityByName(cityName);
    if (city) {
      onOriginChange(city.coordinates, cityName);
    }
  };

  const handleDestSelect = (cityName: string) => {
    setDestinationInput(cityName);
    setShowDestDropdown(false);
  };

  const handleUseCurrentLocationToggle = () => {
    const newValue = !useCurrentLocation;
    setUseCurrentLocation(newValue);
    if (newValue && userLocation) {
      onOriginChange(userLocation, 'Your Location');
      setOriginInput('');
    }
  };

  const handleCalculate = async () => {
    setError(null);
    setIsCalculating(true);

    try {
      // Get origin coordinates
      let originCoords: LatLng | null = null;
      let originLabel = 'Your Location';

      if (useCurrentLocation) {
        if (!userLocation) {
          throw new Error('Unable to get your current location');
        }
        originCoords = userLocation;
      } else {
        const originCity = getCityByName(originInput);
        if (!originCity) {
          throw new Error('Please select a valid origin city');
        }
        originCoords = originCity.coordinates;
        originLabel = originInput;
      }

      // Get destination coordinates
      const destCity = getCityByName(destinationInput);
      if (!destCity) {
        throw new Error('Please select a valid destination');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Calculate route details
      const distanceKm = calculateDistance(originCoords, destCity.coordinates);
      const emissionsKg = calculateEmissions(distanceKm, selectedMode);
      const greenScore = calculateGreenScore(selectedMode);
      const duration = estimateDuration(distanceKm, selectedMode);
      const coordinates = generateRouteCoordinates(originCoords, destCity.coordinates);
      const alternatives = getModeComparison(distanceKm);

      const result: RouteResult = {
        distanceKm,
        emissionsKg,
        mode: selectedMode,
        greenScore,
        originLabel,
        destinationLabel: destinationInput,
        originCoords,
        destinationCoords: destCity.coordinates,
        coordinates,
        duration,
        alternatives,
      };

      onCalculate(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate route');
    } finally {
      setIsCalculating(false);
    }
  };

  const isGreenMode = selectedMode === 'train' || selectedMode === 'bus';
  const isHighImpact = selectedMode === 'flight';

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Green Route Planner</h2>
            <p className="text-emerald-100 text-sm">Calculate your eco-friendly journey</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Origin Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Origin</label>
          
          {/* Use Current Location Toggle */}
          <button
            onClick={handleUseCurrentLocationToggle}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
              useCurrentLocation
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              useCurrentLocation ? 'bg-emerald-500' : 'bg-slate-200'
            }`}>
              {locationLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Navigation className={`w-4 h-4 ${useCurrentLocation ? 'text-white' : 'text-slate-500'}`} />
              )}
            </div>
            <div className="text-left flex-1">
              <p className={`font-medium ${useCurrentLocation ? 'text-emerald-700' : 'text-slate-700'}`}>
                Use my current location
              </p>
              <p className="text-xs text-slate-500">
                {locationLoading ? 'Getting location...' : 'Auto-detect your position'}
              </p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              useCurrentLocation ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
            }`}>
              {useCurrentLocation && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>

          {/* Manual Origin Input */}
          {!useCurrentLocation && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={originInput}
                onChange={(e) => {
                  setOriginInput(e.target.value);
                  setShowOriginDropdown(true);
                }}
                onFocus={() => setShowOriginDropdown(true)}
                placeholder="Enter origin city..."
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              
              {/* Dropdown */}
              {showOriginDropdown && filteredOriginCities.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {filteredOriginCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleOriginSelect(city.name)}
                      className="w-full px-4 py-3 text-left hover:bg-emerald-50 flex items-center gap-3 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="font-medium text-slate-800">{city.name}</p>
                        <p className="text-xs text-slate-500">{city.state}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Destination Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Destination</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <MapPin className="w-5 h-5 text-red-400" />
            </div>
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => {
                setDestinationInput(e.target.value);
                setShowDestDropdown(true);
              }}
              onFocus={() => setShowDestDropdown(true)}
              placeholder="Where do you want to go?"
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            
            {/* Dropdown */}
            {showDestDropdown && filteredDestCities.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredDestCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleDestSelect(city.name)}
                    className="w-full px-4 py-3 text-left hover:bg-emerald-50 flex items-center gap-3 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-red-400" />
                    <div>
                      <p className="font-medium text-slate-800">{city.name}</p>
                      <p className="text-xs text-slate-500">{city.state}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transport Mode Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Transport Mode</label>
          <div className="grid grid-cols-4 gap-2">
            {transportModes.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  selectedMode === mode
                    ? mode === 'train' || mode === 'bus'
                      ? 'border-emerald-500 bg-emerald-50'
                      : mode === 'flight'
                        ? 'border-red-400 bg-red-50'
                        : 'border-orange-400 bg-orange-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  selectedMode === mode
                    ? mode === 'train' || mode === 'bus'
                      ? 'text-emerald-600'
                      : mode === 'flight'
                        ? 'text-red-500'
                        : 'text-orange-500'
                    : 'text-slate-500'
                }`} />
                <span className={`text-xs font-medium ${
                  selectedMode === mode ? 'text-slate-800' : 'text-slate-600'
                }`}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Mode Badge */}
          {isGreenMode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Low Emissions Mode</span>
            </div>
          )}
          {isHighImpact && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200">
              <Flame className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">High Impact - Consider offsetting</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={isCalculating || (!useCurrentLocation && !originInput) || !destinationInput}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Calculate Impact
            </>
          )}
        </button>

        {/* Quick Destinations */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 mb-3">POPULAR DESTINATIONS</p>
          <div className="flex flex-wrap gap-2">
            {['Goa', 'Manali', 'Jaipur', 'Kerala', 'Varanasi'].map((dest) => (
              <button
                key={dest}
                onClick={() => {
                  const city = INDIAN_CITIES.find(c => 
                    c.name.toLowerCase().includes(dest.toLowerCase()) ||
                    c.state.toLowerCase().includes(dest.toLowerCase())
                  );
                  if (city) {
                    setDestinationInput(city.name);
                    setShowDestDropdown(false);
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteFormPanel;
