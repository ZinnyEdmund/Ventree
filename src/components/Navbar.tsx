import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const navLinks = [
  { to: '#hero', label: 'Home' },
  { to: '#about', label: 'About Ventree' },
  { to: '#how-it-works', label: 'How it works' },
  { to: '#contact', label: 'Contact' }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`md:px-15 md:mt-4 fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white md:bg-transparent'
    }`}>
      <div className="md:bg-white rounded-lg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="flex justify-between items-center h-18">
          {/* Logo - Left */}
          <div className="flex items-center shrink-0 animate-[fadeInLeft_0.6s_ease-out]">
            <img src="/images/logo.svg" alt="Logo" className="h-10 transition-transform duration-300 hover:scale-105" />
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex md:items-center md:space-x-8 absolute left-1/2 transform -translate-x-1/2 gap-6">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.to}
                onClick={(e) => handleSmoothScroll(e, link.to)}
                className="text-black body cursor-pointer hover:text-primary-7 transition-all duration-300 relative group animate-[fadeInDown_0.6s_ease-out] hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-7 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Button - Right (Desktop) */}
          <div className="hidden md:block animate-[fadeInRight_0.6s_ease-out]">
            <button 
            onClick={() => navigate("/register")}
              className="w-full md:w-50 btn btn-primary border active:border-tertiary transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-transform duration-300 hover:scale-110"
              aria-label="Toggle menu"
            >
              <div className="transition-transform duration-300">
                {isMenuOpen ? (
                  <X className="block h-6 w-6 animate-[spin_0.3s_ease-out]" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 mt-2 mx-4 z-50 transition-all duration-300 ${
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-4 px-6 space-y-4">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.to}
              onClick={(e) => handleSmoothScroll(e, link.to)}
              className="block text-black body cursor-pointer hover:text-primary-7 transition-all duration-300 py-2 hover:translate-x-2 animate-[fadeInLeft_0.4s_ease-out]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

    </nav>
  );
}