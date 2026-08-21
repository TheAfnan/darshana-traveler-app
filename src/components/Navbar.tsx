import { 
  Home, 
  Sparkles, 
  Smile, 
  Plane, 
  Building2, 
  Calendar, 
  Leaf, 
  Compass, 
  MoreVertical, 
  Menu, 
  X 
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRightSidebar } from "../hooks/useRightSidebar";
import logoImage from "../images/images-map-logo.png";
import RightSidebar from "./RightSidebar";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: sidebarIsOpen, openSidebar, closeSidebar } = useRightSidebar();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "AI Planner", path: "/planner", icon: Sparkles },
    { name: "Mood AI", path: "/mood", icon: Smile },
    { name: "Travel Hub", path: "/travelhub", icon: Plane },
    { name: "All Cities", path: "/cities", icon: Building2 },
    { name: "Cultural Odyssey", path: "/festivals", icon: Calendar },
    { name: "Eco Travel", path: "/sustainable", icon: Leaf },
    { name: "Local Guides", path: "/guides", icon: Compass },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-xs z-50 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-22">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 select-none group shrink-0"
          >
            {/* Logo Image */}
            <img 
              src={logoImage} 
              alt="DarShana Logo" 
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            
            {/* Logo Text */}
            <div className="text-lg sm:text-2xl font-extrabold font-serif tracking-tight drop-shadow-xs whitespace-nowrap shrink-0">
              <span className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Dar
              </span>
              <span className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 bg-clip-text text-transparent">
                Shana
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 text-xs whitespace-nowrap">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group relative px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-full text-[12px] xl:text-[13px] flex items-center gap-1.5 font-medium transition-all duration-200 whitespace-nowrap shrink-0
                    ${active ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-xs font-semibold" : "text-slate-700 hover:bg-orange-50/80 hover:text-orange-700"}
                  `}
                >
                  {Icon && <Icon size={14} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />}
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              );
            })}

            {/* CTA + Kebab Menu */}
            <div className="ml-2 xl:ml-3 flex items-center gap-2 shrink-0">
              <Link
                to="/booking"
                className={`group relative px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-full text-[12px] xl:text-[13px] font-semibold transition-all duration-200 whitespace-nowrap shrink-0
                  ${isActive('/booking') ? 'text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xs' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/60'}
                `}
              >
                <span className="whitespace-nowrap">Book Trip</span>
              </Link>
              
              {/* Kebab Menu (3-dot) */}
              <button
                onClick={openSidebar}
                className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-100/50 rounded-full transition-all duration-200 shrink-0"
                title="More options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Mobile / Tablet Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-orange-600"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-white/20 shadow-xl">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 transform ${
                    isActive(link.path)
                      ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md"
                      : "text-slate-700 hover:text-orange-600 hover:bg-orange-50/60"
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  {link.name}
                </Link>
              );
            })}

            {/* CTA button */}
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg mt-4 shadow-md font-bold"
            >
              Book Trip
            </Link>
          </div>
        </div>
      )}

      {/* Right Sidebar Drawer */}
      <RightSidebar isOpen={sidebarIsOpen} onClose={closeSidebar} />
    </nav>
  );
};

export default Navbar;
