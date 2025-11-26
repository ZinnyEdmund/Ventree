import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";

// Types
type NotificationSettings = {
  salesReport: boolean;
  lowOnStock: boolean;
  outOfStock: boolean;
};

type UserProfile = {
  shopName: string;
  ownerName: string;
  phoneNumber: string;
};

type SettingsData = {
  profile: UserProfile;
  notifications: NotificationSettings;
};

// API Functions
const settingsApi = {
  fetchSettings: async (shopId: string): Promise<SettingsData> => {
    const response = await fetch(`https://backenddomain/shops/${shopId}/settings`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  updateNotifications: async (shopId: string, notifications: NotificationSettings): Promise<void> => {
    const response = await fetch(`https://backenddomain/shops/${shopId}/notifications`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(notifications),
    });
    
    if (!response.ok) throw new Error('Failed to update notifications');
  },
};

export default function Settings() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    salesReport: false,
    lowOnStock: false,
    outOfStock: false,
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Get user data from Redux auth state
  const user = useSelector((state: RootState) => state.auth.user);
  const shopId = (user as { shopId?: string } | undefined)?.shopId;

  // Fetch settings on mount
  useEffect(() => {
    if (!shopId) {
      toast.error('Please login again');
      setIsLoading(false);
      return;
    }

    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const data = await settingsApi.fetchSettings(shopId);
        setNotifications(data.notifications);
        setProfile(data.profile);
      } catch (error) {
        toast.error('Failed to load settings');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [shopId]);

  // Toggle notification with API update
  const toggleNotification = async (key: keyof NotificationSettings) => {
    if (!shopId) {
      toast.error('Please login again');
      return;
    }

    const newNotifications = { ...notifications, [key]: !notifications[key] };
    
    // Optimistic update
    setNotifications(newNotifications);
    
    try {
      setIsSaving(true);
      await settingsApi.updateNotifications(shopId, newNotifications);
      toast.success('Notification preference updated');
    } catch (error) {
      // Revert on error
      setNotifications(notifications);
      toast.error('Failed to update notification');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const settingsLinks = [
    {
      section: "Profile",
      items: [
        {
          to: "/my-profile",
          icon: "octicon:person-16",
          label: profile?.shopName || user?.shopName || "My Profile",
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
    key: keyof NotificationSettings;
    label: string;
  }> = [
    { key: "salesReport", label: "Sales report" },
    { key: "lowOnStock", label: "Low on stock" },
    { key: "outOfStock", label: "Out of stock" },
  ];

  if (isLoading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-bg">
        <div className="text-center">
          <Icon icon="line-md:loading-loop" width="48" height="48" className="text-secondary" />
          <p className="text-black mt-4">Loading settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center min-h-screen pb-6 md:px-1 bg-bg">
      <div className="w-full max-w-7xl">
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
                    disabled={isSaving}
                    aria-label={`Toggle ${label} notification`}
                    aria-pressed={notifications[key]}
                    className="w-[48px] h-[24px] rounded-full flex items-center px-1 cursor-pointer transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: notifications[key]
                        ? "#1EC131"
                        : "#A2A3A2",
                    }}
                  >
                    <div
                      className={`w-[18px] h-[18px] bg-white rounded-full transition ${
                        notifications[key] ? "translate-x-6" : "translate-x-0"
                      }`}
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