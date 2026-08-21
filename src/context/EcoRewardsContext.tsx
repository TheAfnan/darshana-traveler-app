import React, { createContext, useContext, useState, useEffect } from 'react';
import { triggerConfetti } from '../utils/confetti';

export type EcoTier = 'Sapling' | 'Sprout' | 'Tree' | 'Forest Guardian';

export interface EcoActivity {
  id: string;
  action: string;
  points: number;
  carbonSavedKg: number;
  timestamp: string;
  category: 'stay' | 'transport' | 'guide' | 'checklist' | 'bonus' | 'review';
}

export interface RedeemedReward {
  id: string;
  rewardId: string;
  title: string;
  code: string;
  cost: number;
  redeemedAt: string;
}

interface EcoRewardsContextType {
  points: number;
  lifetimePoints: number;
  tier: EcoTier;
  nextTier: EcoTier | null;
  nextTierThreshold: number;
  tierProgressPercent: number;
  carbonSavedKg: number;
  streak: number;
  activities: EcoActivity[];
  redeemedRewards: RedeemedReward[];
  recentEarnedToast: { points: number; reason: string } | null;
  levelUpModalData: { newTier: EcoTier; rewardName: string } | null;
  earnPoints: (amount: number, reason: string, category?: EcoActivity['category'], carbonKg?: number) => void;
  redeemReward: (rewardId: string, cost: number, title: string) => { success: boolean; code?: string; message?: string };
  dismissLevelUpModal: () => void;
  dismissToast: () => void;
}

const TIER_THRESHOLDS = {
  'Sapling': 0,
  'Sprout': 300,
  'Tree': 1000,
  'Forest Guardian': 3000
};

const getTierFromPoints = (pts: number): EcoTier => {
  if (pts >= 3000) return 'Forest Guardian';
  if (pts >= 1000) return 'Tree';
  if (pts >= 300) return 'Sprout';
  return 'Sapling';
};

const getNextTier = (tier: EcoTier): { next: EcoTier | null; threshold: number } => {
  if (tier === 'Sapling') return { next: 'Sprout', threshold: 300 };
  if (tier === 'Sprout') return { next: 'Tree', threshold: 1000 };
  if (tier === 'Tree') return { next: 'Forest Guardian', threshold: 3000 };
  return { next: null, threshold: 3000 };
};

const EcoRewardsContext = createContext<EcoRewardsContextType | undefined>(undefined);

export const EcoRewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('darshana_eco_points');
    return saved !== null ? parseInt(saved, 10) : 620;
  });

  const [lifetimePoints, setLifetimePoints] = useState<number>(() => {
    const saved = localStorage.getItem('darshana_eco_lifetime');
    return saved !== null ? parseInt(saved, 10) : 840;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('darshana_eco_streak');
    return saved !== null ? parseInt(saved, 10) : 3;
  });

  const [activities, setActivities] = useState<EcoActivity[]>(() => {
    const saved = localStorage.getItem('darshana_eco_activities');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'act-1',
        action: 'Chose Vande Bharat Express train over flight',
        points: 75,
        carbonSavedKg: 28.5,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        category: 'transport'
      },
      {
        id: 'act-2',
        action: 'Stayed at certified heritage homestay in Jaipur',
        points: 50,
        carbonSavedKg: 12.0,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        category: 'stay'
      },
      {
        id: 'act-3',
        action: 'Booked verified local walking guide (supporting local community)',
        points: 40,
        carbonSavedKg: 5.4,
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        category: 'guide'
      }
    ];
  });

  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>(() => {
    const saved = localStorage.getItem('darshana_eco_redeemed');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  const [recentEarnedToast, setRecentEarnedToast] = useState<{ points: number; reason: string } | null>(null);
  const [levelUpModalData, setLevelUpModalData] = useState<{ newTier: EcoTier; rewardName: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('darshana_eco_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('darshana_eco_lifetime', lifetimePoints.toString());
  }, [lifetimePoints]);

  useEffect(() => {
    localStorage.setItem('darshana_eco_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('darshana_eco_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('darshana_eco_redeemed', JSON.stringify(redeemedRewards));
  }, [redeemedRewards]);

  const tier = getTierFromPoints(lifetimePoints);
  const { next: nextTier, threshold: nextTierThreshold } = getNextTier(tier);
  const prevTierThreshold = TIER_THRESHOLDS[tier];
  
  const tierProgressPercent = nextTier
    ? Math.min(100, Math.max(0, Math.round(((lifetimePoints - prevTierThreshold) / (nextTierThreshold - prevTierThreshold)) * 100)))
    : 100;

  const carbonSavedKg = Math.round((lifetimePoints * 0.35) * 10) / 10;

  const earnPoints = (amount: number, reason: string, category: EcoActivity['category'] = 'bonus', carbonKg?: number) => {
    const calcCarbon = carbonKg || Math.round((amount * 0.35) * 10) / 10;
    
    const prevLifetime = lifetimePoints;
    const nextLifetime = prevLifetime + amount;
    const prevTier = getTierFromPoints(prevLifetime);
    const newTier = getTierFromPoints(nextLifetime);

    setPoints(prev => prev + amount);
    setLifetimePoints(nextLifetime);
    setStreak(prev => prev + 1);

    const newActivity: EcoActivity = {
      id: `act-${Date.now()}`,
      action: reason,
      points: amount,
      carbonSavedKg: calcCarbon,
      timestamp: new Date().toISOString(),
      category
    };

    setActivities(prev => [newActivity, ...prev]);

    // Visual confetti burst
    triggerConfetti({ count: 45, originY: 0.7 });

    setRecentEarnedToast({ points: amount, reason });
    setTimeout(() => {
      setRecentEarnedToast(null);
    }, 4500);

    if (newTier !== prevTier) {
      setTimeout(() => {
        triggerConfetti({ count: 90, originY: 0.4 });
        setLevelUpModalData({
          newTier,
          rewardName: `${newTier} Tier Badge & Exclusive Perks`
        });
      }, 500);
    }
  };

  const redeemReward = (rewardId: string, cost: number, title: string) => {
    if (points < cost) {
      return { success: false, message: `Need ${cost - points} more eco-points to unlock this reward.` };
    }

    const code = `ECO-${title.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setPoints(prev => prev - cost);

    const newRedemption: RedeemedReward = {
      id: `red-${Date.now()}`,
      rewardId,
      title,
      code,
      cost,
      redeemedAt: new Date().toISOString()
    };

    setRedeemedRewards(prev => [newRedemption, ...prev]);
    triggerConfetti({ count: 35, originY: 0.6 });

    return { success: true, code, message: `Successfully redeemed "${title}"!` };
  };

  const dismissLevelUpModal = () => setLevelUpModalData(null);
  const dismissToast = () => setRecentEarnedToast(null);

  return (
    <EcoRewardsContext.Provider
      value={{
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
        recentEarnedToast,
        levelUpModalData,
        earnPoints,
        redeemReward,
        dismissLevelUpModal,
        dismissToast
      }}
    >
      {children}
    </EcoRewardsContext.Provider>
  );
};

export const useEcoRewards = () => {
  const context = useContext(EcoRewardsContext);
  if (!context) {
    throw new Error('useEcoRewards must be used within an EcoRewardsProvider');
  }
  return context;
};
