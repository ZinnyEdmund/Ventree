import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';

export default function CTASection() {
  const navigate = useNavigate();
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
      <div className={`max-w-6xl w-full mx-auto bg-secondary rounded-3xl px-8 md:px-16 py-10 text-center hover:shadow-2xl transition-all duration-700 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <h2 className={`h2 text-white mb-10 leading-tight transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Built for You, the <span className="text-primary-1">Everyday</span> Business Owner
        </h2>
        <p className={`text-white web-small mb-8 max-w-4xl mx-auto transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Ventree is made to make business management simple for everyone, no tech skills needed.
        </p>
        <p className={`text-white web-small mb-8 max-w-5xl mx-auto transition-all duration-700 delay-[400ms] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Whether you run a small shop or a growing store, Ventree helps you save time, avoid loss, and grow your business.
        </p>
        <button 
          onClick={() => navigate("/register")}
          className={`w-full md:w-80 btn btn-sec border active:border-tertiary transition-all duration-700 delay-500 hover:scale-105 hover:shadow-lg ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Start Now
        </button>
      </div>
    </section>
  );
}