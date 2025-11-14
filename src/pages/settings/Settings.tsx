import { Link } from "react-router-dom";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    salesReport: false,
    lowOnStock: false,
    outOfStock: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsLinks = [
    {
      section: "Account",
      items: [
        {
          to: "/change-password",
          icon: "ic:outline-https",
          label: "Change Password",
        },
      ],
    },
    {
      section: "Help",
      items: [
        {
          to: "/help-center",
          icon: "ic:outline-help-outline",
          label: "Help Center / Feedback",
        },
      ],
    },
    {
      section: "About",
      items: [
        {
          to: "/about-us",
          icon: "ic:outline-report",
          label: "About Us",
        },
      ],
    },
  ];

  const notificationItems: Array<{
    key: keyof typeof notifications;
    label: string;
  }> = [
    { key: "salesReport", label: "Sales report" },
    { key: "lowOnStock", label: "Low on stock" },
    { key: "outOfStock", label: "Out of stock" },
  ];

  return (
    <main className="flex justify-center min-h-screen py-6 px-1 md:px-1">
      <article className="w-full bg-white rounded-xl shadow-sm p-6">
        {/* Header */}
        <header className="flex items-center justify-center relative mb-6">
          <Link
            to="/"
            className="absolute left-0 text-black hover:text-gray-800 transition"
            aria-label="Back to home"
          >
            {/* <Icon icon="ic:outline-arrow-circle-left" width="24" height="24" /> */}
            <img src="/public/images/leftarrow.svg" alt="Leftarrow" />
          </Link>
          <h1 className="h3 text-black">Settings</h1>
        </header>

        {/* Settings Links */}
        {settingsLinks.map(({ section, items }) => (
          <section key={section} className="mb-6">
            <h2 className="h4 text-black mb-2">{section}</h2>
            <nav
              aria-label={`${section} Settings`}
              className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200"
            >
              {items.map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-secondary">
                      <Icon icon={icon} width="24" height="24" />
                    </span>
                    <span className="text-black body">{label}</span>
                  </div>
                  <Icon
                    icon="ic:outline-arrow-forward-ios"
                    width="24"
                    height="24"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>
          </section>
        ))}

        {/* Notification Section */}
        <section>
          <h2 className="h4 text-black mb-2">Push Notification</h2>
          <nav
            aria-label="Notification Settings"
            className="bg-white rounded-lg space-y-2"
          >
            {notificationItems.map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-secondary">
                    <Icon
                      icon="ic:outline-charging-station"
                      width="24"
                      height="24"
                    />
                  </span>
                  <span className="text-black body">{label}</span>
                </div>
                <button
                  onClick={() => toggleNotification(key)}
                  aria-label={`Toggle ${label} notification`}
                  aria-pressed={notifications[key]}
                >
                  <Icon
                    icon={
                      notifications[key]
                        ? "ic:outline-toggle-on"
                        : "ic:outline-toggle-off"
                    }
                    width="50"
                    height="50"
                    className={
                      notifications[key] ? "text-success" : "text-black"
                    }
                  />
                </button>
              </div>
            ))}
          </nav>
        </section>
      </article>
    </main>
  );
}
