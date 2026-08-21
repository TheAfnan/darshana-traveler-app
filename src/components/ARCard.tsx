import React from 'react';
import { motion } from 'framer-motion';
import type { ARDestination } from '../types/arGuide';

interface ARCardProps {
  destination: ARDestination;
  position: 'left' | 'center' | 'right';
  onSelect: (dest: ARDestination) => void;
}

export const ARCard: React.FC<ARCardProps> = ({ destination, position, onSelect }) => {
  const variants = {
    left: { x: -150, y: 0, z: -100, rotateY: 25, scale: 0.8, opacity: 0.7 },
    center: { x: 0, y: 0, z: 0, rotateY: 0, scale: 1.1, opacity: 1, zIndex: 10 },
    right: { x: 150, y: 0, z: -100, rotateY: -25, scale: 0.8, opacity: 0.7 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={variants[position]}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="absolute top-1/2 left-1/2 w-64 h-80 -ml-32 -mt-40 cursor-pointer perspective-1000"
      onClick={() => onSelect(destination)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-black/40 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,245,255,0.3)] group hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] transition-shadow duration-300">
        {/* Image */}
        <div className="h-2/3 w-full overflow-hidden">
          <img 
            src={destination.img} 
            alt={destination.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 w-full p-4 text-left">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            {destination.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30">
              {destination.matchScore}% Match
            </span>
            <span className="text-gray-400 text-xs">
              {destination.pricePerDay ? `₹${destination.pricePerDay}/day` : 'Custom'}
            </span>
          </div>
        </div>

        {/* Holographic Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
};
