
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

export default function Shop(
{   _id, 
    title: existingTitle,
    slug: existingSlug,
    description: existingDesc,
    tags: existingTags,
    images: existingImages,
    price: existingprice,
    afilink: existinglink,
    status: existingStatus,
}) {
    
const [redirect, setRedirect] = useState(false);
const router = useRouter();

const [title, setTitle] = useState(existingTitle || "");
const [slug, setSlug] = useState(existingSlug || "");
const [afilink, setAfilink] = useState(existinglink || "");
const [price, setPrice] = useState(existingprice || "");
const [description, setDescription] = useState(existingDesc || "")
const [tags, setTags] = useState(existingTags || [])
const [images, setImages] = useState(existingImages || [])
const [status, setStatus] = useState(existingStatus || "");

const [isUploading, setIsUploading] = useState(false);

const uploadedImagesQueue = [];

async function createBlog(data) {
    data.preventDefault()
    if (isUploading) {
        await Promise.all(uploadedImagesQueue)
    }

    const userData = {title, slug, images, description, price, afilink, tags, status};

    if (_id) {
      //  console.log("userdata1", userData)
        await axios.put("/api/shops", {...userData, _id})
        toast.success('Data updated')
       // router.push("/blogs") 
    }
    else{
      //  console.log("userdata2", userData)
        await axios.post("/api/shops", {...userData, _id})
        toast.success('Project created!');
        //router.push("/blogs") 
    }

    setRedirect(true);
    
    if (redirect) {
        router.push("/shops") 
    }
}

if (redirect) {
    setTimeout(() => {
        router.push( status == "publish" ? "/shops" : "/shops/draftshop");
         return null; 
    }, 1000);
    
}
async function UploadImages(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
        setIsUploading(true);

        for (const file of files) {
            const data = new FormData();
            data.append('file', file);
            
            uploadedImagesQueue.push(
                axios.post('/api/upload', data).then(res =>{
                    setImages(oldImg => [...oldImg, ...res.data.links])
                })
            )
        }

        await Promise.all(uploadedImagesQueue);
        setIsUploading(false);
        toast.success('image uploaded successfully')
      //  console.log("uploadedImagesQueue", uploadedImagesQueue, "images", images)
    }
    else{
          toast.error("an error occured") 
    }
}


function UpdateImageOder(images) {
      setImages(images)    
}

function DeleteImage(index) {
   const updateImages = [...images];
   updateImages.slice(index, 1);
   setImages(updateImages);
   toast.success("Image deleted! with success")  
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
      <input className='input' value={title} onChange={(e) => setTitle(e.target.value)} type='text' id='title' placeholder='Enter small title' />
    </div>


    <div className='w-100 flex flex-col flex-left mb-2'>
      <label htmlFor='slug'>Slug (seo friendly url)</label>
      <input className='input' value={slug} onChange={(e) => handleSlugChange(e)} type='text' id='slug' placeholder='Enter slug url' />
    </div>

    <div className='w-100 flex flex-col flex-left mb-2'>
      <label htmlFor='price'>Price</label>
      <input className='input' value={price} onChange={(e) => setPrice(e.target.value)} type='number' id='price' placeholder='Enter your price ' />
    </div>

    <div className='w-100 flex flex-col flex-left mb-2'>
      <label htmlFor='afilink'>Link</label>
      <input className='input' value={afilink} onChange={(e) => setAfilink(e.target.value)} type='text' id='livepreview' placeholder='Enter afilink' />
    </div>

    <div className='w-100 flex flex-col flex-left mb-2'>
      <div className='w-100'>
      <label htmlFor='images'>Images (First image displays as thumbnail, you can drag)</label>
       <input type='file' id='fileInput' onChange={(e) => UploadImages(e)} className='mt-2' accept='image/*' multiple />
      </div>

            <div className='w-100 flex flex-left mt-1'>
                   {(isUploading) && (<Spinner />)}
            </div>

      </div>

      {
        (!isUploading) && (
            <div className='flex'>
   <div className='flex gap-1 flex-sb ' style={{
    overflowX: "scroll",
    width: "350"

   }}  >
{
    images.map((link, index) => {
     return   (<div key={link} className='uploadedimg'>
            <img loading='lazy' src={link} className='object-cover' />
            <div className='deleteimg '>
              <button onClick={() => UpdateImageOder(link)}><BsPenFill /></button>
                <button onClick={() => DeleteImage(index)}><IoTrash /></button>
            </div>
        </div>)
    })
}
   </div>
            </div>
        )
      }

      <div className='description w-100 flex flex-col flex-left mb-2'>
            <label htmlFor='description'>
                        Project Content(for image: first upload and copy link and paste in ![alt text](link))
            </label>
            <MarkdownEditor 
            value={description}
            onChange={(e) => setDescription(e.text)}
             style={{
                width: "100%",
                height: "400px"
             }}
             renderHTML={(text) => (
                <ReactMarkdown components={{
                    code:({node, inline, className, children, ...props}) =>{
                        const match = /language.(\w+)/.exec(className || '');

                        if (inline) {
                            return <code>{children}</code>
                        } else if (match) {
                            return(
                                <div style={{
                                    position: 'relative'
                                }}>
<pre style={{ padding: '0', borderRadius: '10px', overflowX: 'auto', whiteSpace:"pre-wrap"}} {...props}>
<code>{children}</code>
</pre>

<button style={{ position: 'absolute', right: '0', top: '0', zIndex:"1"}} onClick={() => navigator.clipboard.writeText(children)}>
    copy code
</button>
                                </div>
                            )
                        } else {
                             return <code {...props}> {children}</code>
                        }
                    }
                }} >

{text}
                </ReactMarkdown>
             )}
             />
             
      </div>

      <div className='w-100 flex flex-col flex-left mb-2'>
      <label htmlFor='tags'>Tags</label>
       <select id='tags' className='mt-2' name='tags' multiple value={tags} onChange={(e) => setTags(Array.from(e.target.selectedOptions, option => option.value))}>

            <option  value={"Programming"}>Programming</option>
            <option  value={"Database"}>Database</option>
            <option  value={"Networking"}>Networking</option>
            <option  value={"Design"}>Design</option>
            <option  value={"Technology"}>Technology</option>
            <option  value={"Management"}> Management </option>
            <option  value={"Development"}>Development</option>
            <option  value={"Maintainance"}>Maintainance</option>
            
       </select>
        </div>

        <div className='w-100 flex flex-col flex-left mb-2'>
      <label htmlFor='status'>Status</label>
       <select id='status' className='mt-2' name='status' value={status} onChange={(e) => setStatus(e.target.value)}>

            <option  value={""}>No select</option>
            <option  value={"draft"}>Draft</option>
            <option  value={"publish"}>Publish</option>
           
            
       </select>
        </div>

        <div className='w-100 mb-2'>
            <button type='submit' className='w-100 addwebbtn flex-center'>SAVE DATA</button>
        </div>

</form>

   

    </>
}

