import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AllCities: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <section className="bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-blue-600">Explore Cities</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Handpicked destinations across India</h2>
          <p className="text-slate-600">Search by city or filter by region/popularity to jump into curated overviews.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              placeholder="Search city, vibe, or keyword"
              className="w-full rounded-full border border-slate-200 bg-white px-11 py-3 text-sm shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 rounded-full text-sm font-semibold transition-all border bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md border-transparent">
              All
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold transition-all border bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:-translate-y-0.5">
              Popular
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold transition-all border bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:-translate-y-0.5">
              North
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold transition-all border bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:-translate-y-0.5">
              South
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold transition-all border bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:-translate-y-0.5">
              East
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold transition-all border bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:-translate-y-0.5">
              West
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-48 overflow-hidden">
              <img
                alt="Lucknow"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="data:image/jpeg;base64,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"
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">Popular</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">north India</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Lucknow</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Tehzeeb, timeless heritage, and legendary Awadhi cuisine.</p>
              <div className="flex justify-between items-center pt-2">
                <Link
                  className="text-blue-700 font-semibold text-sm inline-flex items-center gap-1 hover:text-blue-900"
                  to="/city/lucknow"
                >
                  Explore Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
                <span className="text-xs text-slate-500">Curated by DarShana</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-48 overflow-hidden">
              <img
                alt="Jaipur"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">Popular</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">north India</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Jaipur</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Palaces, bazaars, and sunsets over Amber Fort.</p>
              <div className="flex justify-between items-center pt-2">
                <a
                  className="text-blue-700 font-semibold text-sm inline-flex items-center gap-1 hover:text-blue-900"
                  href="#/cities"
                  data-discover="true"
                >
                  Explore Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
                <span className="text-xs text-slate-500">Curated by DarShana</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-48 overflow-hidden">
              <img
                alt="Kochi"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">south India</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Kochi</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Backwaters, Chinese fishing nets, and art district walks.</p>
              <div className="flex justify-between items-center pt-2">
                <a
                  className="text-blue-700 font-semibold text-sm inline-flex items-center gap-1 hover:text-blue-900"
                  href="#/cities"
                  data-discover="true"
                >
                  Explore Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
                <span className="text-xs text-slate-500">Curated by DarShana</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-48 overflow-hidden">
              <img
                alt="Mumbai"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQze_xHKXmhC8wTi6iJ6PFz5ABJphFH5WW3AA&s"
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">Popular</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">west India</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Mumbai</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Sea breeze, cinema, and street food under the lights.</p>
              <div className="flex justify-between items-center pt-2">
                <a
                  className="text-blue-700 font-semibold text-sm inline-flex items-center gap-1 hover:text-blue-900"
                  href="#/cities"
                  data-discover="true"
                >
                  Explore Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
                <span className="text-xs text-slate-500">Curated by DarShana</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-48 overflow-hidden">
              <img
                alt="Shillong"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">east India</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Shillong</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Cloud-kissed hills, music cafes, and living root bridges nearby.</p>
              <div className="flex justify-between items-center pt-2">
                <a
                  className="text-blue-700 font-semibold text-sm inline-flex items-center gap-1 hover:text-blue-900"
                  href="#/cities"
                  data-discover="true"
                >
                  Explore Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
                <span className="text-xs text-slate-500">Curated by DarShana</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-48 overflow-hidden">
              <img
                alt="Varanasi"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">Popular</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">east India</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Varanasi</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Ghat rituals at dawn and lanes filled with silk and lassi.</p>
              <div className="flex justify-between items-center pt-2">
                <a
                  className="text-blue-700 font-semibold text-sm inline-flex items-center gap-1 hover:text-blue-900"
                  href="#/cities"
                  data-discover="true"
                >
                  Explore Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
                <span className="text-xs text-slate-500">Curated by DarShana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllCities;