import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaBell, FaCheck, FaCheckCircle, FaCheckDouble, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Spinner from '@/components/Spinner';



export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [selectedModel, setSelectedModel] = useState('All');
  const [groupPages, setGroupPages] = useState({}); // { dateLabel: currentPage }
  const itemsPerPage = 8;
  const router = useRouter();
  const notificationRefs = useRef({});

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await axios.get('/api/notification');
        setNotifications(response.data.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Filter and sort notifications when notifications or selectedModel changes
  useEffect(() => {
    let filtered = notifications;
    if (selectedModel !== 'All') {
      filtered = notifications.filter(notif => notif.model === selectedModel);
    }
    // Sort notifications: unread first, then read, both in descending date order
    filtered.sort((a, b) => {
      if (a.read === b.read) {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return a.read ? 1 : -1; // Unread (false) comes before read (true)
    });
    setFilteredNotifications(filtered);
    setGroupPages({}); // Reset pagination on filter change
  }, [notifications, selectedModel]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const markAsRead = async (id) => {
    try {
      await axios.put('/api/notification', { id, read: true });
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // IntersectionObserver to mark notifications as read when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.id;
            const notif = notifications.find(n => n._id === id);
            if (notif && !notif.read) {
              markAsRead(id);
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    Object.values(notificationRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredNotifications]);

  // Mark initially visible notifications as read on load
  useEffect(() => {
    if (!loading) {
      const visibleNotifications = filteredNotifications.slice(0, itemsPerPage).filter(n => !n.read);
      visibleNotifications.forEach(notif => markAsRead(notif._id));
    }
  }, [loading, filteredNotifications]);

  // Function to get relative date label
  const getDateLabel = (date) => {
    const today = new Date();
    const notifDate = new Date(date);
    const diffTime = today - notifDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  };

  // Group notifications by date label
  const groupedNotifications = filteredNotifications.reduce((groups, notif) => {
    const label = getDateLabel(notif.createdDate);
    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(notif);
    return groups;
  }, {});

  // Sorted groups by date (newest first)
  const sortedGroups = Object.keys(groupedNotifications).sort((a, b) => {
    const dateA = new Date(groupedNotifications[a][0].createdDate);
    const dateB = new Date(groupedNotifications[b][0].createdDate);
    return dateB - dateA;
  });

  const handlePageChange = (label, page) => {
    setGroupPages(prev => ({ ...prev, [label]: page }));
  };

  if (loading) {
    return <div className="loading"><Spinner/></div>;
  }

  return (
    <>
    <div className="page">
        <div className="dashboard-header">
          <div>
            <h2><span>Notifications</span></h2>
            <p>All activities are notified here</p>
          </div>

          <div className="filter-select" style={{ margin: '1rem 0' }}>
            <div className="flex flex-col gap-1">
              <label>Select Type</label>
          <select
            id="model-filter"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-select"
          >
            <option value="All">All</option>
            <option value="Profile">Profile</option>
            <option value="Blog">Blog</option>
            <option value="Comment">Comment</option>
            <option value="Project">Project</option>
            <option value="Contact">Contact</option>
            <option value="Review">Review</option>
            <option value="Transaction">Transaction</option>
          </select>
{/*               
              
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="p-2 rounded"
                disabled={loading}
              >
                {subjectOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select> */}
            </div>
          </div>
        </div>
        </div>
    <div className="container1">
      <section className="header">
        <h1 className="header-title">
          <FaBell className="header-icon" /> Notifications Dashboard
        </h1>
        <p className="header-subtitle">{notifications.length} total notifications</p>
        <button className="theme-toggle" onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
        <div className="filter-container">
          <label htmlFor="model-filter">Filter by Model:</label>
          <select
            id="model-filter"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-select"
          >
            <option value="All">All</option>
            <option value="Profile">Profile</option>
            <option value="Blog">Blog</option>
            <option value="Comment">Comment</option>
            <option value="Project">Project</option>
            <option value="Contact">Contact</option>
            <option value="Review">Review</option>
            <option value="Transaction">Transaction</option>
          </select>
        </div>
      </section>

      <div className="notification-timeline">
        {sortedGroups.map((label) => {
          const groupNotifs = groupedNotifications[label];
          const currentGroupPage = groupPages[label] || 1;
          const indexOfLastItem = currentGroupPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          const currentGroupNotifs = groupNotifs.slice(indexOfFirstItem, indexOfLastItem);
          const groupTotalPages = Math.ceil(groupNotifs.length / itemsPerPage);

          return (
            <div key={label} className="date-group">
             <div className='flex gap-1 flex-center'>
               <div className="date-label">{label}</div>
             </div>
              <div className="notification-grid">
                {currentGroupNotifs.map((notif) => (
                  <div
                    key={notif._id}
                    className="notification-card"
                    ref={(el) => (notificationRefs.current[notif._id] = el)}
                    data-id={notif._id}
                  >
                    <div className="card-header">
                      {notif.type === 'add' && <FaCheckCircle className="card-icon add" />}
                      {notif.type === 'update' && <FaExclamationTriangle className="card-icon update" />}
                      {notif.type === 'delete' && <FaTimesCircle className="card-icon delete" />}
                      <h2 className={`card-title ${notif.read ? '' : 'unread'}`}>
                        {notif.title}
                      </h2>
                    </div>
                    <p className="card-message">{notif.message}</p>
                    <div className="card-meta">
                      <span>Model: {notif.model}</span>
                      <span>Type: {notif.type.toUpperCase()}</span>
                      <span>Date: {new Date(notif.createdDate).toLocaleString()}</span>
                    </div>
                    <div className="card-actions">
                      <button className="action-button" onClick={() => markAsRead(notif._id)}>
                        {notif.read ? <FaCheckDouble/> : <FaCheck/> }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {groupTotalPages > 1 && (
                <div className="pagination">
                  {Array.from({ length: groupTotalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(label, index + 1)}
                      className={`pagination-button ${currentGroupPage === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <p className="empty-state">No notifications available.</p>
      )}
    </div>
    </>
  );
}