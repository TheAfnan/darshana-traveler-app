import { CloudSun, MapPin, Star } from 'lucide-react';

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
};

const popularDestinations: DestinationCard[] = [
  {
    id: 'ladakh',
    name: 'Leh–Ladakh, Jammu & Kashmir',
    region: 'Trans-Himalaya',
    description: 'Confluence drives, high passes, and night skies over Pangong Tso.',
    image: 'https://travelmykashmir.com/wp-content/uploads/2024/05/Pangong-Lake-Near-the-Mountains-Under-the-Blue-Sky-and-White-Clouds-Kashmir-leh-ladakh-tour-packages.webp',
    weather: 'Clear Skies',
    mapLink: 'https://maps.app.goo.gl/sxkRXVRwVP3sa3mL7',
    rating: 4.95,
    reviews: 1280,
  },
  {
    id: 'coorg',
    name: 'Coorg, Karnataka',
    region: 'Western Ghats',
    description: 'Coffee estate stays, rainforest hikes, and Kodava culinary tours.',
    image: 'https://static.toiimg.com/photo/58374190.cms',
    weather: 'Misty',
    mapLink: 'https://maps.app.goo.gl/7TXHyxQ7EZbnBo8b7',
    rating: 4.85,
    reviews: 940,
  },
  {
    id: 'meghalaya',
    name: 'Sohra & Mawlynnong, Meghalaya',
    region: 'Northeast India',
    description: 'Living root bridges, waterfalls, and clean village walks in the clouds.',
    image: 'https://d34vm3j4h7f97z.cloudfront.net/optimized/4X/4/5/4/454db32ff82609d46db45be4e4f441038cad6789_2_690x428.jpeg',
    weather: 'Partly Cloudy',
    mapLink: 'https://maps.app.goo.gl/6nX8pVJx8Wx9pddY8',
    rating: 4.9,
    reviews: 1102,
  },
];

const DestinationsSection = () => {
  return (
    <section id="destinations" className="pt-16">
      <div className="flex flex-col gap-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Curated escapes</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-[#0f172a]">Popular destinations right now</h2>
        <p className="text-slate-500 max-w-3xl mx-auto">
          Live weather summaries, verified reviews, and instant navigation links so you can jump from inspiration to action.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {popularDestinations.map((destination) => (
          <article key={destination.id} className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden bg-white flex flex-col">
            <div className="relative">
              <img src={destination.image} alt={destination.name} className="h-56 w-full object-cover" loading="lazy" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#06b6d4]">
                <MapPin size={14} /> {destination.region}
              </div>
              <div className="absolute bottom-4 left-4 rounded-2xl bg-black/60 text-white px-3 py-2 flex items-center gap-2 text-sm">
                <CloudSun size={16} /> {destination.weather}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-semibold text-[#0f172a]">{destination.name}</h3>
              <p className="text-slate-500 text-sm mt-2 flex-1">{destination.description}</p>

              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <a
                  href={destination.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#06b6d4] font-semibold"
                >
                  Open in Google Maps →
                </a>
                <div className="inline-flex items-center gap-1">
                  <Star className="text-[#fbbf24]" size={16} />
                  <span className="font-semibold text-[#0f172a]">{destination.rating.toFixed(2)}</span>
                  <span className="text-slate-400">({destination.reviews} reviews)</span>
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
