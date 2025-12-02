import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
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
    <section ref={sectionRef} className="px-5 py-16 md:py-24 lg:py-32" id="hero">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SECTION */}
          <div className="space-y-8m text-center lg:text-left">
            <h1 className={`h1 font-bold text-black leading-tight transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Less Stress,
              <br />
              <span className="text-black">More Business</span>
            </h1>
            <p className={`text-black body leading-snug mb-10 max-w-md transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Ventree helps you keep record of your sales, stock, and profit,
              all in one simple app. No more paper and confusion.
            </p>
            <button
              onClick={() => navigate("/register")}
              className={`w-full md:w-80 btn btn-sec active:border-tertiary transition-all duration-700 delay-300 hover:scale-105 hover:shadow-lg ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Get Started Now
            </button>
          </div>

          {/* RIGHT SECTION - Image with decorative border */}
          <div className="relative mt-8 lg:mt-0">
            {/* Decorative border */}
            <div className="absolute inset-0 border-2 border-subtle rounded-3xl transform -translate-x-6 translate-y-6 animate-[floatBorder_3s_ease-in-out_infinite]" />
            
            {/* Main image container */}
            <div className={`relative rounded-3xl overflow-hidden transition-all duration-700 delay-200 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <img
                src="/images/seller.svg"
                alt="Small business owner using Ventree app in their store"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}