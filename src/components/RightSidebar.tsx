import {
  AlertCircle,
  Bot,
  Compass,
  Globe,
  Heart,
  LogOut,
  Luggage,
  Shield,
  Sparkles,
  User,
  Users,
  X,
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

const quickActions = [
  { label: 'Trips', icon: Luggage, path: '/my-trips' },
  { label: 'Explore', icon: Compass, path: '/travelhub' },
  { label: 'Rewards', icon: Heart, path: '/rewards' },
  { label: 'Assistant', icon: Bot, path: '/assistant' },
  { label: 'Guide Portal', icon: Users, path: '/guide-dashboard' },
];

type MenuItem = {
  label: string;
  icon: any;
  path?: string;
  color: string;
  onClick?: () => void;
};

const menuItems: MenuItem[] = [
  { label: 'Home', icon: Sparkles, path: '/', color: 'text-amber-300' },
  { label: 'My Profile', icon: User, path: '/profile', color: 'text-slate-500' },
  { label: 'Guide Portal', icon: Users, path: '/guide-dashboard', color: 'text-blue-400' },
  { label: 'Festival Alerts', icon: Sparkles, path: '/festival-alerts', color: 'text-amber-400' },
  { label: 'Travel Hub', icon: Globe, path: '/travelhub', color: 'text-cyan-300' },
  { label: 'Essentials', icon: Luggage, path: '/travel-essentials', color: 'text-emerald-300' },
  { label: 'Eco Travel', icon: Heart, path: '/sustainable', color: 'text-lime-200' },
  { label: 'Local Guides', icon: Compass, path: '/guides', color: 'text-blue-200' },
  { label: 'Admin Dashboard', icon: Shield, path: '/admin', color: 'text-rose-400' },
];

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
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
    // Close the sidebar to reflect the change immediately in UI context
    onClose();
  };

  const fullMenu: MenuItem[] = [
    ...menuItems.slice(0, 3),
    { label: 'Language', icon: Globe, color: 'text-cyan-400', onClick: handleLanguageToggle },
    ...menuItems.slice(3),
  ];

  const handlePathNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleNavigate = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (item.path) {
      handlePathNavigation(item.path);
    }
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-[23rem] bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.25)] border-l border-slate-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold tracking-tight">DarShana Control</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition text-slate-700"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User block */}
        {isAuthenticated && user ? (
          <div className="px-5 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center shadow-inner">
                <User size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500">Welcome back</p>
                <h3 className="text-sm font-semibold text-slate-900">{user.name}</h3>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => handlePathNavigation('/profile')}
              className="mt-3 w-full px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 border border-slate-900/10 text-xs font-semibold rounded-lg transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="px-5 py-4 bg-white border-b border-slate-200">
            <p className="text-xs text-slate-600 mb-2">Sign in to sync trips, rewards, and alerts.</p>
            <button
              onClick={() => handlePathNavigation('/login')}
              className="w-full px-3 py-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-amber-500/20"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Quick actions */}
        <div className="px-5 py-3 grid grid-cols-2 gap-2 border-b border-slate-200 bg-slate-50">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => handlePathNavigation(action.path)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left text-xs font-semibold transition text-slate-800"
              >
                <Icon className="w-4 h-4 text-amber-500" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Menu */}
        <div className="p-5 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Navigate</p>
          <div className="space-y-1.5">
            {fullMenu.map((item) => {
              const Icon = item.icon;
              const subtitle = item.onClick ? 'Tap to toggle' : 'Tap to open';
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/60 transition group text-slate-800"
                >
                  <span className="p-2 rounded-lg bg-slate-100 group-hover:bg-amber-100 transition">
                    <Icon size={18} className={`group-hover:scale-110 transition-transform ${item.color}`} />
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                    <span className="text-[11px] text-slate-500">{subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Danger zone */}
        {isAuthenticated && user && (
          <div className="px-5 pb-5 pt-3 border-t border-slate-200 bg-white space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-800 transition group"
            >
              <LogOut size={18} className="text-red-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">Logout</span>
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 transition group disabled:opacity-60"
            >
              <AlertCircle size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">{isDeleting ? 'Deleting…' : 'Delete Account'}</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>🇮🇳 DarShana Travel Explorer v1.0</span>
          <span className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Secure
          </span>
        </div>

        {/* Mobile quick actions bar */}
        <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          <button
            onClick={() => handlePathNavigation('/')}
            className="flex-1 flex flex-col items-center gap-1 text-xs font-semibold text-slate-800"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handlePathNavigation('/assistant')}
            className="flex-1 flex flex-col items-center gap-1 text-xs font-semibold text-slate-800"
          >
            <Bot className="w-5 h-5 text-cyan-500" />
            <span>Assistant</span>
          </button>
          <button
            onClick={handleLanguageToggle}
            className="flex-1 flex flex-col items-center gap-1 text-xs font-semibold text-slate-800"
          >
            <Globe className="w-5 h-5 text-blue-500" />
            <span>{i18n.language === 'hi' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
