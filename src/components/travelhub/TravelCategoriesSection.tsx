import React from 'react';
import { Compass, Globe2, Heart, Mountain, Sparkles, Umbrella, Users } from 'lucide-react';

const categories = [
  { id: 'wellness', label: 'Wellness & Ayurveda', icon: Heart, description: 'Kerala retreats, Himalayan yoga domes, Ayurveda doctors on-call.' },
  { id: 'royal', label: 'Royal & Palaces', icon: Sparkles, description: 'Rajasthan Havelis, Rajput fort stays, and Nawabi Awadh banquet trails.' },
  { id: 'adventure', label: 'Himalayan Expeditions', icon: Mountain, description: 'Kashmir valleys, Uttarakhand lake treks, and high-altitude road trips.' },
  { id: 'workcation', label: 'Workcation & Solo', icon: Compass, description: 'High-speed fiber stays across Goa, Rishikesh, Dharamshala.' },
  { id: 'family', label: 'Family & Wildlife', icon: Users, description: 'Jim Corbett 4x4 Tiger safaris, backwaters, and heritage walks.' },
  { id: 'pilgrimage', label: 'Sacred Pilgrimage Trails', icon: Globe2, description: 'Varanasi Ganga Ghats, Ayodhya Ram Mandir, and Jyotirlinga circuits.' },
];

const TravelCategoriesSection: React.FC = () => {
  const handleCategoryClick = () => {
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="pt-12">
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 self-center">
          <Sparkles size={13} className="text-amber-600" /> CURATED THEMES
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
          Browse by Travel Themes
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">
          Select your ideal travel vibe to jump straight to handpicked cultural packages and verified itineraries.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={handleCategoryClick}
            className="rounded-3xl border border-stone-200/80 bg-white shadow-xs p-5 flex items-start gap-4 cursor-pointer hover:shadow-lg hover:border-amber-300 transition-all duration-200 group"
          >
            <div className="rounded-2xl bg-amber-50 text-amber-800 p-3 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <category.icon size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-stone-900 group-hover:text-amber-800 transition-colors">
                {category.label}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TravelCategoriesSection;
