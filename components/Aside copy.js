import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPostcard } from "react-icons/bs";
import {IoCallOutline, IoHome, IoHomeOutline, IoSettingsOutline, IoStorefront, IoStorefrontOutline} from "react-icons/io5"
import {GrGallery} from "react-icons/gr"
import { TiContacts} from "react-icons/ti";
import {MdOutlineWorkOutline} from "react-icons/md"
import LoginLayout from "./LoginLayout";
import { signOut, useSession } from "next-auth/react";
 

export default function Aside({handleAsideOpener, asideOpen}) {
        const {data: session} = useSession()
        const router = useRouter();
        const [clicked, setClicked] = useState(false)
        const [openSideBar,setOpenSideBar] = useState(asideOpen)
        const [activeLink, setActiveLink] = useState("/");
         
  const handleClick = () =>{
        setClicked(!clicked);
  }
  
  const handleLinkClick = (link) =>{
        setActiveLink(e => (e === link ? null : link))
        setClicked(false);
}

useEffect(() =>{
        if (!session) {
            setOpenSideBar(false)    
        }
        else{
                setOpenSideBar(asideOpen)          
        }
       
}, [asideOpen, openSideBar, session])

useEffect(() =>{
        setActiveLink(router.pathname); 
}, [router.pathname])



if (session) {
        return <>
        
        <aside className={openSideBar ? `asideleft active` : "asideleft"}>
                <ul>
                        <Link href='/'>
                                <li className="navactive">
                                        <IoHomeOutline />
                                     <span>Dashboard</span>   
                                </li>
                        </Link>
                        
                        <li className={activeLink === "/blogs" ? "navactive flex-col flex-left" : "flex-col flex-left  "} onClick={() => handleLinkClick("/blogs")}>
                                     <div className="flex gap-1">
                                        <BsPostcard />
                                        <span>Blogs</span>
                                     </div> 
                                     {activeLink === "/blogs" && 
                                     (
                                        <ul>
                                        <Link href={"/blogs"}><li>All Blogs</li></Link>
                                        <Link href={"/blogs/draft"}><li>Draft Blogs</li></Link>
                                        <Link href={"/blogs/addblog"}><li>Upload Blogs</li></Link>
                                     </ul>
                                     )
                                     }
                                     
                        </li>

                        <li className={activeLink === "/projects" ? "navactive flex-col flex-left" : "flex-col flex-left  "} onClick={() => handleLinkClick("/projects")}>
                                     <div className="flex gap-1">
                                        <MdOutlineWorkOutline />
                                        <span>Projects</span>
                                     </div> 
                                     {activeLink === "/projects" && 
                                     (
                                        <ul>
                                        <Link href={"/projects"}><li>All Projects</li></Link>
                                        <Link href={"/projects/draftprojects"}><li>Draft Projects</li></Link>
                                        <Link href={"/projects/addproject"}><li>Upload Projects</li></Link>
                                     </ul>
                                     )
                                     }
                                     
                        </li>

                        <li className={activeLink === "/shops" ? "navactive flex-col flex-left" : "flex-col flex-left  "} onClick={() => handleLinkClick("/shops")}>
                                     <div className="flex gap-1">
                                        <IoStorefrontOutline />
                                        <span>Shops</span>
                                     </div> 
                                     {activeLink === "/shops" && 
                                     (
                                        <ul>
                                        <Link href={"/shops"}><li>All Products</li></Link>
                                        <Link href={"/shops/draftshop"}><li>Draft Products</li></Link>
                                        <Link href={"/shops/addproduct"}><li>Upload Product</li></Link>
                                     </ul>
                                     )
                                     }
                                     
                        </li>

                        <li className={activeLink === "/gallery" ? "navactive flex-col flex-left" : "flex-col flex-left  "} onClick={() => handleLinkClick("/galary")}>
                                     <div className="flex gap-1">
                                        <GrGallery />
                                        <span>Gallery</span>
                                     </div> 
                                     {activeLink === "/galary" && 
                                     (
                                        <ul>
                                        <Link href={"/gallery"}><li>All Photos</li></Link>
                                        <Link href={"/gallery/addphoto"}><li>Upload Photos</li></Link>
                                     </ul>
                                     )
                                     }
                                     
                        </li>

                        <Link href='/contacts'>
                                <li className={activeLink === "/contacts" ? "navactive" : ""} onClick={() => handleLinkClick("/contacts")}>
                                        <TiContacts />
                                     <span>Contacts</span>   
                                </li>
                        </Link>

                        <Link href='/setting'>
                                <li className={activeLink === "/settings" ? "navactive" : ""} onClick={() => handleLinkClick("/settings")}>
                                        <IoSettingsOutline />
                                     <span>Settings</span>   
                                </li>
                        </Link>
          
                </ul>
                <button onClick={() => {signOut();
                        router.push("/auth/signin")
                }} className="logoutbtn">
                     Logout
                </button>
        </aside>

        </> 
}

       

       
}