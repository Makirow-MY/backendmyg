import Blog from "@/components/Blog";
import Head from "next/head"
import axios from "axios";
import { useState, useEffect } from "react";
import { BsPostcard } from "react-icons/bs";
import { router, useRouter } from 'next/router';
import LoginLayout from "@/components/LoginLayout";
import { SiBloglovin } from "react-icons/si";
import Project from "@/components/Project";
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
              axios.get('/api/projects?id=' + id).then(res => {
               // console.log("id", id, "res", res);
                setProductInfo(res.data.data )
              })
             // console.log("productInfo", productInfo);
          }
    },[id])

    return  <LoginLayout>
    
    <>
  <Head>
     <title>Update Project</title>
  </Head>

  <div className="page">

    
              <div className="dashboard-header">
          <div>
            <h2>Edit <span>Project</span></h2>
            <p>Provide All Information</p>
          </div>
<div>

</div>
 
               </div>

                  <div className="mt-3">
                           {
                              productInfo && (
                                <Project {...productInfo} />
                              )
                           }
                  </div>
                  
                  </div>
    </>

    </LoginLayout>
}