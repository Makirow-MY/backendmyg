
import LoginLayout from "@/components/LoginLayout";
import Project from "@/components/Project";
import Head from "next/head";
import {    SiBloglovin} from "react-icons/si";


export default function Addproject() {



   return  <LoginLayout>
    <>
     <Head>
                    <title>MYG Tech - Add Projects</title>
                    <meta name="description" content="Add Project website backend" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                  </Head>
       <div className="page">
        
   <div className="dashboard-header">
          <div>
            <h2>Add <span>Project</span></h2>
            <p>Provide All Information</p>
          </div>
<div>

</div>
 
               </div>

               <div className="blogsadd">
                     <Project />
               </div>
       </div>
    </>
    </LoginLayout>
}