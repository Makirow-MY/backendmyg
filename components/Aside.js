import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { IoHome, IoHomeOutline, IoPeople, IoPeopleOutline, IoSettingsOutline, IoStorefrontOutline } from "react-icons/io5";
import { BsPostcard } from "react-icons/bs";
import { GrGallery } from "react-icons/gr";
import { MdOutlineWorkOutline } from "react-icons/md";
import { TiContacts } from "react-icons/ti";
import { useEffect, useState } from "react";
import { FaBloggerB, FaProductHunt, FaUserFriends } from "react-icons/fa";
import { HiOutlineHome } from 'react-icons/hi'; // Best home icon
import { 
  FiFolder,      // Perfect for projects
  FiFileText,    // Ideal for blogs/posts
  FiPackage,     // Best for products
  FiUsers,        // Most clear visitors icon
  FiX
} from 'react-icons/fi';


export default function Aside({ isOpen, setAsideOpen }) {
  const { data: session } = useSession();
   const [isTablet, setIsTablet] = useState(window.innerWidth <= 789);
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);
const [profileImage, setProfileImage] = useState("/img/profile.png");
    
useEffect(() => {
                const handleResize = () => {
                    setIsTablet(window.innerWidth <= 789);
                };

                window.addEventListener('resize', handleResize);
                
                // Cleanup event listener on component unmount
                return () => window.removeEventListener('resize', handleResize);
            }, []);
  const handleSignOut = () => {
    signOut();
    router.push("/auth/signin");
  };
    useEffect(() => {
      const img = window.localStorage.getItem("UserImage");
      if (img) setProfileImage(img);
    }, []);

  return (
    session && (
        <>
       
      <aside className={`aside ${isOpen ? "open" : ""}`}>
            <div className="relative">
               <FiX className={`close-icon`} onClick={() => setAsideOpen(false)} />
            
             <h1 className="logo " onClick={() => router.push('/')}>MYG Tech</h1>
       
        <div className="flex">
                    <img className="profile-icon" src={profileImage} alt="profile" />
                <div className="profile-name">
                  {window.localStorage.getItem("UserName") || "Unkown User"}
                  <br />
                  <span className="profile-email">
                        Admin
                  </span>
                  </div>
                  
                </div>
                </div>
        <ul>
          
<Link className={active === "/" ? "active" : ""} href={"/"}>
  <li className="flex"><HiOutlineHome className="text-lg" /> <span>Dashboard</span></li>
</Link>


<Link className={active.startsWith("/visitors") ? "active" : ""} href={"/visitors"}>
  <li className="flex"><FiUsers className="text-lg" /> <span>Visitors</span></li>
</Link>
<Link className={active.startsWith("/projects") ? "active" : ""} href={"/projects"}>
  <li className="flex"><FiFolder className="text-lg" /> <span>Projects</span></li>
</Link>

<Link className={active.startsWith("/blogs") ? "active" : ""} href={"/blogs"}>
  <li className="flex"><FiFileText className="text-lg" /> <span>Blogs</span></li>
</Link>

<Link className={active.startsWith("/shops") ? "active" : ""} href={"/shops"}>
  <li className="flex"><FiPackage className="text-lg" /> <span>Products</span></li>
</Link>






          
        </ul> 
      </aside>
      </>
    )
  );
}
