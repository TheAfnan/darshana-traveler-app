import { 
  Home, 
  Sparkles, 
  Camera, 
  Plane, 
  Building2, 
  Calendar, 
  Leaf, 
  Menu, 
  X,
  MapPin
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRightSidebar } from "../hooks/useRightSidebar";
import darshanaLogoFull from "../images/darshana-logo-full.png";
import RightSidebar from "./RightSidebar";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: sidebarIsOpen, openSidebar, closeSidebar } = useRightSidebar();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "AI Planner", path: "/planner", icon: Sparkles },
    { name: "AR Scan", path: "/ar-guide", icon: Camera },
    { name: "Travel Hub", path: "/travelhub", icon: Plane },
    { name: "All Cities", path: "/cities", icon: Building2 },
    { name: "Cultural Odyssey", path: "/festivals", icon: Calendar },
    { name: "Eco Travel", path: "/sustainable", icon: Leaf },
    { name: "Local Guides", path: "/guides", icon: MapPin },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-xs z-50 border-b border-stone-200/80">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex justify-between items-center h-18 sm:h-20 py-2">
          
          {/* Left: Top-Left Hamburger Drawer Trigger + DarShana Lockup Logo */}
          <div className="flex items-center shrink-0">
            {/* Hamburger Trigger */}
            <button
              onClick={openSidebar}
              className="p-2 rounded-xl text-slate-700 hover:text-amber-700 hover:bg-amber-50 border border-stone-200 transition cursor-pointer shadow-2xs shrink-0"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>

            {/* Final Logo */}
            <Link 
              to="/" 
              className="flex items-center ml-2.5 sm:ml-3 pr-3 lg:pr-5 select-none shrink-0"
              aria-label="DarShana Home"
            >
              <img 
                src={darshanaLogoFull} 
                alt="DarShana" 
                className="h-[40px] sm:h-[50px] w-auto object-contain transition-transform duration-300 hover:scale-[1.02] shrink-0"
                loading="eager"
              />
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1 text-xs whitespace-nowrap">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group relative px-2.5 py-1.5 rounded-full text-[12px] xl:text-[13px] flex items-center gap-1.5 font-medium transition-all duration-200 whitespace-nowrap shrink-0
                    ${active ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-xs font-semibold" : "text-slate-700 hover:bg-orange-50/80 hover:text-orange-700"}
                  `}
                >
                  {Icon && <Icon size={14} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />}
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              );
            })}

            {/* Primary CTA Book Trip Button (Always Prominently Visible) */}
            <div className="ml-2 xl:ml-3 flex items-center shrink-0">
              <Link
                to="/booking"
                className={`group relative px-4 py-2 rounded-full text-[12px] xl:text-[13px] font-extrabold transition-all duration-200 whitespace-nowrap shrink-0 shadow-xs hover:shadow-md hover:scale-[1.02]
                  ${isActive('/booking') 
                    ? 'text-white bg-slate-900 ring-2 ring-orange-500/50' 
                    : 'text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'}
                `}
              >
                <span className="whitespace-nowrap">Book Trip</span>
              </Link>
            </div>
          </div>

          {/* Mobile Right: Book Trip CTA + Mobile Hamburger */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <Link
              to="/booking"
              className="px-3 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full text-xs font-bold shadow-xs shrink-0"
            >
              Book Trip
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-gray-700 hover:text-orange-600 shrink-0"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-slate-100 shadow-xl">
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

            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="w-full block text-center py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold shadow-md text-sm"
              >
                Book Trip
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Primary Left Navigation Drawer */}
      <RightSidebar isOpen={sidebarIsOpen} onClose={closeSidebar} />
    </nav>
  );
};

export default Navbar;
