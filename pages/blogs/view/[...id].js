import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import LoginLayout from "@/components/LoginLayout";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { faker } from "@faker-js/faker";

export default function EditVisitors() {
  const router = useRouter();
  const randomNum = Math.floor(Math.random() * 100) + 1;
  const gender = randomNum % 2 === 0 ? 'female' : 'male';
  const imageNumber = Math.floor(Math.random() * 100);

  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState({
    name: faker.person.fullName(),
    role: faker.name.jobTitle(),
    message: '',
    rating: "⭐⭐⭐⭐⭐",
    image: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/${gender}/512/${imageNumber}.jpg`
  });
  const [addingComment, setAddingComment] = useState(false);
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState(null);
  const [allComments, setAllComments] = useState([]); // Raw flat list
  const [mainComments, setMainComments] = useState([]); // Only main comments (parent: null)
  const [expandedReplies, setExpandedReplies] = useState({}); // Tracks which main comment has replies open
  const [replyPage, setReplyPage] = useState({}); // Pagination per main comment replies
 const [isloading, setIsLoading] = useState(true);
 
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const [deletingId, setDeletingId] = useState(null);
  const [isDelete, setDelete] = useState(false);
    
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(date));
  };

  // Build nested structure
  const buildCommentTree = (comments) => {
    const commentMap = {};
    const mains = [];

    comments.forEach(comment => {
      comment.children = [];
      commentMap[comment._id] = comment;
    });

    comments.forEach(comment => {
      if (comment.parent === null || !comment.parent) {
        mains.push(comment);
      } else if (commentMap[comment.parent]) {
        commentMap[comment.parent].children.push(comment);
      }
    });

    // Sort children by date (oldest first)
    mains.forEach(main => {
      main.children.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    return mains.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest main first
  };

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/blogs?id=' + id);
        if (res.data.success) {
          setContactInfo(res.data.data);
          const comments = res.data.data1 || [];
          setAllComments(comments);
          setMainComments(buildCommentTree(comments));
        } else {
          toast.error("Failed to load blog or comments");
        }
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router.isReady]);

  const refreshComments = async () => {
    try {
      const res = await axios.get('/api/blogs?id=' + id);
      if (res.data.success) {
        const comments = res.data.data1 || [];
        setAllComments(comments);
        setMainComments(buildCommentTree(comments));
      }
    } catch (err) {
      toast.error("Failed to refresh comments");
    }
  };

  const handleAddManualComment = async (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.message) {
      toast.error("Name and message are required");
      return;
    }
    setAddingComment(true);
    try {
      await axios.post('/api/Comments', {
        BlogId: contactInfo?._id,
        BlogTitle: contactInfo?.title,
        BlogSlug: contactInfo?.slug,
        ...newComment,
        image: newComment.image || `https://ui-avatars.com/api/?name=${newComment.name}&background=random`,
        mainComment: true
      });
      await refreshComments();
      setNewComment({
        ...newComment,
        name: faker.person.fullName(),
        message: '',
        image: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/${gender}/512/${Math.floor(Math.random() * 100)}.jpg`
      });
      setShowAddComment(false);
      toast.success("Comment added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setAddingComment(false);
    }
  };

  const deleteComment = async (commentId, isMainComment) => {
    if (!confirm(`Are you sure you want to delete this ${isMainComment ? "main comment and all replies" : "reply"}?`)) return;

    setDeletingId(commentId);
    try {
      await axios.delete(`/api/comment?id=${commentId}`);
      toast.success("Comment deleted successfully");
      await refreshComments();
    } catch (err) {
      toast.error("Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    if (!replyPage[commentId]) {
      setReplyPage(prev => ({ ...prev, [commentId]: 1 }));
    }
  };

   async function chooseDel(id) {
          setIsLoading(true)
            setDelete(true)
      
        setTimeout(() => {
            setIsLoading(false)
        }, 3000);
      }
              function goBack() {
         // console.log("BlogAllData", BlogAllData)
           setDelete(false);
          router.push('/blogs/process1');
           
       }
  
       async function deletBlog(id) {
    try {
      
      // Use DELETE instead of POST for semantic correctness
     await  axios.delete('/api/blogs?blogId=' + id).then(res => {
         toast.success("Blog Deleted Successfully")
         setDelete(false);
        setLoading(false);
        goBack();
                }).catch ((error) => {
      console.log("Delete error:", error);
      setLoading(false);
     // toast.error(error.response?.data?.message || "Failed to delete project");
    })
  
  
    } catch (error) {
      console.log("Delete error:", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  }
  
  if (loading) {
    return (
      <LoginLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </LoginLayout>
    );
  }

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentMainComments = mainComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(mainComments.length / commentsPerPage);

  return (
    <LoginLayout>
      <Head>
        <title>MYG Tech - {contactInfo?.title} Blogs Details</title>
        <meta name="description" content="Blog website backend" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {contactInfo && (
        <div className="cosmic-contact-display">
          <div className="cosmic-card">
          <div className="stellar-header">
        <h1 className="cosmic-title">
          Blog Overview
        </h1>
        <div className="stellar-decoration"></div>
      </div>
      
      {/* Basic Information Section - Always shown */}
      <p className="pulsing-label">Core Information</p>
      <div className={contactInfo?.blogcategory === "Graphic & UI/UX Design"  ? "galaxy-grid" : "galaxy-grid1"}>
       
        
        <div className={contactInfo?.blogcategory === "Graphic & UI/UX Design" ? "info-column nebula-bg" : "info-column1 nebula-bg"} style={contactInfo?.blogcategory === "Graphic & UI/UX Design" ? {width: '100%'} : {}}>
          <p><span className="glowing-label">Blog Title:</span> 
             <span className="cosmic-text">{contactInfo?.title}</span></p>
          
   {
     contactInfo?.client &&  <p><span className="glowing-label">Client:</span> 
             <span className="cosmic-text">{contactInfo?.client}</span></p>
   }       
           
          <p><span className="glowing-label">Category:</span> 
             <span className="cosmic-text">{contactInfo?.blogcategory}</span></p>
            
          <p><span className="glowing-label">Type:</span> 
             <span className="cosmic-text">{contactInfo?.BlogType}</span></p>
            
          <p><span className="glowing-label">Status:</span> 
             <span className="cosmic-text capitalize">{contactInfo?.status}</span></p>
         
        </div>

        <div className={contactInfo?.blogcategory === "Graphic & UI/UX Design" ?"flex flex-col" :  "flex flex-row"}  style={{width: contactInfo?.blogcategory === "Graphic & UI/UX Design" ?'250px' : "100%"}}>

  { contactInfo?.blogcategory !== "Graphic & UI/UX Design" && contactInfo?.images.map((image, index) => (
<div className="nebula-bg" key={index} style={contactInfo?.blogcategory === "Graphic & UI/UX Design" ? {width:'100%', height: '150px'}: {width:'180px', height: '150px'}}>
          <img src={image} 
               alt={contactInfo?.title} 
               className="Blog-pComment-image" />
        </div>
) ) 
  }

       </div>
      </div>

      {/* Blog Details Section */}
 <div className="cosmic-section">
        <p className="pulsing-label">Blog Specifications</p>
        <div className="cosmic-text-highlight nebula-bg">
          <p className="cosmic-text">
            <span className="glowing-label">Description:</span><br/>
            {contactInfo?.description}
          </p>
           <div>
                <span className="glowing-label">Blog Tags:</span>
                <ul className="feature-list">
                  {contactInfo?.tags.map((feature, i) => (
                    <li key={i} style={{paddingLeft:'20px'}}>*{feature}</li>
                  ))}
                </ul>
              </div>
        
        </div>
      </div>

      {/* Engagement Metadata - Always shown */}
      <div className="cosmic-section">
        <p className="pulsing-label">Blog Date</p>
        <div className="cosmic-text-highlight nebula-bg">
          <p><span className="glowing-label">Year Published:</span> 
             <span className="cosmic-text">{contactInfo?.BlogYear}</span></p>
             
          <p><span className="glowing-label">Publish On:</span> 
             <span className="cosmic-text">{new Date(contactInfo?.createdAt).toLocaleDateString()}</span></p>
             
          <p><span className="glowing-label">Last Updated:</span> 
             <span className="cosmic-text">{new Date(contactInfo?.updatedAt).toLocaleDateString()}</span></p>
        </div>
      </div>

       <div className="cosmic-section">
        <p className="pulsing-label">Blog Actions</p>
        <div className="action-buttons nebula-bg flex flex-col gap-3">
           
          <div style={{position:'relative'}} className="w-100 flex flex-sb">
            <Link style={{background:'var(--primary-color)', borderRadius:'5px', padding: '1rem 2rem'}} 
                  className="button w-100"  
                  href={`/blogs/edit/${contactInfo?._id}`}>
              Edit Blog
            </Link>
            <button style={{background:'red', padding: '1rem 2rem'}} 
                    className="button w-100" 
                    onClick={() => chooseDel(contactInfo?._id)}>
              Delete Blog
            </button>
          </div>
        </div>
      </div>

            {/* Comments Section - Fully Rewritten */}
            <div className="cosmic-section">
              <div className="flex flex-sb align-center mb-1">
                <p className="pulsing-label">Blog Comments ({mainComments.length})</p>
                <button
                  onClick={() => setShowAddComment(!showAddComment)}
                  style={{
                    marginLeft: '1rem',
                    padding: '0.5rem 1rem',
                    background: 'var(--main-hover-color)',
                    border: 'none',
                    borderRadius: '5px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  <FaPlus size={20} /> Add Comment
                </button>
              </div>

              <div className="cosmic-text-highlight nebula-bg" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                {mainComments.length > 0 ? (
                  <>
                    {currentMainComments.map((comment) => (
                      <div key={comment._id} className="nebula-bg" style={{ marginBottom: '1.5rem', padding: '1.2rem', borderRadius: '8px', background: 'var(--main-bgcolor)' }}>
                        {/* Main Comment */}
                        <div className="flex flex-sb" style={{ marginBottom: '0.8rem' }}>
                          <div className="flex">
                            {comment.image && (
                              <img
                                src={comment.image}
                                alt={comment.name}
                                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }}
                              />
                            )}
                            <div>
                              <div className="cosmic-text" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                                {comment.name}
                              </div>
                              {comment.email && (
                                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                  <span className="glowing-label">Email:</span> {comment.email}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            
                            <button
                              onClick={() => deleteComment(comment._id, true)}
                              disabled={deletingId === comment._id}
                              style={{
                                marginTop: '0.5rem',
                                padding: '0.4rem 0.8rem',
                                background: 'rgba(255,0,0,0.2)',
                                color: '#ff6b6b',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '0.8rem'
                              }}
                            >
                              {deletingId === comment._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>

                        <p className="cosmic-text" style={{ margin: '1rem 0',}}>
                          {comment.message}
                        </p>
<span className="glowing-label">
                              {formatDate(comment.createdAt)}
                            </span>
                        {/* Replies Section */}
                        {comment.children.length > 0 && (
                          <div style={{ marginLeft: '60px', marginTop: '1rem' }}>
                            <button
                              onClick={() => toggleReplies(comment._id)}
                              style={{
                                background: 'transparent',
                                border: '1px solid var(--primary-color)',
                                color: 'var(--primary-color)',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '5px',
                                fontSize: '0.85rem'
                              }}
                            >
                              {expandedReplies[comment._id] ? '↑ Hide Replies' : `↓ View Replies (${comment.children.length})`}
                            </button>

                            {expandedReplies[comment._id] && (
                              <div style={{ marginTop: '1rem' }}>
                                {comment.children
                                  .slice((replyPage[comment._id] - 1) * 5, replyPage[comment._id] * 5)
                                  .map((reply) => (
                                    <div key={reply._id} style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
                                      <div className="flex flex-sb">
                                        <div className="flex">
                                          {reply.image && (
                                            <img
                                              src={reply.image}
                                              alt={reply.name}
                                              style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '0.8rem' }}
                                            />
                                          )}
                                          <div>
                                            <div style={{ color: '#aaa', fontWeight: 500 }}>{reply.name}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>↳ Replied to {reply.parentname}</div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => deleteComment(reply._id, false)}
                                          style={{ fontSize: '0.8rem', color: '#ff6b6b', background: 'transparent', border: 'none' }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                      <p style={{ margin: '0.8rem 0', fontSize: '0.95rem', paddingLeft: '48px' }}>
                                        {reply.message}
                                      </p>
                                      <div style={{ fontSize: '0.75rem', opacity: 0.6, paddingLeft: '48px' }}>
                                        {formatDate(reply.createdAt)}
                                      </div>
                                    </div>
                                  ))}

                                {/* Replies Pagination */}
                                {comment.children.length > 5 && (
                                  <div className="pagination" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                                    <button
                                      onClick={() => setReplyPage(prev => ({ ...prev, [comment._id]: Math.max((prev[comment._id] || 1) - 1, 1) }))}
                                      disabled={(replyPage[comment._id] || 1) === 1}
                                      style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', background: 'var(--primary-color)', borderRadius: '4px' }}
                                    >
                                      Prev
                                    </button>
                                    <span>
                                      Page {replyPage[comment._id] || 1} of {Math.ceil(comment.children.length / 5)}
                                    </span>
                                    <button
                                      onClick={() => setReplyPage(prev => ({ ...prev, [comment._id]: Math.min((prev[comment._id] || 1) + 1, Math.ceil(comment.children.length / 5)) }))}
                                      disabled={(replyPage[comment._id] || 1) >= Math.ceil(comment.children.length / 5)}
                                      style={{ marginLeft: '0.5rem', padding: '0.3rem 0.6rem', background: 'var(--primary-color)', borderRadius: '4px' }}
                                    >
                                      Next
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Main Comments Pagination */}
                    {totalPages > 1 && (
                      <div className="pagination flex flex-sb" style={{ marginTop: '2rem' }}>
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          style={{ padding: '0.5rem 1rem', background: 'var(--primary-color)', borderRadius: '5px', opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                          Previous
                        </button>
                        <span className="cosmic-text">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          style={{ padding: '0.5rem 1rem', background: 'var(--primary-color)', borderRadius: '5px', opacity: currentPage === totalPages ? 0.5 : 1 }}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="cosmic-text">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>

            {/* Add Comment Modal */}
            {showAddComment && (
              <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onClick={() => setShowAddComment(false)}>
                <form
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={handleAddManualComment}
                  style={{ width: '90%', maxWidth: '600px', background: 'var(--main-bgcolor)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--primary-color)' }}
                >
                  <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Add New Comment</h3>
                  <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                    <input type="text" placeholder="Name *" value={newComment.name} onChange={e => setNewComment({ ...newComment, name: e.target.value })} required style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #444' }} />
                    <input type="text" placeholder="Role" value={newComment.role} onChange={e => setNewComment({ ...newComment, role: e.target.value })} style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #444' }} />
                    <input type="url" placeholder="Image URL" value={newComment.image} onChange={e => setNewComment({ ...newComment, image: e.target.value })} style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #444' }} />
                    <input type="text" placeholder="Rating" value={newComment.rating} readOnly style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #444' }} />
                  </div>
                  <textarea
                    placeholder="Your comment *"
                    rows={4}
                    value={newComment.message}
                    onChange={e => setNewComment({ ...newComment, message: e.target.value })}
                    required
                    style={{ width: '100%', marginTop: '1rem', padding: '1rem', borderRadius: '8px', border: '1px solid #444' }}
                  />
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button type="submit" disabled={addingComment} style={{ padding: '0.75rem 2rem', background: 'var(--main-hover-color)', border: 'none', borderRadius: '5px', color: 'white' }}>
                      {addingComment ? 'Adding...' : 'Submit Comment'}
                    </button>
                    <button type="button" onClick={() => setShowAddComment(false)} style={{ padding: '0.75rem 2rem', background: '#555', border: 'none', borderRadius: '5px', color: 'white' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
       {

                    isDelete && !isloading && (
                            <div className="deletesec">
                                <div className="pot" >
                                    <div className="deletecard">
                                                    <p className="cookieHeading text-center">Are you sure you want to Delete this blog? </p>
                                                    <p className="cookieDescription">blog title: <span>{contactInfo?.title}</span></p>
                                                    <p className="cookieDescription">Beware, this action can not be reverse</p>
                                                    <div className="buttonContainer">
                                                           <button className="acceptButton" onClick={() => {deletBlog(contactInfo._id),
                                                            setDelete(false), router.push('/blogs/process1')
                                                           }}>Delete</button>
                                                           <button className="declineButton" onClick={() => setDelete(false)}>Cancel</button>
                                                    </div>
                                    </div>
                                                   </div>
                            </div>
                                                   
                                 
                    )
     

}

       {

                    isDelete && isloading && (
                            <div className="deletesec">
                                <div className="pot" >
                                   <Spinner/>
                                                   </div>
                            </div>
                                                   
                                 
                    )
     

}
          <div className="buttonClass">
            <a href="/blogs" className="button"><FaArrowLeft /> Back To Blogs</a>
          </div>
        </div>
      )}
    </LoginLayout>
  );
}


// import Head from "next/head"
// import axios from "axios";
// import { useState, useEffect } from "react";
// import { useRouter } from 'next/router';
// import LoginLayout from "@/components/LoginLayout";
// import toast from "react-hot-toast";
// import { FaArrowLeft, FaPlus, FaUserPlus } from "react-icons/fa";
// import { IoExit, IoStar, IoStarOutline } from "react-icons/io5";
// import Link from "next/link";
// import Spinner from "@/components/Spinner";
// import { faker } from "@faker-js/faker";
// import { FiX } from "react-icons/fi";

// export default function EditVisitors() {
//     const router = useRouter();
//      const randomNum = Math.floor(Math.random() * 100) + 1;
//         const gender = randomNum % 2 === 0 ? 'female' : 'male';
//         const imageNumber = Math.floor(Math.random() * 100);

//     const [showAddComment, setShowAddComment] = useState(false);
// const [newComment, setNewComment] = useState({
//   name: faker.person.fullName(),
//   role: faker.name.jobTitle(),
//   message: '',
//   rating: "⭐⭐⭐⭐⭐",
//   image: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/${gender}/512/${imageNumber}.jpg`// optional
// });
// const [addingComment, setAddingComment] = useState(false);
//     const { id } = router.query;
//       const [isloading, setIsLoading] = useState(true);
//     const [contactInfo, setContactInfo] = useState(null);
//      const [revInfo, setRevInfo] = useState(null);
   
//     const [loading, setLoading] = useState(true);
//     const [cont, setCont] = useState(false);
//     const [Prod, setProd] = useState(false);
//     const [comm, setComm] = useState(false);
// const [currentPage, setCurrentPage] = useState(1);
// const CommentsPerPage = 5;
//     const [error, setError] = useState(null);
// const formatDate = (date) => {
//   if (!date || isNaN(date)) {
//     return '';
//   }
//   const options = {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour12: true
//   };
//   return new Intl.DateTimeFormat('en-US', options).format(date);
// };
//  useEffect(() => {
//   toast.dismiss();
//     const fetchData = async () => {
//         if (!router.isReady || !id) {
//             setLoading(false);
//             if (!id) toast.error('Failed to acquire ID');
//             return;
//         }

//         try {
//             setLoading(true);
//             const contactId = Array.isArray(id) ? id[0] : id;
          

//            await  axios.get('/api/blogs?id=' + id).then(res => {
//                console.log("id", id, "res", res.data.data);
//                 setProductInfo(res.data.data );

//                   const products = res.data?.success ? res.data.data : null;
//                   const Comments = res.data?.success ? res.data.data1 : [];
           
//            if (products) {
//                 setContactInfo(products);
//                 setRevInfo(Comments)
//                 setProd(true);
//             }
//             else {
//                 toast.error(`No data found for the provided ID${contactId}  ${id}`);
//             }

//               })

//             // Handle responses
          
//         } catch (error) {
//             const errorMsg = error.response?.data?.message || error.message;
//             toast.error(errorMsg || 'An unexpected error occurred');
//             console.log('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchData();
// }, [id, router.isReady]);// Add router.isReady to dependencies

//       const StarRating = (rating ) => {
//   const stars = [];

//   for (let i = 1; i <= 5; i++) {
//     if (i <= rating) {
//       stars.push(<IoStar size={24} />);
//     } else {
//       stars.push(<IoStarOutline size={24} />);
//     }
//   }

//   return <div className="starRating rate " style={{fontSize:'35px'}}>{stars}</div>;
// };

//   const [isDelete, setDelete] = useState(false);
//  const [productInfo, setProductInfo] = useState(null);

//  const handleAddManualComment = async (e) => {
//   e.preventDefault();
//   if (!newComment?.name || !newComment?.message) {
//     toast.error("Name and message are required");
//     return;
//   }

//   setAddingComment(true);
//   try {
//     const res = await axios.post('/api/Comments', {
//       BlogId: contactInfo?._id,
//       BlogTitle: contactInfo?.title,
//       BlogSlug: contactInfo?.slug,
//       ...newComment,
//       image: newComment?.image || `https://ui-avatars.com/api/?name=${newComment?.name}&background=random`
//     });

//     if (res.data.success) {
//       // Refresh Comments
//       const updated = await axios.get('/api/blogs?id=' + id);
//       setRevInfo(updated.data.data1);
//        await  axios.get('/api/blogs?id=' + id).then(res => {
//                console.log("id", id, "res", res.data.data);
//                 setProductInfo(res.data.data );

//                   const products = res.data?.success ? res.data.data : null;
//                   const Comments = res.data?.success ? res.data.data1 : [];
//            console.log("products", products, "Comments", Comments);
//            if (products && Comments) {
//                 setRevInfo(Comments)
//                 setNewComment({ name: '', role: '', company: '', website: '', message: '', rating: 5, image: '' });
//                  setShowAddComment(false);
//                   toast.success("Comment added successfully!");
//             }
//             else {
//                setNewComment({ name: '', role: '', company: '', website: '', message: '', rating: 5, image: '' });
//                 setShowAddComment(false);
//                 toast.error(`No data found for the provided ID${contactId}  ${id}`);
//             }

//               })

     
     
//     }
//   } catch (err) {
//     toast.error(err.response?.data?.message || "Failed to add Comment");
//   } finally {
//     {
//     setAddingComment(false);
//   }
// }
// };
//       async function chooseDel(id) {
//         setDelete(true)
//         setIsLoading(true)
//         await axios.get('/api/Blogs?id=' + id).then(res => {
//              setProductInfo(res.data.data )
//            })
//             setIsLoading(false)
//       }

//             function goBack() {
//           setDelete(false);
//         router.push('/blogs/process1');
         
//      }

//      async function deletBlog(id) {
//   try {
//     console.log("Deleting Blog with ID:", id);
//     // Use DELETE instead of POST for semantic correctness
//      axios.delete('/api/blogs?blogId=' + id).then(res => {
//             toast.success(res.data.message || "Blog deleted successfully");
//       goBack();
//               }).catch ((error) => {
//     console.log("Delete error:", error);
//     setLoading(false);
//     toast.error(error.response?.data?.message || "Failed to delete Blog");
//   })

  
//   } catch (error) {
//     console.log("Delete error:", error);
//     setLoading(false);
//     toast.error(error.response?.data?.message || "Failed to delete Blog");
//   }
// }


//     if (loading) {
//         return (
//             <LoginLayout>
//                 <div className="flex justify-center items-center h-64">
//                     <div>Loading...</div>
//                 </div>
//             </LoginLayout>
//         );
//     }

//     if (error) {
//         return (
//             <LoginLayout>
//                 <div className="p-4 text-red-500">{error}</div>
//             </LoginLayout>
//         );
//     }

//     return (
//         <LoginLayout>
           
//              <Head>
//                 <title>MYG Tech - {contactInfo?.title} Blogs Details</title>
//                 <meta name="description" content="Blog website backend" />
//                 <meta name="viewport" content="width=device-width, initial-scale=1" />
//               </Head>

//             {
//                    Prod &&  <div className="cosmic-contact-display">
//  {contactInfo ? (
//   <>
//     <div className="cosmic-card">
//       <div className="stellar-header">
//         <h1 className="cosmic-title">
//           Blog Overview
//         </h1>
//         <div className="stellar-decoration"></div>
//       </div>
      
//       {/* Basic Information Section - Always shown */}
//       <p className="pulsing-label">Core Information</p>
//       <div className={contactInfo?.blogcategory === "Graphic & UI/UX Design"  ? "galaxy-grid" : "galaxy-grid1"}>
       
        
//         <div className={contactInfo?.blogcategory === "Graphic & UI/UX Design" ? "info-column nebula-bg" : "info-column1 nebula-bg"} style={contactInfo?.blogcategory === "Graphic & UI/UX Design" ? {width: '100%'} : {}}>
//           <p><span className="glowing-label">Blog Title:</span> 
//              <span className="cosmic-text">{contactInfo?.title}</span></p>
          
//    {
//      contactInfo?.client &&  <p><span className="glowing-label">Client:</span> 
//              <span className="cosmic-text">{contactInfo?.client}</span></p>
//    }       
           
//           <p><span className="glowing-label">Category:</span> 
//              <span className="cosmic-text">{contactInfo?.blogcategory}</span></p>
            
//           <p><span className="glowing-label">Type:</span> 
//              <span className="cosmic-text">{contactInfo?.BlogType}</span></p>
            
//           <p><span className="glowing-label">Status:</span> 
//              <span className="cosmic-text capitalize">{contactInfo?.status}</span></p>
         
//         </div>

//         <div className={contactInfo?.blogcategory === "Graphic & UI/UX Design" ?"flex flex-col" :  "flex flex-row"}  style={{width: contactInfo?.blogcategory === "Graphic & UI/UX Design" ?'250px' : "100%"}}>

//   { contactInfo?.blogcategory !== "Graphic & UI/UX Design" && contactInfo?.images.map((image, index) => (
// <div className="nebula-bg" key={index} style={contactInfo?.blogcategory === "Graphic & UI/UX Design" ? {width:'100%', height: '150px'}: {width:'180px', height: '150px'}}>
//           <img src={image} 
//                alt={contactInfo?.title} 
//                className="Blog-pComment-image" />
//         </div>
// ) ) 
//   }

//        </div>
//       </div>

//       {/* Blog Details Section */}
//  <div className="cosmic-section">
//         <p className="pulsing-label">Blog Specifications</p>
//         <div className="cosmic-text-highlight nebula-bg">
//           <p className="cosmic-text">
//             <span className="glowing-label">Description:</span><br/>
//             {contactInfo?.description}
//           </p>
//            <div>
//                 <span className="glowing-label">Blog Tags:</span>
//                 <ul className="feature-list">
//                   {contactInfo?.tags.map((feature, i) => (
//                     <li key={i} style={{paddingLeft:'20px'}}>*{feature}</li>
//                   ))}
//                 </ul>
//               </div>
        
//         </div>
//       </div>

//       {/* Engagement Metadata - Always shown */}
//       <div className="cosmic-section">
//         <p className="pulsing-label">Blog Date</p>
//         <div className="cosmic-text-highlight nebula-bg">
//           <p><span className="glowing-label">Year Published:</span> 
//              <span className="cosmic-text">{contactInfo?.BlogYear}</span></p>
             
//           <p><span className="glowing-label">Publish On:</span> 
//              <span className="cosmic-text">{new Date(contactInfo?.createdAt).toLocaleDateString()}</span></p>
             
//           <p><span className="glowing-label">Last Updated:</span> 
//              <span className="cosmic-text">{new Date(contactInfo?.updatedAt).toLocaleDateString()}</span></p>
//         </div>
//       </div>

//       {/* Action Buttons */}
     

//      <div className="cosmic-section">
//       <div className="flex flex-sb align-center mb-1">
// <p className="pulsing-label">Blog Comments ({revInfo?.length || 0})</p>
//        <button
//       onClick={() => setShowAddComment(!showAddComment)}
//       style={{
//         marginLeft: '1rem',
//         padding: '0.5rem 1rem',
//         background: 'var(--main-hover-color)',
//         border: 'none',
//         borderRadius: '5px',
//         color: 'white',
//         fontSize: '14px'
//       }}
//     >
//       <FaPlus size={20} /> add Comment
//        </button>
//        </div>
//         <div className="cosmic-text-highlight nebula-bg">
//           {revInfo?.length > 0 ? (
//             <>
//               <div className="review-grid" style={{ display: 'flex', gap: '.4rem', marginBottom: '1rem' }}>
//                 {revInfo.slice((currentPage - 1) * CommentsPerPage, currentPage * CommentsPerPage).map((Comment, index) => (
//                   <div key={index} className="Comment-item nebula-bg" style={{ padding: '1rem ', background:'var(--main-bgcolor)', borderRadius: '5px' }}>
//                     <div className="flex flex-sb">
//                        <div className="flex">
                       
//                       {Comment?.image && (
//                         <img
//                           src={Comment?.image}
//                           alt={Comment?.name}
//                           className="Commenter-image"
//                           style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
//                         />
//                       )}

//                       <div>
//                         <div>
//                         <span className="cosmic-text" style={{color: `var(--primary-color)`, fontWeight:500}}>{Comment?.name}</span>
//                      {Comment?.email && (
//                       <p>
//                         <span className="glowing-label">Email Address:</span>
//                         <span className="cosmic-text">{Comment?.email}</span>
//                       </p>
//                     )}
                
//                       </div>
                       
//                       </div>
//                       </div>
                      
//                         <p   style={{alignItems:'center'}}>
//                        <span className="cosmic-text text-right w-full">{formatDate(new Date(Comment?.createdAt))}</span>
//                     </p>
                     
//                     </div>
                   
//                     <p>
//                       <span className="cosmic-text">{Comment?.message}</span>
//                     </p>
                    
//                       <button className="button">
//                        Delete
//                       </ button>
                   
                   
//                   </div>
//                 ))}
//               </div>
//               {revInfo.length > CommentsPerPage && (
//                 <div className="pagination flex flex-sb" style={{ marginTop: '1rem' }}>
//                   <button
//                     className="button"
//                     style={{
//                       background: 'var(--primary-color)',
//                       padding: '0.5rem 1rem',
//                       borderRadius: '5px',
//                       opacity: currentPage === 1 ? 0.5 : 1,
//                       cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
//                     }}
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                   >
//                     Previous
//                   </button>
//                   <span className="cosmic-text">
//                     Page {currentPage} of {Math.ceil(revInfo.length / CommentsPerPage)}
//                   </span>
//                   <button
//                     className="button"
//                     style={{
//                       background: 'var(--primary-color)',
//                       padding: '0.5rem 1rem',
//                       borderRadius: '5px',
//                       opacity: currentPage === Math.ceil(revInfo.length / CommentsPerPage) ? 0.5 : 1,
//                       cursor: currentPage === Math.ceil(revInfo.length / CommentsPerPage) ? 'not-allowed' : 'pointer'
//                     }}
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(revInfo.length / CommentsPerPage)))}
//                     disabled={currentPage === Math.ceil(revInfo.length / CommentsPerPage)}
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <p className="cosmic-text">No Comments available for this Blog.</p>
//           )}
       
//        {showAddComment  && (
//       <div style={{ padding: '1.5rem', display:'flex', alignItems:'center', justifyContent:'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '2rem', position: 'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'100%', zIndex:10000000000 }}>
//         <form
//         onMouseLeave={() => setAddingComment(false)}
//         className="addWebsiteform" 
//         style={{  width:'60%',}}  >
//         <div className="flex flex-sb">
//             <h3 style={{ margin: '0 0 1rem', color: 'var(--primary-color)' }}>Add Comment</h3>
     
//         </div>
//               <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
//             <input
//               type="text"
//               placeholder="Customer Name *"
//               value={newComment?.name}
//               onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
//               required
//               style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #444' }}
//             />
//             <input
//               type="text"
//               placeholder="Role (e.g. CEO)"
//               value={newComment?.role}
//               onChange={(e) => setNewComment({ ...newComment, role: e.target.value })}
//               style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #444' }}
//             />
          
//             <input
//               type="url"
//               placeholder="Image URL (optional)"
//               value={newComment?.image}
//               onChange={(e) => setNewComment({ ...newComment, image: e.target.value })}
//               style={{ padding: '0.75rem', borderRadius: '5px', border: '1px solid #444' }}
//             />
//             <div>
//               <select
//                   id="rating"
//                   name="rating"
//                   value={newComment?.rating}
//                   required
//                   defaultValue={"⭐⭐⭐⭐⭐"}
//                   style={{ color: !newComment?.rating ? 'rgba(255,255,255, 0.4)' : '#fff', padding: '0.75rem', borderRadius: '5px', border: '1px solid #444', width: '100%' }}
//                    onChange={(e) => setNewComment({...newComment, rating: e.target.value})}
//                 >
//                   <option value="">Rating</option>
//                   {["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"].map(r => (
//                     <option key={r} value={r}>{r}</option>
//                   ))}
//                 </select>
              
//             </div>
//           </div>
//           <textarea
//             placeholder="Comment message *"
//             rows="2"
//             className='w-100 descript'
//             value={newComment?.message}
//             onChange={(e) => setNewComment({ ...newComment, message: e.target.value })}
//             required
//             style={{ height: '100px', width: '100%', marginTop: '1rem', padding: '1rem', borderRadius: '5px', border: '1px solid #444' }}
//           />
//           <div style={{ marginTop: '1rem' }}>
//             <button
//               type="submit"
//               disabled={addingComment}
//               onClick={handleAddManualComment}
//               style={{
//                 padding: '0.75rem 2rem',
//                 background: 'var(--main-hover-color)',
//                 border: 'none',
//                 borderRadius: '5px',
//                 color: 'white'
//               }}
//             >
//               {addingComment ? 'Adding...' : 'Submit Comment'}
//             </button>
//           </div>
//         </form>
//       </div>
//     )}

//         </div>
//       </div>

//       <div className="stellar-footer"></div>
//     </div>
//   </>
// ) : (
//   <div className="cosmic-empty">
//     <div className="empty-message">No Blog information available</div>
//     <div className="empty-stars"></div>
//   </div>
// )}
//  <div className="buttonClass">
//       <a href="/Blogs" className="button"><FaArrowLeft/> Back To Blogs</a>
//   </div>


//              </div>
//             }

// {
//     isDelete && !isloading && (
//                             <div className="deletesec">
//                                 <div className="pot" >
//                                     <div className="deletecard">
//                                                     <p className="cookieHeading text-center">Are you sure you want to Delete this Blog? </p>
//                                                     <p className="cookieDescription">Beware, this action can not be reverse</p>
//                                                     <div className="buttonContainer">
//                                                            <button className="acceptButton" onClick={() => {deletBlog(contactInfo?._id), setDelete(false), router.push('/Blogs/process1')}}>Delete</button>
//                                                            <button className="declineButton" onClick={() => setDelete(false)}>Cancel</button>
//                                                     </div>
//                                     </div>
//                                                    </div>
//                             </div>
                                                   
                                 
//                     )
// }

// {

//                     isDelete && isloading && (
//                             <div className="deletesec">
//                                 <div className="pot" >
//                                    <Spinner/>
//                                                    </div>
//                             </div>
                                                   
                                 
//                     )
     

// }
 

//         </LoginLayout>
//     );
// }