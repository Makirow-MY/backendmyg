import { IoClose, IoExit, IoMenu, IoNotifications, IoSearch, IoSearchCircleOutline } from "react-icons/io5";
import { BiBell, BiExitFullscreen } from "react-icons/bi";
import { GoScreenFull } from "react-icons/go";
import { useState, useEffect } from "react";
import { FaChevronDown, FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { FiBell, FiSearch } from "react-icons/fi";
import { useNotification } from "./NotificationContext";
import axios from "axios";
import toast from "react-hot-toast";
//import { useNotifications } from "./NotificationContext";
//import { useNotifications } from "../NotificationContext"; // Import the context

export default function Header({ onToggleSidebar, isOpen, setSearch, search }) {
  const [isFull, setIsFull] = useState(false);
  const [profileImage, setProfileImage] = useState("/img/profile.png");
  const { data: session } = useSession();
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [active, setActive] = useState(router.pathname);
 // const { notifications, unreadCount, markAllRead, markRead } = useNotification(); // Get unread count from context

  const handleSignOut = () => {
    signOut();
    router.push("/auth/signin");
  };
  const [isdet, setIsdet] = useState(false);
  const [isdet1, setIsdet1] = useState(false);
  useEffect(() => {
    const img = window.localStorage.getItem("UserImage");
    if (img) setProfileImage(img);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFull(true);
    } else {
      document.exitFullscreen();
      setIsFull(false);
    }
  };

  useEffect(() => {
    const isDark = localStorage.getItem('darkmode');
    setDark(isDark);
    setTimeout(() => {
   toast.dismiss();
}, 3000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/notification?unread=true`);
        if (response.data.success && response.data.data > 0) {
          setUnreadCount(response.data.data);
        }
    //     axios.get('/api/notification?unread=' + true).then(res => {
    //                  console.log("id", id, "res", res);
    // toast.success(response.data.message);
    //                })
    //   } catch (error) {
    //     toast.error('Error fetching unread count:', error);
     //}
}
catch (error) {
    //  toast.error('Error fetching notifications');
}
    }
    fetchData();
  }, [router.pathname]);

  useEffect(() => {
    
    if (dark) {
      document.body.classList.add('light');
      localStorage.setItem('darkmode', true);
    } else {
      document.body.classList.remove('light');
      localStorage.setItem('darkmode', false);
    }
  }, [dark]);

  const ToggleMode = () => {
    setDark(!dark);
  };

  return (
    session && (
      <>
        <header className="header">
          <div className="header-left">
            <h1 className="logo " onClick={() => router.push('/')}>MYG Tech</h1>
            <div className="flex gap-1">
              {isdet1 && <IoClose className="noti" onClick={() => setIsdet1(!isdet1)} />}
              <IoMenu className="noti" onClick={onToggleSidebar} />
            </div>
          </div>
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="search-button">
              <FaSearch />
            </button>
          </form>
          {isdet1 && (
            <form className="form2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Search here"
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
            </form>
          )}
          {!isdet1 && (
            <div className="header-right">
              <div className="fullscreen-icon" onClick={toggleFullscreen}>
                {isFull ? <BiExitFullscreen /> : <GoScreenFull />}
              </div>

              {!isdet1 && search == '' && <FiSearch className="noti dide" onClick={() => setIsdet1(true)} />}
              {dark && <FaMoon onClick={ToggleMode} className="noti" />}
              {!dark && <FaSun onClick={ToggleMode} className="noti" />}

              <div className="notification-wrapper relative cursor"
              onClick={() => router.push('/notification')}
               >
                <IoNotifications className="noti" />
                {
                unreadCount > 0 && <span className="unread-badge">{unreadCount > 999 ?
                  Math.floor
                  (unreadCount / 1000)
                   + 'K' : unreadCount
                }</span>
              
                  }  </div>

              <div className="flex" onClick={() => setIsdet(!isdet)}>
                <img className="profile-icon" src={profileImage} alt="profile" />
                <div className="profile-name">
                  {window.localStorage.getItem("UserName") || "Unkown User"}
                </div>
                <FaChevronDown />
              </div>
            </div>
          )}
        </header>
        {isdet && (
          <div className="head-opt">
            <ul>
              <a href="/profile">
                <li>Profile</li>
              </a>
              <a style={{ background: 'rgba(255, 0, 0, 0.3)' }} onClick={handleSignOut}>
                <li>Logout</li>
              </a>
            </ul>
          </div>
        )}
      </>
    )
  );
}