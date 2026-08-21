import React from 'react';
import { components } from '../config/designSystem';

/**
 * UI Style Guide Component
 * Shows all consistent design patterns used across DarShana
 */

const UIStyleGuide: React.FC = () => {
  return (
    <div className={`${components.container} py-16`}>
      <h1 className={components.sectionTitle}>DarShana UI Style Guide</h1>
      <p className={components.sectionSubtitle}>
        Consistent design patterns across the application
      </p>

      {/* Buttons */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition shadow-md">
            Primary CTA
          </button>
          <button className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-full font-semibold transition shadow-md">
            Secondary Action
          </button>
          <button className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full font-semibold transition">
            Outline Button
          </button>
          <button className="text-gray-700 hover:text-orange-600 hover:bg-gray-50 px-6 py-3 rounded-md transition">
            Ghost Button
          </button>
        </div>
      </section>

      {/* Cards */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-stone-200 p-6">
            <h3 className="font-bold text-stone-800 mb-2">Default Card</h3>
            <p className="text-stone-600 text-sm">Standard card with shadow and border</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-stone-100 p-6">
            <h3 className="font-bold text-stone-800 mb-2">Elevated Card</h3>
            <p className="text-stone-600 text-sm">Higher elevation for featured content</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white">
            <h3 className="font-bold mb-2">Glass Card</h3>
            <p className="text-white/80 text-sm">Modern glassmorphism effect</p>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
            Primary Badge
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
            Secondary Badge
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            Success Badge
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            Error Badge
          </span>
        </div>
      </section>

      {/* Colors */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-full h-24 bg-orange-600 rounded-lg mb-2 shadow"></div>
            <span className="text-xs font-semibold text-center">Orange Primary</span>
            <span className="text-xs text-stone-500">#EA580C</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-24 bg-teal-700 rounded-lg mb-2 shadow"></div>
            <span className="text-xs font-semibold text-center">Teal Secondary</span>
            <span className="text-xs text-stone-500">#0D7377</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-24 bg-blue-900 rounded-lg mb-2 shadow"></div>
            <span className="text-xs font-semibold text-center">Deep Blue</span>
            <span className="text-xs text-stone-500">#001F3F</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-24 bg-purple-800 rounded-lg mb-2 shadow"></div>
            <span className="text-xs font-semibold text-center">Purple</span>
            <span className="text-xs text-stone-500">#6B21A8</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-24 bg-stone-800 rounded-lg mb-2 shadow"></div>
            <span className="text-xs font-semibold text-center">Stone Dark</span>
            <span className="text-xs text-stone-500">#1E293B</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-24 bg-stone-100 rounded-lg mb-2 shadow border"></div>
            <span className="text-xs font-semibold text-center">Stone Light</span>
            <span className="text-xs text-stone-500">#F1F5F9</span>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Typography</h2>
        <div className="space-y-4">
          <div>
            <p className="text-5xl font-serif font-bold text-stone-800">Heading 1 (H1)</p>
            <p className="text-xs text-stone-500 mt-1">Font Serif, Bold, 3rem</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-stone-800">Heading 2 (H2)</p>
            <p className="text-xs text-stone-500 mt-1">Font Sans, Bold, 1.875rem</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-stone-800">Body Large - Semibold</p>
            <p className="text-xs text-stone-500 mt-1">Font Sans, Semibold, 1.125rem</p>
          </div>
          <div>
            <p className="text-base text-stone-700">Body Regular</p>
            <p className="text-xs text-stone-500 mt-1">Font Sans, Normal, 1rem</p>
          </div>
          <div>
            <p className="text-sm text-stone-600">Body Small</p>
            <p className="text-xs text-stone-500 mt-1">Font Sans, Normal, 0.875rem</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Label / Caption</p>
            <p className="text-xs text-stone-500 mt-1">Font Sans, Semibold, 0.75rem, Uppercase, Tracked</p>
          </div>
        </div>
      </section>

      {/* Forms */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Form Elements</h2>
        <div className="max-w-md space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-2">
              Text Input
            </label>
            <input
              type="text"
              placeholder="Enter text..."
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-2">
              Select
            </label>
            <select className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition">
              <option>Choose an option</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-sm text-stone-700">Checkbox option</span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UIStyleGuide;
