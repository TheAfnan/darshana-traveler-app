import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const foods = [
  {
    id: 1,
    region: "North India",
    dish: "Butter Chicken & Naan",
    desc: "Rich, creamy tomato curry with tender chicken, served with clay-oven bread.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1000&auto=format&fit=crop",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 2,
    region: "South India",
    dish: "Masala Dosa",
    desc: "Crispy fermented crepe stuffed with spiced potatoes, served with coconut chutney.",
    image: "https://www.cookwithmanali.com/wp-content/uploads/2020/05/Masala-Dosa.jpg",
    color: "from-emerald-500 to-green-600"
  },
  {
    id: 3,
    region: "East India",
    dish: "Machher Jhol",
    desc: "A traditional spicy fish curry that defines the soul of Bengali cuisine.",
    image: "https://www.licious.in/blog/wp-content/uploads/2022/08/shutterstock_1891229332.jpg",
    color: "from-yellow-400 to-orange-400"
  },
  {
    id: 4,
    region: "West India",
    dish: "Vada Pav",
    desc: "The Indian burger - spicy potato fritter in a soft bun with chutneys.",
    image: "https://content.jdmagicbox.com/v2/comp/mumbai/j6/022pxx22.xx22.100501204356.t6j6/catalogue/bansi-vadapav-malad-west-mumbai-street-food-90uvi1lfvf-250.jpg",
    color: "from-pink-500 to-rose-500"
  }
];

const FamousFood: React.FC = () => {
  return (
    <section className="py-20 bg-orange-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-black text-slate-900 mb-4"
          >
            Culinary Heritage of India
          </motion.h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Embark on a gastronomic journey through the diverse flavors of North, South, East, and West.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {foods.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-56 overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity`} />
                <img 
                  src={item.image} 
                  alt={item.dish}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                  {item.region}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {item.dish}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>
              
              {/* Bottom colored border */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${item.color}`}></div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            See More Delicacies <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FamousFood;
