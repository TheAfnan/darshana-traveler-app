import {
  AlertCircle,
  Award,
  Calendar,
  ChevronRight,
  Compass,
  Globe,
  Home,
  Leaf,
  LogOut,
  Luggage,
  MapPin,
  Plane,
  Shield,
  Sparkles,
  User,
  Users,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { languageApi } from '../services/api';

type RightSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type QuickAction = {
  label: string;
  icon: React.ElementType;
  path: string;
};

const quickActions: QuickAction[] = [
  { label: 'My Trips', icon: Luggage, path: '/my-trips' },
  { label: 'Explore Hub', icon: Compass, path: '/travelhub' },
  { label: 'Rewards', icon: Award, path: '/rewards' },
  { label: 'AI Assistant', icon: Sparkles, path: '/assistant' },
  { label: 'Guide Portal', icon: Users, path: '/guide-dashboard' },
];

type MenuItem = {
  label: string;
  icon: React.ElementType;
  path?: string;
  badge?: string;
  onClick?: () => void;
};

const primaryMenuItems: MenuItem[] = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'My Profile', icon: User, path: '/profile' },
  { label: 'Local Guides Directory', icon: MapPin, path: '/guides' },
  { label: 'Guide Onboarding Portal', icon: Users, path: '/become-guide' },
  { label: 'Festival Alerts', icon: Calendar, path: '/festival-alerts' },
  { label: 'Travel Hub', icon: Plane, path: '/travelhub' },
  { label: 'Travel Essentials', icon: Luggage, path: '/travel-essentials' },
  { label: 'Eco-Friendly Travel', icon: Leaf, path: '/sustainable' },
  { label: 'Admin Console', icon: Shield, path: '/admin', badge: 'Staff' },
];

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, deleteAccount, updateUser } = useAuth();
  const { i18n } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLanguageToggle = async () => {
    const nextLanguage = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem('language', nextLanguage);
    if (isAuthenticated) {
      try {
        await languageApi.updateUserLanguage(nextLanguage);
        updateUser({ preferredLanguage: nextLanguage });
      } catch (err) {
        console.error('Failed to persist language preference', err);
      }
    }
    onClose();
  };

  const handlePathNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Dark Backdrop Overlay covering everything below drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[1000] transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Left-Side Primary Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 h-screen w-[21rem] sm:w-[23rem] bg-white text-slate-900 z-[1001] transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-2xl border-r border-stone-200 flex flex-col justify-between font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ scrollbarWidth: 'thin' }}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
                DT
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-none">DarShana Control</h2>
                <span className="text-[10px] text-slate-500 font-medium">Explorer Navigation</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-stone-100 transition cursor-pointer"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          {/* User Account / Sign In Block */}
          {isAuthenticated && user ? (
            <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">Signed In Traveler</p>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{user.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => handlePathNavigation('/profile')}
                className="w-full py-2 bg-white hover:bg-stone-100 border border-stone-200 text-slate-800 text-xs font-semibold rounded-xl transition shadow-2xs cursor-pointer"
              >
                View Account Profile
              </button>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-2">
              <p className="text-xs text-slate-600 font-medium">Sign in to sync your bookings, local guides & itineraries.</p>
              <button
                onClick={() => handlePathNavigation('/login')}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                Sign In / Create Account
              </button>
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="p-4 border-b border-stone-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Quick Actions
            </span>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => handlePathNavigation(action.path)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 hover:bg-amber-50 hover:border-amber-200 border border-stone-200 text-left text-xs font-semibold text-slate-800 transition group cursor-pointer shadow-2xs"
                  >
                    <Icon size={16} strokeWidth={1.8} className="text-amber-600 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Navigation List */}
          <div className="p-4 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Navigate
            </span>
            
            <div className="space-y-1">
              {primaryMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.path && handlePathNavigation(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 transition group text-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="p-1.5 rounded-lg bg-stone-100 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-800 transition shrink-0">
                        <Icon size={17} strokeWidth={1.8} />
                      </span>
                      <span className="text-xs font-semibold text-slate-900 truncate">{item.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold rounded-md">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={15} className="text-stone-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}

              {/* Language Switch Row */}
              <button
                onClick={handleLanguageToggle}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 transition group text-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-lg bg-stone-100 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-800 transition shrink-0">
                    <Globe size={17} strokeWidth={1.8} />
                  </span>
                  <span className="text-xs font-semibold text-slate-900">App Language</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold rounded-md">
                    {i18n.language === 'hi' ? 'हिन्दी' : 'English'}
                  </span>
                  <ChevronRight size={15} className="text-stone-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* Footer / Account Management */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-2">
          {isAuthenticated && user && (
            <div className="space-y-1.5 pb-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
              >
                <LogOut size={16} strokeWidth={1.8} />
                <span>Log Out</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium px-1">
            <span>🇮🇳 DarShana Explorer v2.0</span>
            <span className="flex items-center gap-1">
              <Shield size={12} className="text-emerald-600" />
              Verified & Safe
            </span>
          </div>
        </div>

      </div>
    </>
  );
};

export default RightSidebar;
