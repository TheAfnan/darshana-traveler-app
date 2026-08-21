import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Gift,
  TreePine,
  ArrowRight,
  Flame,
  Globe,
  Share2,
  Copy,
  Check,
  Calendar,
  Compass,
  Tag,
  Users
} from 'lucide-react';
import { useEcoRewards, type EcoTier } from '../context/EcoRewardsContext';

const REWARD_STORE_ITEMS = [
  {
    id: 'rew-5off',
    title: '5% Off Next Trip Booking',
    cost: 500,
    category: 'Discount Voucher',
    description: 'Instant discount voucher applicable on any DarShana curated travel package or day tour.',
    impact: 'Equivalent to ~17.5kg CO₂ saved',
    badge: 'Popular'
  },
  {
    id: 'rew-guide',
    title: 'Free Certified Guide Excursion',
    cost: 800,
    category: 'Experience Upgrade',
    description: 'Free 1-on-1 certified local guide add-on for monument tours in Agra, Varanasi, Jaipur or Lucknow.',
    impact: 'Directly supports local heritage storytellers',
    badge: 'Best Value'
  },
  {
    id: 'rew-10off',
    title: '10% Off Premium Heritage Expedition',
    cost: 1000,
    category: 'Discount Voucher',
    description: '10% flat off on any weekend or multi-day cultural package across India.',
    impact: 'Equivalent to ~35kg CO₂ saved',
    badge: 'High Value'
  },
  {
    id: 'rew-hidden',
    title: 'Unlock Secret Hidden Heritage Itinerary',
    cost: 400,
    category: 'Exclusive Access',
    description: 'Unlock uncrowded artisan alleys, hidden stepwells, and royal palace culinary guides.',
    impact: 'Disperses tourism to off-the-beaten-path crafts',
    badge: 'Exclusive'
  },
  {
    id: 'rew-badge',
    title: 'Verified Eco-Champion Digital Badge',
    cost: 250,
    category: 'Profile & Social',
    description: 'Digital certification badge for your DarShana traveler profile and social media.',
    impact: 'Inspire your travel circle',
    badge: 'Community'
  }
];

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Priya M. (Green Voyager)', points: 4250, tier: 'Forest Guardian', streak: 12 },
  { rank: 2, name: 'Ananya S. (Eco Explorer)', points: 3180, tier: 'Forest Guardian', streak: 9 },
  { rank: 3, name: 'Rohan K. (Heritage Wanderer)', points: 2840, tier: 'Tree', streak: 7 },
  { rank: 4, name: 'Kabir V. (Clean Traveler)', points: 1950, tier: 'Tree', streak: 5 },
  { rank: 5, name: 'Meera D. (Zero Carbon)', points: 1420, tier: 'Tree', streak: 4 }
];

export const EcoRewardsDashboard: React.FC = () => {
  const {
    points,
    lifetimePoints,
    tier,
    nextTier,
    nextTierThreshold,
    tierProgressPercent,
    carbonSavedKg,
    streak,
    activities,
    redeemedRewards,
    earnPoints,
    redeemReward
  } = useEcoRewards();

  const [leaderboardTab, setLeaderboardTab] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemFeedback, setRedeemFeedback] = useState<string | null>(null);

  const handleRedeem = (item: typeof REWARD_STORE_ITEMS[0]) => {
    const res = redeemReward(item.id, item.cost, item.title);
    if (res.success) {
      setRedeemFeedback(`🎉 ${res.message} Promo Code: ${res.code}`);
    } else {
      setRedeemFeedback(res.message || 'Unable to redeem');
    }
    setTimeout(() => setRedeemFeedback(null), 5000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans pb-24">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-bold">
                <Leaf size={14} className="text-emerald-400" />
                <span>Sustainable Tourism Gamification</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight">
                DarShana Eco Rewards
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Earn real rewards, unlock free tour upgrades, and level up your traveler rank by choosing low-carbon transport, verified local guides, and homestays.
              </p>
            </div>

            {/* Quick Balance Hero Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-6 text-center space-y-2 shrink-0 shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
                Available Eco Balance
              </span>
              <div className="flex items-center justify-center gap-2">
                <Leaf size={24} className="text-emerald-400 animate-pulse" />
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{points}</span>
                <span className="text-xs text-emerald-200 font-semibold">pts</span>
              </div>
              <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-emerald-200">
                <Flame size={13} className="text-amber-400" />
                <span>{streak} Eco-Choice Streak 🔥</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* 1. Level & Progress Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl shadow-sm">
                {tier === 'Sapling' && '🌱'}
                {tier === 'Sprout' && '🌿'}
                {tier === 'Tree' && '🌳'}
                {tier === 'Forest Guardian' && '👑'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 font-serif">{tier} Tier</h2>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                    Active Rank
                  </span>
                </div>
                <p className="text-xs text-slate-500">Lifetime Points Earned: <strong>{lifetimePoints} pts</strong></p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Carbon Impact</span>
                <span className="font-extrabold text-sm text-emerald-700">~{carbonSavedKg} kg CO₂</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Streak</span>
                <span className="font-extrabold text-sm text-amber-600">{streak} Trips 🔥</span>
              </div>
            </div>
          </div>

          {/* Progress Bar towards next tier */}
          {nextTier && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">Progress to {nextTier}</span>
                <span className="text-emerald-700 font-bold">{tierProgressPercent}% ({nextTierThreshold - lifetimePoints} pts to go)</span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tierProgressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Interactive Action Trigger Simulators (Earn Points Upfront) */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              Earn Eco-Points
            </span>
            <h3 className="text-lg font-bold text-slate-900">Choose Sustainable Travel Actions</h3>
            <p className="text-xs text-slate-500">Every eco decision awards instant points before you checkout.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            
            <div className="p-4 bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-2xl transition space-y-2 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md mb-1.5">
                  +75 pts · Eco Choice
                </span>
                <h4 className="font-bold text-xs text-slate-900">Choose Train/Bus over Flight</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Opt for Vande Bharat / electric trains for intra-city routes.</p>
              </div>
              <button
                onClick={() => earnPoints(75, 'Chose Electric Train over Flight', 'transport', 28.5)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
              >
                + Earn 75 Points
              </button>
            </div>

            <div className="p-4 bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-2xl transition space-y-2 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md mb-1.5">
                  +50 pts · Eco Choice
                </span>
                <h4 className="font-bold text-xs text-slate-900">Certified Heritage Homestay</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Book a certified solar-powered eco-stay instead of large luxury chains.</p>
              </div>
              <button
                onClick={() => earnPoints(50, 'Selected Certified Heritage Homestay', 'stay', 14.0)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
              >
                + Earn 50 Points
              </button>
            </div>

            <div className="p-4 bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-2xl transition space-y-2 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md mb-1.5">
                  +40 pts · Local Economy
                </span>
                <h4 className="font-bold text-xs text-slate-900">Book Verified Local Guide</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Support local community storytellers with 100% direct payouts.</p>
              </div>
              <button
                onClick={() => earnPoints(40, 'Booked Verified Local Tour Guide', 'guide', 5.2)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
              >
                + Earn 40 Points
              </button>
            </div>

            <div className="p-4 bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-2xl transition space-y-2 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md mb-1.5">
                  +15 pts · Checklist
                </span>
                <h4 className="font-bold text-xs text-slate-900">Zero-Plastic Travel Pouch</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Pledge to carry a reusable metal bottle & avoid single-use plastics.</p>
              </div>
              <button
                onClick={() => earnPoints(15, 'Pledged Zero Single-Use Plastic on Tour', 'checklist', 2.0)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
              >
                + Earn 15 Points
              </button>
            </div>

            <div className="p-4 bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-2xl transition space-y-2 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-md mb-1.5">
                  +200 pts · Master Bonus
                </span>
                <h4 className="font-bold text-xs text-slate-900">Complete Full Eco-Itinerary</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">All transport, stay, and guide picks marked as green choices.</p>
              </div>
              <button
                onClick={() => earnPoints(200, 'Completed 100% Eco-Tagged Multi-Day Itinerary', 'bonus', 65.0)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
              >
                + Earn 200 Points Bonus
              </button>
            </div>

            <div className="p-4 bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-2xl transition space-y-2 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md mb-1.5">
                  +25 pts · Community
                </span>
                <h4 className="font-bold text-xs text-slate-900">Share Eco-Travel Review</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Help fellow travelers discover clean, responsible local options.</p>
              </div>
              <button
                onClick={() => earnPoints(25, 'Published Sustainable Travel Experience Review', 'review', 1.5)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
              >
                + Earn 25 Points
              </button>
            </div>

          </div>
        </div>

        {/* 3. Redeemable Rewards Store */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Rewards Store
              </span>
              <h3 className="text-lg font-bold text-slate-900">Redeem Points for Real Value</h3>
              <p className="text-xs text-slate-500">Convert your points into booking discounts, free guide tours, and exclusive perks.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold">Your Balance: </span>
              <span className="font-extrabold text-sm text-emerald-700">{points} pts</span>
            </div>
          </div>

          {redeemFeedback && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{redeemFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REWARD_STORE_ITEMS.map((item) => {
              const canAfford = points >= item.cost;
              const needed = item.cost - points;

              return (
                <div
                  key={item.id}
                  className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-stone-300 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-stone-200 text-slate-700 text-[10px] font-bold rounded-md">
                        {item.category}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {item.cost} pts
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    
                    <div className="pt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Leaf size={11} />
                      <span>{item.impact}</span>
                    </div>
                  </div>

                  <button
                    disabled={!canAfford}
                    onClick={() => handleRedeem(item)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Gift size={14} />
                        <span>Redeem Reward</span>
                      </>
                    ) : (
                      <>
                        <Lock size={12} />
                        <span>Need {needed} more pts</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Redeemed Vouchers List */}
          {redeemedRewards.length > 0 && (
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Your Active Redeemed Promo Codes</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {redeemedRewards.map((red) => (
                  <div key={red.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{red.title}</p>
                      <p className="font-mono font-bold text-amber-900 text-sm mt-0.5">{red.code}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(red.code)}
                      className="p-1.5 bg-white border border-amber-200 rounded-lg text-slate-700 hover:text-amber-800 transition"
                      title="Copy coupon code"
                    >
                      {copiedCode === red.code ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Leaderboard & Eco Community */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Leaderboard */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Award size={18} className="text-amber-500" />
                  <span>Eco-Traveler Leaderboard</span>
                </h3>
                <p className="text-xs text-slate-500">Top responsible travelers saving carbon across India.</p>
              </div>

              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setLeaderboardTab('weekly')}
                  className={`px-2.5 py-1 rounded-lg transition ${leaderboardTab === 'weekly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setLeaderboardTab('monthly')}
                  className={`px-2.5 py-1 rounded-lg transition ${leaderboardTab === 'monthly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'}`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {LEADERBOARD_DATA.map((lead) => (
                <div
                  key={lead.rank}
                  className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      lead.rank === 1 ? 'bg-amber-400 text-slate-950' : lead.rank === 2 ? 'bg-stone-300 text-slate-800' : lead.rank === 3 ? 'bg-amber-700 text-white' : 'bg-stone-200 text-slate-600'
                    }`}>
                      {lead.rank}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{lead.name}</p>
                      <span className="text-[10px] text-slate-500">{lead.tier} • {lead.streak} streak 🔥</span>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-emerald-700">{lead.points} pts</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 flex items-center justify-between font-medium">
              <span>Your Standing: <strong>You're #14 this week!</strong></span>
              <span className="font-bold">{points} pts</span>
            </div>
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-700" />
              <span>Recent Activity History</span>
            </h3>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {activities.slice(0, 8).map((act) => (
                <div key={act.id} className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 truncate max-w-[180px]">{act.action}</p>
                    <span className="font-bold text-emerald-700 shrink-0">+{act.points} pts</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Saved ~{act.carbonSavedKg}kg CO₂</span>
                    <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default EcoRewardsDashboard;
