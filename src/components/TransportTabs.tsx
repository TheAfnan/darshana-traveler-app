import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Train, Ship, Car, MapPin, Bus, ExternalLink, ArrowRight } from 'lucide-react';

interface TransportTabsProps {
  selectedTransport: string;
  onSelectTransport: (transport: string) => void;
}

const TransportTabs: React.FC<TransportTabsProps> = ({ selectedTransport, onSelectTransport }) => {
  const transports = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'train', label: 'Train', icon: Train },
    { id: 'bus', label: 'Bus', icon: Bus },
    { id: 'car', label: 'Self Drive', icon: Car },
    { id: 'taxi', label: 'Cabs', icon: MapPin },
    { id: 'cruise', label: 'Cruise', icon: Ship },
  ];

  const providers: Record<string, Array<{ name: string; url: string; desc: string; color: string }>> = {
    flights: [
      { name: 'Indigo', url: 'https://www.goindigo.in/', desc: 'India\'s coolest airline', color: 'from-blue-600 to-blue-800' },
      { name: 'MakeMyTrip', url: 'https://www.makemytrip.com/flights/', desc: 'Best flight deals', color: 'from-red-500 to-red-700' },
      { name: 'Skyscanner', url: 'https://www.skyscanner.co.in/', desc: 'Compare cheap flights', color: 'from-sky-400 to-sky-600' },
      { name: 'Air India', url: 'https://www.airindia.com/', desc: 'The flag carrier', color: 'from-orange-600 to-red-600' },
    ],
    train: [
      { name: 'IRCTC', url: 'https://www.irctc.co.in/', desc: 'Official railway booking', color: 'from-blue-700 to-blue-900' },
      { name: 'ConfirmTkt', url: 'https://www.confirmtkt.com/', desc: 'Predict confirm chances', color: 'from-green-500 to-green-700' },
      { name: 'RailYatri', url: 'https://www.railyatri.in/', desc: 'Train status & booking', color: 'from-orange-400 to-orange-600' },
      { name: 'Ixigo', url: 'https://www.ixigo.com/trains', desc: 'Zero cancellation fee', color: 'from-indigo-500 to-indigo-700' },
    ],
    bus: [
      { name: 'RedBus', url: 'https://www.redbus.in/', desc: 'World\'s largest bus platform', color: 'from-red-600 to-red-800' },
      { name: 'AbhiBus', url: 'https://www.abhibus.com/', desc: 'Fastest bus booking', color: 'from-red-500 to-pink-600' },
      { name: 'Zingbus', url: 'https://www.zingbus.com/', desc: 'Premium AC buses', color: 'from-orange-500 to-orange-700' },
      { name: 'Intrcity', url: 'https://www.intrcity.com/', desc: 'SmartBus for safe travel', color: 'from-blue-500 to-blue-700' },
    ],
    car: [
      { name: 'ZoomCar', url: 'https://www.zoomcar.com/', desc: 'Self-drive car rental', color: 'from-green-600 to-green-800' },
      { name: 'Revv', url: 'https://www.revv.co.in/', desc: 'Sanitized cars for rent', color: 'from-blue-500 to-cyan-600' },
      { name: 'MyChoize', url: 'https://www.mychoize.com/', desc: 'Self drive cars', color: 'from-red-500 to-orange-600' },
    ],
    taxi: [
      { name: 'Ola', url: 'https://www.olacabs.com/', desc: 'Book rides locally', color: 'from-yellow-400 to-yellow-600' },
      { name: 'Uber', url: 'https://www.uber.com/in/en/', desc: 'Global ride sharing', color: 'from-gray-700 to-black' },
      { name: 'Rapido', url: 'https://www.rapido.bike/', desc: 'Bike & Auto taxis', color: 'from-yellow-500 to-orange-500' },
      { name: 'Savaari', url: 'https://www.savaari.com/', desc: 'Outstation cabs', color: 'from-teal-500 to-teal-700' },
    ],
    cruise: [
      { name: 'Cordelia', url: 'https://www.cordeliacruises.com/', desc: 'India\'s premium cruise', color: 'from-blue-800 to-indigo-900' },
      { name: 'Tirun', url: 'https://www.tirun.com/', desc: 'Royal Caribbean partner', color: 'from-cyan-600 to-blue-700' },
    ]
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {transports.map((transport, index) => (
          <motion.button
            key={transport.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            whileHover={{
              y: -4,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectTransport(transport.id)}
            className={`relative group px-6 py-4 rounded-2xl border transition-all duration-200 bg-white/80 backdrop-blur-sm ${
              selectedTransport === transport.id
                ? 'border-[#06b6d4] shadow-lg shadow-cyan-100 text-[#0f172a]'
                : 'border-slate-200 text-slate-600 hover:border-[#06b6d4]/60'
            }`}
          >
            {/* 3D Floating Effect */}
            <div className="relative z-10 flex flex-col items-center space-y-3">
              <motion.div
                animate={selectedTransport === transport.id ? {
                  y: [0, -3, 0],
                  rotate: [0, 5, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <transport.icon
                  size={28}
                  className={`transition-all duration-300 ${
                    selectedTransport === transport.id
                      ? 'text-[#06b6d4] drop-shadow-sm'
                      : 'text-slate-500 group-hover:text-[#06b6d4]'
                  }`}
                />

                {/* Icon Glow */}
                {selectedTransport === transport.id && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-cyan-100 rounded-full blur-sm"
                  />
                )}
              </motion.div>

              <span className={`text-sm font-semibold transition-all duration-300 ${
                selectedTransport === transport.id
                  ? 'text-[#0f172a]'
                  : 'text-slate-500 group-hover:text-[#0f172a]'
              }`}>
                {transport.label}
              </span>
            </div>

            {/* Active underline */}
            {selectedTransport === transport.id && (
              <motion.div
                layoutId="activeTransport"
                className="absolute inset-x-6 bottom-2 h-0.5 rounded-full bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9]"
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Providers Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTransport}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {providers[selectedTransport]?.map((provider, idx) => (
            <motion.a
              key={provider.name}
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${provider.color}`} />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {provider.name[0]}
                  </div>
                  <ExternalLink size={18} className="text-slate-400 group-hover:text-[#06b6d4] transition-colors" />
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-[#06b6d4] transition-colors">
                  {provider.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  {provider.desc}
                </p>

                <div className="flex items-center text-sm font-semibold text-[#06b6d4] group-hover:translate-x-2 transition-transform">
                  Book Now <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
              
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.a>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TransportTabs;