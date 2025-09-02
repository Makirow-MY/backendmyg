
import LoginLayout from "@/components/LoginLayout";
import Project from "@/components/Project";
import Shop from "@/components/Shop";
import Head from "next/head";
import {    SiBloglovin} from "react-icons/si";


export default function Addpoduct() {



    return  <LoginLayout>

<>
 <Head>
                <title>MYG Tech - Add Products</title>
                <meta name="description" content="Blog website backend" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Head>

       <div className="addblogspage">
               <div className="titledashboard flex flex-sb">
<div>
     <h2>Add <span>Product</span></h2>
     <h3>ADMIN PANEL</h3>
</div>

        <div className="breadcrumb">  
                <SiBloglovin/> <span>/</span>
                <span>Addproduct</span>
              </div>
          
               </div>

               <div className="blogsadd">
                     <Shop />
               </div>
       </div>
    </>

    </LoginLayout>
   
}