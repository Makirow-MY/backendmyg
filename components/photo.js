
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

export default function Photo({
    _id, 
    title: existingTitle,
    slug: existingSlug,
    images: existingImages,

}) {
    
const [redirect, setRedirect] = useState(false);
const router = useRouter();

const [title, setTitle] = useState(existingTitle || "");
const [slug, setSlug] = useState(existingSlug || "");
const [images, setImages] = useState(existingImages || [])

const [isUploading, setIsUploading] = useState(false);

const uploadedImagesQueue = [];

async function createBlog(data) {
    data.preventDefault()
    toast.loading("Creating Project...")
    if (isUploading) {
        await Promise.all(uploadedImagesQueue)
    }

    const userData = {title, slug, images};
    if (_id) {
         toast.loading("Updating Blog...")
        await axios.put("/api/photos", {...userData, _id})
        toast.success('Data updated')
       // router.push("/blogs") 
    }
    else{
        await axios.post("/api/photos", {...userData, _id})
        toast.success('Blog created!');
        //router.push("/blogs") 
    }

    setRedirect(true);
    
    if (redirect) {
        router.push("/gallery") 
    }
}

if (redirect) {
    setTimeout(() => {
        router.push("/gallery");
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
       // console.log("uploadedImagesQueue", uploadedImagesQueue, "images", images)
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
      <div className='w-100'>
      <label htmlFor='images'>Images (First image displays as thumbnail, you can drag)</label>
       <input type='file' id='fileInput' onChange={(e) => UploadImages(e)} className='mt-2' accept='image/*'  />
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


        <div className='w-100 mb-2'>
            <button type='submit' className='w-100 addwebbtn flex-center'>UPLOAD PHOTO</button>
        </div>

</form>
    </>
}

