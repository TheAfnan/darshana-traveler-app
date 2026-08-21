import { AlertCircle, CheckCircle, DollarSign, Loader, Mail, MapPin, MessageSquare, Phone, Save } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getBackendUrl } from '../config/api';

interface GuideProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  languages: string[];
  specialization: string[];
  bio: string;
  profileImage: string;
  rating: number;
  totalReviews: number;
  pricePerDay: number;
  availability: {
    startTime: string;
    endTime: string;
    daysAvailable: string[];
  };
  verified: boolean;
}

interface GuideInteraction {
  _id: string;
  userId: string;
  interactionType: string;
  status: string;
  tripDate: string;
  message: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

const LocalGuideDashboard = () => {
  const [guideProfile, setGuideProfile] = useState<GuideProfile | null>(null);
  const [interactions, setInteractions] = useState<GuideInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    specialization: [] as string[],
    languages: [] as string[],
    pricePerDay: 0,
    availability: {
      startTime: '09:00',
      endTime: '18:00',
      daysAvailable: [] as string[]
    }
  });

  const resolveBackendUrl = useCallback(() => {
    const candidate = import.meta.env.VITE_BACKEND_URL?.trim() || getBackendUrl() || 'http://localhost:3001';
    return candidate.replace(/\/+$/, '');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchGuideProfile(token);
    } else {
      setShowRegistration(true);
      setLoading(false);
    }
  }, []);

  const fetchGuideProfile = async (token?: string) => {
    try {
      const baseUrl = resolveBackendUrl();
      const response = await fetch(`${baseUrl}/api/guides/my-profile`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success && data.guide) {
        setGuideProfile(data.guide);
        setFormData({
          name: data.guide.name,
          phone: data.guide.phone,
          bio: data.guide.bio,
          specialization: data.guide.specialization,
          languages: data.guide.languages,
          pricePerDay: data.guide.pricePerDay,
          availability: data.guide.availability
        });
        fetchInteractions(token);
      } else {
        setShowRegistration(true);
      }
    } catch (err) {
      setShowRegistration(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchInteractions = async (token?: string) => {
    try {
      const baseUrl = resolveBackendUrl();
      const response = await fetch(`${baseUrl}/api/guides/my-interactions`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        setInteractions(data.interactions || []);
      }
    } catch (err) {
      console.error('Failed to fetch interactions');
    }
  };

  const handleRegisterAsGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = resolveBackendUrl();
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/guides/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });














































































      
      const data = await response.json();
      if (data.success) {
        setGuideProfile(data.guide);
        setShowRegistration(false);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Failed to register as guide');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = resolveBackendUrl();
      const response = await fetch(`${baseUrl}/api/guides/my-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setGuideProfile(data.guide);
        setIsEditing(false);
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const toggleSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        daysAvailable: prev.availability.daysAvailable.includes(day)
          ? prev.availability.daysAvailable.filter(d => d !== day)
          : [...prev.availability.daysAvailable, day]
      }
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin" /></div>;
  }

  const specializationOptions = ['historical', 'adventure', 'cultural', 'nature', 'religious', 'food', 'other'];
  const languageOptions = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (showRegistration || !guideProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">🧭 Become a Local Guide</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex gap-2">
              <AlertCircle className="text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegisterAsGuide} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Specializations</label>
              <div className="grid grid-cols-2 gap-2">
                {specializationOptions.map(spec => (
                  <label key={spec} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.specialization.includes(spec)}
                      onChange={() => toggleSpecialization(spec)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="capitalize">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Languages</label>
              <div className="grid grid-cols-2 gap-2">
                {languageOptions.map(lang => (
                  <label key={lang} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Day ($)</label>
              <input
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Available Days</label>
              <div className="grid grid-cols-2 gap-2">
                {daysOfWeek.map(day => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.availability.daysAvailable.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Register as Guide
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">🧭 Guide Dashboard</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex gap-2">
            <AlertCircle className="text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Day ($)</label>
                <input
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Rating</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{guideProfile.rating.toFixed(1)}</p>
                  </div>
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Reviews</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{guideProfile.totalReviews}</p>
                  </div>
                  <MessageSquare size={24} className="text-blue-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Price/Day</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">${guideProfile.pricePerDay}</p>
                  </div>
                  <DollarSign size={24} className="text-green-400" />
                </div>
              </div>
              <div className={`bg-gradient-to-br ${guideProfile.verified ? 'from-green-50 to-teal-50' : 'from-gray-50 to-slate-50'} rounded-lg shadow-lg p-6 border-l-4 ${guideProfile.verified ? 'border-green-500' : 'border-gray-500'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Status</p>
                    <p className={`text-2xl font-bold mt-2 ${guideProfile.verified ? 'text-green-600' : 'text-gray-600'}`}>
                      {guideProfile.verified ? '✓ Verified' : 'Pending'}
                    </p>
                  </div>
                  <CheckCircle size={24} className={guideProfile.verified ? 'text-green-400' : 'text-gray-400'} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-gray-600 text-sm">Location</p>
                    <p className="text-lg font-semibold">{guideProfile.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="text-lg font-semibold">{guideProfile.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-lg font-semibold">{guideProfile.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-gray-600 text-sm mb-2">Bio</p>
                <p className="text-lg">{guideProfile.bio}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {guideProfile.specialization.map(spec => (
                      <span key={spec} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {guideProfile.languages.map(lang => (
                      <span key={lang} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiries Section */}
            {interactions && interactions.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Inquiries & Bookings ({interactions.length})</h2>
                <div className="space-y-4">
                  {interactions.map(interaction => (
                    <div key={interaction._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">{interaction.interactionType}</p>
                          <p className="text-gray-600 text-sm">{interaction.message}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          interaction.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          interaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {interaction.status}
                        </span>
                      </div>
                      {interaction.reviewText && (
                        <p className="text-gray-700 italic mt-2">Review: {interaction.reviewText}</p>
                      )}
                      {interaction.rating && (
                        <p className="text-yellow-500 mt-1">Rating: {interaction.rating} ⭐</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LocalGuideDashboard;
