import { Icon } from '@iconify/react';

interface AboutCardProps {
    icon: string;
    title: string;
    description: string;
}

const ABOUT = [
  {
    icon: "stash:pencil-writing",
    title: "Record Sales Easily",
    description: "No paper, no stress. Just record your sales with one tap."
  },
  {
    icon: "mdi:book-cancel-outline",
    title: "Track Your Stock",
    description: "Know when your goods are running low so you never run out."
  },
  {
    icon: "bi:stars",
    title: "Track Your Progress",
    description: "See how your business is doing and make better decisions."
  }
];

function AboutCard({ icon, title, description }: AboutCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
      <div className="w-16 h-16 bg-linear-to-r from-[#59DC59] to-[#ADFFAD] border-2 border-[#33EB35] rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-primary-8">
        <Icon icon={icon} width="35" height="35" />
      </div>
      <h3 className="h5 text-grey mb-5">
        {title}
      </h3>
      <p className="text-subtle-text web-small leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function About() {
  return (
    <section className="px-5 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-6 text-primary-1 border border-primary-1 px-4 py-2 rounded-xl text-sm font-medium mb-6">
            <Icon icon="bi:stars" width="20" height="20" />
            <span>About Us</span>
          </div>
          
          <h2 className="h2 font-bold text-black mb-6 leading-tight">
            Everything <span className="text-primary-1">You Need</span> To Run Your Shop Smoothly
          </h2>
          
          <p className="text-grey web-small max-w-2xl mx-auto">
            Whether you sell foodstuff, clothes, or beauty products — Ventree helps you stay on top of your sales and stock
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {ABOUT.map((feature, index) => (
            <AboutCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}