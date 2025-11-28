import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="flex items-center justify-center px-5 pt-20 md:py-35">
      <div className="text-center max-w-4xl">
        <h1 className="text-black h1 mb-6 leading-tight">
          Run your shop the smart and easy way
        </h1>
        <p className="body md:text-xl text-black mb-9 leading-relaxed max-w-xl mx-auto">
          Ventree helps you keep record of your sales, stock, and profit, all in one simple app. No more paper and confusion.
        </p>
        <button
        onClick={() => navigate("/register")}
          className="w-full md:w-80 btn btn-primary px-10 border active:border-tertiary"
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
}