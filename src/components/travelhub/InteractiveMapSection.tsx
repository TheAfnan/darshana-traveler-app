const mapEmbedUrl = 'https://www.google.com/maps/d/embed?mid=1HcJQy_RouteShowcase&region=in';

const hotspots = [
  { id: 'kutch', name: 'Great Rann of Kutch', detail: 'Salt desert sunsets & craft villages', coord: '23.7337° N, 68.5400° E' },
  { id: 'hampi', name: 'Hampi', detail: 'UNESCO ruins, boulder hikes, coracle rides', coord: '15.3350° N, 76.4600° E' },
  { id: 'kaziranga', name: 'Kaziranga', detail: 'One-horned rhino safaris & riverine islands', coord: '26.5775° N, 93.1711° E' },
];

const InteractiveMapSection = () => (
  <section id="map" className="pt-16">
    <div className="text-center space-y-3">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Interactive map</p>
      <h2 className="text-3xl font-semibold text-[#0f172a]">Explore India on hover</h2>
      <p className="text-slate-500">Integrate Mapbox/Leaflet for live hover interactions focused on Indian states. Placeholder below shows Google My Maps.</p>
    </div>

    <div className="mt-10 grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <iframe
          title="TravelHub Destinations Map"
          src={mapEmbedUrl}
          className="h-[420px] w-full"
          loading="lazy"
        />
      </div>
      <div className="space-y-4">
        {hotspots.map((spot) => (
          <div key={spot.id} className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="text-sm uppercase text-slate-400">{spot.coord}</p>
            <p className="text-xl font-semibold text-[#0f172a]">{spot.name}</p>
            <p className="text-sm text-slate-500">{spot.detail}</p>
            <button className="mt-3 text-[#06b6d4] font-semibold text-sm">Open details →</button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default InteractiveMapSection;
