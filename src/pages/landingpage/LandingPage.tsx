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
        <section id="hero">
          <Hero />
        </section>
        <section id="how-it-works">
          <Steps />
        </section>
        <section id="about">
          <About />
        </section>
        <CTA />
        <Testimonials />
        <div className="w-full bg-primary-6 py-0">
          <div className="container mx-auto p-0">
            <FAQ />
          </div>
        </div>
        <section id="contact">
          <BookKeeping />
        </section>
        <Footer />
      </div>
    </div>
  );
}
