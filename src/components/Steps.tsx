import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

interface StepCardProps {
  icon: string;
  title: string;
  description: string;
  index?: number;
  isVisible?: boolean;
}

const STEPS: readonly StepCardProps[] = [
  {
    icon: "stash:pencil-writing",
    title: "Create an Account",
    description: "Sign up with your phone number or email."
  },
  {
    icon: "stash:pencil-writing",
    title: "Manage goods",
    description: "Enter your stock and prices"
  },
  {
    icon: "stash:pencil-writing",
    title: "Make more money",
    description: "Record every sale and get reports."
  }
] as const;

function StepCard({ icon, title, description, index = 0, isVisible = false }: StepCardProps) {
  return (
    <div 
      className={`text-left bg-white rounded-2xl p-5 hover:shadow-lg transition-all duration-700 hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="w-14 h-14 bg-linear-to-r from-[#59DC59] to-[#ADFFAD] border-2 border-[#33EB35] rounded-full flex items-center justify-center text-white mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-6">
        <Icon icon={icon} width={28} height={28} />
      </div>
      <h3 className="h6 text-black mb-2">
        {title}
      </h3>
      <p className="text-grey web-small leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function HowItWorks() {
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
    <section ref={sectionRef} className="px-5 pt-20 md:py-3 md:mb-15" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {STEPS.map((step, index) => (
            <StepCard key={`step-${index}`} {...step} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}