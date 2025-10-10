import Dataloading from "@/components/Dataloading";
import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { SiBloglovin } from "react-icons/si";
import { FaEdit, FaTrash } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";
import { BsPostcard, BsQuestionCircle } from "react-icons/bs";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { IoChevronBack, IoChevronForward, IoClose, IoTrash } from "react-icons/io5";
import LoginLayout from "@/components/LoginLayout";
import { useSearch } from "../../components/search";
import UserTable from "../UserTable";
import Head from "next/head";

export default function Projects() {

  const [allData, setAllData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currP, setCurrP] = useState(1);
  const [pagePage, setPagePage] = useState(6);
  const { search, setSearch } = useSearch();
  const router = useRouter()
  const [mainFilter, setMainFilter] = useState("all"); // 'all', 'review', 'comment', 'contact'
  const [subjectFilter, setSubjectFilter] = useState("recent"); // 'recent', 'alphabetical', etc.
  const [subjectOptions, setSubjectOptions] = useState([
      { value: "recent", label: "Recent" },
      { value: "alphabetical", label: "Title Alphabetically" },
      { value: "category", label: "By Project Category" }, 
      { value: "reviwed", label: "By Most Reviewed" },   
]);
      const [isDelete, setDelete] = useState(false);
      const [productInfo, setProductInfo] = useState(null);
const [originalData, setOriginalData] = useState({
    reviews: [],
    comments: [],
    contacts: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [projectsRes] = await Promise.all([
          axios.get('/api/projects'),
          ]);

        setOriginalData({
          reviews: projectsRes.data.data.filter(ab => ab.status === 'publish' && ab.projectType === 'For Sale' ),
         });

        const projects = projectsRes.data.data.filter(ab => ab.status === 'publish' && ab.projectType === 'For Sale' );
        
       

        projects.sort((a, b) => b.createdAt - a.createdAt);
        setAllData(projects);
        setLoading(false);
      
      } catch (err) {
        console.log('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);
     useEffect(() => {
            const filterData = () => {
       let filtered = [...allData];
    console.log("filtered", filtered);
    if (search.trim().toLowerCase() !== '') {
      filtered = filtered.filter(item => 
        item?.title.toLowerCase().includes(search.toLowerCase()) || 
        item.client.toLowerCase().includes(search.toLowerCase())
      );
    }
        }
        filterData();
      },[search])


  const filterData = () => {
    let filtered = [...allData];
  
    if (search.trim().toLowerCase() !== '') {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) || 
        item.client.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (mainFilter !== 'all') {
      filtered = filtered.filter(item => item.projectcategory === mainFilter);
    }
  
    switch(subjectFilter) {
      case 'recent':
        filtered.sort((a, b) => b.updatedAt - a.updatedAt);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'alphabetical-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date-asc':
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'category':
        filtered.sort((a, b) => (a.projectcategory[0] || '').localeCompare(b.projectcategory[0] || ''));
         break;
      case 'reviwed':
        if (mainFilter === 'publish') {
          filtered.sort((a, b) => (`${b.review.length}` || '').localeCompare(`${a.review.length}` || 0));
        }
        break;
      case 'title':
        if (mainFilter === 'comment') {
          filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }
        break;
      case 'service':
        if (mainFilter === 'contact') {
          filtered.sort((a, b) => (a.serviceType || '').localeCompare(b.serviceType || ''));
        }
        break;
      case 'country':
        if (mainFilter === 'contact') {
          filtered.sort((a, b) => (a.country || '').localeCompare(b.country || ''));
        }
        break;
      default:
        break;
    }
    return filtered;
  }; 


 const paginate = (pageNum) =>{
           setCurrP(pageNum)
      };
  const filteredData = filterData();
   const allDataFilterd = filterData().length
  const indexfirstString = (currP - 1) * pagePage;
  const indexlastString = currP * pagePage;
  const currentData = filteredData.slice(indexfirstString, indexlastString);
   const pageNum = [];
    for (let index = 1; index <= Math.ceil(allDataFilterd/pagePage); index++) {
       pageNum.push(index);  
        
    }
    useEffect(() => {
            paginate(1)
    },[mainFilter, subjectFilter])

  const formatDate = (date) => {

  if (!date || isNaN(date)) {;
 return '';
  }
  const options = {
     year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour12: true
    };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

      async function chooseDel(id) {
         axios.get('/api/projects?id=' + id).then(res => {
            // console.log("id", id, "res", res);
             setProductInfo(res.data.data )
           })
           //console.log("productInfo", productInfo);
         //  setRefresh(true);
           setDelete(true)
      }

            function goBack() {
       // console.log("BlogAllData", BlogAllData)
         setDelete(false);
        router.push('/projects/process1');
         
     }

     async function deletBlog(id) {
  try {
    console.log("Deleting project with ID:", id);
    
    // Use DELETE instead of POST for semantic correctness
     axios.get('/api/projects?projectId=' + id).then(res => {
               setOriginalData({ reviews: res.data.data });
      toast.success("Project Uploaded Successfully");
      const projects = res.data.data;
      projects.sort((a, b) => b.createdAt - a.createdAt);
      setAllData(projects);
      setLoading(false);
      goBack();
              }).catch ((error) => {
    console.log("Delete error:", error);
    setLoading(false);
    toast.error(error.response?.data?.message || "Failed to delete project");
  })

    
  } catch (error) {
    console.log("Delete error:", error);
    setLoading(false);
    toast.error(error.response?.data?.message || "Failed to delete project");
  }
}
         

  return (
    <LoginLayout>
       <Head>
                <title>MYG Tech - Products</title>
                <meta name="description" content="Blog website backend" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Head>

      <div className="page">

        <div className="dashboard-header">
          <div>
            <h2><span>Products</span></h2>
            <p>All Available Products</p>
          </div>

          <div className="filter-select" style={{ margin: '1rem 0' }}>
            <div className="flex gap-1">
               <select
                value={mainFilter}
                onChange={(e) => setMainFilter(e.target.value)}
                className="p-2 rounded" 
              >
                <option value="all">All</option>
                <option value="Website Development">Website</option>
                 <option value="Mobile Development">Mobile</option>
                <option value="Network Design">Networking</option>
                <option value="Graphic Design">Graphic $ UI/UX Design</option>
                <option value="Video Editing">Content</option>
                
               
              </select>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="p-2 rounded"
                disabled={loading}
              >
                {subjectOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

<div className="flex flex-sb">
 {
                                             currentData.length === 0 < pagePage ? ("") : (
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
                     
                     <button onClick={() => paginate(currP + 1)} disabled={ currentData.length < pagePage}><IoChevronForward style={{fontSize: '20'}} /></button>
                                                 </div>
                                             ) 
                                          }
<Link href={'/projects/addproject'}>
<button className="button">Add Project</button>
</Link>

</div>
        
        {/* Filter buttons */}
       

        <div style={{marginTop:'1rem'}}></div>
        <div className="chart-box">
          <div>
            <table className="table table-styling">
              <thead>
                <tr>
                  <>
            <th># Reviews</th>
            <th>Images</th>
            <th>Title</th>
             <th>Category</th>
             <th>Price</th>
            <th>Description</th>
            <th>Tags</th>
            <th>Date</th>
            <th>Action</th>
          </>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={mainFilter === 'all' ? 7 : 9} className="text-center" style={{padding: '5rem'}}>
                      <Dataloading />
                    </td>
                  </tr>
                ) : (
                  currentData.length === 0 ? (
                    <tr>
                      <td colSpan={mainFilter === 'all' ? 7 : 9} className="text-center" style={{padding: '5rem'}}>
                        No Data Found
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (

                        <tr key={item.id}>
            <td style={{width: '30px'}}>
              {(item.review.length) > 9 ? 
                item.review.length : 
                '0'+ (item.review.length)}
            </td>
            <td style={{textAlign:'center'}}>
              <img 
                src={item.images[0]} 
                alt={item?.title}
                style={{width: '120px', height:'100px', borderRadius: '10px'}}
                className=" rounded-full"
              />
            </td>
            <td>{item?.title}</td>
            <td>
                {
                item.projectcategory 
                 }
                
            </td>
             <td>
              ${item.price}
             
            </td>
           <td>{item.description ? (item.description.substring(0, 50) + (item.description.length > 50 ? '...' : '')) : 'No description'}</td>
                        <td>
              {item.tags.map((tag)=> (
                   <li>* {tag}</li>
              ))
              }
             
            </td>
          
            <td>{formatDate(new Date(item.createdAt))}</td>
            <td>
              <a href={`/shops/view/${item._id}`} className="text-blue-600 hover:underline">
                View
              </a>
            </td>

             </tr>
                    ))
                )
            )}
              </tbody>
            </table>
          </div>
        </div>


        
      </div>
     
    </LoginLayout>
  );
}

