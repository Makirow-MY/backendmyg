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
    const [rev, setRev] = useState(false);
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
            
            const [reviewsRes, contactsRes, commentsRes] = await Promise.all([
                axios.get(`/api/reviews?id=${contactId}`).catch(e => e.response),
                axios.get(`/api/contacts?id=${contactId}`).catch(e => e.response),
                axios.get(`/api/comment?id=${contactId}`).catch(e => e.response),
            ]);

            // Handle responses
            const reviews = reviewsRes?.data?.success ? reviewsRes.data.data : null;
            const contacts = contactsRes?.data?.success ? contactsRes.data.data : null;
            const comments = commentsRes?.data?.success ? commentsRes.data.data : null;

            if (contacts) {
                setContactInfo(contacts);
                setCont(true);
                setComm(false);
                setRev(false);
            } else if (reviews) {
                setContactInfo(reviews);
                setCont(false);
                setComm(false)
                setRev(true);
            }
            else if (comments) {
                setContactInfo(comments);
                setCont(false);
                setComm(true)
                setRev(false);
            }
            else {
                toast.error('No data found for the provided ID');
            }
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
                     {
                     cont && <title>MYG Tech - {contactInfo.clientInfo.firstName} {contactInfo.clientInfo.lastName} Contact Details</title>
                     }
                     {
                     rev && <title>MYG Tech - {contactInfo.name} Review Details</title>
                     }
                      {
                     comm && <title>MYG Tech - {contactInfo.name} Comment Details</title>
                     }
                      <meta name="description" content="Blog website backend" />
                      <meta name="viewport" content="width=device-width, initial-scale=1" />
                    </Head>

            {
                   cont &&  <div className="cosmic-contact-display">
  {contactInfo ? (
    <div className="cosmic-card">
      <div className="stellar-header">
        <h1 className="cosmic-title">
          {contactInfo.engagementType === 'project' ? 'Project Client' : 
           contactInfo.engagementType === 'employment' ? 'Employment Candidate' : 
           'Client'} Profile
        </h1>
        <div className="stellar-decoration"></div>
      </div>
      
      {/* Basic Information Section - Always shown */}
      <p className="pulsing-label">Personal Information</p>
      <div className="galaxy-grid">
        <div className="nebula-bg" style={{width:'250px', height: '200px'}}>
          <img src={contactInfo.clientInfo.profilePicture || `https://ui-avatars.com/api/?name=${contactInfo.clientInfo.firstName} ${contactInfo.clientInfo.lastName}&background=random`} />
        </div>
        
        <div className="info-column nebula-bg">
          <p><span className="glowing-label">Full Name:</span> <span className="cosmic-text">{contactInfo.clientInfo.firstName} {contactInfo.clientInfo.lastName}</span></p>
          <p><span className="glowing-label">Email:</span> <span className="cosmic-text" style={{textTransform:'lowercase'}}>{contactInfo.clientInfo.email}</span></p>
          <p><span className="glowing-label">Phone:</span> <span className="cosmic-text">{contactInfo.clientInfo.phone}</span></p>
          {contactInfo.clientInfo.country && (
            <p><span className="glowing-label">Location:</span> <span className="cosmic-text">{contactInfo.clientInfo.country}</span></p>
          )}
          {contactInfo.clientInfo.company && (
            <p><span className="glowing-label">Organization:</span> <span className="cosmic-text">{contactInfo.clientInfo.company}</span></p>
          )}
          <p><span className="glowing-label">Preferred Contact:</span> <span className="cosmic-text">{contactInfo.clientInfo.contactMethod || 'Not specified'}</span></p>
        </div>
      </div>

      {/* Dynamic Section based on Engagement Type */}
      {contactInfo.engagementType === 'project' && (
        <div className="cosmic-section">
          <p className="pulsing-label">Project Details</p>
          <div className="cosmic-text-highlight nebula-bg">
            <p><span className="glowing-label">Service Type:</span> <span className="cosmic-text">{contactInfo.serviceSelection?.serviceType || 'Not specified'}</span></p>
            {contactInfo.serviceSelection?.websiteDetails?.type && (
              <p><span className="glowing-label">Website Type:</span> <span className="cosmic-text">{contactInfo.serviceSelection.websiteDetails.type}</span></p>
            )}
            {contactInfo.projectInfo?.startDate && (
              <p><span className="glowing-label">Timeline:</span> <span className="cosmic-text">
                {new Date(contactInfo.projectInfo.startDate).toLocaleDateString()} to{' '}
                {contactInfo.projectInfo.deadline ? new Date(contactInfo.projectInfo.deadline).toLocaleDateString() : 'Ongoing'}
              </span></p>
            )}
            {contactInfo.projectInfo?.budgetRange && (
              <p><span className="glowing-label">Budget:</span> <span className="cosmic-text">{contactInfo.projectInfo.budgetRange}</span></p>
            )}
            {contactInfo.projectInfo?.urgency && (
              <p><span className="glowing-label">Urgency:</span> <span className="cosmic-text">{contactInfo.projectInfo.urgency}</span></p>
            )}
          </div>
        </div>
      )}

      {contactInfo.engagementType === 'employment' && contactInfo.serviceSelection?.employmentDetails && (
        <div className="cosmic-section">
          <p className="pulsing-label">Employment Details</p>
          <div className="cosmic-text-highlight nebula-bg">
            {contactInfo.serviceSelection.employmentDetails.jobTitle && (
              <p><span className="glowing-label">Desired Position:</span> <span className="cosmic-text">{contactInfo.serviceSelection.employmentDetails.jobTitle}</span></p>
            )}
            {contactInfo.serviceSelection.employmentDetails.industry && (
              <p><span className="glowing-label">Industry:</span> <span className="cosmic-text">{contactInfo.serviceSelection.employmentDetails.industry}</span></p>
            )}
            {contactInfo.serviceSelection.employmentDetails.salaryExpectation && (
              <p><span className="glowing-label">Salary Expectations:</span> <span className="cosmic-text">{contactInfo.serviceSelection.employmentDetails.salaryExpectation}</span></p>
            )}
            {contactInfo.serviceSelection.employmentDetails.roleType && (
              <p><span className="glowing-label">Employment Type:</span> <span className="cosmic-text">{contactInfo.serviceSelection.employmentDetails.roleType}</span></p>
            )}
          </div>
        </div>
      )}

      {/* Notes/Description Section - Flexible for all types */}
      {(contactInfo.projectInfo?.notes || contactInfo.clientInfo?.description) && (
        <div className="cosmic-section">
          <p className="pulsing-label">
            {contactInfo.engagementType === 'project' ? 'Project Vision' : 
             contactInfo.engagementType === 'employment' ? 'Candidate Summary' : 
             'Additional Information'}
          </p>
          <div className="cosmic-text-highlight nebula-bg">
            <p className="cosmic-text">
              {contactInfo.projectInfo?.notes || contactInfo.clientInfo?.description}
            </p>
          </div>
        </div>
      )}

      {/* Engagement Metadata - Always shown */}
      <div className="cosmic-section">
        <p className="pulsing-label">Engagement Details</p>
        <div className="cosmic-text-highlight nebula-bg">
          <p><span className="glowing-label">Engagement Type:</span> <span className="cosmic-text">{contactInfo.engagementType}</span></p>
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
                   rev &&  <div className="cosmic-contact-display">
  {contactInfo ? (
    <div className="cosmic-card">
      <div className="stellar-header">
        <h1 className="cosmic-title">
         Client Review Details
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
           <p><span className="glowing-label">Roled Played:</span> <span className="cosmic-text">{contactInfo.role}</span></p>
          {contactInfo.company && (
            <p><span className="glowing-label">Organization:</span> <span className="cosmic-text">{contactInfo.company}</span></p>
          )}
          {contactInfo.website && (
            <p><span className="glowing-label">Webiste Link</span> <a href={contactInfo.website} className="cosmic-text">{contactInfo.website}</a></p>
          )}
         </div>
      </div>

      {/* Dynamic Section based on Engagement Type */}
   
        <div className="cosmic-section">
          <p className="pulsing-label">Testimonial Details</p>
          <div className="cosmic-text-highlight nebula-bg">
            <p><span className="cosmic-text"> {StarRating(contactInfo.rating.length)} </span></p>
          <p><span className="glowing-label">Project Name:</span> <span className="cosmic-text">{contactInfo.projectName}</span></p>
          <p className="cosmic-text">
              <span className="glowing-label">Review Details:</span><br/>
              {contactInfo.message}
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