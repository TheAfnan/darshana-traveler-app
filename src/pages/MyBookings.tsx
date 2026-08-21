import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader, AlertCircle, X, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../services/api';

const MyBookings = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      setIsLoading(true);
      const response = await bookingApi.getMyBookings();
      if (response.success && response.data) {
        const bookingsData = (response.data as any).data || [];
        setBookings(bookingsData);
      } else {
        setError((response as any).error || 'Failed to fetch bookings');
      }
      setIsLoading(false);
    };

    fetchBookings();
  }, [isAuthenticated, navigate]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const response = await bookingApi.cancel(bookingId, 'User requested cancellation');
    if (response.success) {
      setBookings(bookings.map(b => b.bookingId === bookingId ? response.data : b));
    } else {
      setError(response.error || 'Failed to cancel booking');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.name}! Here are all your travel bookings.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={32} className="animate-spin text-teal-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">No bookings yet</p>
            <p className="text-sm text-gray-500 mt-2">Start booking your next adventure!</p>
            <button
              onClick={() => navigate('/travel-hub')}
              className="mt-6 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Browse Travel Options
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Booking ID</p>
                      <p className="text-lg font-bold text-gray-900">{booking.bookingId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                          booking.bookingStatus === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.bookingStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.bookingStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Type</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">{booking.bookingType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Passengers</p>
                      <p className="text-lg font-semibold text-gray-900">{booking.passengers.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(booking.departureDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total Price</p>
                      <p className="text-2xl font-bold text-teal-600">₹{booking.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Passengers:</p>
                    <div className="space-y-2">
                      {booking.passengers.map((passenger: any, idx: number) => (
                        <div key={idx} className="text-sm text-gray-600">
                          {passenger.name} ({passenger.email}) - {passenger.phone}
                        </div>
                      ))}
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="border-t mt-4 pt-4">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Special Requests:</p>
                      <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-semibold transition-colors">
                      View Details
                    </button>
                    {booking.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => window.print()}
                        className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={18} /> Ticket
                      </button>
                    )}
                    {booking.bookingStatus !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={18} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
