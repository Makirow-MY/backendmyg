import Blog from "@/components/Blog";
import Head from "next/head"
import axios from "axios";
import { useState, useEffect } from "react";
import { BsPostcard, BsQuestionCircle } from "react-icons/bs";
import { router, useRouter } from 'next/router';
import LoginLayout from "@/components/LoginLayout";
import { SiBloglovin } from "react-icons/si";
import toast from "react-hot-toast";
export default function DeleteProduct() {
 
    const router = useRouter();

    const {id} = router.query;
    const [productInfo, setProductInfo] = useState(null);
    
    useEffect(() =>{
       // console.log("id re",{id})
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

    function goBack() {
        router.push('/blogs')
    }
    async function deletBlog() {
          await axios.delete('/api/blogs?id=' + id);
          toast.success("Blog deleted Successfully")
          goBack()
    }

    return <>
  <Head>
     <title>delete Blog</title>
  </Head>

  <div className="blogpage">
                             <div className="titledashboard flex flex-sb">
                           <div>
                                <h2>Delete <span>{productInfo?.title}</span></h2>
                                <h3>ADMIN PANEL</h3>
                           </div>
                           
                                   <div className="breadcrumb">  
                                           <BsPostcard/> <span>/</span>
                                           <span>Delete Blog</span>
                                         </div>           
                  </div>

                  <div className="deletesec flex flex-center wh_100">
                           <div className="deletecard">
                            <BsQuestionCircle  size={100}/>
                            <p className="cookieHeading text-center">Are you sure you want to Delete {productInfo?.title}? </p>
                            <p className="cookieDescription">Beware, this action can not be reverse</p>
                            <div className="buttonContainer">
                                   <button className="acceptButton">Delete</button>
                                   <button className="declineButton">Cancel</button>
                            </div>
                           </div>
                  </div>
                  
                  </div>
    </>
}