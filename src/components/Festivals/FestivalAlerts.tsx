import React, { useState, useEffect } from 'react';
import type { Notification, Festival } from '../../types';
import { Bell, MapPin, Calendar, Zap } from 'lucide-react';

const FestivalAlerts: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchFestivals();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId: 'user1',
          type: 'festival_alert',
          title: 'Diwali in Delhi',
          message: 'Diwali celebrations are coming up on November 1st',
          relatedId: 'festival1',
          read: false,
          createdAt: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          type: 'festival_alert',
          title: 'Holi in Mathura',
          message: 'Experience colorful Holi celebrations in the spiritual town of Mathura',
          relatedId: 'festival2',
          read: false,
          createdAt: new Date(),
        },
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    } finally {
      setLoading(false);
    }
  };

  const fetchFestivals = async () => {
    try {
      const response = await fetch('/api/festivals', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setFestivals(data);
    } catch (error) {
      console.error('Failed to fetch festivals:', error);
      // Mock data
      const mockFestivals: Festival[] = [
        {
          id: '1',
          name: 'Diwali',
          location: 'Across India',
          startDate: new Date('2024-11-01'),
          endDate: new Date('2024-11-02'),
          description: 'Festival of Lights - the most celebrated festival in India',
          image: 'https://via.placeholder.com/300x200',
          significance: 'Celebrates the victory of light over darkness',
        },
        {
          id: '2',
          name: 'Holi',
          location: 'Mathura, Uttar Pradesh',
          startDate: new Date('2025-03-14'),
          endDate: new Date('2025-03-15'),
          description: 'Festival of Colors - spread happiness and colors',
          image: 'https://via.placeholder.com/300x200',
          significance: 'Spring festival celebrating new beginnings',
        },
        {
          id: '3',
          name: 'Onam',
          location: 'Kerala',
          startDate: new Date('2025-08-29'),
          endDate: new Date('2025-09-12'),
          description: 'Harvest festival with beautiful boat races and flower carpets',
          image: 'https://via.placeholder.com/300x200',
          significance: 'Celebrates the homecoming of King Mahabali',
        },
        {
          id: '4',
          name: 'Pushkar Camel Fair',
          location: 'Pushkar, Rajasthan',
          startDate: new Date('2025-10-28'),
          endDate: new Date('2025-11-11'),
          description: 'Largest camel fair with cultural performances and trading',
          image: 'https://via.placeholder.com/300x200',
          significance: 'One of the most colorful festivals of India',
        },
        {
          id: '5',
          name: 'Hornbill Festival',
          location: 'Nagaland',
          startDate: new Date('2024-12-01'),
          endDate: new Date('2024-12-10'),
          description: 'Celebrates the tribal culture of Nagaland',
          image: 'https://via.placeholder.com/300x200',
          significance: 'Northeast India\'s most vibrant cultural festival',
        },
        {
          id: '6',
          name: 'Biju Patnaik Jatra',
          location: 'Odisha',
          startDate: new Date('2025-01-15'),
          endDate: new Date('2025-01-25'),
          description: 'Religious fair with temple visits and celebrations',
          image: 'https://via.placeholder.com/300x200',
          significance: 'Ancient festival with spiritual significance',
        },
      ];
      setFestivals(mockFestivals);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleSetReminder = async (festivalId: string, location: string) => {
    try {
      const response = await fetch('/api/festival-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          festivalId,
          location,
        }),
      });

      if (response.ok) {
        alert('Reminder set! You will be notified about this festival.');
      }
    } catch (error) {
      console.error('Failed to set reminder:', error);
    }
  };

  const upcomingFestivals = festivals.filter(
    (f) => new Date(f.startDate) > new Date()
  );

  const pastFestivals = festivals.filter(
    (f) => new Date(f.startDate) <= new Date()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading festival alerts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 flex items-center">
              <Zap className="mr-3 text-orange-600" size={40} />
              Festival Alerts & Travel Notifications
            </h1>
            <p className="text-xl text-gray-600">
              Never miss out on festivals and special events happening near you
            </p>
          </div>
          <div className="relative">
            <Bell size={32} className="text-orange-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Notifications Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recent Alerts ({unreadCount})
              </h2>

              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 cursor-pointer transition ${
                        notification.read
                          ? 'border-gray-300 bg-gray-50'
                          : 'border-blue-600 bg-blue-50'
                      }`}
                      onClick={() =>
                        !notification.read &&
                        markAsRead(notification.id)
                      }
                    >
                      <p className="font-semibold text-gray-800 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No alerts yet</p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Upcoming Festivals */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calendar className="mr-3 text-orange-600" size={28} />
                Upcoming Festivals
              </h2>

              {upcomingFestivals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingFestivals.map((festival) => (
                    <div
                      key={festival.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                    >
                      <img
                        src={festival.image}
                        alt={festival.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {festival.name}
                          </h3>
                          <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">
                            Upcoming
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin size={16} className="mr-2" />
                          <span>{festival.location}</span>
                        </div>

                        <div className="flex items-center text-gray-600 mb-3">
                          <Calendar size={16} className="mr-2" />
                          <span>
                            {new Date(festival.startDate).toLocaleDateString()} -{' '}
                            {new Date(festival.endDate).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3">{festival.description}</p>

                        <p className="text-sm text-gray-600 mb-4">
                          <span className="font-semibold">Significance:</span>{' '}
                          {festival.significance}
                        </p>

                        <button
                          onClick={() =>
                            handleSetReminder(festival.id, festival.location)
                          }
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition"
                        >
                          Set Reminder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">No upcoming festivals scheduled</p>
                </div>
              )}
            </div>

            {/* Past Festivals */}
            {pastFestivals.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Recent & Past Festivals
                </h2>

                <div className="space-y-3">
                  {pastFestivals.slice(0, 5).map((festival) => (
                    <div
                      key={festival.id}
                      className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {festival.name}
                        </h3>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin size={14} className="mr-1" />
                          {festival.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {new Date(festival.startDate).toLocaleDateString()}
                        </p>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          Past
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Festival Tips */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Bell size={32} className="text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Smart Alerts</h3>
            <p className="text-gray-600 text-sm">
              Get customized alerts based on your location and interests
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Calendar size={32} className="text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Plan Ahead</h3>
            <p className="text-gray-600 text-sm">
              Set reminders and plan your trips around major festivals
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <MapPin size={32} className="text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Explore</h3>
            <p className="text-gray-600 text-sm">
              Discover unique festivals across different regions of India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalAlerts;
