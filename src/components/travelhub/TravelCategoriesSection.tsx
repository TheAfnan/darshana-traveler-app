import React from 'react';
import { Compass, Globe2, Heart, Mountain, Sparkles, Umbrella, Users, ArrowDownRight, Check } from 'lucide-react';
import { TourCategory } from './TourPackagesSection';

const categories: {
  id: TourCategory;
  label: string;
  icon: any;
  description: string;
  badge: string;
}[] = [
  { 
    id: 'wellness', 
    label: 'Wellness & Ayurveda', 
    icon: Heart, 
    description: 'Kerala retreats, Himalayan yoga domes, Ayurveda doctors on-call.',
    badge: 'Detox & Rejuvenate'
  },
  { 
    id: 'royal', 
    label: 'Royal & Palaces', 
    icon: Sparkles, 
    description: 'Rajasthan Havelis, Rajput fort stays, and Nawabi Awadh banquet trails.',
    badge: 'Forts & Heritage'
  },
  { 
    id: 'himalayan', 
    label: 'Himalayan Expeditions', 
    icon: Mountain, 
    description: 'Kashmir valleys, Ladakh mountain passes, and alpine pine treks.',
    badge: 'High Altitudes'
  },
  { 
    id: 'workcation', 
    label: 'Workcation & Solo', 
    icon: Compass, 
    description: '300 Mbps fiber stays across Goa Portuguese villas, Bir & Rishikesh.',
    badge: 'Remote Nomad'
  },
  { 
    id: 'family', 
    label: 'Family & Wildlife', 
    icon: Users, 
    description: 'Jim Corbett 4x4 Tiger safaris, Alleppey houseboats, and lakeside yachting.',
    badge: 'All Generations'
  },
  { 
    id: 'spiritual', 
    label: 'Sacred Pilgrimage Trails', 
    icon: Globe2, 
    description: 'Varanasi Ganga Ghats, Ayodhya Ram Mandir, and Dravidian temples.',
    badge: 'Maha Aartis'
  },
];

interface TravelCategoriesSectionProps {
  activeCategory?: TourCategory;
  onSelectCategory?: (category: TourCategory) => void;
}

const TravelCategoriesSection: React.FC<TravelCategoriesSectionProps> = ({
  activeCategory,
  onSelectCategory
}) => {
  const handleCategoryClick = (categoryId: TourCategory) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="pt-12">
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 self-center shadow-2xs">
          <Sparkles size={13} className="text-amber-600" /> CURATED THEMES
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
          Browse by Travel Themes
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          Click any travel vibe below to filter and view tailored cultural tour packages instantly.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const isSelected = activeCategory === category.id;
          return (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`rounded-3xl border p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 relative group ${
                isSelected
                  ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/40 scale-[1.02]'
                  : 'bg-white border-stone-200/80 shadow-xs hover:shadow-lg hover:border-amber-400 hover:bg-stone-50/60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl p-3 shrink-0 transition-colors ${
                  isSelected 
                    ? 'bg-slate-900 text-amber-400' 
                    : 'bg-amber-50 text-amber-800 group-hover:bg-slate-900 group-hover:text-white'
                }`}>
                  <category.icon size={22} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold font-serif text-stone-900 group-hover:text-amber-900 transition-colors">
                      {category.label}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{category.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                <span className="text-amber-700 font-semibold bg-amber-100/70 px-2 py-0.5 rounded-md">
                  {category.badge}
                </span>

                <span className={`font-semibold flex items-center gap-1 transition ${
                  isSelected ? 'text-amber-900 font-bold' : 'text-stone-500 group-hover:text-stone-900'
                }`}>
                  {isSelected ? (
                    <>
                      <Check size={13} className="text-emerald-700 font-bold" /> Filter Applied
                    </>
                  ) : (
                    <>
                      View Packages <ArrowDownRight size={13} />
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TravelCategoriesSection;
