import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF, faTwitter, faInstagram, faLinkedinIn} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return (
        <footer className="bg-[#E7E7E7] text-gray-700 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1  md:grid-cols-3 gap-8">
                {/* Brand Section */}
                <div>
                    <div className="flex items-center gap-2">
                        <img src="/png/mindease.png" alt="LOGO" className="w-10 h-10" />
                        <div className="flex-shrink-0 text-xl font-bold font-['Open Sans'] text-black">MindEase</div>
                    </div>
                    <p className="mt-3 text-md leading-6 text-[#181818]">
                        Take a break from stress with 🌬️ guided breathing, 🌿 soothing nature sounds, 🎬 uplifting
                        movies, 🎮 fun games, and 📖 short motivational stories. Simple tools designed to reset your
                        mind ✨ and bring balance ⚖️ to your day.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Quick Links</h3>
                    <ul className="mt-3 space-y-2 text-md text-[#181818]">
                        <li>
                            <a
                                href="#about"
                                className="relative inline-block hover:text-gray-900 
             after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 
             after:-bottom-1 after:bg-gray-900 after:transition-all after:duration-300 
             hover:after:w-full"
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                href="#services"
                                className="relative inline-block hover:text-gray-900 
             after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 
             after:-bottom-1 after:bg-gray-900 after:transition-all after:duration-300 
             hover:after:w-full"
                            >
                                Services
                            </a>
                        </li>
                        <li>
                            <a
                                href="#projects"
                                className="relative inline-block hover:text-gray-900 
             after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 
             after:-bottom-1 after:bg-gray-900 after:transition-all after:duration-300 
             hover:after:w-full"
                            >
                                Projects
                            </a>
                        </li>
                        <li>
                            <a
                                href="#contact"
                                className="relative inline-block hover:text-gray-900 
             after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 
             after:-bottom-1 after:bg-gray-900 after:transition-all after:duration-300 
             hover:after:w-full"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Follow Us</h3>
                    <div className="mt-4 flex space-x-4">
                        <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <FontAwesomeIcon icon={faFacebookF} className="h-4 w-4" />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <FontAwesomeIcon icon={faTwitter} className="h-4 w-4" />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <FontAwesomeIcon icon={faLinkedinIn} className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 mt-6">
                <p className="text-center text-sm py-4 text-gray-600">
                    © {new Date().getFullYear()} MindEase. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
