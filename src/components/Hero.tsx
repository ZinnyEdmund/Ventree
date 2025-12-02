import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  
  return (
    <section className="px-5 py-16 md:py-24 lg:py-32" id="hero">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SECTION */}
          <div className="space-y-8m text-center lg:text-left">
            <h1 className="h1 font-bold text-black leading-tight animate-[fadeInUp_0.8s_ease-out]">
              Less Stress,
              <br />
              <span className="text-black">More Business</span>
            </h1>
            <p className="text-black body leading-snug mb-10 max-w-md animate-[fadeInUp_0.8s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
              Ventree helps you keep record of your sales, stock, and profit,
              all in one simple app. No more paper and confusion.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-full md:w-80 btn btn-sec active:border-tertiary transition-all duration-300 hover:scale-105 hover:shadow-lg animate-[fadeInUp_0.8s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]"
            >
              Get Started Now
            </button>
          </div>

          {/* RIGHT SECTION - Image with decorative border */}
          <div className="relative mt-8 lg:mt-0">
            {/* Decorative border */}
            <div className="absolute inset-0 border-2 border-subtle rounded-3xl transform -translate-x-6 translate-y-6 animate-[floatBorder_3s_ease-in-out_infinite]" />
            
            {/* Main image container */}
            <div className="relative rounded-3xl overflow-hidden animate-[fadeInRight_0.8s_ease-out_0.3s] opacity-0 [animation-fill-mode:forwards] transition-transform duration-500 hover:scale-105">
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