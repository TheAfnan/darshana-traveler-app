import React, { useEffect, useState } from "react";

// Lightweight emoji/SVG fallbacks for icons to avoid lucide-react export issues during debugging
const Icon: React.FC<{ children?: React.ReactNode; className?: string; size?: number }> = ({ children, className }) => (
  <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{children}</span>
);
const Facebook: React.FC<any> = (p) => <Icon {...p}>🔵</Icon>;
const Twitter: React.FC<any> = (p) => <Icon {...p}>🐦</Icon>;
const Instagram: React.FC<any> = (p) => <Icon {...p}>📸</Icon>;
const Mail: React.FC<any> = (p) => <Icon {...p}>✉️</Icon>;
const Phone: React.FC<any> = (p) => <Icon {...p}>📞</Icon>;
const MapPin: React.FC<any> = (p) => <Icon {...p}>📍</Icon>;
const CloudSun: React.FC<any> = (p) => <Icon {...p}>🌤️</Icon>;
const Loader2: React.FC<any> = (p) => <Icon {...p}>⏳</Icon>;
const Search: React.FC<any> = (p) => <Icon {...p}>🔍</Icon>;

const WeatherWidget: React.FC = () => {
  const [city, setCity] = useState("New Delhi");
  const [weather, setWeather] = useState<{temp: number, condition: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (searchCity: string) => {
    if (!searchCity.trim()) return;
    setLoading(true);
    setError("");
    
    try {
      // 1. Geocoding
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1&language=en&format=json`
      );
      const geoJson = await geoRes.json();

      if (!geoJson.results || geoJson.results.length === 0) {
        setError("City not found");
        setWeather(null);
        return;
      }

      const { latitude, longitude } = geoJson.results[0];
      // Optional: Update city name to the official one found
      // setCity(name); 

      // 2. Weather
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const json = await res.json();
      if (json.current_weather) {
        setWeather({
            temp: Math.round(json.current_weather.temperature),
            condition: getWeatherCondition(json.current_weather.weathercode)
        });
      }
    } catch (e) {
      console.error(`Error fetching weather for ${searchCity}`, e);
      setError("Error");
    } finally {
      setLoading(false);
    }
  };

  // Helper to interpret WMO Weather interpretation codes (WW)
  const getWeatherCondition = (code: number) => {
      if (code === 0) return "Clear sky";
      if (code >= 1 && code <= 3) return "Partly cloudy";
      if (code >= 45 && code <= 48) return "Foggy";
      if (code >= 51 && code <= 55) return "Drizzle";
      if (code >= 61 && code <= 65) return "Rain";
      if (code >= 71 && code <= 77) return "Snow";
      if (code >= 80 && code <= 82) return "Showers";
      if (code >= 95) return "Thunderstorm";
      return "Clear";
  }

  useEffect(() => {
    fetchWeather("New Delhi");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <div className="border-t border-primary-800 bg-primary-950/30 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Label */}
            <div className="flex items-center gap-3 text-primary-300">
                <div className="p-2 bg-primary-800 rounded-full">
                    <CloudSun size={20} className="text-orange-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-white">Travel Forecast</h4>
                    <p className="text-xs text-primary-400">Check weather before you travel</p>
                </div>
            </div>

            {/* Controls & Display */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-primary-900/50 p-1.5 rounded-xl border border-primary-800/50">
                
                {/* Search Input */}
                <div className="relative flex items-center">
                    <input 
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city..."
                        className="bg-transparent text-primary-200 text-sm font-medium focus:outline-none py-2 pl-3 pr-2 w-32 sm:w-40 border-r border-primary-700/50 placeholder:text-primary-600"
                    />
                </div>

                {/* Search Button */}
                <button 
                    type="submit"
                    className="p-2 hover:bg-primary-800 rounded-lg text-primary-400 hover:text-primary-200 transition-colors"
                    title="Search Weather"
                >
                    <Search size={16} />
                </button>

                {/* Weather Display */}
                <div className="flex items-center gap-3 px-3 min-w-[100px] justify-center border-l border-primary-700/50">
                    {loading ? (
                        <Loader2 size={18} className="animate-spin text-primary-400" />
                    ) : error ? (
                        <span className="text-xs text-red-400">{error}</span>
                    ) : weather ? (
                        <>
                            <span className="text-xl font-bold text-white">{weather.temp}°C</span>
                            <span className="text-xs text-primary-400 font-medium whitespace-nowrap hidden sm:inline">{weather.condition}</span>
                        </>
                    ) : (
                        <span className="text-xs text-primary-500">No Data</span>
                    )}
                </div>
            </form>

        </div>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-primary-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white">DarShana</h2>
          <p className="text-sm text-primary-400">
            Discover the soul of India through AI-powered experiences. From the Himalayas to the Indian Ocean, find your perfect journey.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-400 transition" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" className="hover:text-primary-400 transition" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" className="hover:text-primary-400 transition" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#/mood" className="hover:text-primary-400">Mood Analyzer</a></li>
            <li><a href="#/festivals" className="hover:text-primary-400">Festival Calendar</a></li>
            <li><a href="#/sustainable" className="hover:text-primary-400">Eco-Planner</a></li>
            <li><a href="#/register" className="hover:text-primary-400">Book Now</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Luxury Trains</li>
            <li>Heritage Walks</li>
            <li>Adventure Tours</li>
            <li>Wellness Retreats</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><MapPin size={16} className="text-primary-400" /> Lucknow, India</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-primary-400" /> +91 87918 98194, +91 93685 68267</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-primary-400" /> hello@darshana.travel</li>
          </ul>
        </div>
      </div>

      {/* Weather Strip */}
      <WeatherWidget />

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-primary-800 text-center text-xs text-primary-500">
        © {new Date().getFullYear()} DarShana Travels. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
