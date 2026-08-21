// src/components/FestivalMap.tsx
import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  MapPin, 
  Calendar, 
  Sparkles, 
  Eye, 
  Navigation, 
  Globe2, 
  ChevronRight,
  LocateFixed,
  Compass
} from 'lucide-react';

const MapContainerComp = MapContainer as any;
const TileLayerComp = TileLayer as any;

export interface FestivalMapItem {
  id?: number | string;
  name: string;
  location?: string;
  lat: number;
  lng: number;
  desc?: string;
  description?: string;
  img?: string;
  cardType?: "festival" | "culture" | "historical" | string;
  type?: string;
  aspect?: string;
  era?: string;
  month?: string;
  date?: string;
  day?: string;
  distanceKm?: number;
  [key: string]: any;
}

interface FestivalMapProps {
  items: FestivalMapItem[];
  onSelectItem?: (item: FestivalMapItem) => void;
  userCoords?: { lat: number; lng: number } | null;
  userCityName?: string;
}

// Custom Leaflet DivIcons for different culture types
const createCategoryIcon = (cardType: string) => {
  let bgColor = '#ea580c'; // Orange for festivals
  let emoji = '🪔';

  if (cardType === 'culture') {
    bgColor = '#9333ea'; // Purple for culture
    emoji = '🎭';
  } else if (cardType === 'historical') {
    bgColor = '#d97706'; // Amber for history
    emoji = '🏛️';
  }

  return L.divIcon({
    className: 'custom-festival-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        cursor: pointer;
      ">
        <span style="transform: rotate(45deg); font-size: 14px; line-height: 1;">${emoji}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const UserLocationIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="
      background-color: #0284c7;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 15px #0284c7;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 1.5s infinite;
    ">
      <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

// Helper component to smoothly pan map view
function MapPanController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export const FestivalMap: React.FC<FestivalMapProps> = ({
  items,
  onSelectItem,
  userCoords,
  userCityName
}) => {
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.5937, 79.9629]); // India central coordinates
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'festival' | 'culture' | 'historical'>('all');

  // Filter items with valid coordinates
  const validItems = useMemo(() => {
    return items.filter(
      (item) =>
        typeof item.lat === 'number' &&
        typeof item.lng === 'number' &&
        !isNaN(item.lat) &&
        !isNaN(item.lng) &&
        (selectedCategory === 'all' || item.cardType === selectedCategory)
    );
  }, [items, selectedCategory]);

  const tileUrl = mapMode === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const attribution = mapMode === 'satellite'
    ? 'Tiles &copy; Esri &mdash; DigitalGlobe, GeoEye, Earthstar Geographics'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  const panToRegion = (regionName: string, lat: number, lng: number, zoom: number = 7) => {
    setMapCenter([lat, lng]);
    setMapZoom(zoom);
  };

  return (
    <div className="w-full h-[620px] rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-stone-50 flex flex-col relative font-sans">
      
      {/* Top Map Control Bar */}
      <div className="p-3 bg-white/95 backdrop-blur-md border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 z-[400]">
        
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
            }`}
          >
            <span>All Locations</span>
            <span className="text-[10px] opacity-80">({items.length})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('festival')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              selectedCategory === 'festival'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200/60'
            }`}
          >
            <span>🪔 Festivals</span>
          </button>
          <button
            onClick={() => setSelectedCategory('culture')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              selectedCategory === 'culture'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            <span>🎭 Cultural Traditions</span>
          </button>
          <button
            onClick={() => setSelectedCategory('historical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              selectedCategory === 'historical'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <span>🏛️ Heritage Sites</span>
          </button>
        </div>

        {/* Region Quick Navigation */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Compass size={13} /> Zoom:
          </span>
          <button
            onClick={() => panToRegion('Pan India', 22.5937, 79.9629, 5)}
            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium rounded-lg text-xs transition cursor-pointer"
          >
            Pan India
          </button>
          <button
            onClick={() => panToRegion('North India', 27.5, 78.5, 6)}
            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium rounded-lg text-xs transition cursor-pointer"
          >
            North
          </button>
          <button
            onClick={() => panToRegion('South India', 11.5, 77.5, 6)}
            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium rounded-lg text-xs transition cursor-pointer"
          >
            South
          </button>
          <button
            onClick={() => panToRegion('East India', 24.5, 88.0, 6)}
            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium rounded-lg text-xs transition cursor-pointer"
          >
            East
          </button>
          <button
            onClick={() => panToRegion('West India', 24.0, 72.5, 6)}
            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium rounded-lg text-xs transition cursor-pointer"
          >
            West
          </button>
        </div>

      </div>

      {/* Map Canvas */}
      <div className="w-full flex-grow relative">
        <MapContainerComp
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <MapPanController center={mapCenter} zoom={mapZoom} />

          <TileLayerComp
            url={tileUrl}
            attribution={attribution}
            maxZoom={18}
          />

          {/* User Live GPS Marker if active */}
          {userCoords && (
            <Marker position={[userCoords.lat, userCoords.lng]} icon={UserLocationIcon}>
              <Popup>
                <div className="p-1 font-sans text-xs">
                  <span className="font-bold text-sky-700 flex items-center gap-1">
                    <LocateFixed size={13} /> Your Location
                  </span>
                  <p className="text-slate-600 text-[11px]">{userCityName || 'Active GPS coordinates'}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Festival Markers Plotted on Map */}
          {validItems.map((festival, index) => (
            <Marker
              key={festival.id ? `fest-${festival.id}` : `fest-${festival.name}-${index}`}
              position={[festival.lat, festival.lng]}
              icon={createCategoryIcon(festival.cardType || 'festival')}
            >
              <Popup className="festival-leaflet-popup">
                <div className="font-sans max-w-[260px] p-0.5 space-y-2">
                  {festival.img && (
                    <div className="relative h-28 rounded-lg overflow-hidden -mt-1 -mx-1 mb-2 bg-slate-900">
                      <img
                        src={festival.img}
                        alt={festival.name}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded text-white ${
                        festival.cardType === 'culture' ? 'bg-purple-600' :
                        festival.cardType === 'historical' ? 'bg-amber-600' : 'bg-orange-600'
                      }`}>
                        {festival.cardType || 'Festival'}
                      </span>
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {festival.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <MapPin size={11} className="text-red-500 shrink-0" />
                      <span className="truncate">{festival.location || 'India'}</span>
                    </div>
                  </div>

                  {(festival.date || festival.month) && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200/80 rounded text-[11px] text-amber-900 font-semibold">
                      <Calendar size={11} className="text-amber-700" />
                      <span>{festival.date || festival.month}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {festival.desc || festival.description || ''}
                  </p>

                  {onSelectItem && (
                    <button
                      onClick={() => onSelectItem(festival)}
                      className="w-full mt-2 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Explore Details</span>
                      <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainerComp>

        {/* Satellite Toggle Floating Switch */}
        <div className="absolute bottom-4 left-4 z-[400]">
          <button
            onClick={() => setMapMode((m) => (m === 'standard' ? 'satellite' : 'standard'))}
            className="px-3 py-1.5 bg-white/95 hover:bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md border border-stone-200 backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer"
          >
            {mapMode === 'standard' ? <Eye size={13} /> : <Globe2 size={13} />}
            <span>{mapMode === 'standard' ? 'Satellite View' : 'Standard Map'}</span>
          </button>
        </div>

        {/* Live Marker Legend Floating Pill */}
        <div className="absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-md text-xs font-semibold text-slate-700 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Festivals
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Traditions
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Heritage
          </span>
        </div>

      </div>

    </div>
  );
};

export default FestivalMap;
