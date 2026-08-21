import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Award, Sparkles, X, CheckCircle2, Share2, ArrowRight } from 'lucide-react';
import { useEcoRewards } from '../../context/EcoRewardsContext';
import { Link } from 'react-router-dom';

const TIER_DETAILS = {
  'Sapling': {
    badge: '🌱',
    color: 'from-emerald-600 to-teal-700',
    perk: '5% Eco Discount on Partner Stays'
  },
  'Sprout': {
    badge: '🌿',
    color: 'from-teal-600 to-emerald-700',
    perk: 'Early Access to Cultural Festivals & 7% Stays Discount'
  },
  'Tree': {
    badge: '🌳',
    color: 'from-emerald-700 to-green-800',
    perk: 'Free Local Guide Walking Tour + 10% Booking Discounts'
  },
  'Forest Guardian': {
    badge: '👑🌲',
    color: 'from-emerald-800 via-teal-900 to-slate-900',
    perk: 'VIP Concierge, 15% Lifetime Off & Exclusive Heritage Access'
  }
};

export const EcoNotificationOverlay: React.FC = () => {
  const { recentEarnedToast, levelUpModalData, dismissLevelUpModal, dismissToast } = useEcoRewards();

  return (
    <>
      {/* 1. Micro-Animation Toast Notification */}
      <AnimatePresence>
        {recentEarnedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-6 left-6 z-[1050] flex items-center gap-3 bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl border border-emerald-500/40 shadow-2xl font-sans"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-sm shrink-0">
              <Leaf size={18} className="animate-bounce" />
            </div>
            
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-emerald-400">+{recentEarnedToast.points} Eco-Points</span>
                <span className="text-[10px] text-slate-400 font-medium">Earned!</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate max-w-[220px] sm:max-w-xs">{recentEarnedToast.reason}</p>
            </div>

            <button
              onClick={dismissToast}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Full-Screen Level Up Celebration Modal */}
      <AnimatePresence>
        {levelUpModalData && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-emerald-200 shadow-2xl text-center space-y-5 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center mx-auto text-4xl shadow-lg shadow-emerald-600/30">
                {TIER_DETAILS[levelUpModalData.newTier]?.badge || '🌿'}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                  🎉 Level Up Achieved!
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900">
                  {levelUpModalData.newTier} Tier
                </h2>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Congratulations! Your sustainable travel decisions have elevated you to <strong>{levelUpModalData.newTier}</strong>.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-1 text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-700" />
                  Unlocked Perk:
                </span>
                <p className="text-[11px] text-emerald-900 font-medium leading-relaxed">
                  {TIER_DETAILS[levelUpModalData.newTier]?.perk || 'Special community rewards'}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  to="/rewards"
                  onClick={dismissLevelUpModal}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Explore Rewards Store</span>
                  <ArrowRight size={13} />
                </Link>
                <button
                  onClick={dismissLevelUpModal}
                  className="px-4 py-2.5 border border-stone-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-stone-50 transition"
                >
                  Continue Journey
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EcoNotificationOverlay;
