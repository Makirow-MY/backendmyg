import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import { getNotifications } from './api/notification/controller';


export default function Notifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filter, setFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [groupedNotifications, setGroupedNotifications] = useState({});

  useEffect(() => {
    fetchNotifications();
    const socket = io();
    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
      }
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    groupNotifications();
  }, [notifications, filter, dateFilter]);

  const fetchNotifications = async () => {
     console.log(getNotifications());
    try {
      const res = await axios.get('/api/notification/controller', {
        params: { page, limit, model: filter, date: dateFilter }
      });
      setNotifications(res.data.notifications);
      setTotal(res.data.total);
    
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const groupNotifications = () => {
    const filtered = filter === 'All' ? notifications : notifications.filter((n) => n.model === filter);
    const dateFiltered = dateFilter === 'All' ? filtered : filtered.filter((n) => getDateCategory(new Date(n.createdAt)) === dateFilter);

    const groups = dateFiltered.reduce((acc, notif) => {
      const category = getDateCategory(new Date(notif.createdAt));
      if (!acc[category]) acc[category] = [];
      acc[category].push(notif);
      return acc;
    }, {});

    const sortedGroups = Object.keys(groups)
      .map((category) => ({ category, notifs: groups[category] }))
      .sort((a, b) => getSortValue(b.category) - getSortValue(a.category));

    const groupedObj = sortedGroups.reduce((acc, group) => {
      acc[group.category] = group.notifs;
      return acc;
    }, {});

    setGroupedNotifications(groupedObj);
  };

  const getDateCategory = (date) => {
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays === 2) return '2 days ago';
    if (diffDays === 3) return '3 days ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return '2 weeks ago';
    return '1 month ago';
  };

  const getSortValue = (category) => {
    const now = new Date().getTime();
    if (category === 'Today') return now;
    if (category === 'Yesterday') return now - 86400000;
    if (category === '2 days ago') return now - (2 * 86400000);
    if (category === '3 days ago') return now - (3 * 86400000);
    if (category.endsWith('days ago')) {
      const days = parseInt(category.split(' ')[0]);
      return now - (days * 86400000);
    }
    if (category === '1 week ago') return now - (7 * 86400000);
    if (category === '2 weeks ago') return now - (14 * 86400000);
    if (category === '1 month ago') return now - (30 * 86400000);
    return now - Infinity;
  };

  const handleMarkRead = async (id) => {
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

  const handleMarkAllRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchNotifications();
  };

  if (!session) return null;

  return (
    <div className="notifications-page">
      <header className="dashboard-header">
        <div>
          <h2>Notifications <span className="unread-badge">{unreadCount}</span></h2>
          <p>All Recent Activities</p>
        </div>
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Blog</option>
            <option>Comment</option>
            <option>Contact</option>
            <option>Project</option>
            <option>Review</option>
            <option>Transaction</option>
          </select>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option>All</option>
            <option>Today</option>
            <option>Yesterday</option>
            <option>2 days ago</option>
            <option>3 days ago</option>
            <option>1 week ago</option>
            <option>2 weeks ago</option>
            <option>1 month ago</option>
          </select>
          <button onClick={handleMarkAllRead}>Mark All as Read</button>
        </div>
      </header>
      <div className="notifications-container">
        {Object.keys(groupedNotifications).length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          Object.keys(groupedNotifications).map((category) => (
            <div key={category} className="notification-group">
              <h3>{category}</h3>
              <ul>
                {groupedNotifications[category].map((notif) => (
                  <li
                    key={notif._id}
                    className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                    onClick={() => !notif.read && handleMarkRead(notif._id)}
                  >
                    <span>{notif.message}</span>
                    <small>{new Date(notif.createdAt).toLocaleString()}</small>
                    {!notif.read && <span className="unread-dot"></span>}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {Math.ceil(total / limit)}</span>
        <button
          disabled={page === Math.ceil(total / limit)}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}