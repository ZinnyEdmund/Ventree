import { useState } from "react";
import { LogOut, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { handleApiError } from "../../components/common/validation";

export default function Logout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // YOUR API CALL HERE
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Logged out successfully!");
      // window.location.href = '/login';
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
      >
        Logout
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 flex items-center justify-center">
                <LogOut size={48} strokeWidth={2} className="text-gray-800" />
              </div>
            </div>

            <h2 className="body-bold text-center text-secondary mb-8">
              Are you sure you want to Log Out?
            </h2>

            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 py-3 px-6 btn btn-primary border active:border-tertiary flex items-center justify-center gap-2"
              >
                {isLoading ? "Logging out" : "Log Out"}
                {isLoading && <LoaderCircle width={20} className="animate-spin" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1 py-3 px-6 btn btn-secondary border"
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