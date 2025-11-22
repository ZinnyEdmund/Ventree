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
      section: "Profile",
      items: [
        {
          to: "/my-profile",
          icon: "octicon:person-16",
          label: "Lota Provisions",
        },
      ],
    },
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
    <main className="flex justify-center min-h-screen pb-6 md:px-1 bg-bg">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-center relative mb-5 px-6 pt-6">
          <Link
            to="/home"
            className="absolute left-6 text-black hover:text-gray-800 transition"
            aria-label="Back to home"
          >
            <Icon
              icon="iconamoon:arrow-left-6-circle-light"
              width="24"
              height="24"
            />
          </Link>
          <h1 className="h3 text-black">Settings</h1>
        </header>

        <article className="bg-white rounded-xl p-6">
          {/* Settings Links */}
          {settingsLinks.map(({ section, items }) => (
            <section key={section} className="mb-6">
              <h2 className="h7 text-black mb-2">{section}</h2>
              <nav
                aria-label={`${section} Settings`}
                className="bg-white rounded-lg shadow-sm"
              >
                {items.map(({ to, icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-secondary">
                        <Icon icon={icon} width="24" height="24" />
                      </span>
                      <span className="text-black web-small">{label}</span>
                    </div>
                    <Icon
                      icon="ic:outline-arrow-forward-ios"
                      width="20"
                      height="20"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </section>
          ))}

          {/* Notification Section */}
          <section>
            <h2 className="h7 text-black my-3">Push Notification</h2>
            <nav
              aria-label="Notification Settings"
              className="bg-white rounded-lg space-y-4"
            >
              {notificationItems.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 shadow-sm rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-secondary">
                      <Icon
                        icon="ic:baseline-charging-station"
                        width="24"
                        height="24"
                      />
                    </span>
                    <span className="text-black web-small">{label}</span>
                  </div>
                  <button
                    onClick={() => toggleNotification(key)}
                    aria-label={`Toggle ${label} notification`}
                    aria-pressed={notifications[key]}
                    className="
    w-[48px] h-[24px]
    rounded-full
    flex items-center
    px-1
    cursor-pointer
    transition
    focus:outline-none
    disabled:opacity-50
  "
                    style={{
                      backgroundColor: notifications[key]
                        ? "#1EC131"
                        : "#A2A3A2",
                    }}
                  >
                    <div
                      className={`
      w-[18px] h-[18px]
      bg-white
      rounded-full
      transition
      ${notifications[key] ? "translate-x-6" : "translate-x-0"}
    `}
                    />
                  </button>
                </div>
              ))}
            </nav>
          </section>
        </article>
      </div>
    </main>
  );
}



