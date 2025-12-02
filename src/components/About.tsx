import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

interface AboutCardProps {
  icon: string;
  title: string;
  description: string;
  index?: number;
  isVisible?: boolean;
}

const ABOUT = [
  {
    icon: "stash:pencil-writing",
    title: "Record Sales Easily",
    description: "No paper, no stress. Just record your sales with one tap."
  },
  {
    icon: "mdi:book-cancel-outline",
    title: "Track Your Stock",
    description: "Know when your goods are running low so you never run out."
  },
  {
    icon: "bi:stars",
    title: "Track Your Progress",
    description: "See how your business is doing and make better decisions."
  }
];

function AboutCard({ icon, title, description, index = 0, isVisible = false }: AboutCardProps) {
  return (
    <div 
      className={`bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-700 hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${400 + index * 150}ms` }}
    >
      <div className="w-16 h-16 bg-linear-to-r from-[#59DC59] to-[#ADFFAD] border-2 border-[#33EB35] rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-primary-8 transition-transform duration-300 hover:scale-110 hover:rotate-12">
        <Icon icon={icon} width="35" height="35" />
      </div>
      <h3 className="h5 text-grey mb-5">
        {title}
      </h3>
      <p className="text-subtle-text web-small leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="px-5 pt-20 md:py-16" id="about">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className={`inline-flex items-center gap-2 bg-primary-6 text-primary-1 border border-primary-1 px-4 py-2 rounded-xl text-sm font-medium mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <Icon icon="bi:stars" width="20" height="20" className="animate-[spin_2s_ease-in-out_infinite]" />
            <span>About Us</span>
          </div>
          <h2 className={`h2 font-bold text-black mb-6 leading-tight transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Everything <span className="text-primary-1">You Need</span> To Run Your Shop Smoothly
          </h2>
          <p className={`text-grey web-small max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Whether you sell foodstuff, clothes, or beauty products — Ventree helps you stay on top of your sales and stock
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {ABOUT.map((feature, index) => (
            <AboutCard key={index} {...feature} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>

 
    </section>
  );
}