// MainLayout.tsx
import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { NotificationModal } from "./components/NotificationModal";
import { ProfileModal } from "./components/ProfileModal";
import { Icon } from "@iconify/react";
import { SupportModal } from "./components/SupportModal";
import { useEffect, useRef } from "react";
import { truncateTextWithStringMethod } from "../lib/helper";

// Mobile Header Component
function MobileHeader({
  onMenuClick,
  onNotificationClick,
}: {
  onMenuClick: () => void;
  onNotificationClick: () => void;
}) {
  return (
      <header className="lg:hidden fixed px-6 top-0 left-0 right-0  z-50 bg-bg">
        <div className="flex items-center justify-between py-3">
          {/* Search Bar */}
          <div className="flex items-center gap-2 border border-subtle-2 px-3 py-2 rounded-full flex-1 max-w-[65%]">
            <input
              type="text"
              placeholder="Search Goods"
              className="bg-transparent outline-none flex-1 text-sm text-subtle"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button onClick={onNotificationClick} className="p-1">
              <Icon
                icon="ic:twotone-notifications"
                width="24"
                height="24"
                className="text-black"
              />
            </button>
            <button onClick={onMenuClick} className="p-1">
              <Icon
                icon="material-symbols:menu"
                width="24"
                height="24"
                className="text-black"
              />
            </button>
          </div>
        </div>
      </header>
  );
}

// Mobile Menu Drawer Component
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();

  if (!isOpen) return null;

  const currentPathSegment = "/" + location.pathname.split("/")[1];

  const isActive = (path: string) => currentPathSegment === path;

  return (
    <>
      {/* Backdrop */}
      <div
        className="lg:hidden  fixed inset-0 bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="lg:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-black z-50 overflow-y-auto">
        <div className="p-6">
          {/* Close button and Logo */}
          <div className="flex items-center justify-between mb-8">
            <img src="/images/logo-white.svg" alt="logo" width={100} />
            <button onClick={onClose} className="text-white">
              <Icon icon="material-symbols:close" width="24" height="24" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-subtle">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Icon
                icon="octicon:person-16"
                width="20"
                height="20"
                className="text-primary-1"
              />
            </div>
            <div>
              <h2 className="text-white text-sm font-medium">
                {truncateTextWithStringMethod("Okafor Ifeanyi", 15)}
              </h2>
              <p className="text-accent text-xs">Client</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-6">
            <MobileNavLink
              to="/home"
              icon="material-symbols-light:home-rounded"
              label="Home"
              isActive={isActive("/home")}
              onClick={onClose}
            />
            <MobileNavLink
              to="#"
              icon="material-symbols-light:home-repair-service-rounded"
              label="Manage Stocks"
              isActive={isActive("#")}
              onClick={onClose}
            />
            <MobileNavLink
              to="#"
              icon="material-symbols-light:shoppingmode"
              label="Record Sales"
              isActive={isActive("#")}
              onClick={onClose}
            />
            <MobileNavLink
              to="/notification"
              icon="material-symbols-light:notifications-rounded"
              label="Business Insights"
              isActive={isActive("/notification")}
              onClick={onClose}
            />
            <MobileNavLink
              to="/notification"
              icon="material-symbols-light:notifications-rounded"
              label="Set Up Shop"
              isActive={isActive("/notification")}
              onClick={onClose}
            />
            <MobileNavLink
              to="/notification"
              icon="material-symbols-light:notifications-rounded"
              label="Notification"
              isActive={isActive("/notification")}
              onClick={onClose}
            />
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-subtle pt-4 space-y-2">
            <MobileNavLink
              to="/settings"
              icon="material-symbols-light:settings-rounded"
              label="Settings"
              isActive={isActive("/settings")}
              onClick={onClose}
            />
            <button
              onClick={() => {
                localStorage.removeItem("authToken");
                sessionStorage.clear();
                window.location.href = "/login";
              }}
              className="flex items-center gap-3 py-3 px-4 rounded-lg transition-colors w-full text-white hover:bg-secondary-4"
            >
              <Icon
                icon="material-symbols-light:logout-rounded"
                width="24"
                height="24"
              />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Mobile Nav Link Component
interface MobileNavLinkProps {
  to: string;
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function MobileNavLink({
  to,
  icon,
  label,
  isActive,
  onClick,
}: MobileNavLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
        isActive ? "bg-primary-1 text-black" : "text-white hover:bg-secondary-4"
      }`}
    >
      <Icon icon={icon} width="24" height="24" />
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}

// Desktop Header Component
function DesktopHeader({
  onNotificationClick,
  showNotifications,
  showProfile,
  showSupport,
  setShowNotifications,
  setShowProfile,
  setShowSupport,
}: {
  onNotificationClick: () => void;
  showNotifications: boolean;
  showProfile: boolean;
  showSupport: boolean;
  setShowNotifications: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
  setShowSupport: (show: boolean) => void;
}) {
  return (
    <header className="hidden  bg-white w-full lg:block border border-accent-g2 rounded-lg">
      <div className="flex items-center bg-transparent justify-between  py-3 px-5 rounded-lg">
        {/* Search Bar */}
        <div className="flex items-center gap-2 border border-subtle-2 px-3 py-2 rounded-full w-1/4">
          <input
            type="text"
            placeholder="Search Goods"
            className="bg-transparent outline-none flex-1 text-sm text-subtle"
          />
        </div>

        {/* Header Icons */}
        <div className="flex items-center gap-4 relative">
          <button onClick={onNotificationClick}>
            <Icon
              icon="ic:twotone-notifications"
              width="24"
              height="24"
              className="text-black"
            />
          </button>
          <div className="flex items-center justify-center gap-2 my-auto">
            <div className="w-[32px] h-[32px] rounded-full bg-secondary justify-center flex m-auto items-center">
              <Icon
                icon="octicon:person-16"
                width="18"
                height="18"
                className="text-primary-1"
              />
            </div>

            <div>
              <h2 className="body-small">
                {truncateTextWithStringMethod("Okafor Ifeanyi", 15)}
              </h2>
              <p className="text-accent body-small">Client</p>
            </div>
          </div>
          <div>
            <Icon
              icon="material-symbols-light:keyboard-arrow-down-rounded"
              width="24"
              height="24"
              className="text-black"
            />
          </div>
        </div>

        {/* Modals */}
        {showNotifications && (
          <NotificationModal onClose={() => setShowNotifications(false)} />
        )}
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
        {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
      </div>
    </header>
  );
}

// Desktop Sidebar Component
function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex w-3/12 bg-black py-6 px-3 flex-col">
      <div className="text-2xl font-bold mb-8 px-6">
        <img src="/images/logo-white.svg" alt="logo" width={100} />
      </div>

      <nav className="flex-1 space-y-3 w-full">
        <SidebarItem
          to="/home"
          icon={
            <Icon
              icon="material-symbols-light:home-rounded"
              width="24"
              height="24"
            />
          }
          label="Home"
        />
        <SidebarItem
          to="#"
          icon={
            <Icon
              icon="material-symbols-light:home-repair-service-rounded"
              width="24"
              height="24"
            />
          }
          label="Manage Stocks"
        />
        <SidebarItem
          to="#"
          icon={
            <Icon
              icon="material-symbols-light:shoppingmode"
              width="24"
              height="24"
            />
          }
          label="Record Sales"
        />
        <SidebarItem
          to="/notification"
          icon={
            <Icon
              icon="material-symbols-light:notifications-rounded"
              width="24"
              height="24"
            />
          }
          label="Business Insights"
        />
        <SidebarItem
          to="/notification"
          icon={
            <Icon
              icon="material-symbols-light:notifications-rounded"
              width="24"
              height="24"
            />
          }
          label="Set Up Shop"
        />
        <SidebarItem
          to="/notification"
          icon={
            <Icon
              icon="material-symbols-light:notifications-rounded"
              width="24"
              height="24"
            />
          }
          label="Notification"
        />
      </nav>

      <div className="pt-4 space-y-4 w-full">
        <div className="border-t border-subtle pt-4 space-y-2">
          <SidebarItem
            to="/settings"
            icon={
              <Icon
                icon="material-symbols-light:settings-rounded"
                width="24"
                height="24"
              />
            }
            label="Settings"
          />
          <SidebarItem
            to="/logout"
            onClick={() => {
              localStorage.removeItem("authToken");
              sessionStorage.clear();
              window.location.href = "/login";
            }}
            icon={
              <Icon
                icon="material-symbols-light:logout-rounded"
                width="24"
                height="24"
              />
            }
            label="Logout"
          />
        </div>
      </div>
    </aside>
  );
}

// Desktop Sidebar Item Component
interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function SidebarItem({ to, icon, label, onClick }: SidebarItemProps) {
  const location = useLocation();
  const currentPathSegment = "/" + location.pathname.split("/")[1];
  const isActive = currentPathSegment === to;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 py-2 px-5 w-full rounded-lg cursor-pointer transition-colors hover:bg-primary-2 text-white"
      >
        {icon}
        <span className="text-sm">{label}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={`flex items-center gap-3 py-2 px-5 w-full rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-primary-1 text-black"
          : "hover:bg-secondary-4 text-white hover:text-white"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}

// Main Layout Component
export default function MainLayout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const menuRef = useRef<HTMLDivElement | null>(null);

  console.log(isMobileMenuOpen);
 

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
  }, [isMobileMenuOpen]);


  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-text">
      {/* Mobile Header */}
      <MobileHeader
        onMenuClick={() => setIsMobileMenuOpen(true)}
        onNotificationClick={() => setShowNotifications(true)}
      />

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content */}
      <div className="flex relative flex-col w-full overflow-y-auto lg:w-9/12 h-screen p-6">
        {/* Desktop Header */}
        <div className="sticky top-0 z-10 bg-white">
          <DesktopHeader
            onNotificationClick={() => setShowNotifications(true)}
            showNotifications={showNotifications}
            showProfile={showProfile}
            showSupport={showSupport}
            setShowNotifications={setShowNotifications}
            setShowProfile={setShowProfile}
            setShowSupport={setShowSupport}
          />
        </div>

        {/* Body (scrollable Outlet area) */}
        <main className="flex-1  pt-10 lg:px-0 lg:pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
