import { Project } from "@/models/Project"; // Assuming this is Mongo fallback, but code uses Neon primarily
import { Review } from '@/models/Review'; // Assuming Mongo
import { defaultProjects, generateRandomReviews } from '@/lib/default'; // If needed
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { neon } from '@netlify/neon';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from "./upload"; // Your Cloudinary config

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const formatDate = (date) => {
  if (!date || isNaN(date)) {
    return '';
  }
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: true
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error('Only images (jpeg, jpg, png, gif) allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024, files: 10 },
  fileFilter
}).array('images', 10);

// IMPORTANT: Disable built-in bodyParser so Multer can handle multipart/form-data
export const config = { api: { bodyParser: false } };

export default async function handleproj(req, res) {
  const { method } = req;
const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use env if needed
 
  if (method === 'GET' || method === 'DELETE') {
    // Handle GET and DELETE without Multer (no body expected)
    if (method === 'GET') {
      // Your existing GET logic (unchanged)
      if (req.query?.id || req.query?.projId) {
        const queryId = req.query.id || req.query.projId;
        let project = null;
        let ProjectReviews = [];  
        try {
          const pgProjects = await sql`SELECT * FROM projects WHERE id = ${queryId}`;
          if (pgProjects.length > 0) {
            const pgProject = pgProjects[0];
            project = {
              _id: pgProject.id,
              title: pgProject.title,
              slug: pgProject.slug,
              images: pgProject.images,
              client: pgProject.client,
              description: pgProject.description,
              projectcategory: pgProject.projectcategory,
              tags: pgProject.tags,
              livepreview: pgProject.livepreview,
              status: pgProject.status,
              price: pgProject.price,
              review: pgProject.review,
              projectType: pgProject.projecttype,
              technologies: pgProject.technologies,
              features: pgProject.features,
              platforms: pgProject.platforms,
              projectYear: pgProject.projectyear,
              repositoryUrl: pgProject.repositoryurl,
              documentationUrl: pgProject.documentationurl,
              isResponsive: pgProject.isresponsive,
              licenseType: pgProject.licensetype,
              supportAvailable: pgProject.supportavailable,
              createdAt: pgProject.createdat,
              updatedAt: pgProject.updatedat,
            };

             
 if (project.review && Array.isArray(project.review) && project.review.length > 0) {
          // Use for...of to await each review query
          for (const revid of project.review) {
            try {
              const [review] = await sql`SELECT * FROM reviews WHERE id = ${revid}`;
              if (review) {
                const reviewData = {
                  _id: review.id,
                  name: review.name,
                  image: review.image,
                  email: review.email,
                  message: review.message,
                  role: review.role,
                  website: review.website,
                  company: review.company,
                  project_id: review.project_id,
                  project_name: review.project_name,
                  project_slug: review.project_slug,
                  rating: review.rating,
                  consent: review.consent,
                  createdAt: review.createdat,
                  updatedAt: review.updatedat
                };
                // Check for metadata mismatch
                if (review.project_id === project._id && 
                    (review.project_name !== project.title || review.project_slug !== project.slug)) {
                  console.warn(
                    `Review ID ${revid} has mismatched metadata: ` +
                    `Review project_name="${review.project_name}", project_slug="${review.project_slug}" ` +
                    `does not match project title="${project.title}", slug="${project.slug}".`
                  );
                  // Optionally update review metadata to match project
                
                  await sql`
                    UPDATE reviews SET
                      project_name = ${project.title},
                      project_slug = ${project.slug}
                    WHERE id = ${revid}
                  `;
                  reviewData.project_name = project.title;
                  reviewData.project_slug = project.slug;
                  
                }
                ProjectReviews.push(reviewData);
              } else {
                console.log(`Review ID ${revid} not found for project ${queryId}`);
              }
            } catch (reviewError) {
              console.error(`Error fetching review ID ${revid}:`, reviewError);
            }
          }
        }
        
          }
        } catch (neonError) {
          console.log('Neon GET single failed:', neonError);
        }
        console.log("ProjectReviews", ProjectReviews)
       
        return res.json(project ? { success: true, data: project, data1: ProjectReviews } : { success: false, message: "Project not found" });
      } else {
        let projects = [];
        try {
          const pgProjects = await sql`SELECT * FROM projects ORDER BY createdat DESC`;
          projects = pgProjects.map(pgProject => ({
            _id: pgProject.id,
            title: pgProject.title,
            slug: pgProject.slug,
            images: pgProject.images,
            client: pgProject.client,
            description: pgProject.description,
            projectcategory: pgProject.projectcategory,
            tags: pgProject.tags,
            livepreview: pgProject.livepreview,
            status: pgProject.status,
            price: pgProject.price,
            review: pgProject.review,
            projectType: pgProject.projecttype,
            technologies: pgProject.technologies,
            features: pgProject.features,
            platforms: pgProject.platforms,
            projectYear: pgProject.projectyear,
            repositoryUrl: pgProject.repositoryurl,
            documentationUrl: pgProject.documentationurl,
            isResponsive: pgProject.isresponsive,
            licenseType: pgProject.licensetype,
            supportAvailable: pgProject.supportavailable,
            createdAt: pgProject.createdat,
            updatedAt: pgProject.updatedat,
          }));
        } catch (neonError) {
          console.log('Neon GET all failed:', neonError);
         }
          console.log("PG Projects:", projects);
       
        return res.json({ success: true, data: projects });
      }
    } else if (method === 'DELETE') {
      // Your existing DELETE logic (unchanged, but added image cleanup if you want - optional)
      const { projectId } = req.query;
      if (!projectId) return res.status(400).json({ success: false, message: "Project ID required" });
      try {
        // Optional: Fetch and delete images from Cloudinary
        const project = await sql`SELECT images FROM projects WHERE id = ${projectId}`; // If you want to add
        for (const img of project[0].images) {
          const publicId = img.split('/').pop().split('.')[0]; // Parse public_id
          await cloudinary.v2.uploader.destroy(`myportfolio/${publicId}`);
        }

         const pgprojects = await sql`SELECT * FROM projects WHERE id = ${projectId}`;
        if (pgprojects.length > 0) {
          const pgproject = pgprojects[0];
         const  RevProject = {
            review: pgproject.review,
           };

           if (RevProject && RevProject.review && Array.isArray(RevProject.review) && RevProject.review.length > 0) {
          // Use for...of to await each review query
          for (const revid of project.review) {
            try {
             await sql`DELETE FROM reviews WHERE id = ${revid}`;
             
            } catch (reviewError) {
              console.error(`Error deleting review ID ${revid}:`, reviewError);
            }
          }
        }

        }
        
         await sql`DELETE FROM projects WHERE id = ${projectId}`;
       
        try {
          await sql`
            INSERT INTO notifications (
              type, model, dataid, title, message, createddate
            ) VALUES (
              ${'delete'}, ${'Project'}, ${projectId}, ${'Project Deletion Performed'},
              ${`Admin deleted A project, ID: ${projectId} on ${formatDate(new Date())}, removing associated images and reviews. Consider implications for portfolio composition and client expectations. Retain audit trails and execute any necessary follow-up measures`},
              CURRENT_TIMESTAMP
            )`;
          res.json({ success: true, message: "Project deleted Successfully" });
        } catch (neonNotifError) {
          console.log('Neon notification insert failed:', neonNotifError);
        }
      } catch (neonError) {
        console.log('Neon delete failed:', neonError);
      }
      // Refetch projects (unchanged)
      let projects = [];
      try {
        const pgProjects = await sql`SELECT * FROM projects ORDER BY createdat DESC`;
        projects = pgProjects.map(pgProject => ({
               _id: pgProject.id,
              title: pgProject.title,
              slug: pgProject.slug,
              images: pgProject.images,
              client: pgProject.client,
              description: pgProject.description,
              projectcategory: pgProject.projectcategory,
              tags: pgProject.tags,
              livepreview: pgProject.livepreview,
              status: pgProject.status,
              price: pgProject.price,
              review: pgProject.review,
              projectType: pgProject.projecttype,
              technologies: pgProject.technologies,
              features: pgProject.features,
              platforms: pgProject.platforms,
              projectYear: pgProject.projectyear,
              repositoryUrl: pgProject.repositoryurl,
              documentationUrl: pgProject.documentationurl,
              isResponsive: pgProject.isresponsive,
              licenseType: pgProject.licensetype,
              supportAvailable: pgProject.supportavailable,
              createdAt: pgProject.createdat,
              updatedAt: pgProject.updatedat,
        
        }));
      } catch (neonError) {
        console.log('Neon GET all after delete failed:', neonError);
      }
      return res.json({ success: true, data: projects });
    }
  } else if (method === 'POST' || method === 'PUT') {
    // Handle POST and PUT with Multer for file uploads
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File size exceeds 20MB limit' });
        } else if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ success: false, message: 'Maximum 10 files allowed' });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      // Parse fields
      const {
        title, slug, price, description, projectcategory, client, livepreview,
        projectType, projectYear, repositoryUrl, documentationUrl,
        isResponsive, licenseType, supportAvailable, _id // For PUT
      } = req.body;

      const tags = JSON.parse(req.body.tags || '[]');
      const technologies = JSON.parse(req.body.technologies || '[]');
      const features = JSON.parse(req.body.features || '[]');
      const platforms = JSON.parse(req.body.platforms || '[]');
      const categoryFields = JSON.parse(req.body.category_fields || '{}');

      // Handle images
      const existingImages = req.body.existingImages
        ? Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : [req.body.existingImages]
        : [];

      const newImageUrls = [];
      if (req.files && req.files.length > 0) {
        console.log('Uploaded files:', req.files); // Now this will show files from frontend
        for (const file of req.files) {
          try {
            const result = await cloudinary.v2.uploader.upload(file.path, {
              folder: 'myportfolio',
              public_id: `file_${Date.now()}`,
              resource_type: 'auto'
            });
            newImageUrls.push(result.secure_url);
            fs.unlinkSync(file.path); // Delete temp local file
          } catch (error) {
            console.log('Cloudinary upload error:', error);
            // Continue, but you can add error handling
          }
        }
      }

      const images = [...existingImages, ...newImageUrls];
      const calcPrice = projectType === 'Showcase' ? 0 : price;
      const calcLicenseType = projectType === 'Showcase' ? '' : licenseType;
      const status = (title && slug && description && projectcategory && projectcategory !== "Graphic & UI/UX Design" && images.length > 0) ? 'publish' : projectcategory && projectcategory === "Graphic & UI/UX Design" ? 'publish' : 'draft';

      if (method === 'POST') {
        const id = uuidv4();
        try {
          await sql`
            INSERT INTO projects (
              id, title, slug, images, client, description, projectcategory, tags, livepreview, status, price,
              projecttype, technologies, features, platforms, projectyear, repositoryurl, documentationurl,
              isresponsive, licensetype, supportavailable, category_fields
            ) VALUES (
              ${id}, ${title}, ${slug}, ${JSON.stringify(images)}::jsonb, ${client}, ${description}, ${projectcategory},
              ${JSON.stringify(tags)}::jsonb, ${livepreview}, ${status}, ${calcPrice}, ${projectType},
              ${JSON.stringify(technologies)}::jsonb, ${JSON.stringify(features)}::jsonb,
              ${JSON.stringify(platforms)}::jsonb, ${projectYear}, ${repositoryUrl}, ${documentationUrl},
              ${isResponsive}, ${calcLicenseType}, ${supportAvailable}, ${JSON.stringify(categoryFields)}::jsonb
            )`;
          try {
            await sql`
              INSERT INTO notifications (
                type, model, dataid, title, message, createddate
              ) VALUES (
                ${'add'}, ${'Project'}, ${id},
                ${'Project Creation Logged'}, ${`Admin added A project "${title}" (category: ${projectcategory}, type: ${projectType}, status: ${status}) for client ${client} on ${formatDate(new Date())}. Specifications: price ${price}, technologies ${JSON.stringify(technologies)}, features ${JSON.stringify(features)}, completion year ${projectYear}. Incorporate into project management framework and initiate review cycle`},
                CURRENT_TIMESTAMP
              )`;
          } catch (neonNotifError) {
            console.log('Neon notification insert failed:', neonNotifError);
          }
          return res.json({ success: true, message: "Project created Successfully" });
        } catch (neonError) {
          return res.status(500).json({ success: false, message: `Neon insert failed: ${neonError.message}` });
        }
      } else if (method === 'PUT') {
        if (!_id) return res.status(400).json({ success: false, message: "Project ID required" });
        try {
          await sql`
            UPDATE projects SET
              title = ${title},
              slug = ${slug},
              images = ${JSON.stringify(images)}::jsonb,
              client = ${client},
              description = ${description},
              projectcategory = ${projectcategory},
              tags = ${JSON.stringify(tags)}::jsonb,
              livepreview = ${livepreview},
              status = ${status},
              price = ${calcPrice},
              projecttype = ${projectType},
              technologies = ${JSON.stringify(technologies)}::jsonb,
              features = ${JSON.stringify(features)}::jsonb,
              platforms = ${JSON.stringify(platforms)}::jsonb,
              projectyear = ${projectYear},
              repositoryurl = ${repositoryUrl},
              documentationurl = ${documentationUrl},
              isresponsive = ${isResponsive},
              licensetype = ${calcLicenseType},
              supportavailable = ${supportAvailable},
              category_fields = ${JSON.stringify(categoryFields)}::jsonb,
              updatedat = CURRENT_TIMESTAMP
            WHERE id = ${_id}
          `;
          try {
            await sql`
              INSERT INTO notifications (
                type, model, dataid, title, message, createddate
              ) VALUES (
                ${'update'}, ${'Project'}, ${_id}, ${'Project Update Documented'},
                ${`Admin updated project "${title}" on ${formatDate(new Date())}. Modifications: category to ${projectcategory}, technologies to ${JSON.stringify(technologies)}, features to ${JSON.stringify(features)}, live preview ${livepreview}. Validate against project objectives and communicate changes to involved parties as needed.`},
                CURRENT_TIMESTAMP
              )`;
          } catch (neonNotifError) {
            console.log('Neon notification insert failed:', neonNotifError);
          }
          return res.json({ success: true, message: "Project updated Successfully" });
        } catch (neonError) {
          return res.status(500).json({ success: false, message: `Neon update failed: ${neonError.message}` });
        }
      }
    });
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}