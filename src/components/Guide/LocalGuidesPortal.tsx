import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Users,
  DollarSign,
  Award,
  Globe,
  Filter,
  X,
  ChevronDown,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
} from 'lucide-react';
import type { LocalGuide } from '../../types';

interface FilterOptions {
  location: string;
  specialty: string;
  minRating: number;
  maxPrice: number;
  languages: string[];
  onlyVerified: boolean;
}

const LocalGuidesPortal: React.FC = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState<LocalGuide[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<LocalGuide | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    location: '',
    specialty: '',
    minRating: 0,
    maxPrice: 50000,
    languages: [],
    onlyVerified: false,
  });

  const specialtyOptions = [
    'Beach Tourism',
    'Mountain Trekking',
    'Cultural Tours',
    'Adventure Sports',
    'Wildlife Safari',
    'Historical Sites',
    'Food & Cuisine',
    'Photography',
    'Backpacking',
    'Family Tours',
    'Solo Travel',
    'Business Tours',
  ];

  const languageOptions = [
    'English',
    'Hindi',
    'Spanish',
    'French',
    'German',
    'Mandarin',
    'Japanese',
  ];

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await fetch('/api/guides?verified=true', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGuides(data);
      } else {
        // Mock data for development
        setGuides([
          {
            id: '1',
            name: 'Raj Kumar',
            email: 'raj@guide.com',
            phone: '+91-98765-43210',
            location: 'Goa',
            specialties: ['Beach Tourism', 'Water Sports', 'Local Cuisine'],
            rating: 4.8,
            reviews: 156,
            profileImage: 'https://via.placeholder.com/150',
            bio: 'Experienced guide with 10 years in Goa tourism. Specializing in beach tours and water sports.',
            languages: ['English', 'Hindi', 'Marathi'],
            verified: true,
            pricePerDay: 2500,
            experience: '10 years',
            availability: 'available',
            responseTime: '1 hour',
            totalTrips: 234,
          },
          {
            id: '2',
            name: 'Priya Sharma',
            email: 'priya@guide.com',
            phone: '+91-87654-32109',
            location: 'Kerala',
            specialties: ['Backwaters', 'Adventure', 'Cultural Tours'],
            rating: 4.9,
            reviews: 243,
            profileImage: 'https://via.placeholder.com/150',
            bio: 'Expert in Kerala tourism with certified credentials and 12 years of experience.',
            languages: ['English', 'Hindi', 'Malayalam', 'Tamil'],
            verified: true,
            pricePerDay: 3000,
            experience: '12 years',
            availability: 'available',
            responseTime: '30 minutes',
            totalTrips: 312,
          },
          {
            id: '3',
            name: 'Amit Singh',
            email: 'amit@guide.com',
            phone: '+91-76543-21098',
            location: 'Rajasthan',
            specialties: ['Desert Safari', 'Historical Sites', 'Photography'],
            rating: 4.7,
            reviews: 189,
            profileImage: 'https://via.placeholder.com/150',
            bio: 'Professional photographer and desert guide with award-winning photography skills.',
            languages: ['English', 'Hindi', 'German'],
            verified: true,
            pricePerDay: 2000,
            experience: '8 years',
            availability: 'available',
            responseTime: '2 hours',
            totalTrips: 178,
          },
          {
            id: '4',
            name: 'Maya Patel',
            email: 'maya@guide.com',
            phone: '+91-65432-10987',
            location: 'Mumbai',
            specialties: ['Food & Cuisine', 'Cultural Tours', 'Solo Travel'],
            rating: 4.9,
            reviews: 267,
            profileImage: 'https://via.placeholder.com/150',
            bio: 'Food blogger and cultural guide specializing in local cuisine and heritage walks.',
            languages: ['English', 'Hindi', 'Gujarati', 'Spanish'],
            verified: true,
            pricePerDay: 1800,
            experience: '7 years',
            availability: 'available',
            responseTime: '45 minutes',
            totalTrips: 289,
          },
          {
            id: '5',
            name: 'Vikram Reddy',
            email: 'vikram@guide.com',
            phone: '+91-54321-09876',
            location: 'Himachal Pradesh',
            specialties: ['Mountain Trekking', 'Adventure Sports', 'Wildlife Safari'],
            rating: 4.6,
            reviews: 134,
            profileImage: 'https://via.placeholder.com/150',
            bio: 'Adventure sports instructor and wildlife expert with certifications in mountaineering.',
            languages: ['English', 'Hindi', 'Pahari'],
            verified: true,
            pricePerDay: 3500,
            experience: '11 years',
            availability: 'available',
            responseTime: '1 hour',
            totalTrips: 201,
          },
          {
            id: '6',
            name: 'Anjali Verma',
            email: 'anjali@guide.com',
            phone: '+91-43210-98765',
            location: 'Varanasi',
            specialties: ['Cultural Tours', 'Historical Sites', 'Photography'],
            rating: 4.8,
            reviews: 178,
            profileImage: 'https://via.placeholder.com/150',
            bio: 'Cultural guide with deep knowledge of Indian heritage and spiritual tourism.',
            languages: ['English', 'Hindi', 'Bengali', 'German', 'French'],
            verified: true,
            pricePerDay: 2200,
            experience: '9 years',
            availability: 'available',
            responseTime: '1 hour',
            totalTrips: 215,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter guides based on search and filter options
  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === '' ||
        guide.name.toLowerCase().includes(searchLower) ||
        guide.location.toLowerCase().includes(searchLower) ||
        guide.specialties.some((s) =>
          s.toLowerCase().includes(searchLower)
        );

      if (!matchesSearch) return false;

      // Location filter
      if (filters.location && !guide.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Specialty filter
      if (filters.specialty && !guide.specialties.includes(filters.specialty)) {
        return false;
      }

      // Rating filter
      if (guide.rating < filters.minRating) {
        return false;
      }

      // Price filter
      if (guide.pricePerDay && guide.pricePerDay > filters.maxPrice) {
        return false;
      }

      // Languages filter
      if (filters.languages.length > 0) {
        const hasLanguage = filters.languages.some((lang) =>
          guide.languages.includes(lang)
        );
        if (!hasLanguage) return false;
      }

      // Verified filter
      if (filters.onlyVerified && !guide.verified) {
        return false;
      }

      return true;
    });
  }, [guides, searchTerm, filters]);

  const handleSelectGuide = (guide: LocalGuide) => {
    setSelectedGuide(guide);
    setShowDetail(true);
  };

  const handleBookGuide = (guide: LocalGuide) => {
    navigate('/booking', { state: { selectedGuide: guide } });
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleLanguageFilter = (language: string) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      specialty: '',
      minRating: 0,
      maxPrice: 50000,
      languages: [],
      onlyVerified: false,
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Users size={48} className="text-teal-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Find Local Guides</h1>
          <p className="text-stone-600">
            Connect with verified local guides and explore destinations like a local
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by guide name, location, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-stone-200 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white border-2 border-stone-300 rounded-lg font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2 transition-colors"
          >
            <Filter size={18} />
            Filters
            <ChevronDown
              size={18}
              className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>

          {showFilters && (
            <div className="mt-4 bg-white rounded-lg shadow-lg p-6 border border-stone-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Goa, Kerala"
                    value={filters.location}
                    onChange={(e) =>
                      handleFilterChange('location', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Specialty Filter */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <Award size={16} className="inline mr-2" />
                    Specialty
                  </label>
                  <select
                    value={filters.specialty}
                    onChange={(e) =>
                      handleFilterChange('specialty', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Specialties</option>
                    {specialtyOptions.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <Star size={16} className="inline mr-2" />
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) =>
                      handleFilterChange('minRating', parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="0">All Ratings</option>
                    <option value="4">4.0+ stars</option>
                    <option value="4.5">4.5+ stars</option>
                    <option value="4.8">4.8+ stars</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <DollarSign size={16} className="inline mr-2" />
                    Max Daily Rate
                  </label>
                  <select
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange('maxPrice', parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="50000">All Prices</option>
                    <option value="1500">₹0 - ₹1,500</option>
                    <option value="3000">₹0 - ₹3,000</option>
                    <option value="5000">₹0 - ₹5,000</option>
                  </select>
                </div>

                {/* Verified Only */}
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.onlyVerified}
                      onChange={(e) =>
                        handleFilterChange('onlyVerified', e.target.checked)
                      }
                      className="w-4 h-4 rounded border-stone-300"
                    />
                    <span className="text-sm font-medium text-stone-700">
                      Verified Only
                    </span>
                  </label>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium transition-colors w-full"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Languages Filter */}
              <div className="mt-6 pt-6 border-t border-stone-200">
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  <Globe size={16} className="inline mr-2" />
                  Languages
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {languageOptions.map((language) => (
                    <button
                      key={language}
                      onClick={() => toggleLanguageFilter(language)}
                      className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                        filters.languages.includes(language)
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-stone-300 bg-white text-stone-700 hover:border-teal-300'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-stone-600 font-medium">
            Found <span className="text-teal-600 font-bold">{filteredGuides.length}</span> guide(s)
          </p>
          {(searchTerm || Object.values(filters).some((v) => v !== '' && v !== 0 && !Array.isArray(v) || (Array.isArray(v) && v.length > 0))) && (
            <button
              onClick={resetFilters}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
            >
              <X size={16} />
              Clear All
            </button>
          )}
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center border border-stone-200">
            <Users size={48} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-600 font-medium text-lg">No guides found</p>
            <p className="text-stone-500 text-sm mt-2">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden border border-stone-200 cursor-pointer"
                onClick={() => handleSelectGuide(guide)}
              >
                {/* Header */}
                <div className="h-40 bg-gradient-to-r from-teal-400 to-blue-500 relative overflow-hidden">
                  <img
                    src={guide.profileImage}
                    alt={guide.name}
                    className="w-full h-full object-cover opacity-50"
                  />
                  {guide.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                      <CheckCircle size={14} />
                      Verified
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-stone-900">{guide.name}</h3>

                  <div className="flex items-center gap-2 mt-2 text-yellow-500">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(guide.rating)
                              ? 'fill-yellow-500'
                              : 'opacity-30'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-stone-700">
                      {guide.rating} ({guide.reviews} reviews)
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-stone-600">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-teal-600" />
                      {guide.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-600" />
                      ₹{guide.pricePerDay?.toLocaleString()}/day
                    </p>
                  </div>

                  {/* Specialties */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {guide.specialties.slice(0, 2).map((specialty) => (
                      <span
                        key={specialty}
                        className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                    {guide.specialties.length > 2 && (
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">
                        +{guide.specialties.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-5 pt-4 border-t border-stone-200 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookGuide(guide);
                      }}
                      className="flex-1 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium transition-colors"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectGuide(guide);
                      }}
                      className="flex-1 px-3 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 text-sm font-medium transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guide Detail Modal */}
      {showDetail && selectedGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{selectedGuide.name}</h2>
                <p className="text-teal-100">{selectedGuide.location}</p>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Bio */}
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">About</h3>
                <p className="text-stone-600">{selectedGuide.bio}</p>
              </div>

              {/* Rating & Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-stone-600">Rating</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {selectedGuide.rating}⭐
                  </p>
                  <p className="text-xs text-stone-500">{selectedGuide.reviews} reviews</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-stone-600">Daily Rate</p>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{selectedGuide.pricePerDay?.toLocaleString()}
                  </p>
                  <p className="text-xs text-stone-500">Per day</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-stone-600">Trips</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {selectedGuide.totalTrips}
                  </p>
                  <p className="text-xs text-stone-500">Completed</p>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="font-semibold text-stone-900 mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGuide.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="font-semibold text-stone-900 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGuide.languages.map((lang) => (
                    <span
                      key={lang}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold text-stone-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <a
                    href={`mailto:${selectedGuide.email}`}
                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
                  >
                    <Mail size={18} />
                    {selectedGuide.email}
                  </a>
                  <a
                    href={`tel:${selectedGuide.phone}`}
                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
                  >
                    <Phone size={18} />
                    {selectedGuide.phone}
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-stone-200">
                <button
                  onClick={() => {
                    handleBookGuide(selectedGuide);
                    setShowDetail(false);
                  }}
                  className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Book This Guide
                </button>
                <button
                  onClick={() =>
                    navigate('/contact', { state: { guideName: selectedGuide.name } })
                  }
                  className="flex-1 px-4 py-3 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalGuidesPortal;
