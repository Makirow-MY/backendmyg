import Head from "next/head"
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import LoginLayout from "@/components/LoginLayout";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { IoStar, IoStarOutline } from "react-icons/io5";
import Link from "next/link";

export default function EditVisitors() {
    const router = useRouter();
    const { id } = router.query;
    const [contactInfo, setContactInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cont, setCont] = useState(false);
    const [Prod, setProd] = useState(false);
    const [comm, setComm] = useState(false);

    const [error, setError] = useState(null);

 useEffect(() => {
  toast.remove()
    const fetchData = async () => {
        if (!router.isReady || !id) {
            setLoading(false);
            if (!id) toast.error('Failed to acquire ID');
            return;
        }

        try {
            setLoading(true);
            const contactId = Array.isArray(id) ? id[0] : id;
          

           await  axios.get('/api/projects?projId=' + id).then(res => {
               console.log("id", id, "res", res.data.data);
                setProductInfo(res.data.data );

                  const products = res.data?.success ? res.data.data : null;
           
           if (products) {
                setContactInfo(products);
                setProd(true);
            }
            else {
                toast.error(`No data found for the provided ID${contactId}  ${id}`);
            }

              })

            // Handle responses
          
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            toast.error(errorMsg || 'An unexpected error occurred');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [id, router.isReady]);// Add router.isReady to dependencies

      const StarRating = (rating ) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<IoStar />);
    } else {
      stars.push(<IoStarOutline />);
    }
  }

  return <div className="starRating rate " style={{fontSize:'35px'}}>{stars}</div>;
};
  const [isDelete, setDelete] = useState(false);
 const [productInfo, setProductInfo] = useState(null);

      async function chooseDel(id) {
         axios.get('/api/projects?id=' + id).then(res => {
             setProductInfo(res.data.data )
           })
            setDelete(true)
      }

            function goBack() {
          setDelete(false);
        router.push('/projects/process1');
         
     }

     async function deletBlog(id) {
  try {
    console.log("Deleting project with ID:", id);
    // Use DELETE instead of POST for semantic correctness
     axios.delete('/api/projects?projectId=' + id).then(res => {
            toast.success(res.data.message || "Project deleted successfully");
      goBack();
              }).catch ((error) => {
    console.error("Delete error:", error);
    setLoading(false);
    toast.error(error.response?.data?.message || "Failed to delete project");
  })

  
  } catch (error) {
    console.error("Delete error:", error);
    setLoading(false);
    toast.error(error.response?.data?.message || "Failed to delete project");
  }
}


    if (loading) {
        return (
            <LoginLayout>
                <div className="flex justify-center items-center h-64">
                    <div>Loading...</div>
                </div>
            </LoginLayout>
        );
    }

    if (error) {
        return (
            <LoginLayout>
                <div className="p-4 text-red-500">{error}</div>
            </LoginLayout>
        );
    }

    return (
        <LoginLayout>
           
             <Head>
                <title>MYG Tech - {contactInfo.title} Projects Details</title>
                <meta name="description" content="Blog website backend" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Head>

            {
                   Prod &&  <div className="cosmic-contact-display">
 {contactInfo ? (
  <>
    <div className="cosmic-card">
      <div className="stellar-header">
        <h1 className="cosmic-title">
          Project Overview
        </h1>
        <div className="stellar-decoration"></div>
      </div>
      
      {/* Basic Information Section - Always shown */}
      <p className="pulsing-label">Core Information</p>
      <div className="galaxy-grid">
        <div className="nebula-bg" style={{width:'250px', height: '200px'}}>
          <img src={contactInfo.images[0] || `https://ui-avatars.com/api/?name=${contactInfo.name}&background=random`} 
               alt={contactInfo.title} 
               className="project-preview-image" />
        </div>
        
        <div className="info-column nebula-bg">
          <p><span className="glowing-label">Project Title:</span> 
             <span className="cosmic-text">{contactInfo.title}</span></p>
          
          <p><span className="glowing-label">Client:</span> 
             <span className="cosmic-text">{contactInfo.client}</span></p>
           
          <p><span className="glowing-label">Category:</span> 
             <span className="cosmic-text">{contactInfo.projectcategory}</span></p>
            
          <p><span className="glowing-label">Type:</span> 
             <span className="cosmic-text">{contactInfo.projectType}</span></p>
            
          <p><span className="glowing-label">Status:</span> 
             <span className="cosmic-text capitalize">{contactInfo.status}</span></p>
            
          <p><span className="glowing-label">Price:</span> 
             <span className="cosmic-text">${contactInfo.price}</span></p>
            
          <p><span className="glowing-label">License:</span> 
             <span className="cosmic-text">{contactInfo.licenseType}</span></p>
            
          <p><span className="glowing-label">Responsive:</span> 
             <span className="cosmic-text">{contactInfo.isResponsive ? 'Yes' : 'No'}</span></p>
            
          {contactInfo.repositoryUrl && (
            <p><span className="glowing-label">Repository:</span> 
               <a href={contactInfo.repositoryUrl} 
               type="button"
                  className="cosmic-text link border "
                  style={{background: 'var(--main-hover-color)', padding:'10px 20px'}} 
                  target="_blank" 
                  rel="noopener noreferrer">
                 View Code
               </a>
            </p>
          )}
        </div>
      </div>

      {/* Project Details Section */}
      <div className="cosmic-section">
        <p className="pulsing-label">Project Specifications</p>
        <div className="cosmic-text-highlight nebula-bg">
          <p className="cosmic-text">
            <span className="glowing-label">Description:</span><br/>
            {contactInfo.description}
          </p>
          
          <div className="tech-grid">
            {contactInfo.technologies.filter(t => t).length > 0 && (
              <div>
                <span className="glowing-label">Technologies:</span>
                <div className="tech-tags">
                  {contactInfo.technologies.filter(t => t).map((tech, i) => (
                    <span key={i} className="tech-tag"> {tech}</span>
                  ))}
                </div>
              </div>
            )}
            
            {contactInfo.platforms.filter(p => p).length > 0 && (
              <div>
                <span className="glowing-label">Platforms:</span>
                <div className="tech-tags">
                  {contactInfo.platforms.filter(p => p).map((platform, i) => (
                    <span key={i} className="tech-tag">{platform}</span>
                  ))}
                </div>
              </div>
            )}
            
            {contactInfo.features.filter(f => f).length > 0 && (
              <div>
                <span className="glowing-label">Key Features:</span>
                <ul className="feature-list">
                  {contactInfo.features.filter(f => f).map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Engagement Metadata - Always shown */}
      <div className="cosmic-section">
        <p className="pulsing-label">Project Timeline</p>
        <div className="cosmic-text-highlight nebula-bg">
          <p><span className="glowing-label">Year Developed:</span> 
             <span className="cosmic-text">{contactInfo.projectYear}</span></p>
             
          <p><span className="glowing-label">Date Created:</span> 
             <span className="cosmic-text">{new Date(contactInfo.createdAt).toLocaleDateString()}</span></p>
             
          <p><span className="glowing-label">Last Updated:</span> 
             <span className="cosmic-text">{new Date(contactInfo.updatedAt).toLocaleDateString()}</span></p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="cosmic-section">
        <p className="pulsing-label">Project Actions</p>
        <div className="action-buttons nebula-bg flex flex-col gap-3">
          {contactInfo.livepreview && (
            <a href={contactInfo.livepreview} 
              style={{background:'var(--main-hover-color)', borderRadius:'5px', padding: '1rem 2rem'}} 
                  className="button w-100 text-center"  
                   target="_blank" 
               rel="noopener noreferrer">
              Live Preview
            </a>
          )}
          
          <div style={{position:'relative'}} className="w-100 flex flex-sb">
            <Link style={{background:'var(--primary-color)', borderRadius:'5px', padding: '1rem 2rem'}} 
                  className="button w-100"  
                  href={`/projects/edit/${contactInfo._id}`}>
              Edit Project
            </Link>
            <button style={{background:'red', padding: '1rem 2rem'}} 
                    className="button w-100" 
                    onClick={() => chooseDel(contactInfo._id)}>
              Delete Project
            </button>
          </div>
        </div>
      </div>

      <div className="stellar-footer"></div>
    </div>
  </>
) : (
  <div className="cosmic-empty">
    <div className="empty-message">No project information available</div>
    <div className="empty-stars"></div>
  </div>
)}
 <div className="buttonClass">
      <a href="/projects" className="button"><FaArrowLeft/> Back To Projects</a>
  </div>


             </div>
            }

{
    isDelete && (
                            <div className="deletesec">
                                <div className="pot" >
                                    <div className="deletecard">
                                                    <p className="cookieHeading text-center">Are you sure you want to Delete this project? </p>
                                                    <p className="cookieDescription">Beware, this action can not be reverse</p>
                                                    <div className="buttonContainer">
                                                           <button className="acceptButton" onClick={() => {deletBlog(contactInfo._id), setDelete(false), router.push('/projects/process1')}}>Delete</button>
                                                           <button className="declineButton" onClick={() => setDelete(false)}>Cancel</button>
                                                    </div>
                                    </div>
                                                   </div>
                            </div>
                                                   
                                 
                    )
}
 

        </LoginLayout>
    );
}