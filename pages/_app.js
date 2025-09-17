
import Aside from "@/components/Aside";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ParentComponent from "@/components/ParentComponent";
import "@/styles/global1.css";
import "@/styles/globals.css";
import "@/styles/global.css";
import '@/styles/notifications.css';
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, createContext, useContext } from "react";
import { Toaster } from "react-hot-toast";
import { SearchContext } from "../components/search";
//import { NotificationContext, NotificationProvider } from "@/components/NotificationContext";
import axios from "axios";
import io from 'socket.io-client';

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
          
        </div>
     ) : 
     (<>


<SessionProvider session={session}> 
       <div>
              <Header setSearch={setSearch}
              search={search}
               isOpen={asideOpen} 
               onToggleSidebar={() => setAsideOpen(!asideOpen)} />
              <Aside isOpen={asideOpen} />
        </div>

</SessionProvider>
  

  


 
  <main>
    <div className={`dashboard ${asideOpen ? "with-sidebar" : ""}`}>
   
    <SessionProvider session={session}> 
   <SearchContext.Provider value={{ search, setSearch }}>
       <Component {...pageProps}   />
     
    </SearchContext.Provider>

      
      
    
    </SessionProvider>  

    </div>
  </main>
  
 
    
     
     </>)
  }
  
   
  </>
}
