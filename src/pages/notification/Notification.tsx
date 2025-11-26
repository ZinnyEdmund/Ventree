import { useMemo } from "react";
import { Icon } from "@iconify/react";
import { useNotifications } from "../../hooks/useNotifications";
import { getNotificationDisplay, formatNotificationTime } from "../../lib/notificationHelpers";

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const notificationList = useMemo(
    () =>
      notifications.map((note) => {
        const display = getNotificationDisplay(note.type);
        const timeFormatted = formatNotificationTime(note.created_at);
        
        return (
          <article
            key={note._id}
            className={`flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white rounded-xl hover:shadow-md transition-shadow cursor-pointer ${
              !note.isRead ? 'border-l-4 border-primary-1' : ''
            }`}
            onClick={() => markAsRead(note._id)}
          >
            <div className="shrink-0 flex items-center justify-center w-8 h-8 bg-primary-5 rounded-full">
              <Icon icon={display.icon} width="24" height="24" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="h4 text-black mb-1 text-sm md:text-base">
                {display.title}
              </h3>
              <p className="text-subtle-text body-small md:text-sm">
                {note.message}
              </p>
            </div>

            <span className="shrink-0 text-subtle-text body-small md:text-sm whitespace-nowrap">
              {timeFormatted}
            </span>
          </article>
        );
      }),
    [notifications, markAsRead]
  );

  return (
    <div className="flex justify-center py-6 px-4 bg-bg">
      <div className="w-full max-w-5xl">
        <header className="mb-5 flex justify-between items-start">
          <div>
            <h1 className="h3 text-secondary mb-1">Notifications</h1>
            <p className="text-black body-small">
              Stay updated with your shop activities
            </p>
          </div>
          
          {notifications.length > 0 && (
            <button onClick={markAllAsRead} className="btn-outline text-sm px-3 py-1">
              Mark all read
            </button>
          )}
        </header>

        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-subtle-text">No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">{notificationList}</div>
        )}
      </div>
    </div>
  );
}