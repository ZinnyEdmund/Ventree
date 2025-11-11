import { Icon } from "@iconify/react";

// Reusable Stat Card Component
interface StatCardProps {
    title: string;
    icon: string;
    value: string;
    description: string;
    variant?: "default" | "warning" | "success";
  }
  
export const StatCard: React.FC<StatCardProps> = ({
    title,
    icon,
    value,
    description,
    variant = "default",
  }) => {
    const getTextColor = () => {
      switch (variant) {
        case "warning":
          return "text-error";
        case "success":
          return "text-success";
        default:
          return "text-[#1E1E1ECC]";
      }
    };
  
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-accent-g2">
        <div>
          <Icon icon={icon} className="w-6 h-6 mb-4 text-[#1E1E1ECC]" />
          <h3 className={`text-sm font-medium mb-2 ${getTextColor()}`}>{title}</h3>
        </div>
        <p className="h6 font-bold text-black mb-1">{value}</p>
        <p className="text-sm text-[#1E1E1ECC]">{description}</p>
      </div>
    );
  };