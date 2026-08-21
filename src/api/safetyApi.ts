import axios from 'axios';

const API_URL = '/api/safety';

export interface EmergencyLog {
  type: 'SOS' | 'PANIC' | 'MEDICAL';
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

export const logEmergency = async (data: EmergencyLog) => {
  try {
    const response = await axios.post(`${API_URL}/emergency`, data);
    return response.data;
  } catch (error) {
    console.error('Error logging emergency:', error);
    throw error;
  }
};

export const updateLiveLocation = async (userId: string, location: { lat: number; lng: number }) => {
  try {
    const response = await axios.post(`${API_URL}/live-track/${userId}`, { location });
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
};

export const getSafetyResources = async (region: string) => {
  try {
    const response = await axios.get(`${API_URL}?region=${region}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching safety resources:', error);
    throw error;
  }
};
