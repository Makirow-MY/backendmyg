import Dataloading from "@/components/Dataloading";
import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";
import { useState, useEffect } from "react";
import {    SiBloglovin} from "react-icons/si";
import { FaEdit, FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";
import { BsPostcard, BsQuestionCircle } from "react-icons/bs";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import LoginLayout from "@/components/LoginLayout";

export default function Contact() {

    const [currP, setCurrP] = useState(1);
    const [pagePage] = useState(7)
 
    const [randomIndex, setRandomIndex] = useState(null);
 
    
 
    const [searchQ, setSearchQ] = useState('');
      const [refresh, setRefresh] = useState(false);
      const {alldata, loading} = useFetchData('/api/contacts',refresh);
      const [BlogAllData, setBlogAllData] = useState(alldata);
 
      const paginate = (pageNum) =>{
           setCurrP(pageNum)
      };
  const router = useRouter();
      const [isDelete, setDelete] = useState(false);
      const [productInfo, setProductInfo] = useState(null);
      

      async function chooseDel(id) {
         axios.get('/api/contacts?id=' + id).then(res => {
          //   console.log("id", id, "res", res);
             setProductInfo(res.data.data )
           })
         //  console.log("productInfo", productInfo);
           setRefresh(true);
           setDelete(true)
      }
      function goBack() {
       // console.log("BlogAllData", BlogAllData)
         setRefresh(!refresh);
         setDelete(false);
        router.push('/contacts/process1');
         
     }
     async function deletBlog(id) {
       //  console.log("delete id", id)
         await axios.post("/api/contacts", {userId: id}).then(res => {
             setBlogAllData(alldata);
         });
             goBack()
        //  return Loading()
     }
      const allBlogs = alldata.length
      const filterBlog = searchQ.trim() === '' ? alldata : alldata.filter(blog => blog.title.toLowerCase().includes(searchQ.toLowerCase()) )
 
      const indexfirstString = (currP - 1) * pagePage;
     const indexlastString = currP * pagePage;
     const curreBlogs = filterBlog.slice(indexfirstString, indexlastString)
    const pageNum = [];
    for (let index = 1; index <= Math.ceil(allBlogs/pagePage); index++) {
       pageNum.push(index);  
        
    }
   return  <LoginLayout>
    
    <> 
                  <div className="blogpage">
                             <div className="titledashboard flex flex-sb">
                           <div>
                                <h2>My <span>Contact</span></h2>
                                <h3>ADMIN PANEL</h3>
                           </div>
                           
                                   <div className="breadcrumb">  
                                           <SiBloglovin/> <span>/</span>
                                           <span>Contact</span>
                                         </div>           
                  </div>
                  <div className="blogstable">
                     <div className="flex gap-2 mb-1">
                         <h2>Search Contact</h2>
                         <input type="text" onChange={(e) => setSearchQ(e.target.value)} placeholder="search by name or email..." />
                     </div>

                     <table className="table table-styling">
                          <thead>
                              <tr>
                                 <th>#</th>
                                 <th>Full Name</th>
                                 <th>Email</th>
                                 <th>Phone no</th>
                                 <th>Project</th>
                                 <th>Open Contact</th>                                
                              </tr>
                          </thead>
                          <tbody>
                            {
                                loading ? <>
                                <tr>
                                    <td>
                                        <Dataloading />
                                    </td>
                                </tr>
                                </>
                                :<>
                                {
                                    curreBlogs.length === 0 ?
                                    (
                                        <tr>
                                            <td colSpan={6} className="text-center" >No Contact Found</td>
                                        </tr>
                                    )
                                    :
                                (
                                    curreBlogs.map((blogs, index) =>{
                                        return (
                                            <tr key={blogs._id}>
                                               <td>
                                                 {indexfirstString + index + 1}
                                               </td>
                                               <td><h3>{blogs.clientInfo.firstName} {blogs.clientInfo.lastName}</h3></td>
                                              <td><h3>{blogs.clientInfo.email}</h3></td>
                                              <td><h3>{blogs.clientInfo.phone}</h3>
                                              </td>
                                              <td><h3>{blogs.clientInfo.country}</h3></td>
                                               <td>
                                                  <div className="flex gap-2 flex-center">
                                                        <Link href={`/contacts/view/${blogs._id}`} >
                                                        <button><FaRegEye/></button>
                                                        </Link>
                                                                      
                                                  </div>
                                               </td>
                                           
                                            </tr>
                                        )
                                    }
                                    
                                    )
                                )
                                }
                                </>
                            }
                          </tbody>
                     </table>

                     {
                        curreBlogs.length == 0 ? ("") : (
                            <div className="blogpagination">
                                        <button onClick={() => paginate(currP - 1)} disabled={ currP === 1}><IoChevronBack style={{fontSize: '20'}} /></button>
                                        {
                                             pageNum.slice(Math.max(currP - 3, 0), Math.min(currP + 2, pageNum.length)).map(num => (
                                                <button key={num} onClick={
                                                    () => paginate(num)
                                                } className={`${currP === num ? 'active' : ''}`}>
                                                    {num}
                                                </button>
                                             ))

                                        }

<button onClick={() => paginate(currP + 1)} disabled={ curreBlogs.length < pagePage}><IoChevronForward style={{fontSize: '20'}} /></button>
                            </div>
                        ) 
                     }
                  </div>
                  {
                    isDelete && (
                            <div className="deletesec">
                                <div className="pot" >
                                    <div className="deletecard">
                                                    <BsQuestionCircle  size={100}/>
                                                    <p className="cookieHeading text-center">Are you sure you want to Delete {productInfo?.title}? </p>
                                                    <p className="cookieDescription">Beware, this action can not be reverse</p>
                                                    <div className="buttonContainer">
                                                           <button className="acceptButton" onClick={() => deletBlog(productInfo._id)}>Delete</button>
                                                           <button className="declineButton" onClick={() => setDelete(false)}>Cancel</button>
                                                    </div>
                                    </div>
                                                   </div>
                            </div>
                                                   
                                 
                    )
                  }
                  </div>
    </>

    </LoginLayout>
}