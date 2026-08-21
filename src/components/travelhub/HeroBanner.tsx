import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, PhoneCall, PlaneTakeoff } from 'lucide-react';

export interface HeroSearchPayload {
  destination: string;
  checkIn: string;
  checkOut: string;
  budget: string;
}

interface HeroBannerProps {
  onSearch?: (payload: HeroSearchPayload) => void;
  onExploreDestinations?: () => void;
  onContact?: () => void;
}

const seasonalOffers = [
  { id: 1, title: 'Himalayan Snow Trails', discount: '25% OFF', details: 'Gulmarg · Auli · Tawang' },
  { id: 2, title: 'Festive South Circuit', discount: '15% OFF', details: 'Kochi · Madurai · Mysuru' },
  { id: 3, title: 'Desert Glow Retreat', discount: '20% OFF', details: 'Jaisalmer · Bikaner · Rann of Kutch' },
];

const HeroBanner: React.FC<HeroBannerProps> = ({ onSearch, onExploreDestinations, onContact }) => {
  const [form, setForm] = useState<HeroSearchPayload>({
    destination: '',
    checkIn: '',
    checkOut: '',
    budget: '',
  });

  const handleSearch = () => {
    onSearch?.(form);
  };

  const updateField = (key: keyof HeroSearchPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-[#0a1625] text-white shadow-2xl">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.45),_transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-soft-light"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1625] via-[#0a1625]/70 to-[#0f1d30]"></div>
      </div>

      <div className="relative grid gap-10 lg:grid-cols-2 p-8 md:p-12">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.5em] text-white/70">
            <PlaneTakeoff size={16} /> Your personalized travel studio
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Feel India through curated journeys <span className="text-[#06d6a0]">crafted for you</span>
          </h1>
          <p className="text-lg text-white/80 max-w-xl">
            Single hub for Indian hotels, trains, flights, guides, and AI-powered planners. Compare in real time and confirm with one click.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] font-semibold shadow-lg shadow-cyan-500/30"
            >
              Book Now
            </button>
            <button
              onClick={onExploreDestinations}
              className="px-6 py-3 rounded-2xl border border-white/30 text-white/90 hover:border-white"
            >
              Explore Destinations
            </button>
            <button
              onClick={onContact}
              className="px-6 py-3 rounded-2xl border border-transparent bg-white/10 hover:bg-white/20 flex items-center gap-2"
            >
              <PhoneCall size={18} /> Contact
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 pt-4">
            {seasonalOffers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-wide text-white/70">{offer.title}</p>
                <p className="text-2xl font-semibold text-[#fb923c]">{offer.discount}</p>
                <p className="text-xs text-white/60">{offer.details}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4"
        >
          <p className="text-white/80 text-sm">Search across hotels, flights, tours</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
              <MapPin className="text-[#06b6d4]" size={18} />
              <input
                className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                placeholder="Destination"
                value={form.destination}
                onChange={(e) => updateField('destination', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                <Calendar className="text-[#06b6d4]" size={18} />
                <input
                  type="date"
                  className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                  value={form.checkIn}
                  onChange={(e) => updateField('checkIn', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                <Calendar className="text-[#06b6d4]" size={18} />
                <input
                  type="date"
                  className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                  value={form.checkOut}
                  onChange={(e) => updateField('checkOut', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
              <DollarSign className="text-[#06b6d4]" size={18} />
              <input
                className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                placeholder="Budget (₹)"
                value={form.budget}
                onChange={(e) => updateField('budget', e.target.value)}
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full rounded-2xl bg-gradient-to-r from-[#06d6a0] to-[#0ea5e9] py-3 font-semibold shadow-lg shadow-cyan-500/30"
            >
              Search availability
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
