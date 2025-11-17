import { Icon } from "@iconify/react";

export default function AboutApp() {
  return (
    <section className="min-h-screen bg-white py-6 px-4">
      <div className="w-full mx-auto space-y-8 rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 pb-4">
          <Icon
            icon="iconamoon:arrow-left-6-circle-light"
            width={24}
            height={24}
            aria-hidden="true"
          />
          <h1 className="h3 text-black">About App</h1>
        </div>

        {/* Version Section */}
        <div className="mb-6 p-4 shadow-sm rounded-lg">
          <h2 className="h4 text-black mb-1">Version</h2>
          <p className="body text-black">1.0.0</p>
        </div>

        {/* App Language Section */}
        <div className="mb-6 p-4 shadow-sm rounded-lg">
          <h2 className="h4 text-black mb-1">
            App Language
          </h2>
          <p className="body text-black">English</p>
        </div>

        {/* About Section */}
        <div className="p-4 shadow-sm rounded-lg">
          <h2 className="h4 text-black mb-2">About</h2>
          <p className="body text-subtle-text leading-relaxed">
            Our application is designed to provide you with a seamless
            experience. We're committed to continuous improvement and regularly
            update our features based on user feedback.
          </p>
        </div>
      </div>
    </section>
  );
}
