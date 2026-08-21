import React, { useState } from 'react';
import { 
  Leaf, 
  TrendingDown, 
  Clock, 
  Route, 
  Zap,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Car,
  Train,
  Bus,
  Plane,
  Check
} from 'lucide-react';
import type { RouteResult, RouteMode } from '../../types/greenRoute';
import { getEcoTip } from '../../types/greenRoute';

interface RouteResultCardProps {
  result: RouteResult;
  onSaveRoute?: () => void;
}

const modeIcons: Record<RouteMode, React.ElementType> = {
  car: Car,
  bus: Bus,
  train: Train,
  flight: Plane,
};

const modeColors: Record<RouteMode, { bg: string; text: string; bar: string }> = {
  train: { bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  bus: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
  car: { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' },
  flight: { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' },
};

const RouteResultCard: React.FC<RouteResultCardProps> = ({ result, onSaveRoute }) => {
  const [showComparison, setShowComparison] = useState(false);
  const [saved, setSaved] = useState(false);

  const ecoTip = getEcoTip(result.mode, result.distanceKm);
  const Icon = modeIcons[result.mode];
  const colors = modeColors[result.mode];

  const handleSave = () => {
    setSaved(true);
    onSaveRoute?.();
    setTimeout(() => setSaved(false), 2000);
  };

  // Find the greenest alternative
  const greenestAlt = result.alternatives.reduce((best, current) => 
    current.greenScore > best.greenScore ? current : best
  );

  const showGreenAlt = result.mode !== greenestAlt.mode;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
      {/* Result Header */}
      <div className={`px-6 py-4 ${colors.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${colors.bg} border-2 border-white/50 flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <p className="text-sm text-slate-600">Route calculated</p>
              <p className={`font-bold ${colors.text}`}>
                {result.originLabel} → {result.destinationLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-all ${
                saved 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/80 text-slate-600 hover:bg-white'
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button className="p-2 rounded-lg bg-white/80 text-slate-600 hover:bg-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <Route className="w-5 h-5 text-slate-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-800">{result.distanceKm}</p>
            <p className="text-xs text-slate-500">km distance</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <Clock className="w-5 h-5 text-slate-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-800">{result.duration}</p>
            <p className="text-xs text-slate-500">travel time</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <TrendingDown className="w-5 h-5 text-slate-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-800">{result.emissionsKg}</p>
            <p className="text-xs text-slate-500">kg CO₂</p>
          </div>
        </div>

        {/* Green Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-700">Green Score</span>
            </div>
            <span className={`text-lg font-bold ${
              result.greenScore >= 80 ? 'text-emerald-600' :
              result.greenScore >= 50 ? 'text-orange-500' : 'text-red-500'
            }`}>
              {result.greenScore}/100
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                result.greenScore >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                result.greenScore >= 50 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 
                'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{ width: `${result.greenScore}%` }}
            />
          </div>
        </div>

        {/* Eco Tip */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700">{ecoTip}</p>
          </div>
        </div>

        {/* Greener Alternative Suggestion */}
        {showGreenAlt && (
          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                {React.createElement(modeIcons[greenestAlt.mode], { 
                  className: 'w-5 h-5 text-white' 
                })}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-emerald-800">
                  Consider {greenestAlt.mode} instead
                </p>
                <p className="text-sm text-emerald-600">
                  Save {Math.round(result.emissionsKg - greenestAlt.emissionsKg)} kg CO₂ 
                  ({greenestAlt.savingsPercent}% less emissions)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compare Modes Toggle */}
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <span className="font-medium text-slate-700">Compare all transport modes</span>
          {showComparison ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {/* Mode Comparison Chart */}
        {showComparison && (
          <div className="space-y-3 animate-fade-in">
            {result.alternatives
              .sort((a, b) => a.emissionsKg - b.emissionsKg)
              .map((alt) => {
                const AltIcon = modeIcons[alt.mode];
                const altColors = modeColors[alt.mode];
                const maxEmissions = Math.max(...result.alternatives.map(a => a.emissionsKg));
                const barWidth = (alt.emissionsKg / maxEmissions) * 100;
                const isSelected = alt.mode === result.mode;

                return (
                  <div 
                    key={alt.mode}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? `${altColors.bg} border-current ${altColors.text}` 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <AltIcon className={`w-5 h-5 ${isSelected ? altColors.text : 'text-slate-500'}`} />
                      <span className={`font-medium capitalize ${isSelected ? altColors.text : 'text-slate-700'}`}>
                        {alt.mode}
                      </span>
                      <span className="text-sm text-slate-500 ml-auto">{alt.duration}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${altColors.bar}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-20 text-right">
                        {alt.emissionsKg} kg
                      </span>
                    </div>
                    {alt.savingsPercent && alt.savingsPercent > 0 && (
                      <p className="text-xs text-emerald-600 mt-1">
                        ↓ {alt.savingsPercent}% less emissions
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all">
            View Alternatives
          </button>
          <button className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all">
            Book This Route
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteResultCard;
