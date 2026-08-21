import React from "react";

export type HighlightSlide = {
  id: string;
  title: string;
  description: string;
  badge: string;
  type: string;
  link?: string;
  color: string;
  lat?: number;
  lon?: number;
};

type Props = {
  slides: HighlightSlide[];
  intervalMs?: number;
};

const HighlightSlideBar: React.FC<Props> = ({ slides, intervalMs = 6500 }) => {
  const [index, setIndex] = React.useState(0);
  const active = slides[index] ?? slides[0];

  React.useEffect(() => {
    if (!slides.length) return undefined;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides, intervalMs]);

  if (!slides.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Highlight slide bar</p>
          <h3 className="text-xl font-semibold text-slate-900">Festivals, history, culture, places, events</h3>
        </div>
        <p className="text-xs text-slate-500">Slide {index} / {slides.length - 1}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setIndex(idx)}
            className={`min-w-[180px] rounded-xl border px-3 py-2 text-left transition-all shadow-sm ${idx === index ? "border-slate-900 bg-slate-900 text-white shadow" : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"}`}
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
              <span>{slide.badge}</span>
              <span className="text-[11px]">{idx}</span>
            </div>
            <p className="text-sm font-semibold leading-snug mt-1">{slide.title}</p>
            <p className="text-xs mt-1 text-slate-500">{slide.type}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Active highlight</p>
          <h4 className="text-2xl font-bold text-slate-900">{active.title}</h4>
          <p className="text-sm text-slate-700 leading-relaxed">{active.description}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">{active.badge}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">{active.type}</span>
            {typeof active.lat === "number" && typeof active.lon === "number" && (
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">{active.lat.toFixed(3)}, {active.lon.toFixed(3)}</span>
            )}
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Actions</p>
          <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
            <li>Slides auto-advance; click any chip to pause and jump.</li>
            <li>Use the active card to brief guides or link to media buckets.</li>
            {active.link && (
              <li>
                <a className="text-teal-700 font-semibold hover:underline" href={active.link}>
                  Open related results
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HighlightSlideBar;
