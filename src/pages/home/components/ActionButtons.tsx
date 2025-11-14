import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

// Reusable Action Card Component
interface ActionCardProps {
    title: string;
    icon: string;
    description: string;
    to: string
  }
  
export const ActionCard: React.FC<ActionCardProps> = ({
    title,
    icon,
    description,
    to
  }) => {
    return (
      <Link
        to={to}
        className="flex flex-col bg-secondary hover:bg-secondary-2 text-white rounded-lg p-4 text-left transition-all shadow-md hover:shadow-lg w-full"
      >
         <div className={`flex items-center gap-2 mb-2`}>
          <Icon icon={icon} width="24" />
          <h3 className="text-lg lg:text-sm xl:text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-subtle-2">{description}</p>
      </Link>
    );
  };