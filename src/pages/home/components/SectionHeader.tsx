import { ChevronDown } from "lucide-react";

// Reusable Section Header Component
interface SectionHeaderProps {
    title: string;
    isCollapsible?: boolean;
    isExpanded?: boolean;
    onToggle?: () => void;
  }
  
export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    isCollapsible = true,
    isExpanded = true,
    onToggle,
  }) => {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
        disabled={!isCollapsible}
      >
        <h2 className="h4 text-secondary">{title}</h2>
        {isCollapsible && (
          <ChevronDown
            className={`hidden md:block w-5 h-5 text-gray-600 transition-transform ${
              isExpanded ? "" : "-rotate-90"
            }`}
          />
        )}
      </button>
    );
  };