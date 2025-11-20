import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import About from "../../components/About";
import Steps from "../../components/Steps";
import CTA from "../../components/CTA";
import Testimonials from "../../components/Testimonials";
import FAQ from "../../components/FAQ";
import BookKeeping from "../../components/BookKeeping";
import Footer from "../../components/Footer";

export default function LandingPage() {
  return (
    <div className="bg-bg min-h-screen flex justify-center">
      <div className="w-full mx-auto py-4">
        <Navbar />
        <Hero />
        <About />
        <Steps />
        <CTA />
        <Testimonials />
        <div className="w-full bg-primary-6 py-0">
          <div className="container mx-auto p-0">
            <FAQ />
          </div>
        </div>
        <BookKeeping />
        <Footer />
      </div>
    </div>
  );
}
