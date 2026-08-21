import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Landmark, Leaf, ExternalLink } from 'lucide-react';

const GovernmentInitiatives: React.FC = () => {
  const initiatives = [
    {
      id: 1,
      title: "Digital India",
      description: "Supporting Digital India's mission with AI-powered maps, safety tools & smart recommendations.",
      icon: <Smartphone className="w-8 h-8 text-blue-500" />,
      borderColor: "border-t-blue-500",
      shadowColor: "hover:shadow-blue-100",
      link: "https://www.digitalindia.gov.in/",
      delay: 0.1
    },
    {
      id: 2,
      title: "Incredible India 2.0",
      description: "Promoting Indian tourism through culture-rich storytelling & immersive travel planning.",
      icon: <Landmark className="w-8 h-8 text-orange-500" />,
      borderColor: "border-t-orange-500",
      shadowColor: "hover:shadow-orange-100",
      link: "https://www.incredibleindia.org/",
      delay: 0.2
    },
    {
      id: 3,
      title: "Swachh Bharat Mission",
      description: "Encouraging eco-friendly & responsible travel habits for a cleaner India.",
      icon: <Leaf className="w-8 h-8 text-green-500" />,
      borderColor: "border-t-green-500",
      shadowColor: "hover:shadow-green-100",
      link: "https://swachhbharatmission.gov.in/",
      delay: 0.3
    }
  ];

  return (
    <section id="government-initiatives" className="py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Government Initiatives We Support <span className="inline-block animate-pulse">🇮🇳</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Aligned with India's vision for tourism, sustainability, and digital growth.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {initiatives.map((item) => (
            <motion.a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item.delay }}
              whileHover={{ y: -5 }}
              className={`block bg-white rounded-xl p-6 shadow-lg border-t-4 ${item.borderColor} ${item.shadowColor} transition-all duration-300 group cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                  {item.icon}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                {item.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </motion.a>
          ))}
        </div>

        {/* Footer Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default group">
            <span className="text-lg">🇮🇳</span>
            <span className="text-sm font-medium text-gray-600 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:via-blue-500 group-hover:to-green-500 transition-all duration-300">
              Designed & Developed in India
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default GovernmentInitiatives;
