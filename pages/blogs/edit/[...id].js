import Blog from "@/components/Blog";
import Head from "next/head"
import axios from "axios";
import { useState, useEffect } from "react";
import { BsPostcard } from "react-icons/bs";
import { router, useRouter } from 'next/router';
import LoginLayout from "@/components/LoginLayout";
import { SiBloglovin } from "react-icons/si";
export default function EditProduct() {
 
    const router = useRouter();

    const {id} = router.query;
    const [productInfo, setProductInfo] = useState(null);
    
    useEffect(() =>{
       console.log("id re",{id})
          if (!id) {
            return
          }
          else{
              axios.get('/api/blogs?id=' + id).then(res => {
               // console.log("id", id, "res", res);
                setProductInfo(res.data.data )
              })
             // console.log("productInfo", productInfo);
          }
    },[id])

 return  <LoginLayout>
    
    <>

   <Head>
                  <title>MYG Tech -  Update Blog</title>
                  <meta name="description" content="Blog website backend" />
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>

     <div className="page">
        
   <div className="dashboard-header">
          <div>
            <h2>Edit <span>Blog</span></h2>
            <p>Provide All Information</p>
          </div>
<div>

</div>
 
               </div>

                  <div className="mt-3">
                           {
                              productInfo && (
                                <Blog {...productInfo} />
                              )
                           }
                  </div>
                  
                  </div>
    </>
    </LoginLayout>
}