import { Icon } from '@iconify/react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  index?: number;
}

const TESTIMONIALS: readonly TestimonialProps[] = [
  {
    quote: "Before Ventree, I used to forget what I sold. Now I can see everything clearly.",
    author: "Amaka",
    role: "Provision Store Owner"
  },
  {
    quote: "It helps me restock at the right time. I feel like a big businesswoman now!",
    author: "Mama Tayo",
    role: "Trader"
  },
  {
    quote: "Before Ventree, I used to forget what I sold. Now I can see everything clearly.",
    author: "Amaka",
    role: "Provision Store Owner"
  }
] as const;

function TestimonialCard({ quote, author, role, index = 0 }: TestimonialProps) {
  return (
    <div 
      className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-[fadeInUp_0.6s_ease-out] opacity-0 [animation-fill-mode:forwards]"
      style={{ animationDelay: `${0.4 + index * 0.15}s` }}
    >
      <div className="mb-4 transition-transform duration-300 hover:scale-110 inline-block">
        <Icon icon="bi:quote" width="32" height="32" className="text-primary-1" />
      </div>
      <p className="text-black italic text-lg mb-6 leading-relaxed">
        "{quote}"
      </p>
      <div className="body">
        <p className="text-black italic">-{author}, {role}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="px-5 pt-20 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-6 text-primary-1 border border-primary-1 px-4 py-2 rounded-xl text-sm font-medium mb-6 animate-[fadeInDown_0.6s_ease-out]">
            <Icon icon="bi:stars" width="20" height="20" className="animate-[spin_2s_ease-in-out_infinite]" />
            <span>Testimonials</span>
          </div>
          <h2 className="h2 text-black mb-8 animate-[fadeInUp_0.6s_ease-out_0.1s] opacity-0 [animation-fill-mode:forwards]">
            Trusted by Market Women & Small Business Owners <span className="text-primary-7">Everywhere</span>
          </h2>
          <p className="text-black text-lg animate-[fadeInUp_0.6s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
            See how other shop owners like you are growing their business with Ventree.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={`testimonial-${index}`} {...testimonial} index={index} />
          ))}
        </div>
      </div>


    </section>
  );
}