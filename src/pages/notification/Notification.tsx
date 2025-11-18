import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
};

export default function Notifications() {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Low Stock Alert",
      message:
        "You have only 3 packs of sugar left. Restock soon to avoid running out.",
      time: "10 mins ago",
      icon: "ic:outline-trending-down",
    },
    {
      id: 2,
      title: "New Sale Recorded",
      message:
        "Attendant Chika sold 4 cartons of Malt today. ₦6,000 added to total sales.",
      time: "1 hr ago",
      icon: "ic:outline-playlist-add",
    },
    {
      id: 3,
      title: "Monthly Report Ready",
      message:
        "View your total profit, loss, and sales performance for October.",
      time: "Yesterday",
      icon: "ic:outline-assessment",
    },
    {
      id: 4,
      title: "Reminder",
      message: "Keep your sales safe even without internet.",
      time: "2 days ago",
      icon: "ic:outline-timer",
    },
    {
      id: 5,
      title: "New Sale Recorded",
      message:
        "Attendant Chika sold 4 cartons of Malt today. ₦6,000 added to total sales.",
      time: "1 hr ago",
      icon: "ic:outline-playlist-add",
    },
    {
      id: 6,
      title: "Reminder",
      message: "Keep your sales safe even without internet.",
      time: "2 days ago",
      icon: "ic:outline-timer",
    },
  ]);

  const notificationList = useMemo(
    () =>
      notifications.map((note) => (
        <article
          key={note.id}
          className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white rounded-xl hover:shadow-md transition-shadow"
        >
          <div className="shrink-0 flex items-center justify-center w-8 h-8 bg-primary-5 rounded-full">
            <Icon icon={note.icon} width="24" height="24" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="h4 text-black mb-1 text-sm md:text-base">
              {note.title}
            </h3>
            <p className="text-subtle-text body-small md:text-sm">
              {note.message}
            </p>
          </div>

          <span className="shrink-0 text-subtle-text body-small md:text-sm whitespace-nowrap">
            {note.time}
          </span>
        </article>
      )),
    [notifications]
  );

  return (
    <div className="flex justify-center py-6 px-4 bg-bg">
      <div className="w-full max-w-5xl">
        <header className="mb-5">
          <h1 className="h3 text-secondary mb-1">Notifications</h1>
          <p className="text-black body-small">
            Stay updated with your shop activities
          </p>
        </header>

        <div className="flex flex-col gap-4">{notificationList}</div>
      </div>
    </div>
  );
}