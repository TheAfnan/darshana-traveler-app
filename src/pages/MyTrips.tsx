import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plane, AlertCircle, Loader, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripApi } from '../services/api';

interface Trip {
  _id: string;
  bookingId: string;
  mode: string;
  from: string;
  to: string;
  date: string;
  price: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  passengers: any[];
  paymentMethod: string;
}

const MyTrips: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [pastTrips, setPastTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchTrips = async () => {
      setIsLoading(true);
      const response = await tripApi.getMyTrips();
      if (response.success && response.data) {
        const data = response.data as any;
        setUpcomingTrips(data.upcomingTrips || []);
        setPastTrips(data.pastTrips || []);
      } else {
        setError((response as any).error || 'Failed to fetch trips');
      }
      setIsLoading(false);
    };

    fetchTrips();
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  const trips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
          <p className="text-gray-600">Manage your travel bookings and trip details</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upcoming ({upcomingTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'past'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Past ({pastTrips.length})
          </button>
        </div>

        {/* Trips List */}
        {trips.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Plane size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">No {activeTab} trips</p>
            <p className="text-sm text-gray-500 mt-2">Start booking your next adventure!</p>
            <button
              onClick={() => navigate('/travel-hub')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Plus size={18} /> Book a Trip
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plane size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {trip.from} → {trip.to}
                        </h3>
                        <p className="text-sm text-gray-600">Booking ID: {trip.bookingId}</p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      trip.status === 'upcoming'
                        ? 'bg-green-100 text-green-800'
                        : trip.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {trip.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      Date
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <p className="text-sm font-medium">
                        {new Date(trip.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      Passengers
                    </p>
                    <p className="text-sm font-medium">{trip.passengers.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      Mode
                    </p>
                    <p className="text-sm font-medium capitalize">{trip.mode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      Total Price
                    </p>
                    <p className="text-xl font-bold text-blue-600">₹{trip.totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
