import React, { useEffect, useRef, useState } from 'react';
import type L from 'leaflet';
import { 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Layers,
  MapPin,
  Navigation,
  Loader2
} from 'lucide-react';
import type { LatLng, RouteResult } from '../../types/greenRoute';

interface EcoMapPanelProps {
  userLocation: LatLng | null;
  locationLoading: boolean;
  routeResult: RouteResult | null;
  originCoords: LatLng | null;
  originLabel: string;
}

// Declare Leaflet types
declare global {
  interface Window {
    L: typeof import('leaflet');
  }
}

const EcoMapPanel: React.FC<EcoMapPanelProps> = ({
  userLocation,
  locationLoading,
  routeResult,
  originCoords,
  originLabel,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite'>('standard');

  // Default center: India
  const defaultCenter: LatLng = { lat: 20.5937, lng: 78.9629 };
  const defaultZoom = 5;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initializeMap();
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current || !window.L) return;

      const L = window.L;
      
      // Create map
      const map = L.map(mapRef.current, {
        center: [defaultCenter.lat, defaultCenter.lng],
        zoom: defaultZoom,
        zoomControl: false,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map when user location changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const locationToShow = originCoords || userLocation;

    if (locationToShow) {
      // Create custom icon for user location
      const userIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative">
            <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-500 rotate-45"></div>
          </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
      });

      const marker = L.marker([locationToShow.lat, locationToShow.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`<b>${originLabel || 'You are here'}</b>`);
      
      markersRef.current.push(marker);

      // Center map on user location if no route
      if (!routeResult) {
        map.setView([locationToShow.lat, locationToShow.lng], 10);
      }
    }
  }, [mapReady, userLocation, originCoords, originLabel, routeResult]);

  // Draw route when result changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !window.L || !routeResult) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear existing route
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create origin marker (A)
    const originIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-3 border-white text-white font-bold text-lg">
          A
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const originMarker = L.marker(
      [routeResult.originCoords.lat, routeResult.originCoords.lng], 
      { icon: originIcon }
    )
      .addTo(map)
      .bindPopup(`<b>Start:</b> ${routeResult.originLabel}`);
    
    markersRef.current.push(originMarker);

    // Create destination marker (B)
    const destIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-3 border-white text-white font-bold text-lg">
          B
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const destMarker = L.marker(
      [routeResult.destinationCoords.lat, routeResult.destinationCoords.lng], 
      { icon: destIcon }
    )
      .addTo(map)
      .bindPopup(`<b>End:</b> ${routeResult.destinationLabel}<br><small>${routeResult.distanceKm} km</small>`);
    
    markersRef.current.push(destMarker);

    // Draw route polyline with gradient effect
    const routeCoords = routeResult.coordinates.map(c => [c.lat, c.lng] as [number, number]);
    
    // Create eco-themed polyline
    const routeLine = L.polyline(routeCoords, {
      color: '#10b981', // Emerald green
      weight: 5,
      opacity: 0.8,
      dashArray: routeResult.mode === 'flight' ? '10, 10' : undefined,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    routeLineRef.current = routeLine;

    // Fit bounds to show entire route
    const bounds = L.latLngBounds([
      [routeResult.originCoords.lat, routeResult.originCoords.lng],
      [routeResult.destinationCoords.lat, routeResult.destinationCoords.lng],
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

  }, [mapReady, routeResult]);

  // Map controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;

    if (routeResult) {
      const L = window.L;
      const bounds = L.latLngBounds([
        [routeResult.originCoords.lat, routeResult.originCoords.lng],
        [routeResult.destinationCoords.lat, routeResult.destinationCoords.lng],
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 10);
    }
  };

  const toggleMapStyle = () => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Remove existing tile layer
    map.eachLayer((layer) => {
      if ((layer as L.TileLayer).getAttribution) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer based on style
    const newStyle = mapStyle === 'standard' ? 'satellite' : 'standard';
    
    if (newStyle === 'satellite') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri',
        maxZoom: 19,
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
    }

    setMapStyle(newStyle);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden h-full flex flex-col">
      {/* Map Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold text-slate-700">Interactive Route Map</span>
        </div>
        {routeResult && (
          <span className="text-sm text-slate-500">
            {routeResult.distanceKm} km • {routeResult.duration}
          </span>
        )}
      </div>

      {/* Map Container */}
      <div className="relative flex-1 min-h-[400px]">
        {/* Loading State */}
        {(locationLoading || !mapReady) && (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-600">
                {locationLoading ? 'Getting your location...' : 'Loading map...'}
              </p>
            </div>
          </div>
        )}

        {/* Leaflet Map */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={handleRecenter}
            className="w-10 h-10 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Recenter map"
          >
            <Crosshair className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={toggleMapStyle}
            className="w-10 h-10 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Toggle map style"
          >
            <Layers className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Legend */}
        {routeResult && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-3 z-[1000]">
            <p className="text-xs font-semibold text-slate-500 mb-2">ROUTE LEGEND</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                <span className="text-sm text-slate-700">{routeResult.originLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>
                <span className="text-sm text-slate-700">{routeResult.destinationLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-emerald-500 rounded"></div>
                <span className="text-sm text-slate-700">Eco Route</span>
              </div>
            </div>
          </div>
        )}

        {/* No Route Message */}
        {!routeResult && mapReady && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-4 z-[1000]">
            <div className="flex items-center gap-3">
              <Navigation className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="font-medium text-slate-700">Ready to plan your green journey</p>
                <p className="text-sm text-slate-500">Select a destination to see the eco-friendly route</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoMapPanel;
