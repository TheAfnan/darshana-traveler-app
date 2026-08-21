// User Authentication Types
export interface SignUpData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Profile Types
export interface UserProfile extends User {
  upcomingTrips: Trip[];
  pastTrips: Trip[];
  savedDestinations: Destination[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'en' | 'hi';
  notifications: boolean;
  theme: 'light' | 'dark';
}

// Trip Types
export interface Trip {
  id: string;
  userId: string;
  destination: Destination;
  startDate: Date;
  endDate: Date;
  travelers: TravelerDetail[];
  transport: TransportType;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingId: string;
  totalCost: number;
  createdAt: Date;
}

export interface TravelerDetail {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  documentType: 'passport' | 'aadhar' | 'license';
  documentNumber: string;
  relationship?: string;
}

export type TransportType = 'Plane' | 'Train' | 'Bus' | 'Ship' | 'Bike' | 'Car';

// Destination Types
export interface Destination {
  id: string;
  name: string;
  country: string;
  state: string;
  description: string;
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  upcomingFestivals: Festival[];
}

// Festival Types
export interface Festival {
  id: string;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string;
  image: string;
  significance: string;
}

// Local Guide Types
export interface LocalGuide {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  specialties: string[];
  rating: number;
  reviews: number;
  profileImage: string;
  bio: string;
  languages: string[];
  verified: boolean;
  pricePerDay?: number;
  experience?: string;
  certifications?: string[];
  availability?: 'available' | 'unavailable' | 'on_leave';
  responseTime?: string;
  totalTrips?: number;
}

export interface GuideRegistration {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  specialties: string[];
  languages: string[];
  bio: string;
  pricePerDay: number;
  experience: number;
  certifications: string[];
  documents: {
    idProof: File | string;
    backgroundCheck: File | string;
  };
  availability: 'available' | 'unavailable' | 'on_leave';
  responseTime: string;
  profileImage?: File | string;
}

export interface GuideStats {
  totalRequests: number;
  acceptedRequests: number;
  completedTrips: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
  responseRate: number;
}

export interface GuideRequest {
  id: string;
  userId: string;
  guideId: string;
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  travelers?: number;
  requestType: 'travel_queries' | 'trip_planning' | 'recommendations' | 'emergency' | 'booking_assistance';
  message: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  createdAt: Date;
  resolvedAt?: Date;
}

// Contact Us Types
export interface ContactMessage {
  id?: string;
  subject: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'read' | 'resolved';
  createdAt?: Date;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  trip: Trip;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingReference: string;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'festival_alert' | 'booking_update' | 'guide_response' | 'general';
  title: string;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: Date;
}
