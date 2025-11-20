export default function CTASection() {
  return (
    <section className="px-5 py-20">
      <div className="max-w-6xl  w-full mx-auto bg-secondary rounded-3xl px-8 md:px-16 py-10 text-center">
        <h2 className="h2 text-white mb-10 leading-tight">
          Built for You, the <span className="text-primary-1">Everyday</span> Business Owner
        </h2>
        
        <p className="text-white web-small mb-8 max-w-4xl mx-auto">
          Ventree is made to make business management simple for everyone, no tech skills needed.
        </p>
        
        <p className="text-white web-small mb-8 max-w-5xl mx-auto">
          Whether you run a small shop or a growing store, Ventree helps you save time, avoid loss, and grow your business.
        </p>
        
        <button className="w-full md:w-80 btn btn-sec border active:border-tertiary">
          Start Now
        </button>
      </div>
    </section>
  );
}