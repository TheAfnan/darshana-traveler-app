import React from 'react';
import { Star, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import type { Guide } from '../api/guides';

interface GuideCardProps {
  guide: Guide;
  onClick?: () => void;
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div className="relative h-56 overflow-hidden bg-slate-900">
          <img
            src={guide.profileImage || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80'}
            alt={guide.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <ShieldCheck size={12} />
            <span>Govt Certified</span>
          </div>

          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 shadow-sm">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{guide.rating ? guide.rating.toFixed(1) : '5.0'}</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-base font-bold font-serif leading-tight">{guide.name}</h3>
            <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5 opacity-90">
              <MapPin size={12} className="text-amber-400 shrink-0" />
              <span>{guide.location}</span>
            </p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {guide.bio}
          </p>

          <div className="flex flex-wrap gap-1">
            {(guide.specialties || []).slice(0, 2).map((s, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-amber-50 border border-amber-200/60 text-amber-900 text-[10px] font-semibold rounded-md">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">From</span>
          <span className="text-xs font-bold text-slate-900">₹{guide.pricePerDay || 1500} / day</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1 cursor-pointer"
        >
          <span>Book</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default GuideCard;
