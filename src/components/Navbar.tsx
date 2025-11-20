import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="px-15">
      <div className="bg-white rounded-lg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo - Left */}
          <div className="flex items-center shrink-0">
            <img src="/images/logo.svg" alt="Logo" className="h-10"/>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex md:items-center md:space-x-8 absolute left-1/2 transform -translate-x-1/2 gap-6">
            <Link to="/home" className="text-black body">
              Home
            </Link>
            <Link to="/about" className="text-black body">
              About Ventree
            </Link>
            <Link to="/how-it-works" className="text-black body">
              How it works
            </Link>
            <Link to="/contact" className="text-black body">
              Contact
            </Link>
          </div>

          {/* Button - Right (Desktop) */}
          <div className="hidden md:block">
            <button className="w-full md:w-50 btn btn-primary border active:border-tertiary">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <span className="sr-only">Open main menu</span>
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
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white flex flex-col items-left">
          <Link
            to="/home"
            className="text-black body"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-black body"
          >
            About Ventree
          </Link>
          <Link
            to="/how-it-works"
            className="text-black body"
          >
            How it works
          </Link>
          <Link
            to="/contact"
            className="text-black body"
          >
            Contact
          </Link>
          <button className="w-full bg-black text-white px-6 py-2 rounded-full text-base font-medium hover:bg-gray-800 transition mt-2">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}