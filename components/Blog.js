import ReactMarkdown from 'react-markdown';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Spinner from './Spinner';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ReactSortable } from 'react-sortablejs';
import { IoTrash } from 'react-icons/io5';
import { FiUpload } from 'react-icons/fi';

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
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState(existingTitle || "");
  const [slug, setSlug] = useState(existingSlug || "");
  const [description, setDescription] = useState(existingDesc || "");
  const [blogcategory, setBlogcategory] = useState(existingCat || "");
  const [tags, setTags] = useState(existingTags || []);
  const [attachments, setAttachments] = useState([]); // {url, name} or {file, name}
  const [status, setStatus] = useState(existingStatus || "");
  const [isUploading, setIsUploading] = useState(false);
  const [pasteImageUrl, setPasteImageUrl] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setAttachments(existingImages.map(url => ({ url, name: url.split('/').pop() })));
    }
    if (existingTags && existingTags.length > 0) {
      setTags(existingTags);
    }
  }, [existingImages, existingTags]);

  useEffect(() => {
    if (blogcategory) {
      setAvailableTags(TAGS_BY_CATEGORY[blogcategory] || []);
      setTags(existingTags || []);
    }
  }, [blogcategory]);

  async function createBlog(e) {
    e.preventDefault();
    if (isUploading) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('blogcategory', blogcategory);
    formData.append('tags', JSON.stringify(tags));
    formData.append('status', status || (title && slug && description && blogcategory && attachments.length > 0 ? 'publish' : 'draft'));

    attachments.forEach((att) => {
      if (att.file) {
        formData.append('images', att.file);
      } else if (att.url) {
        formData.append('existingImages', att.url);
      }
    });

    if (_id) {
      formData.append('_id', _id);
    }

    try {
      setIsUploading(true);
      const toastId = _id ? toast.loading("Updating Blog...") : toast.loading("Creating Blog...");
      const response = _id
        ? await axios.put("/api/blogs", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        : await axios.post("/api/blogs", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
      toast.success(_id ? 'Blog updated' : 'Blog created!', { id: toastId });
      setRedirect(true);
    } catch (error) {
      toast.error(error.response?.data?.message || (_id ? 'Failed to update blog' : 'Failed to create blog'));
      console.error('Save error:', error);
    } finally {
      setIsUploading(false);
    }
  }

  if (redirect) {
    setTimeout(() => router.push("/blogs"), 1000);
    return null;
  }

  function uploadImages(e) {
    const files = e.target?.files;
    if (!files || files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }
    if ((attachments.length + files.length) > 10) {
      toast.error(`You can only upload at most 10 images`);
      return;
    }
    setAttachments((prev) => [...prev, ...Array.from(files).map(file => ({ file, name: file.name }))]);
  }

  function deleteImage(image) {
    setAttachments(prev => prev.filter(att => att.name !== image.name));
    toast.success('Image removed successfully');
  }

  function handlePasteImage(e) {
    const pastedUrl = e.target.value.trim();
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
    if (pastedUrl && urlPattern.test(pastedUrl)) {
      if (attachments.length >= 10) {
        toast.error(`You can only upload at most 10 images`);
        return;
      }
      setAttachments(prev => [...prev, { url: pastedUrl, name: pastedUrl.split('/').pop() }]);
      setPasteImageUrl("");
      toast.success('Image URL added successfully');
    } else if (pastedUrl) {
      toast.error('Please paste a valid image URL (png, jpg, jpeg, gif)');
    }
  }

  const handleSlugChange = (e) => {
    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setSlug(newSlug);
  };

  return (
    <form className='addWebsiteform' onSubmit={createBlog}>
      <div className='w-100 flex flex-col flex-left mb-2'>
        <label htmlFor='title'>Title* <span className='text-sm text-gray-500'>(e.g., My Blog Post)</span></label>
        <input
          className='input'
          required
          value={title}
          onChange={(e) => {
            handleSlugChange(e);
            setTitle(e.target.value);
          }}
          type='text'
          id='title'
          placeholder='Enter blog title'
        />
      </div>
      <input className='input' value={slug} onChange={handleSlugChange} type='hidden' id='slug' />
      <div className='w-100 flex flex-col flex-left mb-2'>
        <label htmlFor='category'>Blog Category*</label>
        <select
          name='category'
          required
          id='category'
          value={blogcategory}
          onChange={(e) => setBlogcategory(e.target.value)}
          className='input'
        >
          <option value="">Select Your Field</option>
          {Object.keys(TAGS_BY_CATEGORY).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className='description w-100 flex flex-col flex-left mb-2'>
        <label htmlFor='description'>Blog Description* <span className='text-sm text-gray-500'>(Write your blog content)</span></label>
        <MarkdownEditor
          value={description}
          style={{ height: '400px' }}
          renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
          onChange={({ text }) => setDescription(text)}
          placeholder='Write something about your blog (Markdown supported)'
        />
      </div>
      {blogcategory && (
        <div className='w-100 flex flex-col flex-left mb-2'>
          <label htmlFor='tags'>Blog Tags* <span className='text-sm text-gray-500'>(Select multiple)</span></label>
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
      )}
      <div className='w-100 flex flex-col flex-left mb-2'>
        <label>Paste Image URL <span className='text-sm text-gray-500'>(png, jpg, jpeg, gif)</span></label>
        <input
          className='input'
          value={pasteImageUrl}
          onChange={(e) => setPasteImageUrl(e.target.value)}
          onPaste={handlePasteImage}
          onBlur={handlePasteImage}
          type='text'
          placeholder='e.g., https://example.com/image.jpg'
        />
      </div>
      <div className='w-100 flex flex-col flex-left mb-2'>
        <label>Blog Visuals* <span className='text-sm text-gray-500'>(Maximum 10 images)</span></label>
        <div className='w-100' style={{ display: 'flex', gap: '1rem', flexShrink: '-1' }}>
          <label className='fileInput' htmlFor='fileInput' style={{ flexShrink: 0 }}>
            <FiUpload /> Upload Images<br />(Showcase your work)
          </label>
          <input
            type='file'
            style={{ display: 'none' }}
            id='fileInput'
            onChange={uploadImages}
            accept='image/*'
            multiple
            disabled={isUploading}
          />
          {uploadError && (
            <div className="upload-error">{uploadError}</div>
          )}
          {attachments.length > 0 && (
            <ReactSortable
              list={attachments}
              setList={setAttachments}
              className='gap-1'
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
            >
              {attachments.map((attachment, index) => (
                <div key={index} className='uploadedimg'>
                  <img
                    loading='lazy'
                    src={attachment.url || URL.createObjectURL(attachment.file)}
                    alt={attachment.name}
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
          {attachments.length === 0 && (
            <div className='w-100 flex mt-1'>
              <p>Uploaded or pasted images will appear here</p>
            </div>
          )}
        </div>
      </div>
      <div className='w-100 mb-2'>
        <button type='submit' className='w-100 addwebbtn flex-center' disabled={isUploading}>
          {isUploading ? <Spinner /> : 'SAVE BLOG'}
        </button>
      </div>
    </form>
  );
}