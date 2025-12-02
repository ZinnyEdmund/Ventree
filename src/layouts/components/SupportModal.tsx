import { Icon } from "@iconify/react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

// Support Modal Component
export function SupportModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute top-20 right-6 bg-white rounded-2xl shadow-2xl w-[400px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="home-head font-medium dark text-primary">Idey Customer Support</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-3 space-y-2">
          {/* Help Center */}
          <Link to={"/help"} className="flex items-start gap-4 w-full text-left hover:bg-gray-50 rounded-xl p-3 transition-colors">
            <div className="w-12 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
            <Icon icon="material-symbols-light:contact-support-rounded" width="24px" className="text-grey" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Help Center</h3>
              <p className="text-sm text-gray-600">Support Hub, Talk to Us</p>
            </div>
          </Link>

          {/* Send Feedback */}
          <Link to={"/help"} className="flex items-start gap-4 w-full text-left hover:bg-gray-50 p-4 rounded-xl transition-colors">
            <div className="w-12 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
            <Icon icon="material-symbols-light:feedback-rounded" width="24px" className="text-grey" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Send Feedback</h3>
              <p className="text-sm text-gray-600">Report a Technical Issue</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}