import Head from "next/head"
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import LoginLayout from "@/components/LoginLayout";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { IoStar, IoStarOutline } from "react-icons/io5";

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
    const fetchData = async () => {
        if (!router.isReady || !id) {
            setLoading(false);
            if (!id) toast.error('Failed to acquire ID');
            return;
        }

        try {
            setLoading(true);
            const contactId = Array.isArray(id) ? id[0] : id;
          

           await  axios.get('/api/projects?id=' + id).then(res => {
               // console.log("id", id, "res", res);
               // setProductInfo(res.data.data );

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
                <title>Contact Details</title>
            </Head>

            {
                   Prod &&  <div className="cosmic-contact-display">
  {contactInfo ? (
    <div className="cosmic-card">
      <div className="stellar-header">
        <h1 className="cosmic-title">
        Product Details
        </h1>
        <div className="stellar-decoration"></div>
      </div>
      
      {/* Basic Information Section - Always shown */}
      <p className="pulsing-label">Personal Information</p>
      <div className="galaxy-grid">
        <div className="nebula-bg" style={{width:'250px', height: '200px'}}>
          <img src={contactInfo.images[0] || `https://ui-avatars.com/api/?name=${contactInfo.name}&background=random`} />
        </div>
        
        <div className="info-column nebula-bg">
          <p><span className="glowing-label">Product Name:</span> <span className="cosmic-text">{contactInfo.title} </span></p>
          <p><span className="glowing-label">Client</span> <span className="cosmic-text">{contactInfo.client}</span></p>
           <p><span className="glowing-label">Project Category:</span> <span className="cosmic-text">{contactInfo.projectcategory}</span></p>
          {contactInfo.projectType === 'For Sale' && (
            <p><span className="glowing-label">Organization:</span> <span className="cosmic-text">{contactInfo.projectType
}</span></p>
          )}
          {contactInfo.repositoryUrl && (
            <p><span className="glowing-label">Github Link</span> <a href={contactInfo.repositoryUrl} className="cosmic-text">{contactInfo.repositoryUrl}</a></p>
          )}
         </div>
      </div>

      {/* Dynamic Section based on Engagement Type */}
   
        <div className="cosmic-section">
          <p className="pulsing-label">Product Details</p>
          <div className="cosmic-text-highlight nebula-bg">
          <p className="cosmic-text">
              <span className="glowing-label">Product Description:</span><br/>
              {contactInfo.description}
            </p>
       
           
          </div>
        </div>
    

      {/* Engagement Metadata - Always shown */}
      <div className="cosmic-section">
        <p className="pulsing-label">Release Details</p>
        <div className="cosmic-text-highlight nebula-bg">
          <p><span className="glowing-label">Initiated:</span> <span className="cosmic-text">{new Date(contactInfo.createdAt).toLocaleString()}</span></p>
          <p><span className="glowing-label">Last Updated:</span> <span className="cosmic-text">{new Date(contactInfo.updatedAt).toLocaleString()}</span></p>
        </div>
      </div>
      
      <div className="stellar-footer"></div>
    </div>
  ) : (
    <div className="cosmic-empty">
      <div className="empty-message">No client information available</div>
      <div className="empty-stars"></div>
    </div>
  )}
 <div className="buttonClass">
      <a href="/visitors" className="button"><FaArrowLeft/> Return</a>
  </div>
             </div>
            }


            {
                   comm &&  <div className="cosmic-contact-display">
  {contactInfo ? (
    <div className="cosmic-card">
      <div className="stellar-header">
        <h1 className="cosmic-title">
         Client Comment Details
        </h1>
        <div className="stellar-decoration"></div>
      </div>
      
      {/* Basic Information Section - Always shown */}
      <p className="pulsing-label">Personal Information</p>
      <div className="galaxy-grid">
        <div className="nebula-bg" style={{width:'250px', height: '200px'}}>
          <img src={contactInfo.image || `https://ui-avatars.com/api/?name=${contactInfo.name}&background=random`} />
        </div>
        
        <div className="info-column nebula-bg">
          <p><span className="glowing-label">Full Name:</span> <span className="cosmic-text">{contactInfo.name} </span></p>
          <p><span className="glowing-label">Email:</span> <span className="cosmic-text" style={{textTransform:'lowercase'}}>{contactInfo.email}</span></p>
        </div>
      </div>

      {/* Dynamic Section based on Engagement Type */}
   
        <div className="cosmic-section">
          <p className="pulsing-label">Comment Details</p>
          <div className="cosmic-text-highlight nebula-bg">
          <p><span className="glowing-label">Comment Title:</span> <span className="cosmic-text">{contactInfo.title}</span></p>
          <p className="cosmic-text">
              <span className="glowing-label">Content:</span><br/>
              {contactInfo.contentPera}
            </p>
       
           
          </div>
        </div>
    

      {/* Engagement Metadata - Always shown */}
      <div className="cosmic-section">
        <p className="pulsing-label">Release Details</p>
        <div className="cosmic-text-highlight nebula-bg">
          <p><span className="glowing-label">Initiated:</span> <span className="cosmic-text">{new Date(contactInfo.createdAt).toLocaleString()}</span></p>
          <p><span className="glowing-label">Last Updated:</span> <span className="cosmic-text">{new Date(contactInfo.updatedAt).toLocaleString()}</span></p>
        </div>
      </div>
      
      <div className="stellar-footer"></div>
    </div>
  ) : (
    <div className="cosmic-empty">
      <div className="empty-message">No client information available</div>
      <div className="empty-stars"></div>
    </div>
  )}
 <div className="buttonClass">
      <a href="/visitors" className="button"><FaArrowLeft/> Return</a>
  </div>
             </div>
            }

 

        </LoginLayout>
    );
}