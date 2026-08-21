import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Heart, Map, Phone, Lock, Eye, Battery, Signal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SafetyGuide: React.FC = () => {
  const features = [
    {
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      title: "Emergency SOS",
      description: "One-tap emergency response system that instantly alerts authorities and your trusted contacts.",
      usage: [
        "Tap the big red SOS button in the Safety Dashboard.",
        "A 5-second countdown will begin (to prevent accidental triggers).",
        "Once activated, it calls 112 and shares your live location via SMS/WhatsApp."
      ]
    },
    {
      icon: <Eye className="w-8 h-8 text-blue-500" />,
      title: "Live Location Tracking",
      description: "Share your real-time location with friends and family so they can watch over you.",
      usage: [
        "Click 'Share Location' in the Women Safety tab.",
        "Copy the unique tracking link or share directly via WhatsApp.",
        "Your contacts can see your movement on a map in real-time."
      ]
    },
    {
      icon: <Phone className="w-8 h-8 text-purple-500" />,
      title: "Fake Call Simulator",
      description: "Escape uncomfortable situations by triggering a realistic fake incoming call.",
      usage: [
        "Tap the 'Fake Call' button.",
        "Your phone will ring like a normal call.",
        "Pick up and pretend to talk to excuse yourself from the situation."
      ]
    },
    {
      icon: <Map className="w-8 h-8 text-green-500" />,
      title: "Offline Wilderness Maps",
      description: "Navigate safely even without internet in remote areas like forests or mountains.",
      usage: [
        "Go to the 'Forest Safety' tab.",
        "View your GPS location on the offline-ready map.",
        "Check your compass heading and altitude."
      ]
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Medical ID & Assistance",
      description: "Quick access to your critical medical info and nearby healthcare facilities.",
      usage: [
        "Set up your Medical ID in the 'Medical Safety' tab.",
        "In an emergency, first responders can view your blood group and allergies.",
        "Use 'Find Hospital' to locate the nearest emergency room."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-6"
          >
            <Shield className="w-12 h-12 text-red-600" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Your Safety is Our Priority
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            DarShana Travel provides a comprehensive suite of safety tools designed to keep you secure wherever you go. Here's how to use them.
          </p>
        </div>

        {/* Quick Access Banner */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl mb-16 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h2 className="text-2xl font-bold mb-2">Need Help Right Now?</h2>
            <p className="text-gray-300">Access the Safety Dashboard for immediate emergency tools.</p>
          </div>
          <Link 
            to="/safety"
            className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-lg flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-red-900/50"
          >
            <AlertTriangle className="w-6 h-6" />
            Open Safety Dashboard
          </Link>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">How to use:</h4>
                <ul className="space-y-2">
                  {feature.usage.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Safety Tips Section */}
        <div className="mt-16 bg-teal-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-teal-900 mb-8 text-center">General Safety Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Battery className="w-8 h-8 text-teal-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Keep Battery Charged</h3>
              <p className="text-sm text-gray-600">Always carry a power bank. GPS and emergency features consume battery.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Signal className="w-8 h-8 text-teal-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Download Offline Maps</h3>
              <p className="text-sm text-gray-600">Network coverage can be spotty in remote areas. Be prepared.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Lock className="w-8 h-8 text-teal-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Share Itinerary</h3>
              <p className="text-sm text-gray-600">Let trusted contacts know your travel plans and expected return time.</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <Link 
            to="/safety" 
            className="inline-flex items-center gap-2 text-teal-600 font-bold hover:text-teal-700 text-lg"
          >
            Go to Safety Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SafetyGuide;
