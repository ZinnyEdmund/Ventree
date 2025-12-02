import {
  useState,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const CONTACT_INFO = {
  email: "ventreeapp@gmail.com",
  phone: "+2340813477647",
} as const;

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const trimmedFeedback = feedback.trim();

    if (!trimmedFeedback) {
      toast.error("Please enter your feedback before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // await submitFeedback(trimmedFeedback);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      toast.success("Feedback submitted successfully!");
      setFeedback("");
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [feedback]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  }, []);

  return (
    <section className="bg-white min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-4xl md:max-w-5xl space-y-6">
        {/* Header */}
        <header className="flex items-center gap-3">
          <Link to="/settings" className="text-black hover:text-gray-800 transition">
            <Icon
              icon="iconamoon:arrow-left-6-circle-light"
              width={24}
              height={24}
              aria-hidden="true"
            />
          </Link>
          <h1 className="h3 text-black">Help & Feedback</h1>
        </header>

        {/* Content Card */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 rounded-lg space-y-6 sm:space-y-8 shadow-2xl">
          {/* Send Feedback Section */}
          <section aria-labelledby="feedback-heading">
            <h2 id="feedback-heading" className="h4 text-black mb-4">
              Send Feedback
            </h2>

            <textarea
              value={feedback}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Put your feedback here"
              className="w-full h-30 sm:h-40 px-4 py-3 border border-secondary-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-glow focus:border-success text-gray-900 transition-shadow"
              aria-label="Feedback message"
              disabled={isSubmitting}
            />

            <div className="flex justify-center sm:justify-end mt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full md:w-80 px-6 btn btn-primary rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Submit feedback"
              >
                {isSubmitting ? "Submitting..." : "Send Feedback"}
              </button>
            </div>
          </section>

          {/* Contact Support Section */}
          <section aria-labelledby="support-heading">
            <h2 id="support-heading" className="h4 text-black mb-2">
              Contact Support
            </h2>
            <p className="web-small text-subtle-text mb-4">
              Need assistance? Reach out to our support team
            </p>

            <address className="space-y-2 not-italic">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-black body hover:text-SB transition-colors block"
                aria-label={`Email support at ${CONTACT_INFO.email}`}
              >
                {CONTACT_INFO.email}
              </a>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="text-black body hover:text-SB transition-colors block"
                aria-label={`Call support at ${CONTACT_INFO.phone}`}
              >
                {CONTACT_INFO.phone}
              </a>
            </address>
          </section>
        </div>
      </div>
    </section>
  );
}
