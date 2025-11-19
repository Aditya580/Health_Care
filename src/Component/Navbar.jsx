// import React, {useState, useContext} from "react";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import SignIn from '../authentication/AuthModel.jsx';
// import {
//     faHome,
//     faInfoCircle,
//     faEnvelope,
//     faBlog,
//     faBars,
//     faTimes,
//     faUser,
//     faSignOutAlt,
// } from "@fortawesome/free-solid-svg-icons";
// import {UserContext} from "./UserContext";

// export default function Navbar({onLoginClick}) {
//     const [isOpen, setIsOpen] = useState(false);
//     const {user, logout} = useContext(UserContext);
//     const [open, setOpen] = useState(false);
    

//     return (
//         <>
//         <nav
//             className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] 
//       bg-gradient-to-r from-sky-300/70 via-sky-500/70 to-blue-600/70 
//       backdrop-blur-xl border border-white/20 shadow-lg 
//       rounded-2xl z-50 transition-all duration-500"
//         >
//             <div className="max-w-7xl mx-auto px-6 sm:px-8">
//                 <div className="flex items-center justify-between h-16">
//                     {/* Logo */}
//                     <div className="flex items-center gap-2">
//                         <img src="/png/mindease.png" alt="LOGO" className="w-10 h-10" />
//                         <span className="text-2xl font-[Playfair_Display] font-bold text-white tracking-wide">
//                             MindEase
//                         </span>
//                     </div>

//                     {/* Desktop Menu */}
//                     <div className="hidden md:flex flex-1 justify-end items-center">
//                         <div className="flex space-x-12 font-medium font-[Poppins] text-white/90">
//                             {[
//                                 {href: "#home", label: "Home"},
//                                 {href: "/activity", label: "Activity"},
//                                 {href: "/community", label: "Community"},
//                                 {href: "/contact", label: "Contact"},
//                             ].map((item, idx) => (
//                                 <a
//                                     key={idx}
//                                     href={item.href}
//                                     className="relative hover:text-white tracking-wide transition-all duration-300 group"
//                                 >
//                                     {item.label}
//                                     <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
//                                 </a>
//                             ))}
//                         </div>

//                         {/* Profile + Auth Buttons (Desktop) */}
//                         <div className="flex items-center space-x-6 ml-10">
//                             {!user ? (
                                
//                                 <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 
//                  text-white font-medium transition-all"
//                  onClick={() => {setOpen(true)}}
//                  >

//                                     Sign In
//                                 </button>
//                             ) : (
//                                 <>
//                                     <span className="text-white/90 flex items-center gap-2">
//                                         <FontAwesomeIcon icon={faUser} /> {user.name}
//                                     </span>
//                                     <button
//                                         onClick={logout}
//                                         className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-600 
//                    text-white font-medium transition-all"
//                                     >
//                                         Logout
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     {/* Mobile Menu Button */}
//                     <div className="md:hidden">
//                         <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
//                             {isOpen ? (
//                                 <FontAwesomeIcon icon={faTimes} size="lg" />
//                             ) : (
//                                 <FontAwesomeIcon icon={faBars} size="lg" />
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile Dropdown */}
//             {isOpen && (
//                 <div
//                     className="md:hidden bg-gradient-to-b from-sky-400/90 to-blue-600/90 
//           text-white font-[Poppins] text-lg shadow-lg rounded-b-2xl px-6 py-4 flex flex-col space-y-4"
//                 >
//                     <a href="#home" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
//                         <FontAwesomeIcon icon={faHome} /> Home
//                     </a>
//                     <a href="/activity" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
//                         <FontAwesomeIcon icon={faInfoCircle} /> Activity
//                     </a>
//                     <a href="/community" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
//                         <FontAwesomeIcon icon={faBlog} /> Community
//                     </a>
//                     <a href="/contact" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
//                         <FontAwesomeIcon icon={faEnvelope} /> Contact
//                     </a>

//                     {/* Mobile Profile Only */}
//                     {user && (
//                         <div className="flex items-center gap-2 mt-2">
//                             <FontAwesomeIcon icon={faUser} />
//                             <span>{user.name}</span>
//                         </div>
//                     )}

//                     {/* Mobile Auth Buttons */}
//                     {!user ? (
//                         <a href="/login" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
//                             <FontAwesomeIcon icon={faUser} /> Sign In
//                         </a>
//                     ) : (
//                         <button
//                             onClick={logout}
//                             className="flex items-center gap-2 hover:text-sky-200 transition-colors"
//                         >
//                             <FontAwesomeIcon icon={faSignOutAlt} /> Logout
//                         </button>
//                     )}
//                 </div>
//             )}
//         </nav>
//         {open && <SignIn onClose={() => setOpen(false)} />}
//         </>
//     );
// }

import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SignIn from "../authentication/AuthModel.jsx";

import {
  faHome,
  faInfoCircle,
  faEnvelope,
  faBlog,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../contexts/UserContext.jsx";


import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] 
        bg-gradient-to-r from-sky-300/70 via-sky-500/70 to-blue-600/70 
        backdrop-blur-xl border border-white/20 shadow-lg 
        rounded-2xl z-50 transition-all duration-500"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div className="flex items-center gap-2">
              <img src="/png/mindease.png" alt="LOGO" className="w-10 h-10" />
              <span className="text-2xl font-[Playfair_Display] font-bold text-white tracking-wide">
                MindEase
              </span>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex flex-1 justify-end items-center">
              <div className="flex space-x-12 font-medium font-[Poppins] text-white/90">
                {[
                  { href: "#home", label: "Home" },
                  { href: "/activity", label: "Activity" },
                  { href: "/community", label: "Community" },
                  { href: "/contact", label: "Contact" },
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

              {/* DESKTOP — SIGN IN or AVATAR */}
              <div className="flex items-center space-x-6 ml-10">
                {!user ? (
                  <button
                    className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 
                    text-white font-medium transition-all cursor-pointer"
                    onClick={() => setOpen(true)}
                  >
                    Sign In
                  </button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar className="cursor-pointer border-white border-2">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-40">
                      <DropdownMenuItem onClick={logout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* MOBILE — SIGN IN / AVATAR + HAMBURGER */}
            <div className="md:hidden flex items-center gap-4">
              {!user ? (
                <button
                  className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 
                  text-white font-medium transition-all"
                  onClick={() => setOpen(true)}
                >
                  Sign In
                </button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="cursor-pointer border-white border-2 w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-40">
                    <DropdownMenuItem onClick={logout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

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

        {/* MOBILE DROPDOWN MENU */}
        {isOpen && (
          <div
            className="md:hidden bg-gradient-to-b from-sky-400/90 to-blue-600/90 
            text-white font-[Poppins] text-lg shadow-lg rounded-b-2xl px-6 py-4 flex flex-col space-y-4"
          >
            <a href="#home" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
              <FontAwesomeIcon icon={faHome} /> Home
            </a>
            <a href="/activity" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
              <FontAwesomeIcon icon={faInfoCircle} /> Activity
            </a>
            <a href="/community" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
              <FontAwesomeIcon icon={faBlog} /> Community
            </a>
            <a href="/contact" className="flex items-center gap-2 hover:text-sky-200 transition-colors">
              <FontAwesomeIcon icon={faEnvelope} /> Contact
            </a>

            {/* MOBILE — SHOW USER NAME */}
            {user && (
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="w-8 h-8 border-white border">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* SIGN-IN MODAL */}
      {open && <SignIn onClose={() => setOpen(false)} />}
    </>
  );
}


