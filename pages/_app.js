
import Aside from "@/components/Aside";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ParentComponent from "@/components/ParentComponent";
import "@/styles/global1.css";
import "@/styles/globals.css";
import "@/styles/global.css";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, createContext, useContext } from "react";
import { Toaster } from "react-hot-toast";
import { SearchContext } from "../components/search";
import { NotificationContext, NotificationProvider } from "@/components/NotificationContext";
import axios from "axios";
import io from 'socket.io-client';

// export const SearchContext = createContext();

// export const useSearch = () => useContext(SearchContext);

export default function App({ Component, pageProps: {session, ...pageProps}  }) {

  const [asideOpen, setAsideOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('');
 const router  = useRouter()

 useEffect(() => {
                const handleResize = () => {
                    setAsideOpen(window.innerWidth <= 768 ? false : true);
                };

                window.addEventListener('resize', handleResize);
                
                // Cleanup event listener on component unmount
                return () => window.removeEventListener('resize', handleResize);
            }, []);
console.log("Component", Component)
 useEffect(() =>{
   const handleStart = () => setLoading(true)
   const handleComplete = () => setLoading(false)
 
 if (router.isReady) {
    setLoading(false)
    
 }
setSearch('')
router.events.on("routeChangeStart", handleStart)
router.events.on("routeChangeComplete", handleComplete)
router.events.on("routeChangeError", handleComplete)

return () =>{
router.events.off("routeChangeStart", handleStart)
router.events.off("routeChangeComplete", handleComplete)
router.events.off("routeChangeError", handleComplete)

}

  }, [router.isReady])


    const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000/'); // Adjust URL if your socket server is on a different port/domain
    setSocket(newSocket);

    newSocket.on('new_notification', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    fetchNotifications();
    fetchUnreadCount();

    return () => newSocket.disconnect();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notification/seed.js');
      setNotifications(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('/api/notifications/unread');
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put('/api/notifications/mark-read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setUnreadCount((prev) => prev - 1);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const AsideOpener = () =>{
      setAsideOpen(!asideOpen)
  }
  return <>
  <div style={{position:'absolute', top:0, zIndex: 999999999999999999}}>
     <Toaster />
  </div>
 
  {
     loading ? (
        <div className="flex flex-col flex-center wh_100">
          <Loading />
          <h1 className="mt-1">Loading...</h1>
        </div>
     ) : 
     (<>


<SessionProvider session={session}> 
 <NotificationContext.Provider value={{ notifications, setNotifications, unreadCount, markAllRead, markRead }}>
     
       <div>
              <Header setSearch={setSearch}
              search={search}
               isOpen={asideOpen} 
               onToggleSidebar={() => setAsideOpen(!asideOpen)} />
              <Aside isOpen={asideOpen} />
        </div>
</NotificationContext.Provider>
</SessionProvider>
  

  


 
  <main>
    <div className={`dashboard ${asideOpen ? "with-sidebar" : ""}`}>
   
    <SessionProvider session={session}> 
   <SearchContext.Provider value={{ search, setSearch }}>
      <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markRead }}>
       <Component {...pageProps}   />
       </NotificationContext.Provider>
    </SearchContext.Provider>

      
      
    
    </SessionProvider>  

    </div>
  </main>
  
 
    
     
     </>)
  }
  
   
  </>
}
