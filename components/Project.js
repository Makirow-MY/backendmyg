import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ReactSortable } from 'react-sortablejs';
import { IoTrash } from 'react-icons/io5';
import { FaArrowLeft } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';
import Spinner from './Spinner'; // Assuming this exists
import { faker } from '@faker-js/faker';

const TAGS_BY_CATEGORY = {
  "Graphic & UI/UX Design": ["Wireframing", "Prototyping", "Figma", "Adobe XD", "Photoshop", "Usability Testing", "Design Systems", "Accessibility"],
  "Website Development": ["Frontend", "Backend", "React", "Next.js", "Node.js", "REST API", "SEO", "Performance"],
  "Mobile Development": ["React Native", "Flutter", "iOS", "Android", "Push Notifications", "App Store", "Mobile Security"],
  "Network Design": ["5G", "Network Security", "Routing", "VPN", "Firewalls", "Cloud Networking", "Network Automation"],
  "Video Editing": ["Premiere Pro", "After Effects", "DaVinci Resolve", "Motion Graphics", "Color Grading", "VFX", "4K Editing"]
};

const CATEGORY_FIELDS = {
  "Graphic & UI/UX Design": [
    { name: "designTools", label: "Design Tools", type: "text", placeholder: "e.g., Figma, Adobe XD" },
    { name: "userResearchMethods", label: "Research Methods", type: "text", placeholder: "e.g., Surveys, Interviews" },
    { name: "designImpact", label: "Design Impact", type: "textarea", placeholder: "e.g., Improved retention by 25%" }
  ],
  "Website Development": [
    { name: "frameworks", label: "Frameworks", type: "text", placeholder: "e.g., React, Express" },
    { name: "deploymentPlatform", label: "Deployment Platform", type: "text", placeholder: "e.g., Vercel, AWS" },
    { name: "performanceMetrics", label: "Performance Metrics", type: "textarea", placeholder: "e.g., 30% faster load time" }
  ],
  "Mobile Development": [
    { name: "mobileFrameworks", label: "Mobile Frameworks", type: "text", placeholder: "e.g., React Native, Flutter" },
    { name: "targetDevices", label: "Target Devices", type: "text", placeholder: "e.g., iOS, Android" },
    { name: "appStoreStatus", label: "App Store Status", type: "text", placeholder: "e.g., Published on Google Play" }
  ],
  "Network Design": [
    { name: "networkProtocols", label: "Network Protocols", type: "text", placeholder: "e.g., TCP/IP, BGP" },
    { name: "hardwareUsed", label: "Hardware Used", type: "text", placeholder: "e.g., Cisco Routers" },
    { name: "networkMetrics", label: "Network Metrics", type: "textarea", placeholder: "e.g., 99.9% uptime" }
  ],
  "Video Editing": [
    { name: "editingSoftware", label: "Editing Software", type: "text", placeholder: "e.g., Premiere Pro, DaVinci Resolve" },
    { name: "videoType", label: "Video Type", type: "text", placeholder: "e.g., Promotional, Tutorial" },
    { name: "videoImpact", label: "Video Impact", type: "textarea", placeholder: "e.g., 100K views, 15% engagement" }
  ]
};

export default function Project({
  _id, title: existingTitle, slug: existingSlug, description: existingDesc, projectcategory: existingCat,
  tags: existingTags, images: existingImages, client: existingClient, livepreview: existingLivePreview,
  price: existingPrice, projectType: existingProjectType, technologies: existingTechnologies,
  features: existingFeatures, platforms: existingPlatforms, projectYear: existingProjectYear,
  repositoryUrl: existingRepositoryUrl, documentationUrl: existingDocumentationUrl,
  isResponsive: existingIsResponsive, licenseType: existingLicenseType, supportAvailable: existingSupportAvailable,
  ...existingCategoryFields
}) {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState(existingTitle || "");
  const [slug, setSlug] = useState(existingSlug || "");
  const [livepreview, setLivepreview] = useState(existingLivePreview || "");
  const [client, setClient] = useState(existingClient || faker.company.name());
  const [description, setDescription] = useState(existingDesc || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [projectcategory, setProjectcategory] = useState(existingCat || "");
  const [tags, setTags] = useState(existingTags || []);
  const [attachments, setAttachments] = useState([]); // Now {url, name} or {file, name}
  const [projectType, setProjectType] = useState(existingProjectType || "Showcase");
  const [technologies, setTechnologies] = useState(existingTechnologies || []);
  const [features, setFeatures] = useState(existingFeatures || []);
  const [platforms, setPlatforms] = useState(existingPlatforms || []);
  const [projectYear, setProjectYear] = useState(existingProjectYear || new Date().getFullYear());
  const [repositoryUrl, setRepositoryUrl] = useState(existingRepositoryUrl || "");
  const [documentationUrl, setDocumentationUrl] = useState(existingDocumentationUrl || "");
  const [isResponsive, setIsResponsive] = useState(existingIsResponsive || false);
  const [licenseType, setLicenseType] = useState(existingLicenseType || "");
  const [supportAvailable, setSupportAvailable] = useState(existingSupportAvailable || false);
  const [categorySpecificFields, setCategorySpecificFields] = useState({
    designTools: existingCategoryFields.designTools || "",
    userResearchMethods: existingCategoryFields.userResearchMethods || "",
    designImpact: existingCategoryFields.designImpact || "",
    frameworks: existingCategoryFields.frameworks || "",
    deploymentPlatform: existingCategoryFields.deploymentPlatform || "",
    performanceMetrics: existingCategoryFields.performanceMetrics || "",
    mobileFrameworks: existingCategoryFields.mobileFrameworks || "",
    targetDevices: existingCategoryFields.targetDevices || "",
    appStoreStatus: existingCategoryFields.appStoreStatus || "",
    networkProtocols: existingCategoryFields.networkProtocols || "",
    hardwareUsed: existingCategoryFields.hardwareUsed || "",
    networkMetrics: existingCategoryFields.networkMetrics || "",
    editingSoftware: existingCategoryFields.editingSoftware || "",
    videoType: existingCategoryFields.videoType || "",
    videoImpact: existingCategoryFields.videoImpact || ""
  });
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
    if (projectcategory) {
      setAvailableTags(TAGS_BY_CATEGORY[projectcategory] || []);
      setTags(existingTags || []);
    }
  }, [projectcategory]);

  async function createBlog(e) {
    e.preventDefault();
    if (isUploading) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('projectcategory', projectcategory);
    formData.append('client', client);
    formData.append('livepreview', livepreview);
    formData.append('projectType', projectType);
    formData.append('projectYear', projectYear);
    formData.append('repositoryUrl', repositoryUrl);
    formData.append('documentationUrl', documentationUrl);
    formData.append('isResponsive', isResponsive);
    formData.append('licenseType', licenseType);
    formData.append('supportAvailable', supportAvailable);
    formData.append('tags', JSON.stringify(tags));
    formData.append('technologies', JSON.stringify(technologies));
    formData.append('features', JSON.stringify(features));
    formData.append('platforms', JSON.stringify(platforms));
    formData.append('category_fields', JSON.stringify(categorySpecificFields));

    attachments.forEach((att) => {
      if (att.file) {
        formData.append('images', att.file);
      } else if (att.url) {
        formData.append('existingImages', att.url);
      }
    });

    try {
      if (_id) {
        formData.append('_id', _id);
        toast.loading("Updating Project...");
        await axios.put("/api/projects", formData);
        toast.success('Project updated');
      } else {
        toast.loading("Creating Project...");
        await axios.post("/api/projects", formData);
        toast.success('Project created!');
      }
      setRedirect(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving project');
      console.log('Save error:', error);
    }
  }

  if (redirect) {
    setTimeout(() => router.push("/projects"), 1000);
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

  const handleCategoryFieldChange = (field, value) => {
    setCategorySpecificFields(prev => ({ ...prev, [field]: value }));
  };

  const renderInput = ({ name, label, type, placeholder }) => (
    <div key={name} className='w-100 flex flex-col flex-left mb-2' style={{ flex: type === 'textarea' ? '1 0 100%' : '1 0 48%' }}>
      <label htmlFor={name}>{label} {type !== 'textarea' && <span className='text-sm text-gray-500'>(Comma-separated)</span>}</label>
      {type === 'textarea' ? (
        <textarea
          className='w-100 descript'
          value={categorySpecificFields[name]}
          onChange={(e) => handleCategoryFieldChange(name, e.target.value)}
          rows={4}
          placeholder={placeholder}
        />
      ) : (
        <input
          className='input'
          value={categorySpecificFields[name]}
          onChange={(e) => handleCategoryFieldChange(name, e.target.value)}
          type='text'
          id={name}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <>
      <form className='addWebsiteform' onSubmit={createBlog}>
        {/* Your form fields (unchanged except for images section) */}
        <div className='flex gap-2'>
          <div className='w-100 flex flex-col flex-left mb-2'>
            <label htmlFor='title'>Project Title* <span className='text-sm text-gray-500'>(e.g., E-commerce Website)</span></label>
            <input className='input' required={ projectcategory !== "Graphic & UI/UX Design" ? true : false} value={title} onChange={(e) => { handleSlugChange(e); setTitle(e.target.value); }} type='text' id='title' placeholder='Enter project title' />
          </div>
          <div className='w-100 flex flex-col flex-left mb-2'>
            <label htmlFor='client'>Client <span className='text-sm text-gray-500'>(Optional)</span></label>
            <input className='input' value={client} onChange={(e) => setClient(e.target.value)} type='text' id='client' placeholder='e.g., CamTech Solutions' />
          </div>
        </div>
        <input className='input' required={ projectcategory !== "Graphic & UI/UX Design" ? true : false} value={slug} onChange={handleSlugChange} type='hidden' id='slug' />
        <div className='flex gap-2'>
          <div className='w-100 flex flex-col flex-left mb-2'>
            <label htmlFor='category'>Specialization*</label>
            <select name='category' required={ projectcategory !== "Graphic & UI/UX Design" ? true : false} id='category' value={projectcategory} onChange={(e) => setProjectcategory(e.target.value)} className='input'>
              <option value="">Select Category</option>
              {Object.keys(TAGS_BY_CATEGORY).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className='w-100 flex flex-col flex-left mb-2'>
            <label htmlFor='projectType'>Purpose*</label>
            <select id='projectType' value={projectType} onChange={(e) => setProjectType(e.target.value)} className='input'>
              <option value="Showcase">Portfolio Showcase</option>
              <option value="For Sale">Commercial Product</option>
            </select>
          </div>
        </div>
{ projectcategory !== "Graphic & UI/UX Design" && <>
        {projectType === "For Sale" && (
          <>
            <div className='flex gap-2'>
              <div className='w-100 flex flex-col flex-left mb-2'>
                <label htmlFor='price'>Price (USD)*</label>
                <input className='input' required={ projectcategory !== "Graphic & UI/UX Design" ? true : false} value={price} onChange={(e) => setPrice(Number(e.target.value))} type='number' min="0" step="0.01" id='price' placeholder='e.g., 999.99' />
              </div>
              <div className='w-100 flex flex-col flex-left mb-2'>
                <label htmlFor='licenseType'>License Type*</label>
                <select className='input' required={ projectcategory !== "Graphic & UI/UX Design" ? true : false} value={licenseType} onChange={(e) => setLicenseType(e.target.value)}>
                  <option value="">Select License</option>
                  <option value="MIT">MIT</option>
                  <option value="GPL">GPL</option>
                  <option value="Apache">Apache</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>
            <div className='w-100 flex flex-left mb-2'>
              <label className='flex' style={{ textWrap: 'nowrap' }}>
                <input type="checkbox" checked={supportAvailable} onChange={(e) => setSupportAvailable(e.target.checked)} />
                Includes Support <span className='text-sm text-gray-500'>(e.g., 6 months)</span>
              </label>
            </div>
          </>
        )}
        <div className='w-100 flex flex-col flex-left mb-2'>
          <label htmlFor='description'>Description* <span className='text-sm text-gray-500'>(Purpose, challenges, impact)</span></label>
          <textarea className='w-100 descript' required={ projectcategory !== "Graphic & UI/UX Design" ? true : false} value={description} rows={6} placeholder='Describe purpose, role, challenges, outcomes (e.g., 20% engagement)' onChange={(e) => setDescription(e.target.value)} />
        </div>
        {projectcategory && CATEGORY_FIELDS[projectcategory] && (
          <div className='w-100 flex flex-col flex-left mb-2'>
            <div className='flex gap-2 flex-wrap'>{CATEGORY_FIELDS[projectcategory].map(renderInput)}</div>
          </div>
        )}
        <div className='flex gap-2'>
  <div className='w-100 flex flex-col flex-left mb-2'>
    <label htmlFor='technologies' className='glowing-label'>Technologies* <span className='text-sm text-gray-500'>(Comma-separated)</span></label>
    <input
      className='input shad-input'
      id='technologies'
      required={ projectcategory !== "Graphic & UI/UX Design" ? true : false}
      value={technologies.join(", ")}
      onChange={(e) => {
        const value = e.target.value;
        setTechnologies(value ? value.split(",").map(t => t.trim()) : []);
      }}
      placeholder="e.g., React, Cisco"
    />
  </div>
  <div className='w-100 flex flex-col flex-left mb-2'>
    <label htmlFor='features' className='glowing-label'>Features* <span className='text-sm text-gray-500'>(Comma-separated)</span></label>
    <input
      className='input shad-input'
      id='features'
      required={ projectcategory !== "Graphic & UI/UX Design" ? true : false}
      value={features.join(", ")}
      onChange={(e) => {
        const value = e.target.value;
        setFeatures(value ? value.split(",").map(f => f.trim()) : []);
      }}
      placeholder="e.g., Authentication, VFX"
    />
  </div>
</div>
<div className='flex gap-2'>
  <div className='w-100 flex flex-col flex-left mb-2'>
    <label htmlFor='platforms' className='glowing-label'>Platforms* <span className='text-sm text-gray-500'>(Comma-separated)</span></label>
    <input
      className='input shad-input'
      id='platforms'
      required={ projectcategory !== "Graphic & UI/UX Design" ? true : false}
      value={platforms.join(", ")}
      onChange={(e) => {
        const value = e.target.value;
        setPlatforms(value ? value.split(",").map(p => p.trim()): []);
      }}
      placeholder="e.g., Web, iOS"
    />
  </div>
  <div className='w-100 flex flex-col flex-left mb-2'>
    <label htmlFor='projectYear' className='glowing-label'>Year*</label>
    <input
      className='input shad-input'
      id='projectYear'
      required={ projectcategory !== "Graphic & UI/UX Design" ? true : false}
      type="number"
      min="2000"
      max={new Date().getFullYear()}
      value={projectYear}
      onChange={(e) => setProjectYear(Number(e.target.value))}
      placeholder={new Date().getFullYear().toString()}
    />
  </div>
</div>
        <div className='flex gap-2'>
          <div className='w-100 flex flex-col flex-left mb-2'>
            <label htmlFor='livepreview'>Live Demo <span className='text-sm text-gray-500'>(Optional)</span></label>
            <input className='input' value={livepreview} onChange={(e) => setLivepreview(e.target.value)} type='url' id='livepreview' placeholder='e.g., https://demo.example.com' />
          </div>
          <div className='w-100 flex flex-col flex-left mb-2'>
            <label htmlFor='repositoryUrl'>Repository <span className='text-sm text-gray-500'>(Optional)</span></label>
            <input className='input' value={repositoryUrl} onChange={(e) => setRepositoryUrl(e.target.value)} type='url' placeholder="e.g., https://github.com/your-repo" />
          </div>
        </div>
        <div className='w-100 flex flex-col flex-left mb-2'>
          <label htmlFor='documentationUrl'>Documentation <span className='text-sm text-gray-500'>(Optional)</span></label>
          <input className='input' value={documentationUrl} onChange={(e) => setDocumentationUrl(e.target.value)} type='url' placeholder="e.g., https://docs.your-project.com" />
        </div>
        {projectcategory && (
          <div className='w-100 flex flex-col flex-left mb-2'>
            <label htmlFor='tags'>Tags* <span className='text-sm text-gray-500'>(Select multiple)</span></label>
            <select id='tags' name='tags' multiple value={tags} onChange={(e) => setTags(Array.from(e.target.selectedOptions, option => option.value))} className='input'>
              {availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
        )}
        {(projectcategory === "Website Development" || projectcategory === "Mobile Development" || projectcategory === "Graphic & UI/UX Design") && (
          <div className='w-100 flex flex-left mb-2'>
            <label className='flex' style={{ textWrap: 'nowrap' }}>
              <input type="checkbox" checked={isResponsive} onChange={(e) => setIsResponsive(e.target.checked)} />
              Responsive Design <span className='text-sm text-gray-500'>(Multi-device)</span>
            </label>
          </div>
        )}

        <div className='w-100 flex flex-col flex-left mb-2'>
          <label>Paste Image URL <span className='text-sm text-gray-500'>(png, jpg, jpeg, gif)</span></label>
          <input className='input' value={pasteImageUrl} onChange={(e) => setPasteImageUrl(e.target.value)} onPaste={handlePasteImage} onBlur={handlePasteImage} type='text' placeholder='e.g., https://example.com/image.jpg' />
        </div>
        </>
        }
        <div className='w-100 flex flex-col flex-left mb-2'>
          <label>Project Visuals* (Maximum 10 images)</label>
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
          <button type='submit' className='w-100 addwebbtn flex-center'>
            {
             !_id ?  projectType === "For Sale" ? 'Publish Product' : 'Add to Portfolio' : 'Save Changes'
            }
           </button>
        </div>
      </form>
      <div className="buttonClass">
        {
          _id &&  <a href={`/projects/view/${_id}`} className="button"><FaArrowLeft />back to view</a>
        }
        {
          !_id &&  <a href="/projects" className="button"><FaArrowLeft />Back to Projects</a>
        }
      </div>
    </>
  );
}