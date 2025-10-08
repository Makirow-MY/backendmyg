
import ReactMarkdown from 'react-markdown';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Spinner from './Spinner';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ReactSortable } from 'react-sortablejs';
import { IoPencil, IoTrash } from 'react-icons/io5';
import { BsPenFill } from 'react-icons/bs';
import { FiUpload } from 'react-icons/fi';
import { useEffect } from 'react';
//import cloudinary from './cloudinary';

export default function Blog({
    _id, 
    title: existingTitle,
    slug: existingSlug,
    description: existingDesc,
    blogcategory: existingCat,
    tags: existingTags,
    images: existingImages,
    status: existingStatus,
}) {
    
    //   console.log("existingTags", existingTags, [existingTags.map(tag => `${tag}`)])
const [redirect, setRedirect] = useState(false);
const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState(null);
const [title, setTitle] = useState(existingTitle || "");
const [slug, setSlug] = useState(existingSlug || "");
const [description, setDescription] = useState(existingDesc || "")
const [blogcategory, setBlogcategory] = useState(existingCat || [])
const [tags, setTags] = useState(existingTags || [])
const [images, setImages] = useState(existingImages || [])
const [status, setStatus] = useState(existingStatus || "");

    const [isUploading, setIsUploading] = useState(false);
    const [pasteImageUrl, setPasteImageUrl] = useState("");
 
    const uploadedImagesQueue = [];
const TAGS_BY_CATEGORY = {
  "Graphic & UI/UX Design": [
    "UI Design", "UX Design", "Wireframing", "Prototyping", 
    "User Research", "Figma", "Adobe XD", "Sketch", 
    "Illustration", "Branding", "Typography", "Color Theory",
    "Logo Design", "Print Design", "Web Design", "Mobile Design"
  ],
  "Website Development": [
    "HTML/CSS", "JavaScript", "React.js", "Next.js",
    "Node.js", "Express", "MongoDB", "SQL",
    "REST API", "GraphQL", "Authentication", "Deployment",
    "Performance", "SEO", "Accessibility", "Security"
  ],
  "Mobile Development": [
    "React Native", "Flutter", "iOS", "Android",
    "Expo", "Mobile UI", "Push Notifications", "App Store",
    "Google Play", "Offline First", "Mobile Security", "Cross-platform",
    "Native Modules", "Performance", "State Management", "Testing"
  ],
  "Network Design": [
    "5G", "Connectivity", "IoT", "Network Security",
    "Routing", "Switching", "VPN", "Firewalls",
    "Cloud Networking", "Wireless", "Cisco", "Juniper",
    "Network Automation", "SDN", "VoIP", "Monitoring"
  ],
  "Video Editing": [
    "Premiere Pro", "Final Cut", "DaVinci Resolve", "After Effects",
    "Motion Graphics", "Color Grading", "Sound Design", "Transitions",
    "Titles", "Compression", "Storyboarding", "Cinematography",
    "4K Editing", "Green Screen", "VFX", "YouTube"
  ]
};

  const uploadedAttachments = [];

// Then in your component:
const [availableTags, setAvailableTags] = useState([]);
 const [attachments, setAttachments] = useState([]);
// Add this useEffect to update tags when category changes
useEffect(() =>{
    if (existingImages) {
       existingImages.forEach(element => {
    setAttachments((prevImages) => [...prevImages, { data: element, name: element}]);
        
       }); 
//   (prev) => [...prev, ...validAttachments]      
    }
},[existingImages])
useEffect(() => {
  if (blogcategory) {
    setAvailableTags(TAGS_BY_CATEGORY[blogcategory] || []);
    // Reset tags when category changes to avoid mismatches
    setTags([]);
  }
}, [blogcategory]);
async function createBlog(data) {
    data.preventDefault()
    
    if (isUploading) {
        await Promise.all(uploadedImagesQueue)
    }

    const userData = {title, slug, attachments, description, blogcategory, tags};
    if (_id) {
        toast.loading("Updating Blog...")
        await axios.put("/api/blogs", {...userData, _id})
        toast.success('Data updated')
       // router.push("/blogs") 
    }
    else{
        toast.loading("Creating Blog...")
        await axios.post("/api/blogs", {...userData, _id})
        toast.success('Blog created!');
        //router.push("/blogs") 
    }

    setRedirect(true);
    
    if (redirect) {
        router.push("/blogs") 
    }
}

if (redirect) {
    setTimeout(() => {
        router.push(  "/blogs" );
         return null; 
    }, 1000);
    
}
    async function uploadImages(e) {
        const files = e.target?.files;
         setIsUploading(true);
          setUploadError(null);
        const myFiles = Array.from(e.target.files);
        if (!myFiles || myFiles.length === 0) {
            toast.error("Please select files to upload");
            return;
        }

        if ((images.length + myFiles.length) > 10) {
            toast.error(`You can only upload atmost 10 images`);
            return;
        }

          const processFile = async (file) => {
   
        let base64;
        try {
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          
        } catch (err) {
          toast.error(`Failed to read file: ${file.name}`);
          setUploadError(`Failed to read file: ${file.name}`);
          return null;
        }
        finally{
              setIsUploading(false);
             
        }
        const attachmentData = { data: base64, name: file.name };
      
        return attachmentData;
      
    };
    const processed = await Promise.all(myFiles.map(processFile));
    const validAttachments = processed.filter((a) => a !== null);
    const prevLength = attachments.length;
    setAttachments((prev) => [...prev, ...validAttachments]);
      

    //      if (attachments?.length) {
    //   for (const attachment of attachments) {
    //     const base64Data = attachment.data;
    //     const resource_type = attachment.type === 'image' ? 'image' :
    //                          attachment.type === 'video' ? 'video' :
    //                          attachment.type === 'audio' ? 'video' :
    //                          'raw';
    //     const uploadResponse = await cloudinary.uploader.upload(base64Data, {
    //       resource_type,
    //       folder: attachment.type,
    //     });
    //     uploadedAttachments.push({
    //       attachmentUrl: uploadResponse.secure_url,
    //       attachmentType: attachment.type,
    //       originalName: attachment.name,
    //       attachmentSize: attachment.size,
    //       attachmentExt: attachment.ext || attachment.name.split(".").pop().toLowerCase(),
    //       previewUrl: attachment.preview || uploadResponse.secure_url,
    //       duration: attachment.duration,
    //     });
    //   }
    // }

        // setIsUploading(true);
        // setUploadProgress(0);
        // setUploadError(null);

        // const formData = new FormData();
        // for (let i = 0; i < files.length; i++) {
        //     formData.append('images', files[i]);
        // }

        // try {
        //     const response = await axios.post('/api/upload', formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //         onUploadProgress: (progressEvent) => {
        //             const percentCompleted = Math.round(
        //                 (progressEvent.loaded * 100) / progressEvent.total
        //             );
        //             setUploadProgress(percentCompleted);
        //         },
        //     });

        //     // Store uploaded images with type 'uploaded'
        //     setImages(prevImages => [
        //         ...prevImages, 
        //         ...response.data.images.map(url => ({ url, type: 'uploaded' }))
        //     ]);
        //     toast.success(`${files.length} image(s) uploaded successfully`);
        // } catch (error) {
        //     console.error('Upload error:', error);
        //     setUploadError(error.response?.data?.error || 'Error uploading images');
        //     toast.error(uploadError || 'Error uploading images');
        // } finally {
        //     setIsUploading(false);
        //     setUploadProgress(0);
        // }

    }

    async function deleteImage(image) {
        try {
        
            if (image.name && image.name) {
               setAttachments(prevImages => prevImages.filter(img => img.name !== image.name));
                toast.success('Uploaded image deleted successfully');
            } else {
                toast.success('Pasted image URL removed successfully');
            }
            // Remove image from state regardless of type
  setAttachments(prevImages => prevImages.filter(img => img.name !== image.name));

        } catch (error) {
            console.error('Delete error:', error);
            if (error.response?.data?.error === 'File not found in either location') {
            setImages([]);
            }
            toast.error(error.response?.data?.error || 'Error deleting image');
        }
    }

    function handlePasteImage(e) {
        const pastedUrl = e.target.value.trim();
        const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
        if (pastedUrl && urlPattern.test(pastedUrl)) {
            setAttachments(prevImages => [...prevImages, { data: pastedUrl, name: pastedUrl }]);
            setPasteImageUrl("");
            toast.success('Image URL added successfully');
        } else if (pastedUrl) {
            toast.error('Please paste a valid image URL (png, jpg, jpeg, gif)');
        }
    }

const handleSlugChange = (e) =>{
    const input = e.target.value;
    const newSlug = input.replace(/\s+/g, '-');
    setSlug(newSlug)
}

    return <>
<form className='addWebsiteform' onSubmit={createBlog}>

<div className='w-100 flex flex-col flex-left mb-2'>
      <label htmlFor='title'>Title</label>
      <input className='input' value={title} onChange={(e) => {
        handleSlugChange(e)
        setTitle(e.target.value)}} type='text' id='title' placeholder='Enter small title' />
    </div>

   <input className='input' value={slug} onChange={(e) => handleSlugChange(e)} type='hidden' id='slug' placeholder='Enter slug url' />
   

   <div className='w-100 flex flex-col flex-left mb-2'>
                        <label htmlFor='category'>Blog setActiveCategory</label>
                        <select 
                            name='category' 
                            required 
                            id='category' 
                            value={blogcategory} 
                            onChange={(e) => setBlogcategory(e.target.value)}
                        >
                            <option value="">Select Your Field</option>
                            <option value="Graphic & UI/UX Design">Graphic & UI/UX Design</option>
                            <option value="Website Development">Website Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Network Design">Network Design</option>
                            <option value="Video Editing">Video Editing</option>
                        </select>
                    </div>
    
       <div className='description w-100 flex flex-col flex-left mb-2'>
            <label htmlFor='description'>
                        Blog Description
            </label>
            <textarea className='w-100 descript'
            required
             value={description}
             rows={6}
             cols={6}
             placeholder='Write something about your blog'
             onChange={(e) => setDescription(e.target.value)}
             >

            </textarea>
         
      </div>
{
    blogcategory !== "" && <div className='w-100 flex flex-col flex-left mb-2'>
  <label htmlFor='tags'>Blog Tags* (Select multiple)</label>
  <select 
    id='tags' 
    name='tags' 
    multiple 
    value={tags} 
    onChange={(e) => setTags(Array.from(e.target.selectedOptions, option => option.value))}
    className='input'
  >
    {availableTags.map(tag => (
      <option key={tag} value={tag}>{tag}</option>
    ))}
  </select>
</div>
}
     


 {/* Project Visuals */}
                <div className='w-100 flex flex-col flex-left mb-2'>
                    <label>Paste Image URL</label>
                    <input 
                        className='input' 
                        value={pasteImageUrl}
                        onChange={(e) => {setPasteImageUrl(e.target.value)
                            handlePasteImage(e)
                        }}
                        onPaste={handlePasteImage}
                         onBlur={handlePasteImage}
                         onFocus={handlePasteImage}
                        type='text'
                        placeholder='Paste image URL (e.g., https://example.com/image.jpg)'
                    />
                </div>

                <div className='w-100 flex flex-col flex-left mb-2'>
                    <label>Project Visuals* (Minimum 3 images)</label>
                    <div className='w-100' style={{display:'flex', gap:'1rem', flexShrink:'-1'}}>
                        <label className='fileInput' htmlFor='fileInput' style={{ flexShrink:0 }}>
                            <FiUpload/> Upload Images<br/>(Showcase your work)
                        </label>
                        <input 
                            type='file' 
                            style={{display:'none'}} 
                            id='fileInput' 
                            onChange={uploadImages} 
                            accept='image/*' 
                            multiple 
                            disabled={isUploading}
                        />
                        
                        {/* {isUploading && (
                            <div className='w-100 flex mt-1'>
                                <div className="upload-progress-container">
                                    <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                                    <span className="upload-progress-text">{uploadProgress}%</span>
                                </div>
                            </div>
                        )} */}

                        {uploadError && (
                            <div className="upload-error">{uploadError}</div>
                        )}
                    
                        {(!isUploading && attachments.length > 0) && (
                            <ReactSortable 
                                list={attachments} 
                                setList={setAttachments} 
                                className='gap-1' 
                                style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)'}}
                            >
                                {/* {images.slice(0, 3).map((image, index) => (
                                    <div key={index} className='uploadedimg'>
                                        <img 
                                            loading='lazy' 
                                            src={image.url ? image.url : image} 
                                            alt={`Project ${index + 1}`} 
                                            className='object-cover' 
                                        />
                                        <div className='deleteimg'>
                                            <button 
                                                type='button' 
                                                onClick={() => deleteImage(image)}
                                            >
                                                <IoTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))} */}
                                 {attachments.map((attachment, index) => (
                                   <div key={index} className='uploadedimg'>
                                        <img 
                                            loading='lazy' 
                                            src={attachment.data} 
                                            alt={`${attachment.name}`} 
                                            className='object-cover' 
                                        />
                                        <div className='deleteimg'>
                                            <button 
                                                type='button' 
                                                onClick={() => deleteImage(attachment)}
                                            >
                                                <IoTrash />
                                            </button>
                                        </div>
                                    </div>
                                  
                                 ))}
                            </ReactSortable>
                        )}

                        {(!isUploading && attachments.length === 0) && 
                            <div className='w-100 flex mt-1'>
                                <p>Uploaded or pasted images will appear here</p>
                            </div>
                        }
                    </div>
                    
                    {/* {(!isUploading && images.length > 0) && (
                        <ReactSortable 
                            list={images} 
                            setList={setImages} 
                            className='gap-1' 
                            style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)'}}
                        >
                            {images.slice(3, 9).map((image, index) => (
                                <div key={index} className='uploadedimg'>
                                    <img 
                                        loading='lazy' 
                                       src={image.url ? image.url : image} 
                                        alt={`Project ${index + 4}`} 
                                        className='object-cover' 
                                    />
                                    <div className='deleteimg'>
                                        <button 
                                            type='button' 
                                            onClick={() => deleteImage(image)}
                                        >
                                            <IoTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </ReactSortable>
                    )}  */}
                </div>





        <div className='w-100 mb-2'>
            <button type='submit' className='w-100 addwebbtn flex-center'>SAVE BLOG</button>
        </div>

</form>
    </>
}

