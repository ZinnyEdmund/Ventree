import { useState, type ReactNode } from "react";
import { Icon } from "@iconify/react"

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  icons?: ReactNode;
};

export default function Notifications() {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Low Stock Alert",
      message:
        "You have only 3 packs of sugar left. Restock soon to avoid running out.",
      time: "10 mins ago",
      icons: <Icon icon="ic:outline-trending-down" width="24" height="24" />,
    },
    {
      id: 2,
      title: "New Sale Recorded",
      message:
        "Attendant Chika sold 4 cartons of Malt today. ₦6,000 added to total sales.",
      time: "1 hr ago",
      icons: <Icon icon="ic:outline-playlist-add" width="24" height="24" />,
    },
    {
      id: 3,
      title: "Monthly Report Ready",
      message:
        "View your total profit, loss, and sales performance for October.",
      time: "Yesterday",
      icons: <Icon icon="ic:outline-assessment" width="24" height="24" />,
    },
    {
      id: 4,
      title: "Reminder",
      message: "Keep your sales safe even without internet.",
      time: "2 days ago",
      icons: <Icon icon="ic:outline-timer"width="24" height="24" />,
    },
    {
      id: 5,
      title: "New Sale Recorded",
      message:
        "Attendant Chika sold 4 cartons of Malt today. ₦6,000 added to total sales.",
      time: "1 hr ago",
      icons: <Icon icon="ic:outline-playlist-add" width="24" height="24" />,
    },
    {
      id: 6,
      title: "Reminder",
      message: "Keep your sales safe even without internet.",
      time: "2 days ago",
      icons: <Icon icon="ic:outline-timer" width="24" height="24" />,
    },
  ]);

  return (
    <div className="flex justify-center py-6">
      <div className="w-full">
        <h2 className="h3 text-secondary mb-1">
          Notifications
        </h2>
        <p className="text-black body-small mb-5">
          Stay updated with your shop activities
        </p>
        <div className="flex flex-col gap-4">
          {notifications.map((note) => (
            <div
              key={note.id}
              className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 md:p-6 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary-5 rounded-full">
                {note.icons}
              </div>

              <div className="flex-1">
                <h3 className="h4 text-black mb-1 text-sm md:text-base">
                  {note.title}
                </h3>
                <p className="text-subtle-text body-small md:text-sm">
                  {note.message}
                </p>
              </div>
              <span className="text-subtle-text body-small sm:text-sm whitespace-nowrap">
                {note.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
