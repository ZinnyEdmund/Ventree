import { Icon } from '@iconify/react';

interface StepCardProps {
  icon: string;
  title: string;
  description: string;
}

const STEPS: readonly StepCardProps[] = [
  {
    icon: "stash:pencil-writing",
    title: "Create an Account",
    description: "Sign up with your phone number or email."
  },
  {
    icon: "stash:pencil-writing",
    title: "Add Your Goods",
    description: "Enter your stock and prices"
  },
  {
    icon: "stash:pencil-writing",
    title: "Designed to Drive Bookings",
    description: "Record every sale and get reports."
  }
] as const;

function StepCard({ icon, title, description }: StepCardProps) {
  return (
    <div className="text-left bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
      <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white mb-4">
        <Icon icon={icon} width={28} height={28} />
      </div>
      <h3 className="h6 text-black mb-2">
        {title}
      </h3>
      <p className="text-grey web-small leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="px-5 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-5xl mx-auto">
          <h2 className="h2 text-black mb-2">
            How Ventree Helps You <span className="text-primary-1">Grow</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {STEPS.map((step, index) => (
            <StepCard key={`step-${index}`} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}