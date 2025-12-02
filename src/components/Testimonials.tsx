import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  index?: number;
  isVisible?: boolean;
}

const TESTIMONIALS: readonly TestimonialProps[] = [
  {
    quote: "Before Ventree, I used to forget what I sold. Now I can see everything clearly.",
    author: "Amaka",
    role: "Provision Store Owner"
  },
  {
    quote: "It helps me restock at the right time. I feel like a big businesswoman now!",
    author: "Mama Tayo",
    role: "Trader"
  },
  {
    quote: "Before Ventree, I used to forget what I sold. Now I can see everything clearly.",
    author: "Amaka",
    role: "Provision Store Owner"
  }
] as const;

function TestimonialCard({ quote, author, role, index = 0, isVisible = false }: TestimonialProps) {
  return (
    <div 
      className={`bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-700 hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${400 + index * 150}ms` }}
    >
      <div className="mb-4 transition-transform duration-300 hover:scale-110 inline-block">
        <Icon icon="bi:quote" width="32" height="32" className="text-primary-1" />
      </div>
      <p className="text-black italic text-lg mb-6 leading-relaxed">
        "{quote}"
      </p>
      <div className="body">
        <p className="text-black italic">-{author}, {role}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
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
    <section ref={sectionRef} className="px-5 pt-20 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className={`inline-flex items-center gap-2 bg-primary-6 text-primary-1 border border-primary-1 px-4 py-2 rounded-xl text-sm font-medium mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <Icon icon="bi:stars" width="20" height="20" className="animate-[spin_2s_ease-in-out_infinite]" />
            <span>Testimonials</span>
          </div>
          <h2 className={`h2 text-black mb-8 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Trusted by Market Women & Small Business Owners <span className="text-primary-7">Everywhere</span>
          </h2>
          <p className={`text-black text-lg transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            See how other shop owners like you are growing their business with Ventree.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={`testimonial-${index}`} {...testimonial} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>

    </section>
  );
}