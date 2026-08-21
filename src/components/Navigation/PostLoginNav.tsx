import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Plane,
  Users,
  Mail,
  Zap,
  Globe,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface PostLoginNavProps {
  userLanguage?: 'en' | 'hi';
  onLanguageChange?: (lang: 'en' | 'hi') => void;
}

const PostLoginNav: React.FC<PostLoginNavProps> = ({
  userLanguage = 'en',
  onLanguageChange = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },
    { id: 'trips', label: 'My Trips', icon: Plane, path: '/my-trips' },
    { id: 'guide', label: 'Local Guide', icon: Users, path: '/local-guide' },
    { id: 'contact', label: 'Contact Us', icon: Mail, path: '/contact' },
    { id: 'festivals', label: 'Festival Alerts', icon: Zap, path: '/festivals' },
  ];

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userProfile');
      navigate('/login');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold">
                DT
              </div>
              <span
                onClick={() => navigate('/dashboard')}
                className="font-bold text-xl text-gray-800 cursor-pointer hover:text-blue-600 transition"
              >
                DarShana Travel
              </span>
            </div>

            {/* Nav Items */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Language & Logout */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                  <Globe size={18} />
                  <span className="text-sm font-medium">
                    {userLanguage.toUpperCase()}
                  </span>
                </button>
                <div className="absolute hidden group-hover:block right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    onClick={() => onLanguageChange('en')}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      userLanguage === 'en'
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => onLanguageChange('hi')}
                    className={`w-full text-left px-4 py-2 text-sm border-t ${
                      userLanguage === 'hi'
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-lg sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                DT
              </div>
              <span className="font-bold text-sm text-gray-800">DarShana</span>
            </div>

            {/* Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Items */}
          {mobileMenuOpen && (
            <div className="space-y-2 border-t pt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Language Selector Mobile */}
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-semibold text-gray-600 px-4 mb-2">
                  Language
                </p>
                <div className="flex space-x-2 px-4">
                  <button
                    onClick={() => onLanguageChange('en')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                      userLanguage === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => onLanguageChange('hi')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                      userLanguage === 'hi'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Logout Mobile */}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium mt-2"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default PostLoginNav;
