// Green Route Planner TypeScript Types

export type RouteMode = 'car' | 'train' | 'bus' | 'flight';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface CityData {
  name: string;
  state: string;
  coordinates: LatLng;
}

export interface RouteResult {
  distanceKm: number;
  emissionsKg: number;
  mode: RouteMode;
  greenScore: number;
  originLabel: string;
  destinationLabel: string;
  originCoords: LatLng;
  destinationCoords: LatLng;
  coordinates: LatLng[];
  duration: string;
  alternatives: ModeComparison[];
}

export interface ModeComparison {
  mode: RouteMode;
  emissionsKg: number;
  greenScore: number;
  duration: string;
  savingsPercent?: number;
}

export interface EmissionFactors {
  car: number;
  bus: number;
  train: number;
  flight: number;
}

// Emission factors in kg CO2 per km
export const EMISSION_FACTORS: EmissionFactors = {
  car: 0.21,      // Average car emissions
  bus: 0.089,     // Bus per passenger
  train: 0.041,   // Electric train per passenger
  flight: 0.255,  // Domestic flight per passenger
};

// Speed factors in km/h for duration estimation
export const SPEED_FACTORS: EmissionFactors = {
  car: 60,
  bus: 45,
  train: 80,
  flight: 500,
};

// Indian cities with coordinates for geocoding
export const INDIAN_CITIES: CityData[] = [
  { name: 'New Delhi', state: 'Delhi', coordinates: { lat: 28.6139, lng: 77.2090 } },
  { name: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.0760, lng: 72.8777 } },
  { name: 'Bangalore', state: 'Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 } },
  { name: 'Chennai', state: 'Tamil Nadu', coordinates: { lat: 13.0827, lng: 80.2707 } },
  { name: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 } },
  { name: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.3850, lng: 78.4867 } },
  { name: 'Pune', state: 'Maharashtra', coordinates: { lat: 18.5204, lng: 73.8567 } },
  { name: 'Ahmedabad', state: 'Gujarat', coordinates: { lat: 23.0225, lng: 72.5714 } },
  { name: 'Jaipur', state: 'Rajasthan', coordinates: { lat: 26.9124, lng: 75.7873 } },
  { name: 'Lucknow', state: 'Uttar Pradesh', coordinates: { lat: 26.8467, lng: 80.9462 } },
  { name: 'Chandigarh', state: 'Punjab', coordinates: { lat: 30.7333, lng: 76.7794 } },
  { name: 'Goa', state: 'Goa', coordinates: { lat: 15.2993, lng: 74.1240 } },
  { name: 'Manali', state: 'Himachal Pradesh', coordinates: { lat: 32.2396, lng: 77.1887 } },
  { name: 'Shimla', state: 'Himachal Pradesh', coordinates: { lat: 31.1048, lng: 77.1734 } },
  { name: 'Udaipur', state: 'Rajasthan', coordinates: { lat: 24.5854, lng: 73.7125 } },
  { name: 'Jodhpur', state: 'Rajasthan', coordinates: { lat: 26.2389, lng: 73.0243 } },
  { name: 'Varanasi', state: 'Uttar Pradesh', coordinates: { lat: 25.3176, lng: 82.9739 } },
  { name: 'Agra', state: 'Uttar Pradesh', coordinates: { lat: 27.1767, lng: 78.0081 } },
  { name: 'Amritsar', state: 'Punjab', coordinates: { lat: 31.6340, lng: 74.8723 } },
  { name: 'Kochi', state: 'Kerala', coordinates: { lat: 9.9312, lng: 76.2673 } },
  { name: 'Thiruvananthapuram', state: 'Kerala', coordinates: { lat: 8.5241, lng: 76.9366 } },
  { name: 'Mysore', state: 'Karnataka', coordinates: { lat: 12.2958, lng: 76.6394 } },
  { name: 'Rishikesh', state: 'Uttarakhand', coordinates: { lat: 30.0869, lng: 78.2676 } },
  { name: 'Dehradun', state: 'Uttarakhand', coordinates: { lat: 30.3165, lng: 78.0322 } },
  { name: 'Darjeeling', state: 'West Bengal', coordinates: { lat: 27.0410, lng: 88.2663 } },
  { name: 'Gangtok', state: 'Sikkim', coordinates: { lat: 27.3389, lng: 88.6065 } },
  { name: 'Leh', state: 'Ladakh', coordinates: { lat: 34.1526, lng: 77.5771 } },
  { name: 'Srinagar', state: 'Jammu & Kashmir', coordinates: { lat: 34.0837, lng: 74.7973 } },
  { name: 'Ooty', state: 'Tamil Nadu', coordinates: { lat: 11.4102, lng: 76.6950 } },
  { name: 'Coorg', state: 'Karnataka', coordinates: { lat: 12.3375, lng: 75.8069 } },
  { name: 'Pondicherry', state: 'Puducherry', coordinates: { lat: 11.9416, lng: 79.8083 } },
  { name: 'Rameswaram', state: 'Tamil Nadu', coordinates: { lat: 9.2881, lng: 79.3129 } },
  { name: 'Madurai', state: 'Tamil Nadu', coordinates: { lat: 9.9252, lng: 78.1198 } },
  { name: 'Hampi', state: 'Karnataka', coordinates: { lat: 15.3350, lng: 76.4600 } },
  { name: 'Aurangabad', state: 'Maharashtra', coordinates: { lat: 19.8762, lng: 75.3433 } },
  { name: 'Nashik', state: 'Maharashtra', coordinates: { lat: 19.9975, lng: 73.7898 } },
  { name: 'Mount Abu', state: 'Rajasthan', coordinates: { lat: 24.5926, lng: 72.7156 } },
  { name: 'Pushkar', state: 'Rajasthan', coordinates: { lat: 26.4897, lng: 74.5511 } },
  { name: 'Jaisalmer', state: 'Rajasthan', coordinates: { lat: 26.9157, lng: 70.9083 } },
  { name: 'Khajuraho', state: 'Madhya Pradesh', coordinates: { lat: 24.8318, lng: 79.9199 } },
  { name: 'Bhopal', state: 'Madhya Pradesh', coordinates: { lat: 23.2599, lng: 77.4126 } },
  { name: 'Indore', state: 'Madhya Pradesh', coordinates: { lat: 22.7196, lng: 75.8577 } },
  { name: 'Guwahati', state: 'Assam', coordinates: { lat: 26.1445, lng: 91.7362 } },
  { name: 'Shillong', state: 'Meghalaya', coordinates: { lat: 25.5788, lng: 91.8933 } },
  { name: 'Kaziranga', state: 'Assam', coordinates: { lat: 26.5775, lng: 93.1711 } },
  { name: 'Bhubaneswar', state: 'Odisha', coordinates: { lat: 20.2961, lng: 85.8245 } },
  { name: 'Puri', state: 'Odisha', coordinates: { lat: 19.8135, lng: 85.8312 } },
  { name: 'Konark', state: 'Odisha', coordinates: { lat: 19.8876, lng: 86.0945 } },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', coordinates: { lat: 17.6868, lng: 83.2185 } },
  { name: 'Tirupati', state: 'Andhra Pradesh', coordinates: { lat: 13.6288, lng: 79.4192 } },
];

// Get city by name
export const getCityByName = (name: string): CityData | undefined => {
  return INDIAN_CITIES.find(
    city => city.name.toLowerCase() === name.toLowerCase()
  );
};

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (from: LatLng, to: LatLng): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

const toRad = (deg: number): number => deg * (Math.PI / 180);

// Calculate emissions for a route
export const calculateEmissions = (distanceKm: number, mode: RouteMode): number => {
  return Math.round(distanceKm * EMISSION_FACTORS[mode] * 10) / 10;
};

// Calculate green score (0-100, higher is better/greener)
export const calculateGreenScore = (mode: RouteMode): number => {
  const scores: Record<RouteMode, number> = {
    train: 95,
    bus: 80,
    car: 45,
    flight: 25,
  };
  return scores[mode];
};

// Estimate travel duration
export const estimateDuration = (distanceKm: number, mode: RouteMode): string => {
  const hours = distanceKm / SPEED_FACTORS[mode];
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  } else if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
};

// Generate route coordinates (simplified - creates a curved path)
export const generateRouteCoordinates = (from: LatLng, to: LatLng): LatLng[] => {
  const points: LatLng[] = [];
  const numPoints = 20;
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    // Add slight curve to the route
    const curve = Math.sin(t * Math.PI) * 0.5;
    const lat = from.lat + (to.lat - from.lat) * t + curve * (to.lng - from.lng) * 0.1;
    const lng = from.lng + (to.lng - from.lng) * t - curve * (to.lat - from.lat) * 0.1;
    points.push({ lat, lng });
  }
  
  return points;
};

// Get mode comparison for all transport types
export const getModeComparison = (distanceKm: number): ModeComparison[] => {
  const modes: RouteMode[] = ['train', 'bus', 'car', 'flight'];
  const comparisons = modes.map(mode => ({
    mode,
    emissionsKg: calculateEmissions(distanceKm, mode),
    greenScore: calculateGreenScore(mode),
    duration: estimateDuration(distanceKm, mode),
  }));

  // Calculate savings compared to highest emission mode
  const maxEmissions = Math.max(...comparisons.map(c => c.emissionsKg));
  return comparisons.map(c => ({
    ...c,
    savingsPercent: Math.round((1 - c.emissionsKg / maxEmissions) * 100),
  }));
};

// Get eco tip based on mode
export const getEcoTip = (mode: RouteMode, distanceKm: number): string => {
  const tips: Record<RouteMode, string[]> = {
    train: [
      '🌿 Great choice! Trains are the greenest long-distance option.',
      '🚂 You\'re saving up to 80% emissions compared to flying!',
      '♻️ Electric trains produce minimal direct emissions.',
    ],
    bus: [
      '🚌 Good choice! Buses are efficient for medium distances.',
      '👥 Shared transport means lower per-person emissions.',
      '💡 Consider sleeper buses for overnight journeys.',
    ],
    car: [
      '🚗 Consider carpooling to reduce your carbon footprint.',
      '⚡ Electric vehicles can cut emissions by 50%+.',
      '🔄 Train might be faster and greener for this distance.',
    ],
    flight: [
      '✈️ Flights have highest emissions. Consider alternatives.',
      '🌱 Offset your carbon footprint through verified programs.',
      '🚂 For distances under 500km, trains are often faster overall.',
    ],
  };

  const tipIndex = Math.floor(Math.random() * tips[mode].length);
  
  // Add distance-specific suggestion
  if (mode === 'flight' && distanceKm < 400) {
    return '🚂 This distance is ideal for train travel - faster door-to-door and much greener!';
  }
  
  return tips[mode][tipIndex];
};
