import { API_BASE_URL } from '../config/api';

export interface DestinationResponse {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  temperature: string;
  weather: string;
  mapLink: string;
  rating: number;
  reviews: number;
}

export interface PackageResponse {
  id: string;
  title: string;
  duration: string;
  hotel: string;
  transport: string;
  price: number;
  includes: string[];
  excludes: string[];
  itinerary: string[];
}

export interface OfferResponse {
  id: string;
  title: string;
  discount: string;
  details: string;
}

export const fetchDestinations = async (): Promise<DestinationResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/destinations`);
  if (!res.ok) throw new Error('Failed to load destinations');
  return res.json();
};

export const fetchPackages = async (): Promise<PackageResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/packages`);
  if (!res.ok) throw new Error('Failed to load packages');
  return res.json();
};

export const fetchOffers = async (): Promise<OfferResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/offers`);
  if (!res.ok) throw new Error('Failed to load offers');
  return res.json();
};

export const fetchReviews = async () => {
  const res = await fetch(`${API_BASE_URL}/reviews`);
  if (!res.ok) throw new Error('Failed to load reviews');
  return res.json();
};

export const submitInquiry = async (payload: { name: string; email: string; phone?: string; message: string }) => {
  const res = await fetch(`${API_BASE_URL}/contact/inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Unable to send inquiry');
  return res.json();
};
