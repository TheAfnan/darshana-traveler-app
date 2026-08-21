import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Compass, Landmark, MapPin, Mountain, Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 0,
    title: "Explore India",
    subtitle: "Discover the timeless beauty and heritage of the subcontinent.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop", // Taj Mahal
    ctaLink: "/travelhub",
    ctaText: "Start Exploring",
    icon: MapPin,
    color: "from-orange-500 to-amber-500"
  },
  {
    id: 1,
    title: "Experience India Beyond Destinations",
    subtitle: "Proudly supporting Dekho Apna Desh & Digital India missions.",
    image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2076&auto=format&fit=crop",
    ctaLink: "#government-initiatives",
    ctaText: "View Initiatives",
    icon: Landmark,
    color: "from-orange-600 to-green-600"
  },
  {
  id: 2,
  title: "Welcome to Lucknow – The City of Nawabs",
  subtitle: "Experience Tehzeeb, timeless heritage, and the soul of Awadh.",
  image:
  "https://media.istockphoto.com/id/2167395972/photo/lucknow-uttar-pradesh-india-19-june-2022-rumi-darwaza-gate-in-islamic-architecture-built-by.jpg?s=612x612&w=0&k=20&c=AfV0BcNrODmU4uyd63gp_kQfYB66QOUkASN9YXvzufE=",
  ctaLink: "#government-initiatives",
  ctaText: "Explore Initiatives",
  icon: Landmark,
  color: "from-orange-600 to-green-600",
  },
  {
    id: 3,
    title: "Festivals of India",
    subtitle: "Experience the vibrant colors, lights, and traditions.",
    image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=1974&auto=format&fit=crop", // Holi/Colors
    ctaLink: "/festivals",
    ctaText: "See Festivals",
    icon: Calendar,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 4,
    title: "Spiritual Journeys",
    subtitle: "Find inner peace in sacred spaces and ancient temples.",
    image: "https://tripcosmos.co/wp-content/uploads/2025/06/v5-1024x605.jpg.webp", // Varanasi
    ctaLink: "/mood",
    ctaText: "Find My Vibe",
    icon: Sparkles,
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: 5,
    title: "Travel Inspiration",
    subtitle: "Curated itineraries for your next unforgettable adventure.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop", // Scenic
    ctaLink: "/guides",
    ctaText: "Get Inspired",
    icon: Compass,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 6,
    title: "Nature & Adventure",
    subtitle: "From the majestic Himalayas to the serene backwaters.",
    image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2070&auto=format&fit=crop", // Nature
    ctaLink: "/sustainable",
    ctaText: "Go Green",
    icon: Mountain,
    color: "from-emerald-500 to-green-500"
  }
];

const HeroSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = window.setTimeout(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, isPaused]);

  return (
    <section 
      className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden bg-black group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider Container */}
      <div 
        className="flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="w-full h-full flex-shrink-0 relative overflow-hidden">
            {/* Background Image with Zoom Effect */}
            <motion.div 
              className="absolute inset-0 w-full h-full"
              animate={{ 
                scale: index === current ? 1.1 : 1,
              }}
              transition={{ 
                duration: 8, 
                ease: "linear" 
              }}
            >
               <img 
                 src={slide.image} 
                 alt={slide.title}
                 className="w-full h-full object-cover"
               />
            </motion.div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80" />
            
            {/* Radial Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">
          <div className="space-y-6">
            <motion.h1 
              key={`title-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black text-white font-serif mb-2 drop-shadow-xl leading-tight tracking-tight"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p 
              key={`sub-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto font-light drop-shadow-lg"
            >
              {slides[current].subtitle}
            </motion.p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 mt-10 justify-center items-center">
             <motion.div
               key={`btn-${current}`}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5, delay: 0.2 }}
             >
                {slides[current].ctaLink.startsWith('#') ? (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(slides[current].ctaLink);
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`bg-gradient-to-r ${slides[current].color} text-white px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 shadow-lg hover:scale-105 transform flex items-center justify-center gap-2 group/btn cursor-pointer`}
                  >
                    <span>{slides[current].ctaText}</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <Link 
                    to={slides[current].ctaLink} 
                    className={`bg-gradient-to-r ${slides[current].color} text-white px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 shadow-lg hover:scale-105 transform flex items-center justify-center gap-2 group/btn cursor-pointer`}
                  >
                    <span>{slides[current].ctaText}</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                )}
             </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${
              current === idx 
                ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar (Optional - indicates auto-slide) */}
      {!isPaused && (
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full z-30">
           <motion.div 
             key={current}
             initial={{ width: "0%" }}
             animate={{ width: "100%" }}
             transition={{ duration: 5, ease: "linear" }}
             className="h-full bg-gradient-to-r from-orange-500 via-white to-green-500 opacity-70"
           />
        </div>
      )}
    </section>
  );
};

export default HeroSection;
