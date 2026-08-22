import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const PageLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 font-sans">
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin" />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center text-orange-600">
          <Sparkles size={20} className="animate-pulse" />
        </div>
      </div>

      <div className="mt-4 text-center space-y-1.5">
        <p className="text-sm font-bold text-slate-800 tracking-wide">
          Loading DarShana Experience...
        </p>
        <p className="text-xs text-slate-400">
          Preparing cultural assets & curated guides
        </p>
      </div>

      {/* Shimmer line */}
      <div className="mt-6 w-48 h-1 bg-stone-200 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default PageLoadingSkeleton;
