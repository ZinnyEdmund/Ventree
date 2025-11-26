import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useNotifications } from "../../hooks/useNotifications";
import { getNotificationDisplay, formatNotificationTime } from "../../lib/notificationHelpers";

export function NotificationModal({ onClose }: { onClose: () => void }) {
  const { notifications, markAsRead } = useNotifications();
  
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="flex items-start justify-end fixed inset-0 z-40 px-12">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mt-16 mr-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-gray-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h2>
          <div></div>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {recentNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No notifications</div>
          ) : (
            recentNotifications.map((notif) => {
              const display = getNotificationDisplay(notif.type);
              const timeFormatted = formatNotificationTime(notif.created_at);
              
              return (
                <div
                  key={notif._id}
                  className="flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => markAsRead(notif._id)}
                >
                  <div className="flex-shrink-0 mt-2">
                    <div className={`w-2 h-2 rounded-full ${notif.isRead ? "bg-gray-300" : "bg-primary-1"}`} />
                  </div>

                  <Icon icon={display.icon} width="20" height="20" className="text-primary-1 mt-1" />

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{display.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{timeFormatted}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 text-center border-t border-gray-200">
          <Link to={"/notification"} onClick={onClose} className="font-medium text-sm hover:underline">
            See all
          </Link>
        </div>
      </div>
    </div>
  );
}
