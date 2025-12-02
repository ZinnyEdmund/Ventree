import { Icon } from '@iconify/react';

interface StepCardProps {
  icon: string;
  title: string;
  description: string;
  index?: number;
}

const STEPS: readonly StepCardProps[] = [
  {
    icon: "stash:pencil-writing",
    title: "Create an Account",
    description: "Sign up with your phone number or email."
  },
  {
    icon: "stash:pencil-writing",
    title: "Mannage goods",
    description: "Enter your stock and prices"
  },
  {
    icon: "stash:pencil-writing",
    title: "Make more money",
    description: "Record every sale and get reports."
  }
] as const;

function StepCard({ icon, title, description, index = 0 }: StepCardProps) {
  return (
    <div 
      className="text-left bg-white rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-[fadeInUp_0.6s_ease-out] opacity-0 [animation-fill-mode:forwards]"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="w-14 h-14 bg-linear-to-r from-[#59DC59] to-[#ADFFAD] border-2 border-[#33EB35] rounded-full flex items-center justify-center text-white mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-6">
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
    <section className="px-5 pt-20 md:py-3 md:mb-15" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {STEPS.map((step, index) => (
            <StepCard key={`step-${index}`} {...step} index={index} />
          ))}
        </div>
      </div>

    </section>
  );
}