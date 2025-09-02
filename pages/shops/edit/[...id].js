import Blog from "@/components/Blog";
import Head from "next/head"
import axios from "axios";
import { useState, useEffect } from "react";
import { BsPostcard } from "react-icons/bs";
import { router, useRouter } from 'next/router';
import LoginLayout from "@/components/LoginLayout";
import { SiBloglovin } from "react-icons/si";
import Project from "@/components/Project";
import Shop from "@/components/Shop";
export default function EditProject() {
 
    const router = useRouter();

    const {id} = router.query;
    const [productInfo, setProductInfo] = useState(null);
    
    useEffect(() =>{
       // console.log("id re",{id})
          if (!id) {
            return
          }
          else{
              axios.get('/api/shops?id=' + id).then(res => {
               // console.log("id", id, "res", res);
                setProductInfo(res.data.data )
              })
             // console.log("productInfo", productInfo);
          }
    },[id])

  return  <LoginLayout>
     <>
  <Head>
     <title>Update Product</title>
  </Head>

  <div className="blogpage">
                             <div className="titledashboard flex flex-sb">
                           <div>
                                <h2>Edit <span>{productInfo?.title}</span></h2>
                                <h3>ADMIN PANEL</h3>
                           </div>
                           
                                   <div className="breadcrumb">  
                                           <BsPostcard/> <span>/</span>
                                           <span>Edit Product </span>
                                         </div>           
                  </div>

                  <div className="mt-3">
                           {
                              productInfo && (
                                <Shop {...productInfo} />
                              )
                           }
                  </div>
                  
                  </div>
    </>
    </LoginLayout>
}