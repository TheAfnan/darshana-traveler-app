import { Compass, Globe2, Heart, Mountain, Umbrella, Users } from 'lucide-react';

const categories = [
  { id: 'wellness', label: 'Wellness & Ayurveda', icon: Heart, description: 'Kerala retreats, Himalayan yoga domes, Ayurveda doctors on-call.' },
  { id: 'family', label: 'Family Holidays', icon: Users, description: 'Tiger safaris, theme resorts, and heritage walks for every generation.' },
  { id: 'adventure', label: 'Adventure India', icon: Mountain, description: 'Himalayan treks, Northeast caving, Konkan scuba circuits.' },
  { id: 'workcation', label: 'Workcation & Solo', icon: Compass, description: 'Fiber-ready co-living stays across Goa, Rishikesh, Bir.' },
  { id: 'weekend', label: 'Weekend Drives', icon: Umbrella, description: 'Two-night micro itineraries from metro cities.' },
  { id: 'pilgrimage', label: 'Pilgrimage Trails', icon: Globe2, description: 'Char Dham, Jyotirlinga, and Sufi circuits with local experts.' },
];

const TravelCategoriesSection = () => {
  const handleCategoryClick = () => {
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="pt-16">
      <div className="text-center space-y-3">
        <p className="text-base uppercase tracking-[0.28em] text-slate-600 font-semibold">Choose your vibe</p>
        <h2 className="text-3xl font-semibold text-[#0f172a]">Browse by travel categories</h2>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={handleCategoryClick}
            className="rounded-3xl border border-slate-100 bg-white shadow-sm p-5 flex items-start gap-4 cursor-pointer hover:shadow-md hover:border-cyan-100 transition-all active:scale-95"
          >
            <div className="rounded-2xl bg-cyan-50 text-[#06b6d4] p-3">
              <category.icon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#0f172a]">{category.label}</h3>
              <p className="text-sm text-slate-500">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TravelCategoriesSection;
