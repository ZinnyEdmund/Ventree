import { Icon } from '@iconify/react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
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

function TestimonialCard({ quote, author, role }: TestimonialProps) {
  return (
    <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
      <p>“</p>
      <p className="text-black italic text-lg mb-6 leading-relaxed">
        “{quote}”
      </p>
      <div className="body">
        <p className="text-black italic">-{author}, {role}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="px-5 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-6 text-primary-1 border border-primary-1 px-4 py-2 rounded-xl text-sm font-medium mb-6">
            <Icon icon="bi:stars" width="20" height="20" />
            <span>Testimonials</span>
          </div>
          <h2 className="h2 text-black mb-8">
            Trusted by Market Women & Small Business Owners <span className="text-primary-7">Everywhere</span>
          </h2>
          <p className="text-black text-lg">
            See how other shop owners like you are growing their business with Ventree.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={`testimonial-${index}`} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}