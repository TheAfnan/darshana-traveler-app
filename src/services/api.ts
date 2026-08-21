import { getBackendUrl } from '../config/api';

const resolveBackendOrigin = (): string => {
  const envUrl = import.meta.env.VITE_BACKEND_URL?.trim();
  const candidate = envUrl || getBackendUrl() || 'http://localhost:3001';
  return candidate.replace(/\/+$/, '');
};

const API_BASE_URL = `${resolveBackendOrigin()}/api`;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private getHeaders() {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${this.baseURL}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Auth APIs
export const authApi = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    apiClient.put(`/auth/reset-password/${token}`, { password }),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),
  deleteAccount: () => apiClient.delete('/user/account'),
};

// User APIs
export const userApi = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data: any) => apiClient.put('/user/profile', data),
  updateProfileImage: (profileImage: string) =>
    apiClient.put('/user/profile-image', { profileImage }),
  deleteAccount: () => apiClient.delete('/user/account'),
};

// Trip APIs
export const tripApi = {
  getMyTrips: () => apiClient.get('/trips/my-trips'),
  bookTrip: (data: any) => apiClient.post('/trips/book', data),
  getTripDetails: (tripId: string) => apiClient.get(`/trips/${tripId}`),
  cancelTrip: (tripId: string) => apiClient.put(`/trips/${tripId}/cancel`),
};

// Festival APIs
export const festivalApi = {
  getAlerts: (region?: string) =>
    apiClient.get('/festivals/alerts', region ? { region } : undefined),
  subscribeToFestival: (festivalId: string, region?: string) =>
    apiClient.post('/festivals/subscribe', { festivalId, region }),
  unsubscribeFromFestival: (festivalId: string) =>
    apiClient.post('/festivals/unsubscribe', { festivalId }),
  updateNotificationPreferences: (preferences: any) =>
    apiClient.put('/festivals/preferences', preferences),
};

// Language APIs
export const languageApi = {
  getAvailableLanguages: () => apiClient.get('/language/list'),
  getUserLanguage: () => apiClient.get('/language/user-language'),
  updateUserLanguage: (language: string) =>
    apiClient.put('/language/user-language', { language }),
};

// Flight APIs
export const flightApi = {
  search: (from: string, to: string, date: string, passengers: number = 1) =>
    apiClient.get('/flights/search', { from, to, date, passengers }),
  getDetails: (id: string) => apiClient.get(`/flights/${id}`),
  getPopularRoutes: () => apiClient.get('/flights/popular-routes'),
};

// Train APIs
export const trainApi = {
  search: (from: string, to: string, date: string, passengers: number = 1) =>
    apiClient.get('/trains/search', { from, to, date, passengers }),
  getDetails: (id: string) => apiClient.get(`/trains/${id}`),
  getSchedule: (from: string, to: string) =>
    apiClient.get('/trains/schedule', { from, to }),
};

// Transport APIs
export const transportApi = {
  searchCabs: (from: string, to: string, date: string) =>
    apiClient.get('/transport/cabs/search', { from, to, date }),
  searchCruises: (from: string, to: string, date: string) =>
    apiClient.get('/transport/cruises/search', { from, to, date }),
  searchJets: (from: string, to: string, date: string) =>
    apiClient.get('/transport/jets/search', { from, to, date }),
  searchBikes: (from: string, to: string, startDate: string, endDate: string) =>
    apiClient.get('/transport/bikes/search', { from, to, startDate, endDate }),
};

// Booking APIs
export const bookingApi = {
  create: (data: any) => apiClient.post('/bookings', data),
  getMyBookings: () => apiClient.get('/bookings/my-bookings'),
  getBooking: (id: string) => apiClient.get(`/bookings/${id}`),
  cancel: (id: string, reason: string) =>
    apiClient.post(`/bookings/${id}/cancel`, { reason }),
  getStats: () => apiClient.get('/bookings/stats'),
  processPayment: (bookingId: string, paymentData: any) =>
    apiClient.post(`/bookings/${bookingId}/payment`, paymentData),
  shareTrip: (bookingId: string) => apiClient.post(`/bookings/${bookingId}/share`),
  getSharedTrip: (slug: string) => apiClient.get(`/bookings/shared/${slug}`),
  uploadDocuments: (bookingId: string, formData: FormData) => {
    // We need to bypass the default JSON content-type for FormData
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    return fetch(`${getBackendUrl()}/api/bookings/${bookingId}/documents`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(res => res.json());
  }
};

// Smart Planner APIs
export const plannerApi = {
  getSuggestions: (preferences: any) => apiClient.post('/planner/suggestions', preferences),
  analyzeMood: (emotions: any) => apiClient.post('/planner/mood-analyze', { emotions }),
};

// Review APIs
export const reviewApi = {
  create: (data: any) => apiClient.post('/reviews', data),
  getReviews: (targetId: string) => apiClient.get(`/reviews/${targetId}`),
};

// Safety APIs
export const safetyApi = {
  getResources: (region: string) => apiClient.get('/safety', { region }),
};

// Yatra Shayak APIs
export const yatraShayakApi = {
  chat: (message: string) => apiClient.post('/yatra-shayak/chat', { message }),
};

// Itinerary APIs
export const itineraryApi = {
  getItineraries: () => apiClient.get('/itineraries'),
  createItinerary: (data: any) => apiClient.post('/itineraries', data),
};

// AI APIs
export const aiApi = {
  generatePlan: (data: any) => apiClient.post('/ai/plan', data),
};

