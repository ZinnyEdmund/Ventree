import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/#', label: 'Home' },
  { to: '#', label: 'About Ventree' },
  { to: '#', label: 'How it works' },
  { to: '#', label: 'Contact' }
];

const socialLinks = [
  { icon: 'mage:facebook', label: 'Facebook' },
  { icon: 'mdi:instagram', label: 'Instagram' },
  { icon: 'mdi:twitter', label: 'Twitter' },
  { icon: 'mdi:youtube', label: 'YouTube' }
];

const legalLinks = [
  { to: '#', label: 'Privacy Policy' },
  { to: '#', label: 'Terms of Service' }
];

export default function FooterWithCTA() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary-1 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 mb-12 text-center md:text-left items-center md:items-start justify-center md:grid-cols-3">
          {/* Logo and Tagline */}
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="flex items-center justify-center">
                <img src="/images/Delogo.svg" alt="Logo" />
              </div>
            </div>
            <p className="text-black font-medium">Less Stress, More Business</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-black hover:text-primary-7 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="text-black font-bold mb-4">Stay Connected</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  to="/"
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                  aria-label={social.label}
                >
                  <Icon icon={social.icon} width="20" height="20" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-6 pt-8 flex flex-col justify-between items-center gap-4 text-sm text-black">
          <p className="text-center">© {currentYear} Ventree. All rights reserved.</p>
          <div className="flex flex-wrap gap-3 sm:gap-6 justify-center items-center">
            {legalLinks.map((link, index) => (
              <div key={link.label} className="flex gap-3 sm:gap-6 items-center">
                <Link to={link.to} className="hover:text-primary-7 transition-colors whitespace-nowrap">
                  {link.label}
                </Link>
                {index < legalLinks.length - 1 && <span>|</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}