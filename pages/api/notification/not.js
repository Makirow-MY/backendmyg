import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async (params = {}) => {
    try {
      const res = await axios.get('/api/notifications', { params });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, unreadCount, fetchNotifications, markRead, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}