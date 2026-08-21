// src/components/Map.tsx
import React, { useEffect, useState } from 'react';
import { Eye, Globe2, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapContainerComp = MapContainer as any;
const TileLayerComp = TileLayer as any;

// Fix Leaflet marker icons
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconShadow = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MAP_MODES = [
  { key: 'standard', label: 'Standard', icon: <Globe2 size={16} /> },
  { key: 'streetview', label: 'Street View', icon: <Eye size={16} /> },
  { key: 'traffic', label: 'Traffic', icon: <Navigation size={16} /> },
];

const LOCATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'India': { lat: 27.1751, lng: 78.0421 }, // Taj Mahal, Agra
  'Agra': { lat: 27.1751, lng: 78.0421 },
  'Delhi': { lat: 28.6129, lng: 77.2295 },
  'Mumbai': { lat: 18.9220, lng: 72.8347 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Kerala': { lat: 9.9312, lng: 76.2673 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
};

const Map: React.FC<{ location?: string }> = ({ location = 'India' }) => {
  const [mode, setMode] = useState<'standard' | 'streetview' | 'traffic'>('standard');
  const [showLocation, setShowLocation] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const locData = LOCATION_COORDINATES[location] || LOCATION_COORDINATES['India'];
  const coords = showLocation && userCoords ? userCoords : locData;

  useEffect(() => {
    if (showLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.warn("Geolocation error:", err)
      );
    }
  }, [showLocation]);

  // Tile layer source by mode
  let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  let attribution = '&copy; OpenStreetMap contributors';

  if (mode === 'streetview') {
    // High-Resolution Satellite & Street View
    tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
  } else if (mode === 'traffic') {
    // Navigation & Traffic Route Tiles
    tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    attribution = 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap';
  }

  const openGoogleStreetView = () => {
    const url = `https://www.google.com/maps/@${coords.lat},${coords.lng},3a,75y,210h,90t/data=!3m6!1e1`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-slate-700 bg-slate-950 relative font-sans">
      {/* Control Buttons Bar */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap gap-2">
        {MAP_MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setMode(m.key as any);
              setShowLocation(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all ${
              !showLocation && mode === m.key
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-slate-900/90 text-slate-200 hover:bg-slate-800 border border-slate-700 backdrop-blur-md'
            }`}
            title={m.label}
          >
            {m.icon} {m.label}
          </button>
        ))}

        <button
          onClick={() => setShowLocation((l) => !l)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all ${
            showLocation
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-slate-900/90 text-slate-200 hover:bg-slate-800 border border-slate-700 backdrop-blur-md'
          }`}
          title="Show My Location"
        >
          <MapPin size={16} /> My Location
        </button>

        {mode === 'streetview' && (
          <button
            onClick={openGoogleStreetView}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-600 text-white flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all border border-amber-500/30"
          >
            <ExternalLink size={14} /> Open 360° Street View
          </button>
        )}
      </div>

      {/* Interactive Map View */}
      <div className="w-full h-[460px] relative">
        <MapContainerComp 
          key={`${coords.lat}-${coords.lng}-${mode}`}
          center={[coords.lat, coords.lng]} 
          zoom={mode === 'streetview' ? 16 : 13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayerComp
            url={tileUrl}
            attribution={attribution}
            maxZoom={19}
          />
          <Marker position={[coords.lat, coords.lng]}>
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <p className="font-bold text-sm">{location}</p>
                <p className="text-xs text-slate-600">Coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainerComp>
      </div>

      {/* Map Footer Bar */}
      <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-slate-300">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-rose-500" />
          <span className="font-semibold text-slate-100">{location}</span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
            {mode === 'streetview' ? 'High-Res Street View' : mode === 'traffic' ? 'Traffic Navigation View' : 'Standard Map'}
          </span>
        </div>

        {showLocation && userCoords && (
          <span className="text-blue-400 font-mono text-[11px]">
            GPS: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Map;
