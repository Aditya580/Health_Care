import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faEnvelope,
  faBlog,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] 
      bg-gradient-to-r from-sky-300/70 via-sky-500/70 to-blue-600/70 
      backdrop-blur-xl border border-white/20 shadow-lg 
      rounded-2xl z-50 transition-all duration-500">
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/png/mindease.png" alt="LOGO" className="w-9 h-9" />
            <span className="text-2xl font-[Playfair_Display] font-bold text-white tracking-wide">
              MindEase
            </span>
          </div>

          {/* Desktop Centered Menu */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-12 font-medium font-[Poppins]">
              {[
                { href: "#home", label: "Home" },
                { href: "#about", label: "About" },
                { href: "#blog", label: "Blog" },
                { href: "#contact", label: "Contact" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="relative text-white/90 hover:text-white tracking-wide transition-all duration-300 group"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? (
                <FontAwesomeIcon icon={faTimes} size="lg" />
              ) : (
                <FontAwesomeIcon icon={faBars} size="lg" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-sky-400/90 to-blue-600/90 
          text-white font-[Poppins] text-lg shadow-lg rounded-b-2xl px-6 py-4 
          flex flex-col space-y-4">
          <a href="#home" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
            <FontAwesomeIcon icon={faHome} /> Home
          </a>
          <a href="#about" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
            <FontAwesomeIcon icon={faInfoCircle} /> About
          </a>
          <a href="#blog" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
            <FontAwesomeIcon icon={faBlog} /> Blog
          </a>
          <a href="#contact" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
            <FontAwesomeIcon icon={faEnvelope} /> Contact
          </a>
        </div>
      )}
    </nav>
  );
}
