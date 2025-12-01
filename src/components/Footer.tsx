import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

// These are anchor links to sections on the same page
const quickLinks = [
  { to: "#hero", label: "Home" },
  { to: "#about", label: "About Ventree" },
  { to: "#how-it-works", label: "How it works" },
  { to: "#contact", label: "Contact" },
];

const socialLinks = [
  {
    icon: "mage:facebook",
    label: "Facebook",
    url: "https://facebook.com/ventree",
  },
  {
    icon: "mdi:instagram",
    label: "Instagram",
    url: "https://www.instagram.com/useventree",
  },
  { icon: "mdi:twitter", label: "Twitter", url: " https://x.com/useVentree" },
  {
    icon: "mdi:youtube",
    label: "YouTube",
    url: "https://youtube.com/@ventree",
  },
];

const legalLinks = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-of-service", label: "Terms of Service" },
];

export default function FooterWithCTA() {
  const currentYear = new Date().getFullYear();

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer
      className="border-t border-primary-1 py-12 md:flex mx-auto w-full relative 
            bg-black bg-center"
      style={{ backgroundImage: "url('images/onboarding-pattern.svg')" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        <div className="grid gap-12 mb-12 text-center md:text-left items-center md:items-start justify-items-center md:justify-items-start md:grid-cols-3 md:gap-8">
          {/* Logo and Tagline */}
          <div className="animate-[fadeInUp_0.6s_ease-out_0.1s] opacity-0 [animation-fill-mode:forwards]">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="flex items-center justify-center transition-transform duration-300 hover:scale-105">
                <img src="/images/Delogo.svg" alt="Logo" />
              </div>
            </div>
            <p className="text-white font-medium">Less Stress, More Business</p>
          </div>

          {/* Quick Links */}
          <div className="animate-[fadeInUp_0.6s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li 
                  key={link.label}
                  className="animate-[fadeInLeft_0.4s_ease-out] opacity-0 [animation-fill-mode:forwards]"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <a
                    href={link.to}
                    onClick={(e) => handleSmoothScroll(e, link.to)}
                    className="text-white hover:text-primary-7 transition-all duration-300 cursor-pointer inline-block hover:translate-x-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="animate-[fadeInUp_0.6s_ease-out_0.3s] opacity-0 [animation-fill-mode:forwards]">
            <h3 className="text-white font-bold mb-4">Stay Connected</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-grey transition-all duration-300 hover:scale-110 hover:-translate-y-1 animate-[scaleIn_0.4s_ease-out] opacity-0 [animation-fill-mode:forwards]"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  aria-label={social.label}
                >
                  <Icon icon={social.icon} width="20" height="20" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-6 pt-8 flex flex-col justify-between items-center gap-4 text-sm text-white animate-[fadeInUp_0.6s_ease-out_0.5s] opacity-0 [animation-fill-mode:forwards]">
          <p className="text-center">
            © {currentYear} Ventree. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-6 justify-center items-center">
            {legalLinks.map((link, index) => (
              <div
                key={link.label}
                className="flex gap-3 sm:gap-6 items-center"
              >
                <Link
                  to={link.to}
                  className="hover:text-primary-7 transition-colors whitespace-nowrap hover:underline"
                >
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