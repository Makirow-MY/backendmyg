import { IoMenu } from "react-icons/io5";
import { BiExitFullscreen } from "react-icons/bi";
import { BsFullscreen } from "react-icons/bs";
import { GoScreenFull } from "react-icons/go";
import { useState, useEffect } from "react";
import LoginLayout from "./LoginLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
export default function Header({handleAsideOpener}) {
   
    const [isFull, setIsFull] = useState(false);
    const router = useRouter()

    const toggleScreen = () =>{
        if (!document.fullscreenElement) {
           document.documentElement.requestFullscreen().then(() => {
            setIsFull(true);
           }) 
        }
        else{
            document.exitFullscreen().then(() => {
                setIsFull(false)
            })
        }
    }

    const getImage = window.localStorage.getItem("UserImage")
//window.localStorage.getItem("UserImage") ||
    const [image, setImage] = useState("")

    useEffect (() => {
       setImage(getImage)
       
    }, [getImage])

    return    <LoginLayout>
    <>
        <header className="header flex flex-sb">
              <div className="logo flex gap-2">
                    <h1>ADMIN</h1>
                    <div className="headerham flex flex-center " onClick={handleAsideOpener}>
                         <IoMenu />
                    </div>
              </div>
              <div className="rightnav flex gap-2">
                            <div onClick={toggleScreen }>
                               
                               {isFull ?  <BiExitFullscreen />  :  <GoScreenFull />}
                            </div>
                            <div className="notification">
                                    <img src="/img/notification.png"  alt="notification  "/>
                            </div>
                            <div className="profilenav" onClick={() => { router.push("/setting")}}>
                                    <img src={image}  alt="profile  "/>
                            </div>
              </div>
        </header>
    </>
    </LoginLayout> 
}