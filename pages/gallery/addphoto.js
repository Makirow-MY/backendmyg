import Blog from "@/components/Blog";
import LoginLayout from "@/components/LoginLayout";
import Photo from "@/components/photo";
import {    SiBloglovin} from "react-icons/si";


export default function Addphoto() {



 return  <LoginLayout>
     <>
       <div className="addblogspage">
               <div className="titledashboard flex flex-sb">
<div>
     <h2>Add <span>Photo</span></h2>
     <h3>ADMIN PANEL</h3>
</div>

        <div className="breadcrumb">  
                <SiBloglovin/> <span>/</span>
                <span>Addphotos</span>
              </div>
          
               </div>

               <div className="blogsadd">
                     <Photo />
               </div>
       </div>
    </>
    </LoginLayout>
}