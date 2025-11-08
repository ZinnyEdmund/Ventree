// Reusable Action Card Component
interface ActionCardProps {
    title: string;
    description: string;
    onClick?: () => void;
  }
  
export const ActionCard: React.FC<ActionCardProps> = ({
    title,
    description,
    onClick,
  }) => {
    return (
      <button
        onClick={onClick}
        className="flex flex-col bg-secondary hover:bg-secondary-2 text-white rounded-lg p-4 text-left transition-all shadow-md hover:shadow-lg w-full"
      >
        <h3 className=" font-bold mb-2">{title}</h3>
        <p className="text-sm text-subtle-2">{description}</p>
      </button>
    );
  };