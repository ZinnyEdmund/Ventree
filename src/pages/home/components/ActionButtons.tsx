import { Icon } from "@iconify/react";

// Reusable Action Card Component
interface ActionCardProps {
    title: string;
    icon: string;
    description: string;
    onClick?: () => void;
  }
  
export const ActionCard: React.FC<ActionCardProps> = ({
    title,
    icon,
    description,
    onClick,
  }) => {
    return (
      <button
        onClick={onClick}
        className="flex flex-col bg-secondary hover:bg-secondary-2 text-white rounded-lg p-4 text-left transition-all shadow-md hover:shadow-lg w-full"
      >
         <div className={`flex items-center gap-2 mb-2`}>
          <Icon icon={icon} className="" width="24" />
          <h3 className=" font-bold">{title}</h3>
        </div>
        <p className="text-sm text-subtle-2">{description}</p>
      </button>
    );
  };