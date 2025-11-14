import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHome,
  faInfoCircle,
  faEnvelope,
  faBlog,
  faBars,
  faTimes,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] 
      bg-gradient-to-r from-sky-300/70 via-sky-500/70 to-blue-600/70 
      backdrop-blur-xl border border-white/20 shadow-lg 
      rounded-2xl z-50 transition-all duration-500">

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/png/mindease.png" alt="LOGO" className="w-10 h-10" />
            <span className="text-2xl font-[Playfair_Display] font-bold text-white tracking-wide">
              MindEase
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-end">
            <div className="flex space-x-12 font-medium font-[Poppins] text-white/90">
              {[
                { href: "#home", label: "Home" },
                { href: "/activity", label: "Activity" },
                { href: "/community", label: "Community" },
                { href: "#contact", label: "Contact" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="relative hover:text-white tracking-wide transition-all duration-300 group"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Buttons / Profile */}
          {/* <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="px-4 py-2 font-[Poppins] font-semibold text-white 
                    bg-white/20 backdrop-blur-md rounded-lg border border-white/30 
                    hover:bg-white/30 transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 font-[Poppins] font-semibold text-white 
                    bg-gradient-to-r from-sky-400/70 to-blue-600/70 backdrop-blur-md 
                    rounded-lg border border-white/30 hover:from-sky-500/80 hover:to-blue-700/80 
                    transition-all duration-300"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-white" />
                <span className="text-white font-medium">{user.name}</span>
                <button
                  onClick={logout}
                  className="text-white hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </div>
            )}
          </div> */}

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
          text-white font-[Poppins] text-lg shadow-lg rounded-b-2xl px-6 py-4 flex flex-col space-y-4">

          <a href="#home" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
            <FontAwesomeIcon icon={faHome} /> Home
          </a>
          <a href="#activity" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
            <FontAwesomeIcon icon={faInfoCircle} /> Activity
          </a>
          <a href="#blog" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
            <FontAwesomeIcon icon={faBlog} /> Community
          </a>
          <a href="#contact" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
            <FontAwesomeIcon icon={faEnvelope} /> Contact
          </a>

          {!user ? (
            <div className="flex flex-col space-y-2 mt-2">
              <button
                onClick={() => navigate("/signin")}
                className="w-full px-4 py-2 font-[Poppins] font-semibold text-white 
                  bg-white/20 backdrop-blur-md rounded-lg border border-white/30 
                  hover:bg-white/30 transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="w-full px-4 py-2 font-[Poppins] font-semibold text-white 
                  bg-gradient-to-r from-sky-400/70 to-blue-600/70 backdrop-blur-md 
                  rounded-lg border border-white/30 hover:from-sky-500/80 hover:to-blue-700/80 
                  transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <FontAwesomeIcon icon={faUser} />
              <span>{user.name}</span>
              <button onClick={logout} className="ml-auto text-red-400">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
