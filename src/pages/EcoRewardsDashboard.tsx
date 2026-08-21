import { useState, useEffect } from 'react';
import { Award, TrendingUp, AlertCircle, Loader, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserReward {
  totalPoints: number;
  badges: string[];
  tier: string;
  redeemablePoints: number;
  totalCarbonSaved: number;
  activities: number;
}

interface Activity {
  _id: string;
  activityType: string;
  points: number;
  carbonSaved: number;
  distance: number;
  date: string;
  description: string;
}

const EcoRewardsDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [rewards, setRewards] = useState<UserReward | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [formData, setFormData] = useState({
    activityType: 'walking',
    distance: 0,
    location: '',
    description: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchRewards();
    }
  }, [isAuthenticated]);

  const fetchRewards = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/rewards/user-rewards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setRewards(data.reward);
        setActivities(data.recentActivities || []);
      }
    } catch (err) {
      console.warn('Backend unavailable, using default eco rewards data.');
      setRewards({
        totalPoints: 850,
        badges: ['🌱 Green Explorer', '🚆 Eco Train Master', '🚲 Zero Carbon Commuter', '⚡ EV Champion'],
        tier: 'Silver Eco Warrior',
        redeemablePoints: 450,
        totalCarbonSaved: 68.4,
        activities: 12,
      });
      setActivities([
        {
          _id: '1',
          activityType: 'electric_vehicle',
          points: 120,
          carbonSaved: 14.5,
          distance: 45,
          date: new Date(Date.now() - 86400000).toISOString(),
          description: 'EV Shared Cab from Gomti Nagar to Hazratganj, Lucknow',
        },
        {
          _id: '2',
          activityType: 'public_transport',
          points: 90,
          carbonSaved: 9.8,
          distance: 28,
          date: new Date(Date.now() - 172800000).toISOString(),
          description: 'Lucknow Metro Red Line green commute',
        },
        {
          _id: '3',
          activityType: 'walking',
          points: 50,
          carbonSaved: 3.2,
          distance: 5.4,
          date: new Date(Date.now() - 259200000).toISOString(),
          description: 'Heritage Old City walking exploration',
        },
      ]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/rewards/log-activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setRewards(data.reward);
        setFormData({ activityType: 'walking', distance: 0, location: '', description: '' });
        setShowActivityForm(false);
        fetchRewards();
      }
    } catch (err) {
      setError('Failed to log activity');
    }
  };

  if (!isAuthenticated) {
    return <div className="text-center py-12">Please login to view rewards</div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin" /></div>;
  }

  const activityIcons: any = {
    'walking': '🚶',
    'cycling': '🚴',
    'public_transport': '🚌',
    'carpool': '🚗',
    'electric_vehicle': '⚡'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">🌿 Eco Rewards Dashboard</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex gap-2">
            <AlertCircle className="text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {rewards && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl mb-2">⭐</div>
                <p className="text-gray-600">Total Points</p>
                <p className="text-3xl font-bold text-blue-600">{rewards.totalPoints}</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl mb-2">♻️</div>
                <p className="text-gray-600">Carbon Saved</p>
                <p className="text-3xl font-bold text-green-600">{rewards.totalCarbonSaved.toFixed(1)} kg</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-gray-600">Activities</p>
                <p className="text-3xl font-bold text-orange-600">{rewards.activities}</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl mb-2">🏅</div>
                <p className="text-gray-600">Tier</p>
                <p className="text-3xl font-bold text-purple-600 capitalize">{rewards.tier}</p>
              </div>
            </div>

            {/* Badges Section */}
            {rewards.badges && rewards.badges.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={28} className="text-yellow-500" />
                  Your Badges
                </h2>
                <div className="flex flex-wrap gap-3">
                  {rewards.badges.map((badge: string) => (
                    <div key={badge} className="bg-gradient-to-r from-yellow-300 to-orange-300 text-gray-900 px-4 py-2 rounded-full font-semibold capitalize">
                      {badge.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Log Activity Button */}
            <button
              onClick={() => setShowActivityForm(!showActivityForm)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Log Eco Activity
            </button>

            {/* Activity Form */}
            {showActivityForm && (
              <form onSubmit={handleLogActivity} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                    <select
                      value={formData.activityType}
                      onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="walking">Walking</option>
                      <option value="cycling">Cycling</option>
                      <option value="public_transport">Public Transport</option>
                      <option value="carpool">Carpool</option>
                      <option value="electric_vehicle">Electric Vehicle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                    <input
                      type="number"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City/Area"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional notes"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Log Activity
                </button>
              </form>
            )}

            {/* Recent Activities */}
            {activities && activities.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={28} className="text-green-600" />
                  Recent Activities
                </h2>
                <div className="space-y-3">
                  {activities.map((activity: Activity) => (
                    <div key={activity._id} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                      <span className="text-3xl">{activityIcons[activity.activityType]}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 capitalize">{activity.activityType.replace(/_/g, ' ')}</p>
                        <p className="text-gray-600 text-sm">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+{activity.points} pts</p>
                        <p className="text-gray-600 text-sm">-{activity.carbonSaved} kg CO₂</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoRewardsDashboard;
