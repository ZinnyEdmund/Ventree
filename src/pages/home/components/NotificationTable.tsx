// Reusable Notification Item Component
interface NotificationItemProps {
    message: string;
  }
  
export const NotificationItem: React.FC<NotificationItemProps> = ({ message }) => {
    return (
      <div className="p-4 border-b border-subtle-2 last:border-b-0">
        <p className="text-grey">{message}</p>
      </div>
    );
};