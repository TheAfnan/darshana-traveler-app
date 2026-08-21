import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import kathakali from "../images/kathakali-face.png";

const KathakaliAssistant: React.FC = () => {
  const [isJumping, setIsJumping] = useState(false);

  // Motion values for cursor position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for movement
  const springConfig = { damping: 25, stiffness: 150 };
  
  // Map mouse position to movement and rotation
  const x = useSpring(useTransform(mouseX, [-window.innerWidth / 2, window.innerWidth / 2], [-40, 40]), springConfig);
  const y = useSpring(useTransform(mouseY, [-window.innerHeight / 2, window.innerHeight / 2], [-40, 40]), springConfig);
  const rotateX = useSpring(useTransform(mouseY, [-window.innerHeight / 2, window.innerHeight / 2], [45, -45]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-window.innerWidth / 2, window.innerWidth / 2], [-45, 45]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleClick = () => {
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 1000);
    }
  };

  return (
    <div 
      className="flex flex-col justify-center items-center py-12 relative z-10 select-none"
      style={{ perspective: "600px" }}
    >

              {/* Static Tagline */}
      <div className="text-center z-0">
        <h3 className="text-4xl font-black text-slate-800 font-serif tracking-wide mb-2 drop-shadow-sm">
          Discover the Soul of India
        </h3>
        <p className="text-orange-600 font-bold text-lg uppercase tracking-widest">
          Your Cultural Companion
        </p>
        
      </div>

      <motion.div
        className="relative w-72 mb-16"
        style={{
          x,
          y,
          rotateX,
          rotateY,
        }}
      >
        <motion.div
          className="cursor-pointer flex flex-col items-center"
          animate={isJumping ? { y: -60, rotateY: 360, scale: 1.1 } : { y: 0, rotateY: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
        >
          {/* Face image */}
          <img
            src={kathakali}
            alt="Kathakali Assistant"
            className="w-full drop-shadow-2xl mix-blend-multiply"
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* Three Cultural Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
  {[
    {
      src: "https://s.alicdn.com/@sc04/kf/Hd7a451d441a54af396a19e0e61b82db1S/Kathputli-Marionette-Puppets-Traditional-Indian-Puppet-Handmade-Rajasthani-Vintage-Wooden-Doll-Party-Wedding-Backdrop-Decorate.jpg_300x300.jpg",
      title: "Kathputli",
      desc: "The iconic Rajasthani puppet face representing North India's folk heritage."
    },
    {
      src: "https://www.gitagged.com/wp-content/uploads/2023/07/CHAU-DEVI-GREEN-1FT-1.jpg",
      title: "Chhau Mask",
      desc: "Traditional Chhau dance mask known for vibrant colors and divine expressions."
    },
    {
      src: "https://thumbs.dreamstime.com/b/majestic-theyyam-performer-kerala-india-ornate-headdress-vibrant-face-paint-portrait-showcasing-magnificent-416318960.jpg",
      title: "Theyyam Face",
      desc: "Mythical Theyyam face symbolizing devotion, power, and ancient ritual art."
    }
  ].map((item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ y: -10 }}
      className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
    >
      <div className="h-64 overflow-hidden">
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 flex flex-col justify-end p-6">
        <h4 className="text-white font-bold text-xl mb-1">{item.title}</h4>
        <p className="text-gray-300 text-sm">{item.desc}</p>
      </div>
    </motion.div>
  ))}
</div>


    </div>
  );
};

export default KathakaliAssistant;
