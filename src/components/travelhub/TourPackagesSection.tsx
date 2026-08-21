import { useState } from 'react';
import { Clock, Hotel, Plane, CheckCircle2, XCircle, X } from 'lucide-react';

type Package = {
  id: string;
  title: string;
  duration: string;
  hotel: string;
  transport: string;
  price: string;
  includes: string[];
  excludes: string[];
  itinerary: string[];
};

const packages: Package[] = [
  {
    id: 'kashmir-budget',
    title: 'Kashmir Budget Explorer · 5 days',
    duration: '5 days / 4 nights',
    hotel: 'Standard hotels & Cozy Houseboat',
    transport: 'Shared Tempo Traveller',
    price: '₹18,500 per person',
    includes: ['Breakfast & Dinner', 'Shikara Ride', 'Local Sightseeing'],
    excludes: ['Flights', 'Lunch', 'Gondola Tickets', 'Entry Fees'],
    itinerary: [
      'Day 1: Srinagar Arrival & Shikara Ride',
      'Day 2: Day trip to Gulmarg (Meadow of Flowers)',
      'Day 3: Day trip to Pahalgam (Valley of Shepherds)',
      'Day 4: Sonamarg excursion',
      'Day 5: Departure from Srinagar',
    ],
  },
  {
    id: 'kerala-budget',
    title: 'Kerala Budget Delight · 5 days',
    duration: '5 days / 4 nights',
    hotel: 'Standard Homestays & Hotels',
    transport: 'AC Sedan / Hatchback',
    price: '₹15,999 per person',
    includes: ['Breakfast', 'Houseboat Day Cruise', 'Sightseeing'],
    excludes: ['Flights/Train', 'Lunch & Dinner', 'Entry Tickets'],
    itinerary: [
      'Day 1: Cochin Arrival & Transfer to Munnar',
      'Day 2: Munnar Sightseeing (Tea Gardens)',
      'Day 3: Transfer to Thekkady & Spice Plantation',
      'Day 4: Alleppey Houseboat Day Cruise',
      'Day 5: Cochin Sightseeing & Departure',
    ],
  },
];

const TourPackagesSection = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  return (
    <section id="packages" className="pt-16">
      <div className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Tailored bundles</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-[#0f172a]">Tour packages with clarity</h2>
        <p className="text-slate-500 max-w-3xl mx-auto">
          Every package spells out duration, hotels, transport, inclusions/exclusions, and a day-wise narrative so clients know exactly what to expect.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {packages.map((pkg) => (
          <article key={pkg.id} className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-semibold text-[#0f172a]">{pkg.title}</h3>
              <p className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                <span className="inline-flex items-center gap-2"><Clock size={16} /> {pkg.duration}</span>
                <span className="inline-flex items-center gap-2"><Hotel size={16} /> {pkg.hotel}</span>
                <span className="inline-flex items-center gap-2"><Plane size={16} /> {pkg.transport}</span>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-3xl font-semibold text-[#06b6d4]">{pkg.price}</p>
              <button 
                onClick={() => setSelectedPackage(pkg)}
                className="px-4 py-2 rounded-xl border border-[#06b6d4] text-[#06b6d4] font-semibold hover:bg-[#06b6d4]/10"
              >
                View details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="uppercase text-xs text-slate-400 mb-2">Included</p>
                <ul className="space-y-1">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 size={16} className="text-[#06d6a0]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="uppercase text-xs text-slate-400 mb-2">Excluded</p>
                <ul className="space-y-1">
                  {pkg.excludes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-600">
                      <XCircle size={16} className="text-rose-400" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <p className="uppercase text-xs text-slate-400 mb-2">Day-wise itinerary</p>
              <div className="space-y-2 text-sm text-slate-600">
                {pkg.itinerary.slice(0, 2).map((day) => (
                  <p key={day} className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2">{day}</p>
                ))}
                {pkg.itinerary.length > 2 && (
                  <p className="text-xs text-slate-400 pl-2">+ {pkg.itinerary.length - 2} more days (click details)</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedPackage(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={24} className="text-slate-500" />
            </button>
            
            <h3 className="text-2xl font-bold text-[#0f172a] pr-10">{selectedPackage.title}</h3>
            <p className="text-[#06b6d4] font-semibold text-lg mt-1">{selectedPackage.price}</p>
            
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="font-semibold text-[#0f172a] mb-3">Full Itinerary</h4>
                <div className="space-y-3">
                  {selectedPackage.itinerary.map((day, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-none w-6 h-6 rounded-full bg-cyan-100 text-[#06b6d4] flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-slate-600 text-sm">{day}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setSelectedPackage(null);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 rounded-xl bg-[#06b6d4] text-white font-semibold hover:bg-[#0891b2] transition-colors"
              >
                Book this Package
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TourPackagesSection;
