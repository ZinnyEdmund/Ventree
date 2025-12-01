import { useNavigate } from "react-router-dom";

export default function BookKeeping() {
  const navigate = useNavigate();
  
  return (
    <>
      {/* CTA Section */}
      <section className="px-5 pt-16">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="border-t border-l border-r border-primary-1 rounded-t-xl p-12 py-20 text-center animate-[slideUpBorder_0.8s_ease-out] hover:shadow-lg transition-shadow duration-500">
            <h2 className="h2 text-black mb-8 animate-[fadeInUp_0.6s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
              Spend <span className="text-primary-7">Less</span> Time
              Bookkeeping
            </h2>
            <button
              onClick={() => navigate("/register")}
              className="w-full md:w-80 btn btn-primary border active:border-tertiary transition-all duration-300 hover:scale-105 hover:shadow-lg animate-[fadeInUp_0.6s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
}