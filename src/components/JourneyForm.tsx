import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Search, Sparkles } from 'lucide-react';

interface JourneyFormProps {
  onSearch?: (data: {
    from: string;
    to: string;
    date: string;
    passengers: number;
  }) => void;
}

const JourneyForm: React.FC<JourneyFormProps> = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ from, to, date, passengers });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-4xl mx-auto"
    >
      <div className="relative bg-white border border-slate-100 rounded-3xl shadow-xl p-8 md:p-12">
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-[#06b6d4] text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Plan your journey smarter
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Plan Your Journey</h2>
            <p className="text-slate-500 text-lg mt-2">Discover the perfect way to travel</p>
          </motion.div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* From Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="group"
            >
              <label className="block text-xs font-semibold text-slate-500 mb-2 tracking-[0.25em]">
                FROM
              </label>
              <div className="relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm focus-within:border-[#06b6d4] focus-within:shadow-cyan-100 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <MapPin className="h-5 w-5 text-[#06b6d4]" />
                    <div className="absolute inset-0 bg-cyan-50 rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Departure city"
                    className="w-full bg-transparent text-[#0f172a] placeholder-slate-400 focus:outline-none text-lg font-medium"
                  />
                </div>
              </div>
            </motion.div>

            {/* To Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="group"
            >
              <label className="block text-xs font-semibold text-slate-500 mb-2 tracking-[0.25em]">
                TO
              </label>
              <div className="relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm focus-within:border-[#06b6d4] focus-within:shadow-cyan-100 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <MapPin className="h-5 w-5 text-[#06b6d4]" />
                    <div className="absolute inset-0 bg-cyan-50 rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Destination city"
                    className="w-full bg-transparent text-[#0f172a] placeholder-slate-400 focus:outline-none text-lg font-medium"
                  />
                </div>
              </div>
            </motion.div>

            {/* Date Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="group"
            >
              <label className="block text-xs font-semibold text-slate-500 mb-2 tracking-[0.25em]">
                DATE
              </label>
              <div className="relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm focus-within:border-[#06b6d4] focus-within:shadow-cyan-100 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Calendar className="h-5 w-5 text-[#06b6d4]" />
                    <div className="absolute inset-0 bg-cyan-50 rounded-full"></div>
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-[#0f172a] focus:outline-none text-lg font-medium [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>

            {/* Passengers Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="group"
            >
              <label className="block text-xs font-semibold text-slate-500 mb-2 tracking-[0.25em]">
                PASSENGERS
              </label>
              <div className="relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm focus-within:border-[#06b6d4] focus-within:shadow-cyan-100 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Users className="h-5 w-5 text-[#06b6d4]" />
                    <div className="absolute inset-0 bg-cyan-50 rounded-full"></div>
                  </div>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    className="w-full bg-transparent text-[#0f172a] focus:outline-none text-lg font-medium appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option
                        key={num}
                        value={num}
                        className="text-[#0f172a]"
                      >
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSearch}
              className="group relative px-10 py-4 rounded-2xl text-white font-semibold text-lg bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] shadow-lg shadow-cyan-200"
            >
              <div className="relative z-10 flex items-center gap-3">
                <Search className="h-5 w-5" />
                <span>Search Journeys</span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default JourneyForm;