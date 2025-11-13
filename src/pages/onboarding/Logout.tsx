import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Logout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // YOUR API CALL GOES HERE
      // const response = await fetch('YOUR_API_ENDPOINT/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Logout failed');
      // }

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Logged out successfully!");
      
      // Redirect to login page
      // window.location.href = '/login';
      
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
      >
        Logout
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Modal Content */}
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 flex items-center justify-center">
                <LogOut size={48} strokeWidth={2} className="text-gray-800" />
              </div>
            </div>

            {/* Text */}
            <h2 className="body-bold text-center text-secondary mb-8">
              Are you sure you want to Log Out?
            </h2>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 py-3 px-6 btn btn-primary border active:border-tertiary"
              >
                {isLoading ? "Logging out..." : "Log Out"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1 py-3 px-6 btn btn-primary border active:border-tertiary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}