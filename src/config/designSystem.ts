/**
 * DarShana Design System Configuration
 * Ensures consistent styling across the entire application
 */

// Color Palette
export const colors = {
  // Primary
  primary: {
    orange: '#EA580C', // Main CTA, highlights
    teal: '#0D7377',   // Secondary buttons, accents
    darkTeal: '#053E36',
  },

  // Gradients
  gradients: {
    heroGradient: 'from-blue-900 via-purple-800 to-blue-900',
    accentGradient: 'from-orange-600 to-orange-500',
    tealGradient: 'from-teal-700 to-teal-600',
  },

  // Neutral
  neutral: {
    stone900: '#0F172A',
    stone800: '#1E293B',
    stone700: '#334155',
    stone600: '#475569',
    stone500: '#64748B',
    stone400: '#94A3B8',
    stone300: '#CBD5E1',
    stone200: '#E2E8F0',
    stone100: '#F1F5F9',
    white: '#FFFFFF',
  },

  // Status
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
};

// Typography
export const typography = {
  heading: 'font-serif font-bold',
  subheading: 'font-semibold',
  body: 'font-normal',
  small: 'text-sm',
  label: 'text-xs uppercase tracking-wider',
};

// Spacing
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '2.5rem',
  '3xl': '3rem',
};

// Border Radius
export const radius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
};

// Shadow
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

// Button Styles
export const buttonStyles = {
  primary:
    'bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full font-semibold transition shadow-md hover:shadow-lg',
  secondary:
    'bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-full font-semibold transition shadow-md hover:shadow-lg',
  outline:
    'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-full font-semibold transition',
  ghost:
    'text-gray-700 hover:text-orange-600 hover:bg-gray-50 px-4 py-2 rounded-md transition',
};

// Card Styles
export const cardStyles = {
  default:
    'bg-white rounded-xl shadow-md border border-stone-200 hover:shadow-lg transition-shadow',
  elevated:
    'bg-white rounded-xl shadow-lg border border-stone-100 hover:shadow-xl transition-shadow',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all',
};

// Common Component Classes
export const components = {
  navLink: 'px-3 py-2 rounded-md text-sm font-medium transition-all',
  navLinkActive: 'text-orange-700 bg-orange-100',
  navLinkInactive: 'text-gray-700 hover:text-orange-600 hover:bg-gray-50',

  sectionTitle:
    'text-4xl font-serif font-bold text-stone-800 mb-4',
  sectionSubtitle: 'text-stone-600 text-lg',

  badge: 'inline-block px-3 py-1 rounded-full text-xs font-semibold',
  badgePrimary: 'bg-orange-100 text-orange-700',
  badgeSecondary: 'bg-teal-100 text-teal-700',

  input:
    'w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition',

  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
};
