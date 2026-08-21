import { useState, useEffect, useCallback } from 'react';
import type { LatLng } from '../types/greenRoute';

interface GeolocationState {
  location: LatLng | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => void;
  clearError: () => void;
}

// Default location: New Delhi, India
const DEFAULT_LOCATION: LatLng = {
  lat: 28.6139,
  lng: 77.2090,
};

/**
 * Custom hook for getting user's geolocation
 * Falls back to New Delhi if permission denied or unavailable
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
    permissionDenied: false,
  });

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      location: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      loading: false,
      error: null,
      permissionDenied: false,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Unable to get your location';
    let permissionDenied = false;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied';
        permissionDenied = true;
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
    }

    setState({
      location: DEFAULT_LOCATION, // Fallback to default
      loading: false,
      error: errorMessage,
      permissionDenied,
    });
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        location: DEFAULT_LOCATION,
        loading: false,
        error: 'Geolocation is not supported by your browser',
        permissionDenied: false,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes cache
    });
  }, [handleSuccess, handleError]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    ...state,
    requestLocation,
    clearError,
  };
};

export default useGeolocation;
