import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();
  
  return (
    <section className="px-5 pt-20 md:py-20">
      <div className="max-w-6xl w-full mx-auto bg-secondary rounded-3xl px-8 md:px-16 py-10 text-center animate-[scaleIn_0.7s_ease-out] hover:shadow-2xl transition-shadow duration-500">
        <h2 className="h2 text-white mb-10 leading-tight animate-[fadeInUp_0.6s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
          Built for You, the <span className="text-primary-1">Everyday</span> Business Owner
        </h2>
        <p className="text-white web-small mb-8 max-w-4xl mx-auto animate-[fadeInUp_0.6s_ease-out_0.3s] opacity-0 [animation-fill-mode:forwards]">
          Ventree is made to make business management simple for everyone, no tech skills needed.
        </p>
        <p className="text-white web-small mb-8 max-w-5xl mx-auto animate-[fadeInUp_0.6s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">
          Whether you run a small shop or a growing store, Ventree helps you save time, avoid loss, and grow your business.
        </p>
        <button 
          onClick={() => navigate("/register")}
          className="w-full md:w-80 btn btn-sec border active:border-tertiary transition-all duration-300 hover:scale-105 hover:shadow-lg animate-[fadeInUp_0.6s_ease-out_0.5s] opacity-0 [animation-fill-mode:forwards]"
        >
          Start Now
        </button>
      </div>
    </section>
  );
}