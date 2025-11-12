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
        <div className={`flex items-center gap-2 mb-2 ${getTextColor()}`}>
          <Icon icon={icon} className="" width="24" />
          <h3 className={`text-sm font-medium`}>{title}</h3>
        </div>
        <p className="h6 font-bold text-black mb-1">{value}</p>
        <p className="text-sm text-[#1E1E1E80]">{description}</p>
      </div>
    );
  };