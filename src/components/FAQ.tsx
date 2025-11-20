import { useState } from "react";
import { Icon } from "@iconify/react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is Ventree?",
    answer:
      "Ventree is a simple online tool that helps shop owners and attendants record sales, track goods, and know their profit or loss — all in one place.",
  },
  {
    question: "Who can use Ventree?",
    answer:
      "Anyone who runs a shop or retail business can use Ventree. Whether you're a small business owner, market vendor, or shop attendant, Ventree makes it easy to manage your inventory and track your sales.",
  },
  {
    question: "Do I need an internet connection to use Ventree?",
    answer:
      "While Ventree works best with an internet connection for syncing data and accessing all features, you can still record sales offline. Your data will sync automatically once you're back online.",
  },
  {
    question: "How much does it cost to use Ventree?",
    answer:
      "Ventree has a free plan with basic features. You can start free and upgrade later if you want more options.",
  },
  {
    question: "Can I add my shop attendants to help me manage my shop?",
    answer:
      "Yes! Ventree allows you to add multiple shop attendants to your account. You can assign different permissions and roles to help them manage sales, inventory, and other shop activities while maintaining oversight.",
  },
];

export default function VentreeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-6 text-primary-1 border border-primary-1 px-4 py-2 rounded-xl text-sm font-medium mb-6">
            <Icon icon="bi:stars" width="20" height="20" />
            <span>FAQs</span>
          </div>
          <h1 className="h2 text-black">Questions, answered.</h1>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className="overflow-hidden border-b border-secondary-6"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-semibold text-black pr-4">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-grey shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-grey shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-0">
                    <p className="text-grey leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}