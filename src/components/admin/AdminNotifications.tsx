import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Clock, Mail, Eye } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface Notification {
  type: 'new_host' | 'host_verified' | 'urgent_review';
  timestamp: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  message: string;
  priority: 'high' | 'medium' | 'low';
  read?: boolean;
  channels: string[];
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage
    const loadNotifications = () => {
      const stored = localStorage.getItem('admin_notifications');
      if (stored) {
        const parsedNotifications = JSON.parse(stored);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
      }
    };

    loadNotifications();

    // Poll for new notifications every 10 seconds
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (index: number) => {
    const updatedNotifications = [...notifications];
    if (!updatedNotifications[index].read) {
      updatedNotifications[index].read = true;
      setNotifications(updatedNotifications);
      setUnreadCount(prev => Math.max(0, prev - 1));
      localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (index: number) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_host':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'host_verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'urgent_review':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error" size="sm">High</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" size="sm">Low</Badge>;
      default:
        return <Badge variant="secondary" size="sm">Normal</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-umd-red transition-colors duration-200 rounded-lg hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-umd-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[70vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-umd-red" />
              <h3 className="text-lg font-bold text-umd-black">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="error" size="sm">{unreadCount} new</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {notification.type.replace('_', ' ')}
                          </span>
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => markAsRead(index)}
                            className="text-gray-400 hover:text-blue-500 p-1"
                            title="Mark as read"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteNotification(index)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="Delete notification"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatTimestamp(notification.timestamp)}</span>
                        <div className="flex items-center space-x-1">
                          {notification.channels.includes('email') && (
                            <Mail className="w-3 h-3" title="Email sent" />
                          )}
                          <span>via {notification.channels.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  // In real app, would navigate to full notifications page
                  alert('View all notifications - feature coming soon');
                  setShowDropdown(false);
                }}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default AdminNotifications;