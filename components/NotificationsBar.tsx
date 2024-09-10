import React from 'react';
import { X } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success';
  timestamp: Date;
}

interface NotificationsBarProps {
  notifications: Notification[];
  onClose: () => void;
  onClearAll: () => void;
}

const NotificationsBar: React.FC<NotificationsBarProps> = ({ notifications, onClose, onClearAll }) => {
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">Notifications</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      {notifications.length === 0 ? (
        <p className="p-4 text-gray-400">No new notifications</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-700">
            {notifications.map((notification) => (
              <li key={notification.id} className="p-4">
                <p className={`mb-1 ${notification.type === 'error' ? 'text-red-400' : notification.type === 'success' ? 'text-green-400' : 'text-blue-400'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500">
                  {notification.timestamp.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={onClearAll}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsBar;