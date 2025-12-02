import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";

// Types
type UserProfile = {
  shopName: string;
  ownerName: string;
  phoneNumber: string;
};

type SettingsData = {
  profile: UserProfile;
  notifications: {
    salesReport: boolean;
    lowOnStock: boolean;
    outOfStock: boolean;
  };
};

// API Functions
const settingsApi = {
  fetchSettings: async (shopId: string): Promise<SettingsData> => {
    const response = await fetch(`https://backenddomain/shops/${shopId}/settings`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    
    // if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },
};

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Get user data from Redux auth state
  const user = useSelector((state: RootState) => state.auth.user);
  const shopId = (user as { shopId?: string } | undefined)?.shopId;

  // Fetch settings on mount
  useEffect(() => {
    if (!shopId) {
      toast.error('Please login again');
      // setIsLoading(false);
      return;
    }

    const loadSettings = async () => {
      try {
        // setIsLoading(true);
        const data = await settingsApi.fetchSettings(shopId);
        setProfile(data.profile);
      } catch (error) {
        // toast.error('Failed to load settings');
        console.error(error);
      } finally {
        // setIsLoading(false);
      }
    };

    loadSettings();
  }, [shopId]);

  const settingsLinks = [
    {
      section: "Profile",
      items: [
        {
          to: "/my-profile",
          icon: "octicon:person-16",
          label: profile?.shopName || user?.shopName || "My Profile",
          disabled: true, // Keep profile enabled
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
          disabled: true,
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
          disabled: true,
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
          disabled: true,
        },
      ],
    },
  ];

  const notificationItems = [
    { key: "salesReport", label: "Sales report" },
    { key: "lowOnStock", label: "Low on stock" },
    { key: "outOfStock", label: "Out of stock" },
  ];

  // if (isLoading) {
  //   return (
  //     <main className="flex justify-center items-center min-h-screen bg-bg">
  //       <div className="text-center justify-center">
  //         <Icon icon="line-md:loading-loop" width="48" height="48" className="text-secondary" />
  //         <p className="text-black mt-4">Loading settings...</p>
  //       </div>
  //     </main>
  //   );
  // }

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
                {items.map(({ to, icon, label, disabled }) => (
                  <div
                    key={to}
                    className="relative"
                    onMouseEnter={() => disabled && setHoveredItem(to)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {disabled ? (
                      <div className="flex items-center justify-between p-2 opacity-40 cursor-not-allowed">
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
                      </div>
                    ) : (
                      <Link
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
                    )}
                    
                    {/* Tooltip */}
                    {disabled && hoveredItem === to && (
                      <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1.5 rounded shadow-lg whitespace-nowrap z-10">
                        Disabled
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </section>
          ))}

          {/* Notification Section - ALL DISABLED */}
          <section>
            <h2 className="h7 text-black my-3">Push Notification</h2>
            <nav
              aria-label="Notification Settings"
              className="bg-white rounded-lg space-y-4"
            >
              {notificationItems.map(({ key, label }) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(`notification-${key}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center justify-between p-3 shadow-sm rounded-lg opacity-40 cursor-not-allowed">
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
                    <div
                      className="w-[48px] h-[24px] rounded-full flex items-center px-1 bg-gray-300"
                    >
                      <div className="w-[18px] h-[18px] bg-white rounded-full" />
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  {hoveredItem === `notification-${key}` && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1.5 rounded shadow-lg whitespace-nowrap z-10">
                      Disabled
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </section>
        </article>
      </div>
    </main>
  );
}