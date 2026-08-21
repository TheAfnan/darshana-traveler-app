import React from 'react';
import { CloudSun, MapPin, Star, ExternalLink, Sparkles } from 'lucide-react';
import nainitalLakeImg from '../../images/nainital-lake.jpg';

type DestinationCard = {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  weather: string;
  mapLink: string;
  rating: number;
  reviews: number;
  highlight: string;
};

const popularDestinations: DestinationCard[] = [
  {
    id: 'nainital',
    name: 'Nainital & Kumaon Lakes',
    region: 'Uttarakhand Himalayas',
    description: 'Emerald lake sailing, vintage colonial villas, and panoramic snow vistas of Nanda Devi.',
    image: nainitalLakeImg,
    weather: '18°C · Pleasant',
    mapLink: 'https://maps.app.goo.gl/9bN6tYn5N2G7b5V17',
    rating: 4.92,
    reviews: 1420,
    highlight: 'Lake Yachting & Shaktipeeth'
  },
  {
    id: 'ladakh',
    name: 'Leh–Ladakh & Nubra Valley',
    region: 'Trans-Himalaya',
    description: 'High-altitude mountain passes, ancient gompas, and breathtaking starry nights over Pangong Tso.',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80',
    weather: '12°C · Clear Skies',
    mapLink: 'https://maps.app.goo.gl/sxkRXVRwVP3sa3mL7',
    rating: 4.96,
    reviews: 1880,
    highlight: 'Pangong Tso & Monasteries'
  },
  {
    id: 'varanasi',
    name: 'Varanasi (Kashi)',
    region: 'Uttar Pradesh',
    description: 'World’s oldest living city with synchronized Ganga aartis, labyrinthine heritage alleys, and ancient ghats.',
    image: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=800&auto=format&fit=crop&q=80',
    weather: '26°C · Sunny',
    mapLink: 'https://maps.app.goo.gl/yQ7nB2w4Fm3H6z5S8',
    rating: 4.98,
    reviews: 2150,
    highlight: 'Subah-e-Banaras & Aarti'
  },
];

const DestinationsSection: React.FC = () => {
  return (
    <section id="destinations" className="pt-16">
      <div className="flex flex-col gap-2 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 self-center">
          <Sparkles size={13} className="text-amber-600" /> TOP RATED HUBS
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
          Trending Destinations This Season
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">
          Real-time weather summaries, verified traveler reviews, and instant location navigation to plan your next retreat.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {popularDestinations.map((destination) => (
          <article 
            key={destination.id} 
            className="rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden bg-white flex flex-col group"
          >
            <div className="relative h-60 overflow-hidden">
              <img 
                src={destination.image} 
                alt={destination.name} 
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-amber-300 border border-white/20">
                <MapPin size={12} className="text-amber-400" /> {destination.region}
              </div>
              
              <div className="absolute bottom-3.5 left-3.5 rounded-xl bg-white/90 backdrop-blur-md text-stone-800 px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium shadow-xs">
                <CloudSun size={14} className="text-amber-600" /> {destination.weather}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 justify-between space-y-3">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                  ✨ {destination.highlight}
                </span>
                <h3 className="text-xl font-bold font-serif text-stone-900">{destination.name}</h3>
                <p className="text-stone-600 text-xs sm:text-sm mt-1.5 leading-relaxed">{destination.description}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <a
                  href={destination.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-800 hover:text-amber-700 font-semibold flex items-center gap-1 transition"
                >
                  <span>Google Maps</span>
                  <ExternalLink size={12} />
                </a>

                <div className="inline-flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                  <Star className="text-amber-500 fill-amber-500" size={13} />
                  <span className="font-bold text-stone-900">{destination.rating.toFixed(2)}</span>
                  <span className="text-stone-400">({destination.reviews})</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DestinationsSection;
