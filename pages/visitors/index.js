import Dataloading from "@/components/Dataloading";
import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SiBloglovin } from "react-icons/si";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";
import { BsPostcard, BsQuestionCircle } from "react-icons/bs";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import LoginLayout from "@/components/LoginLayout";
import { useSearch } from "../../components/search";
import UserTable from "../UserTable";
import Head from "next/head";

export default function Projects() {

  const [allData, setAllData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currP, setCurrP] = useState(1);
  const [pagePage, setPagePage] = useState(15);
  const { search, setSearch } = useSearch();
  const [mainFilter, setMainFilter] = useState("all"); // 'all', 'review', 'comment', 'contact'
  const [subjectFilter, setSubjectFilter] = useState("recent"); // 'recent', 'alphabetical', etc.
  const [subjectOptions, setSubjectOptions] = useState([
    { value: "recent", label: "Recent" },
    { value: "alphabetical", label: "(A-Z)" },
    { value: "alphabetical-desc", label: "(Z-A)" },
    { value: "date-asc", label: "Date (Oldest)" },
  ]);
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
        
        const [reviewsRes, commentsRes, contactsRes] = await Promise.all([
          axios.get('/api/reviews'),
          axios.get('/api/comment'),
          axios.get('/api/contacts'),
        ]);

        setOriginalData({
          reviews: reviewsRes.data,
          comments: commentsRes.data,
          contacts: contactsRes.data.data
        });

        const reviews = reviewsRes.data;
        const comments = commentsRes.data;
        const contacts = contactsRes.data.data;

        const combinedData = [
          ...reviews.map(review => ({
            id: review._id,
            name: review.name,
            email: review.email,
            createdAt: new Date(review.createdAt),
            status: 'Testified',
            image: review.image,
            type: 'review',
            detailUrl:  `/visitors/view/${review._id}`,
            message: review.message,
            role: review.role,
            company: review.company,
            project: review.projectName,
            rating: review.rating
          })),
          
          ...comments.map(comment => ({
            id: comment._id,
            name: comment.name,
            email: comment.email,
            createdAt: new Date(comment.createdAt),
            status: 'Commented',
            image: comment.image,
            type: 'comment',
            detailUrl:  `/visitors/view/${comment._id}`,
            title: comment.title,
            contentPera: comment.contentPera,
            blog: comment.blog
          })),
          
          ...contacts.map(contact => ({
            id: contact._id,
            name: `${contact.clientInfo.firstName} ${contact.clientInfo.lastName || ''}`.trim(),
            email: contact.clientInfo.email,
            createdAt: new Date(contact.createdAt),
            status: 'Contacted',
            image: contact.clientInfo.profilePicture || null,
            type: 'contact',
            detailUrl: `/visitors/view/${contact._id}`,
            phone: contact.clientInfo.phone,
            company: contact.clientInfo.company,
            country: contact.clientInfo.country,
            serviceType: contact.serviceSelection?.serviceType
          }))
        ];

        combinedData.sort((a, b) => b.createdAt - a.createdAt);
        setAllData(combinedData);
        console.log(" commentsRes",  commentsRes,
          "combinedData",combinedData
          , "alldata",allData
        )
        setLoading(false);
      
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
      const filterData = () => {
    let filtered = [...allData];
  
    if (search.trim().toLowerCase() !== '') {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.email.toLowerCase().includes(search.toLowerCase())
      );
    }
  }
  filterData();
},[search])


  useEffect(() => {
    const baseOptions = [
      { value: "recent", label: "Recent" },
      { value: "alphabetical", label: "Alphabetical (A-Z)" },
      { value: "alphabetical-desc", label: "Alphabetical (Z-A)" },
      { value: "date-asc", label: "Date (Oldest)" },
    ];
    
    switch(mainFilter) {
      case 'review':
        setSubjectOptions([
          ...baseOptions,
          { value: "project", label: "By Project" },
          { value: "role", label: "By Role" }
        ]);
        break;
      case 'comment':
        setSubjectOptions([
          ...baseOptions,
          { value: "title", label: "By Title" }
        ]);
        break;
      case 'contact':
        setSubjectOptions([
          ...baseOptions,
          { value: "service", label: "By Service" },
          {value: 'country', label: 'By Country'}
        ]);
        break;
      default:
        setSubjectOptions(baseOptions);
    }
    
    setSubjectFilter("recent");
  }, [mainFilter]);

  const filterData = () => {
    let filtered = [...allData];
  
    if (search.trim().toLowerCase() !== '') {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (mainFilter !== 'all') {
      filtered = filtered.filter(item => item.type === mainFilter);
    }
    
    switch(subjectFilter) {
      case 'recent':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alphabetical-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-asc':
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'project':
        if (mainFilter === 'review') {
          filtered.sort((a, b) => (a.projectName || '').localeCompare(b.projectName || ''));
        }
        break;
      case 'role':
        if (mainFilter === 'review') {
          filtered.sort((a, b) => (a.role || '').localeCompare(b.role || ''));
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

  const getStatusColor = (status) => {
    const baseBrightness = 150;
    const r = Math.max(Math.floor(Math.random() * 200), baseBrightness);
    const b = Math.max(Math.floor(Math.random() * 200), baseBrightness);
    
    switch(status) {
      case 'review': 
        return {
          backgroundColor: `rgba(${r}, 0, 0, 0.5)`,
          color: '#ffffff'
        };
      case 'comment': 
        return {
          backgroundColor: `rgba(0, ${r}, 0, 0.5)`,
          color: '#ffffff'
        };
      case 'contact': 
        return {
          backgroundColor: `rgba(0, 0, ${r}, 0.5)`,
          color: '#ffffff'
        };
      default: 
        return {
          backgroundColor: 'rgba(243, 244, 246, 1)',
          color: 'rgba(55, 65, 81, 1)'
        };
    }
  };

  const renderTableHeaders = () => {
    switch(mainFilter) {
      case 'comment':
        return (
          <>
            <th>#</th>
            <th>Visitor</th>
            <th>Full Name</th>
            <th>Title</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Action</th>
          </>
        );
      case 'contact':
        return (
          <>
            <th>#</th>
            <th>Visitor</th>
            <th>Full Name</th>
             <th>Country</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Service</th>
            <th>Date</th>
            <th>Action</th>
          </>
        );
      case 'review':
        return (
          <>
            <th>Visitor</th>
            <th>Full Name</th>
            <th>Client Role</th>
            <th>Rating</th>
            <th>Project Name</th>
            <th>Testimony</th>           
            <th>Action</th>
          </>
        );
      default:
        return (
          <>
            <th>#</th>
            <th>Visitor</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Date</th>
            <th>Action</th>
          </>
        );
    }
  };

  const renderTableRow = (item, index) => {
    
    switch(mainFilter) {
      case 'comment':
        return (
          <tr key={item.id}>
            <td style={{width: '30px'}}>
              {(indexfirstString + index + 1) > 9 ? 
                indexfirstString + index + 1 : 
                '0'+ (indexfirstString + index + 1)}
            </td>
            <td style={{textAlign:'center', width: '50px'}}>
              <img 
                src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=random`} 
                alt={item.name}
                className="w-10 h-10 rounded-full"
              />
            </td>
            <td>{item.name}</td>
            <td>{item.title || 'No title'}</td>
            <td>{item.contentPera?.substring(0, 50) + (item.contentPera?.length > 50 ? '...' : '')}</td>
            <td>{item.createdAt.toLocaleString()}</td>
            <td>
              <a href={item.detailUrl} className="text-blue-600 hover:underline">
                View
              </a>
            </td>
          </tr>
        );
      case 'contact':
        return (
          <tr key={item.id}>
            <td style={{width: '30px'}}>
              {(indexfirstString + index + 1) > 9 ? 
                indexfirstString + index + 1 : 
                '0'+ (indexfirstString + index + 1)}
            </td>
            <td style={{textAlign:'center', width: '50px'}}>
              <img 
                src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=random`} 
                alt={item.name}
                className="w-10 h-10 rounded-full"
              />
            </td>
            <td>{item.name}</td>
             <td>{item.country || 'N/A'}</td>
            <td>{item.phone || 'N/A'}</td>
            <td>{item.company || 'N/A'}</td>
            <td>{item.serviceType || 'N/A'}</td>
            <td>{item.createdAt.toLocaleString()}</td>
            <td>
              <a href={item.detailUrl} className="text-blue-600 hover:underline">
                View
              </a>
            </td>
          </tr>
        );
      case 'review':
        return (
          <tr key={item.id}>
            
            <td style={{textAlign:'center', width: '50px'}}>
              <img 
                src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=random`} 
                alt={item.name}
                className="w-10 h-10 rounded-full"
              />
            </td>
            <td>{item.name}</td>
             <td >{item.role}</td>
            <td>{item.rating || 'N/A'}</td>
            <td>{item.project || 'N/A'}</td>
            <td>{item.message?.substring(0, 50) + (item.message?.length > 50 ? '...' : '')}</td>
           <td>
              <a href={item.detailUrl} className="text-blue-600 hover:underline">
                View
              </a>
            </td>
          </tr>
        );
      default:
        return (
          <tr key={item.id}>
            <td style={{width: '30px'}}>
              {(indexfirstString + index + 1) > 9 ? 
                indexfirstString + index + 1 : 
                '0'+ (indexfirstString + index + 1)}
            </td>
            <td style={{textAlign:'center', width: '50px'}}>
              <img 
                src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=random`} 
                alt={item.name}
                className="w-10 h-10 rounded-full"
              />
            </td>
            <td>{item.name}</td>
            <td style={{textTransform:'lowercase'}}>{item.email}</td>
            <td>
              <span style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                ...getStatusColor(item.type)
              }}>
                {item.status}
              </span>
            </td>
            <td>{item.createdAt.toLocaleString()}</td>
            <td>
              <a href={item.detailUrl} className="text-blue-600 hover:underline">
                View
              </a>
            </td>
          </tr>
        );
    }
  };

  return (
    <LoginLayout>
      <Head>
                      <title>MYG Tech - Visitors Page</title>
                      <meta name="description" content="Blog website backend" />
                      <meta name="viewport" content="width=device-width, initial-scale=1" />
                    </Head>
      <div className="page">
        <div className="dashboard-header">
          <div>
            <h2><span>Visitors</span></h2>
            <p>All user interaction with the website</p>
          </div>

          <div className="filter-select" style={{ margin: '1rem 0' }}>
           <div className="flex gap-4">
              <select
                value={mainFilter}
                onChange={(e) => setMainFilter(e.target.value)}
                className="p-2"
              >
                <option value="all">All</option>
                <option value="contact">Contacts</option>
                <option value="review">Reviews</option>
                <option value="comment">Comments</option>
              </select>
              
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="p-2  rounded"
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

         {
                                             currentData.length == 0 < pagePage ? ("") : (
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

        {/* Filter buttons */}
       

        <div style={{marginTop:'1rem'}}></div>
        <div className="chart-box">
          <div>
            <table className="table table-styling">
              <thead>
                <tr>
                  {renderTableHeaders()}
                </tr>
              </thead>
              <tbody>
                {loading && currentData.length === 0
                 ? (
                  <tr>
                    <td colSpan={mainFilter === 'all' ? 7 : 9} className="text-center" style={{padding: '5rem'}}>
                      <Dataloading />
                    </td>
                  </tr>
                ) : (
  !loading &&   currentData.length === 0 ? (
                    <tr>
                      <td colSpan={mainFilter === 'all' ? 7 : 9} className="text-center" style={{padding: '5rem'}}>
                        No Data Found
                      </td>
                    </tr>
                  ) : (
    !loading &&  currentData.length > 0 &&
     currentData.map((item, index) => renderTableRow(item, index))
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