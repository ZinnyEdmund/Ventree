import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const navLinks = [
  { to: '#hero', label: 'Home' },
  { to: '#about', label: 'About Ventree' },
  { to: '#how-it-works', label: 'How it works' },
  { to: '#contact', label: 'Contact' }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav className="md:px-15 relative">
      <div className="md:bg-white rounded-lg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo - Left */}
          <div className="flex items-center shrink-0">
            <img src="/images/logo.svg" alt="Logo" className="h-10" />
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex md:items-center md:space-x-8 absolute left-1/2 transform -translate-x-1/2 gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                onClick={(e) => handleSmoothScroll(e, link.to)}
                className="text-black body cursor-pointer hover:text-primary-7 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Button - Right (Desktop) */}
          <div className="hidden md:block">
            <Link to="/register" className="w-full md:w-50 btn btn-primary border active:border-tertiary">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-4 px-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                onClick={(e) => handleSmoothScroll(e, link.to)}
                className="block text-black body cursor-pointer hover:text-primary-7 transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            {/* <button className="w-full bg-black text-white px-6 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition mt-2">
              Get Started
            </button> */}
          </div>
        </div>
      )}
    </nav>
  );
}