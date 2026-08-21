import { Calendar, CloudSun, MapPin, Mountain, Sparkles, Wind } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface HighlightItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  type: 'destination' | 'festival' | 'season' | 'experience';
  link?: string;
  color?: 'blue' | 'slate' | 'neutral' | 'accent' | 'light' | 'red' | 'green' | 'orange';
  lat?: number;
  lon?: number;
}

interface HighlightSliderProps {
  items?: HighlightItem[];
  onItemClick?: (item: HighlightItem) => void;
}

// Default travel & tourism highlight data
const DEFAULT_ITEMS: HighlightItem[] = [
  {
    id: 'lucknow-mahotsav',
    title: 'Lucknow Mahotsav',
    description: 'Culture, crafts, and performances',
    badge: 'Nov–Dec',
    icon: <Calendar size={16} />,
    type: 'festival',
    link: '/festivals?search=Lucknow Mahotsav',
    color: 'green',
    lat: 26.86,
    lon: 80.9425
  },
  {
    id: 'kathak-evening',
    title: 'Kathak & Ghazal Evening',
    description: 'Classical dance and live ghazals',
    badge: 'Culture',
    icon: <Sparkles size={16} />,
    type: 'experience',
    link: '/travelhub?search=Lucknow',
    color: 'red',
    lat: 26.8464,
    lon: 80.946
  },
  {
    id: 'goa',
    title: 'Goa',
    description: 'Beach escape',
    badge: 'Relaxation',
    icon: <Wind size={16} />,
    type: 'destination',
    link: '/travelhub?search=Goa',
    color: 'slate',
    lat: 15.4909,
    lon: 73.8278
  },
  {
    id: 'hubli-dharwad',
    title: 'Hubli–Dharwad',
    description: 'Gateway to North Karnataka',
    badge: 'New',
    icon: <MapPin size={16} />,
    type: 'destination',
    link: '/travelhub?search=Hubli',
    color: 'neutral',
    lat: 15.3647,
    lon: 75.1239
  },
  {
    id: 'jaipur',
    title: 'Jaipur',
    description: 'Royal Pink City',
    badge: 'Must Visit',
    icon: <MapPin size={16} />,
    type: 'destination',
    link: '/travelhub?search=Jaipur',
    color: 'blue',
    lat: 26.9124,
    lon: 75.7873
  },
  {
    id: 'kerala',
    title: "Kerala",
    description: "God's Own Country",
    badge: 'Paradise',
    icon: <Wind size={16} />,
    type: 'destination',
    link: '/travelhub?search=Kerala',
    color: 'slate',
    lat: 8.5241,
    lon: 76.9366
  },
  {
    id: 'taj-mahal',
    title: 'Taj Mahal',
    description: 'Symbol of Love',
    badge: 'Heritage',
    icon: <Sparkles size={16} />,
    type: 'destination',
    link: '/travelhub?search=Agra',
    color: 'neutral',
    lat: 27.1751,
    lon: 78.0421
  },
  {
    id: 'diwali',
    title: 'Diwali Festival',
    description: 'Festival of Lights',
    badge: 'Nov–Dec',
    icon: <Calendar size={16} />,
    type: 'festival',
    link: '/festivals?search=Diwali',
    color: 'blue',
  },
  {
    id: 'manali',
    title: 'Manali',
    description: 'Mountain Adventure',
    badge: 'Popular',
    icon: <Mountain size={16} />,
    type: 'destination',
    link: '/travelhub?search=Manali',
    color: 'accent',
    lat: 32.2432,
    lon: 77.1892
  },
  {
    id: 'goa',
    title: 'Goa',
    description: 'Beach Escape',
    badge: 'Relaxation',
    icon: <Wind size={16} />,
    type: 'destination',
    link: '/travelhub?search=Goa',
    color: 'slate',
    lat: 15.4909,
    lon: 73.8278
  },
  {
    id: 'holi',
    title: 'Holi Festival',
    description: 'Colors of Joy',
    badge: 'Mar–Apr',
    icon: <Calendar size={16} />,
    type: 'festival',
    link: '/festivals?search=Holi',
    color: 'neutral',
  },
  {
    id: 'shimla',
    title: 'Shimla',
    description: 'Hill Station Beauty',
    badge: 'Scenic',
    icon: <Mountain size={16} />,
    type: 'destination',
    link: '/travelhub?search=Shimla',
    color: 'blue',
    lat: 31.1048,
    lon: 77.1734
  },
  {
    id: 'varanasi',
    title: 'Varanasi',
    description: 'Spiritual Journey',
    badge: 'Sacred',
    icon: <Sparkles size={16} />,
    type: 'destination',
    link: '/travelhub?search=Varanasi',
    color: 'accent',
    lat: 25.3176,
    lon: 82.9739
  },
  {
    id: 'navratri',
    title: 'Navratri',
    description: '9 Nights of Dance',
    badge: 'Sep-Oct',
    icon: <Calendar size={16} />,
    type: 'festival',
    link: '/festivals?search=Navratri',
    color: 'green',
  },
  {
    id: 'onam',
    title: 'Onam',
    description: 'Harvest Festival',
    badge: 'Aug-Sep',
    icon: <Calendar size={16} />,
    type: 'festival',
    link: '/festivals?search=Onam',
    color: 'light',
  },
];

const HighlightSlider: React.FC<HighlightSliderProps> = ({
  items = DEFAULT_ITEMS,
  onItemClick,
}) => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [weatherData, setWeatherData] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchWeather = async () => {
      const newWeatherData: Record<string, number> = {};
      
      // Filter items that have coordinates
      const itemsWithCoords = items.filter(item => item.lat && item.lon);
      
      // Fetch weather for each item (using Open-Meteo free API)
      // In a real app, you might want to batch this or use a backend proxy
      for (const item of itemsWithCoords) {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${item.lat}&longitude=${item.lon}&current_weather=true`
          );
          const data = await response.json();
          if (data.current_weather) {
            newWeatherData[item.id] = Math.round(data.current_weather.temperature);
          }
        } catch (error) {
          console.error(`Failed to fetch weather for ${item.title}`, error);
        }
      }
      setWeatherData(newWeatherData);
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // Run once on mount

  const handleItemClick = (item: HighlightItem) => {
    onItemClick?.(item);
    if (item.link) {
      navigate(item.link);
    }
  };

  // Color palette
  const colorGradients: Record<string, string> = {
    blue: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    slate: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
    neutral: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
    accent: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    light: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
    red: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
    green: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
    orange: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
  };

  const colorShadows: Record<string, string> = {
    blue: 'rgba(30, 64, 175, 0.3)',
    slate: 'rgba(51, 65, 85, 0.3)',
    neutral: 'rgba(30, 41, 59, 0.3)',
    accent: 'rgba(15, 23, 42, 0.3)',
    light: 'rgba(241, 245, 249, 0.3)',
    red: 'rgba(185, 28, 28, 0.3)',
    green: 'rgba(21, 128, 61, 0.3)',
    orange: 'rgba(234, 88, 12, 0.3)',
  };

  // Duplicate items for infinite scroll
  const loopedItems = [...items, ...items];
  const animationDuration = items.length * 2; // seconds

  return (
    <div
      className="highlight-slider w-full relative overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid rgba(51, 65, 85, 0.15)',
      }}
    >
      {/* Soft gradient background */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 50%, rgba(30, 64, 175, 0.08), transparent 50%), radial-gradient(circle at 80% 50%, rgba(51, 65, 85, 0.08), transparent 50%)',
        }}
      />

      {/* Top animated line */}
      <div
        className="absolute top-0 left-0 w-full h-1 opacity-30"
        style={{
          background:
            'linear-gradient(90deg, transparent, #EA580C, #A855F7, #3B82F6, transparent)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 py-1 sm:py-2 px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-1 flex items-center gap-2 px-2">
          <div className="w-1 h-3 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-orange-400">
            ✈️ Explore Destinations
          </span>
        </div>

        {/* Slider */}
        <div
          className="w-full overflow-hidden rounded-xl px-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex gap-3 sm:gap-4 lg:gap-6 items-center py-1"
            style={{
              animation: isPaused
                ? 'none'
                : `smooth-flow ${animationDuration}s linear infinite`,
              willChange: 'transform',
            }}
            role="list"
            aria-label="Popular Indian travel highlights"
          >
            {loopedItems.map((item, idx) => {
              const gradient = colorGradients[item.color || 'blue'];
              const shadowColor = colorShadows[item.color || 'blue'];

              const ariaLabel = item.description
                ? `${item.title} – ${item.description}`
                : item.title;

              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => handleItemClick(item)}
                  className="group relative flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl whitespace-nowrap flex-shrink-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent hover:scale-105 active:scale-95"
                  style={{
                    background: gradient,
                    boxShadow: `
                      0 8px 20px ${shadowColor},
                      inset 0 1px 2px rgba(255, 255, 255, 0.25),
                      0 0 15px ${shadowColor}
                    `,
                    backdropFilter: 'blur(4px)',
                  }}
                  title={item.description}
                  aria-label={ariaLabel}
                  role="listitem"
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 70%)',
                      boxShadow: `inset 0 0 24px rgba(255, 255, 255, 0.15), 0 0 24px ${shadowColor}`,
                    }}
                  />

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute -top-1.5 -right-1 px-1.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold text-white/90 border border-white/20 flex items-center gap-1">
                      {item.badge}
                      {weatherData[item.id] !== undefined && (
                        <span className="flex items-center gap-0.5 border-l border-white/30 pl-1 ml-1">
                          <CloudSun size={8} />
                          {weatherData[item.id]}°
                        </span>
                      )}
                    </div>
                  )}

                  {/* Icon */}
                  <div className="text-white group-hover:scale-125 transition-transform duration-300 flex-shrink-0 flex items-center justify-center">
                    {item.icon}
                  </div>

                  {/* Desktop text */}
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-200 transition-colors duration-300">
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="text-[10px] text-white/70 group-hover:text-white/90 transition-colors duration-300">
                        {item.description}
                      </span>
                    )}
                  </div>

                  {/* Mobile text */}
                  <span className="text-[10px] sm:hidden font-bold text-white group-hover:text-orange-200 transition-colors duration-300">
                    {item.title}
                  </span>

                  {/* Sparkles on hover */}
                  <Sparkles
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 text-white/80 ml-auto hidden sm:block"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile hint */}
        <div className="text-center text-slate-500 text-xs mt-2 sm:hidden">
          Auto-scrolling highlights · Tap a card for details
        </div>
      </div>

      <style>{`
        @keyframes smooth-flow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Scope performance tweaks to this component only */
        .highlight-slider * {
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
};

export default HighlightSlider;
