import React, { useState, useEffect } from 'react';
import type { LocalGuide } from '../../types';
import { Star, MessageCircle, Phone, MapPin, Award } from 'lucide-react';

const LocalGuideSupport: React.FC = () => {
  const [guides, setGuides] = useState<LocalGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<LocalGuide | null>(null);
  const [requestType, setRequestType] = useState<
    'travel_queries' | 'trip_planning' | 'recommendations' | 'emergency' | 'booking_assistance'
  >('travel_queries');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await fetch('/api/guides', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      console.error('Failed to fetch guides:', error);
      // Mock data for development
      setGuides([
        {
          id: '1',
          name: 'Raj Kumar',
          email: 'raj@localguide.com',
          phone: '+91-98765-43210',
          location: 'Goa',
          specialties: ['Beach Tourism', 'Water Sports', 'Local Cuisine'],
          rating: 4.8,
          reviews: 156,
          profileImage: 'https://via.placeholder.com/150',
          bio: 'Experienced guide with 10 years in Goa tourism',
          languages: ['English', 'Hindi', 'Marathi'],
          verified: true,
        },
        {
          id: '2',
          name: 'Priya Sharma',
          email: 'priya@localguide.com',
          phone: '+91-87654-32109',
          location: 'Kerala',
          specialties: ['Backwaters', 'Adventure', 'Cultural Tours'],
          rating: 4.9,
          reviews: 243,
          profileImage: 'https://via.placeholder.com/150',
          bio: 'Expert in Kerala tourism with certified credentials',
          languages: ['English', 'Hindi', 'Malayalam', 'Tamil'],
          verified: true,
        },
        {
          id: '3',
          name: 'Amit Singh',
          email: 'amit@localguide.com',
          phone: '+91-76543-21098',
          location: 'Rajasthan',
          specialties: ['Desert Safari', 'Historical Sites', 'Photography'],
          rating: 4.7,
          reviews: 189,
          profileImage: 'https://via.placeholder.com/150',
          bio: 'Professional photographer and desert guide',
          languages: ['English', 'Hindi', 'German'],
          verified: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGuide || !message.trim()) {
      alert('Please select a guide and enter a message');
      return;
    }

    try {
      const response = await fetch('/api/guide-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          guideId: selectedGuide.id,
          requestType,
          message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setMessage('');
        setSelectedGuide(null);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Failed to submit request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  const requestTypeDescriptions = {
    travel_queries: 'General travel questions and information',
    trip_planning: 'Personalized trip planning and itineraries',
    recommendations: 'Local recommendations and hidden gems',
    emergency: 'Emergency assistance and urgent help',
    booking_assistance: 'Help with booking activities and accommodations',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading local guides...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Local Guide Support
          </h1>
          <p className="text-xl text-gray-600">
            Connect with trusted local guides for personalized travel assistance
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg mb-6">
            <p className="font-semibold">Request submitted successfully!</p>
            <p className="text-sm">The guide will respond to you shortly.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guides List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Guides</h2>
            <div className="space-y-4">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition ${
                    selectedGuide?.id === guide.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={guide.profileImage}
                      alt={guide.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 flex items-center space-x-2">
                            <span>{guide.name}</span>
                            {guide.verified && (
                              <Award size={16} className="text-blue-600" />
                            )}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <MapPin size={16} />
                            <span>{guide.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold text-gray-800">{guide.rating}</span>
                          </div>
                          <p className="text-xs text-gray-600">{guide.reviews} reviews</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-2">{guide.bio}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {guide.specialties.map((specialty: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Phone size={14} />
                          <span>{guide.phone}</span>
                        </div>
                        <div>
                          Languages: {guide.languages.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Request Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Send Request</h2>

              {selectedGuide ? (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-semibold text-gray-800">
                      Selected: {selectedGuide.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{selectedGuide.location}</p>
                  </div>

                  {/* Request Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Request Type *
                    </label>
                    <select
                      value={requestType}
                      onChange={(e) =>
                        setRequestType(
                          e.target.value as any
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="travel_queries">Travel Queries</option>
                      <option value="trip_planning">Trip Planning</option>
                      <option value="recommendations">Recommendations</option>
                      <option value="emergency">Emergency Help</option>
                      <option value="booking_assistance">Booking Assistance</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {requestTypeDescriptions[requestType]}
                    </p>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      placeholder="Describe your query or request..."
                    />
                  </div>

                  {/* Contact Options */}
                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Quick Contact:</p>
                    <div className="space-y-2">
                      <a
                        href={`tel:${selectedGuide.phone}`}
                        className="flex items-center space-x-2 text-blue-600 hover:underline text-sm"
                      >
                        <Phone size={14} />
                        <span>Call Now</span>
                      </a>
                      <a
                        href={`mailto:${selectedGuide.email}`}
                        className="flex items-center space-x-2 text-blue-600 hover:underline text-sm"
                      >
                        <MessageCircle size={14} />
                        <span>Send Email</span>
                      </a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Send Request
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <MessageCircle size={32} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600">
                    Select a guide from the list to send a request
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <MessageCircle size={32} className="mx-auto text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Quick Response</h3>
            <p className="text-sm text-gray-600">Get responses within 2 hours</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center">
            <Award size={32} className="mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Verified Guides</h3>
            <p className="text-sm text-gray-600">All guides are thoroughly verified</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center">
            <Star size={32} className="mx-auto text-yellow-500 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Highly Rated</h3>
            <p className="text-sm text-gray-600">Average rating of 4.8/5 stars</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center">
            <MapPin size={32} className="mx-auto text-red-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Local Experts</h3>
            <p className="text-sm text-gray-600">Real locals with deep knowledge</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalGuideSupport;
