import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import lucknowRumiImg from '../images/lucknow-rumi-darwaza.jpg';

interface CityItem {
  id: string;
  name: string;
  state: string;
  region: 'North' | 'South' | 'East' | 'West';
  isPopular: boolean;
  desc: string;
  img: string;
  tag: string;
}

const CITIES_DATA: CityItem[] = [
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    region: 'North',
    isPopular: true,
    desc: 'Tehzeeb, timeless Awadhi heritage, Rumi Darwaza, and legendary Galouti Kebabs.',
    img: lucknowRumiImg,
    tag: 'Awadhi Heritage'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    region: 'North',
    isPopular: true,
    desc: 'Pink City royal palaces, vibrant Johari Bazaar, and sunsets over Amber Fort.',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
    tag: 'Royal Palaces'
  },
  {
    id: 'nainital',
    name: 'Nainital',
    state: 'Uttarakhand',
    region: 'North',
    isPopular: true,
    desc: 'Emerald crescent Naini Lake, Himalayan Naina Devi Shaktipeeth, and pine ridge walks.',
    img: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80',
    tag: 'Lake District'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'North',
    isPopular: true,
    desc: 'Sacred Ganga Ghat rituals at dawn, Kashi Vishwanath temple, and ancient silk lanes.',
    img: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=800&auto=format&fit=crop',
    tag: 'Spiritual Capital'
  },
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    region: 'North',
    isPopular: true,
    desc: 'Mughal architectural wonder Taj Mahal, Agra Fort, and fragrant Angoori Petha sweets.',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    tag: 'World Wonder'
  },
  {
    id: 'ayodhya',
    name: 'Ayodhya',
    state: 'Uttar Pradesh',
    region: 'North',
    isPopular: true,
    desc: 'Sacred Sarayu riverfront, grand Deepotsav festivities, and Ram Janmabhoomi temple.',
    img: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&auto=format&fit=crop&q=80',
    tag: 'Ancient Heritage'
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    region: 'North',
    isPopular: true,
    desc: 'Golden Temple spiritual serenity, 24/7 world largest community langar, and Wagah Border.',
    img: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
    tag: 'Golden Serenity'
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    region: 'North',
    isPopular: false,
    desc: 'Colonial Ridge architecture, toy train pine valleys, and snow-capped Himalayan peaks.',
    img: 'https://images.unsplash.com/photo-1562670652-e5947bddb335?w=800&auto=format&fit=crop&q=80',
    tag: 'Pine Hills'
  },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    region: 'South',
    isPopular: true,
    desc: 'Serene backwaters, cantilevered Chinese fishing nets, spice havens, and Fort Kochi art cafes.',
    img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800&auto=format&fit=crop',
    tag: 'Coastal & Art'
  },
  {
    id: 'mysore',
    name: 'Mysore',
    state: 'Karnataka',
    region: 'South',
    isPopular: true,
    desc: 'Illuminated Mysore Palace, royal Dasara processions, sandalwood crafts, and Mysore Pak.',
    img: 'https://images.unsplash.com/photo-1600100397608-f010e08e1e19?w=800&auto=format&fit=crop&q=80',
    tag: 'Royal Kingdom'
  },
  {
    id: 'madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    region: 'South',
    isPopular: false,
    desc: 'Dravidian gopuram marvel Meenakshi Amman Temple, jasmine flower markets, and temple street food.',
    img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    tag: 'Dravidian Temples'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    region: 'West',
    isPopular: true,
    desc: 'Arabian Sea breeze at Marine Drive, Gateway of India, cinema legacy, and street food.',
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    tag: 'Max City'
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    region: 'West',
    isPopular: true,
    desc: 'Golden sun-kissed beaches, historic Portuguese churches, vibrant night flea markets, and seafood.',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    tag: 'Coastal Paradise'
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    region: 'West',
    isPopular: true,
    desc: 'City of Lakes, Lake Pichola shimmering boat rides, white marble palaces, and Rajasthani folk dance.',
    img: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&auto=format&fit=crop&q=80',
    tag: 'Lake City'
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    region: 'East',
    isPopular: true,
    desc: 'Grand Victoria Memorial, Howrah Bridge, artistic Durga Puja pandals, and legendary Rosogollas.',
    img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80',
    tag: 'City of Joy'
  },
  {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    region: 'East',
    isPopular: false,
    desc: 'Cloud-kissed pine hills, rock music culture, crystal-clear Umngot river, and living root bridges.',
    img: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=800&auto=format&fit=crop',
    tag: 'Scotland of East'
  },
  {
    id: 'gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    region: 'East',
    isPopular: false,
    desc: 'Panoramic views of Mt. Kanchenjunga, Rumtek Monastery prayer flags, and alpine Tsomgo Lake.',
    img: 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=800&auto=format&fit=crop&q=80',
    tag: 'Himalayan Realm'
  },
  {
    id: 'puri',
    name: 'Puri',
    state: 'Odisha',
    region: 'East',
    isPopular: false,
    desc: 'Sacred Jagannath Rath Yatra chariot festival, golden beaches, and Konark Sun Temple.',
    img: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=800&auto=format&fit=crop&q=80',
    tag: 'Sacred Coast'
  }
];

type FilterType = 'All' | 'Popular' | 'North' | 'South' | 'East' | 'West';

const AllCities: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filterOptions: FilterType[] = ['All', 'Popular', 'North', 'South', 'East', 'West'];

  const filteredCities = useMemo(() => {
    return CITIES_DATA.filter((city) => {
      // 1. Region / Popularity filter
      if (activeFilter === 'Popular' && !city.isPopular) return false;
      if (activeFilter === 'North' && city.region !== 'North') return false;
      if (activeFilter === 'South' && city.region !== 'South') return false;
      if (activeFilter === 'East' && city.region !== 'East') return false;
      if (activeFilter === 'West' && city.region !== 'West') return false;

      // 2. Search query filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = city.name.toLowerCase().includes(q);
        const matchesState = city.state.toLowerCase().includes(q);
        const matchesDesc = city.desc.toLowerCase().includes(q);
        const matchesTag = city.tag.toLowerCase().includes(q);
        return matchesName || matchesState || matchesDesc || matchesTag;
      }

      return true;
    });
  }, [activeFilter, search]);

  return (
    <section className="min-h-screen bg-stone-50/50 py-12 pt-28 border-y border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold tracking-widest uppercase text-teal-700 bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-full">
            EXPLORE CITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
            Handpicked destinations across India
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Search by city or filter by region/popularity to jump into curated cultural overviews and seasonal itineraries.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-white p-3 sm:p-4 rounded-3xl border border-stone-200/80 shadow-xs">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              placeholder="Search city, state, vibe, or keyword..."
              className="w-full rounded-full border border-stone-200 bg-stone-50/50 pl-11 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-teal-500 focus:bg-white transition"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 flex-wrap items-center">
            {filterOptions.map((filter) => {
              const isSelected = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-102"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center text-xs text-stone-500 font-medium px-1">
          <span>Showing {filteredCities.length} {filteredCities.length === 1 ? 'destination' : 'destinations'}</span>
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="text-teal-700 hover:underline cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>

        {/* City Cards Grid */}
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <div 
                key={city.id}
                className="group relative overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={city.img}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Top Tag Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 border border-white/40 shadow-xs">
                      {city.region} India
                    </span>
                    {city.isPopular && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1">
                        <Sparkles size={11} /> Popular
                      </span>
                    )}
                  </div>

                  {/* City Name Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold font-serif leading-tight">{city.name}</h3>
                    <p className="text-xs text-amber-200 font-medium flex items-center gap-1">
                      <MapPin size={11} /> {city.state}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {city.desc}
                  </p>

                  <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                    <Link
                      className="text-teal-700 hover:text-teal-900 font-semibold text-xs inline-flex items-center gap-1 transition group-hover:translate-x-0.5"
                      to={`/planner?to=${city.name}`}
                    >
                      <span>Explore Itinerary</span>
                      <ArrowRight size={13} />
                    </Link>
                    <span className="text-[10px] text-stone-400 font-medium bg-stone-50 px-2 py-0.5 rounded-md">
                      {city.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <MapPin size={32} className="mx-auto text-stone-400" />
            <h3 className="text-lg font-bold text-stone-900">No destinations found</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              No cities match "{search}" under the {activeFilter} filter. Try searching for another keyword or clear the filter.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setActiveFilter('All');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default AllCities;