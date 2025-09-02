import Blog from "@/components/Blog";
import LoginLayout from "@/components/LoginLayout";
import Head from "next/head";
import {    SiBloglovin} from "react-icons/si";


export default function Addblog() {



    return  <LoginLayout>
    
    <>
     <Head>
                    <title>MYG Tech - Add Blog</title>
                    <meta name="description" content="Add Blog website backend" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                  </Head>
         <div className="page">
        
   <div className="dashboard-header">
          <div>
            <h2>Add <span>Blog</span></h2>
            <p>Provide All Information</p>
          </div>
<div>

</div>
 
               </div>

               <div className="blogsadd">
                     <Blog />
               </div>
       </div>
    </>

    </LoginLayout>
}