import { mongooseConnect } from "@/lib/mongoose";
import { Project } from "@/models/Project";
import { Review } from '@/models/Review';
import { defaultProjects, generateRandomReviews } from '@/lib/default';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { neon } from '@netlify/neon';
import { v4 as uuidv4 } from 'uuid';

const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed
 // Use your env if needed: neon(process.env.DATABASE_URL)

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
export const config = { api: { bodyParser: true } };
async function deleteImage(imageUrl) {
  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(process.cwd(), 'public/uploads', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}
export default async function handleproj(req, res) {
  await mongooseConnect();
  const { method } = req;
  if (method === "POST") {
    upload(req, res, async (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      const {
        title, slug, price, description, projectcategory, client, tags, livepreview,
        projectType, technologies, features, platforms, projectYear, repositoryUrl,
        documentationUrl, isResponsive, licenseType, supportAvailable, ...categoryFields
      } = req.body;
      const imagesArr = req.files?.map(file => `/uploads/${file.filename}`) || [ `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,          
            `https://via.placeholder.com/${Math.floor(Math.random() * 300)}`,
            `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,
    ];
      const status = title && slug && description && projectcategory ? 'publish' : 'draft';
      const calcPrice = projectType === 'Showcase' ? 0 : price;
      const calcLicenseType = projectType === 'Showcase' ? '' : licenseType;
      const id = uuidv4();
      // Write to Neon first
      try {
        await sql`
          INSERT INTO projects (
            id, title, slug, images, client, description, projectcategory, tags, livepreview, status, price, 
            projecttype, technologies, features, platforms, projectyear, repositoryurl, documentationurl, 
            isresponsive, licensetype, supportavailable, category_fields
          ) VALUES (
            ${id}, ${title}, ${slug}, ${JSON.stringify(imagesArr)}::jsonb, ${client}, ${description}, ${projectcategory}, 
            ${JSON.stringify(tags || [])}::jsonb, ${livepreview}, ${status}, ${calcPrice}, ${projectType}, 
            ${JSON.stringify(technologies || [])}::jsonb, ${JSON.stringify(features || [])}::jsonb, 
            ${JSON.stringify(platforms || [])}::jsonb, ${projectYear}, ${repositoryUrl}, ${documentationUrl}, 
            ${isResponsive}, ${calcLicenseType}, ${supportAvailable}, ${JSON.stringify(categoryFields)}::jsonb
          )`;
          // After Project.create
// Insert into Neon
 try {
                    await sql`
                        INSERT INTO notifications (
                            type, model, dataid, title, message, createddate
                        ) VALUES (
                            ${'add'}, ${'Project'}, ${id}, 
     ${'Project Creation Logged'}, ${`Admin added A project "${title}" ( category: ${projectcategory}, type: ${projectType}, status: ${status}) for client ${client} on ${formatDate(new Date())}. Specifications: price ${price}, technologies ${JSON.stringify(technologies)}, features ${JSON.stringify(features)}, completion year ${projectYear}. Incorporate into project management framework and initiate review cycle`},
                            CURRENT_TIMESTAMP
                        )`;

                         return res.json({ success: true, message: "Project created Successfully" });
 
                } catch (neonNotifError) {
                    console.error('Neon notification insert failed:', neonNotifError);
                }
                
                    } catch (neonError) {
        return res.status(500).json({ success: false, message: `Neon insert failed: ${neonError.message}` });
      }

    });
  } else if (method === "GET") {
    // Review cleanup (kept using Mongo)
    // const reviews = await Review.find().sort({ createdAt: -1 });
    // for (const review of reviews) { // Changed to sync loop for safety
    //   const getRecent = await Project.findById(review.project);
    //   if (!getRecent) {
    //     await Review.deleteOne({ _id: review._id });
    //   }
    // }
    if (req.query?.id || req.query?.projId) {
      const queryId = req.query.id || req.query.projId;
      let project = null;
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
        }
      } catch (neonError) {
        console.error('Neon GET single failed:', neonError);
      }
      if (!project) {
        project = await Project.findById(queryId);
      }
      return res.json(project ? { success: true, data: project } : { success: false, message: "Project not found" });
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
        //  ...JSON.parse(pgProject.category_fields || '{}')
        }));
      } catch (neonError) {
        console.error('Neon GET all failed:', neonError);
        projects = await Project.find().sort({ createdAt: -1 });
      }
        return res.json({ success: true, data: projects });
    }
  } else if (method === "PUT") {
    const {
      _id, title, slug, price, images, description, projectcategory, client, tags,
      livepreview, projectType, technologies, features, platforms, projectYear,
      repositoryUrl, documentationUrl, isResponsive, licenseType, supportAvailable,
      ...categoryFields
    } = req.body;
    if (!_id) return res.status(400).json({ success: false, message: "Project ID required" });
    const status = title && slug && description && projectcategory ? 'publish' : 'draft';
    const calcPrice = projectType === 'Showcase' ? 0 : price;
    const calcLicenseType = projectType === 'Showcase' ? '' : licenseType;
    // Update Neon first

    console.log("req.body",req.body)
    try {
      await sql`
        UPDATE projects SET
          title = ${title},
          slug = ${slug},
          images = ${JSON.stringify(images.length > 0 ? images : [ `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,          
           `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,
            `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,
    ])}::jsonb,
          client = ${client},
          description = ${description},
          projectcategory = ${projectcategory},
          tags = ${JSON.stringify(tags.length > 0  ? tags : [])}::jsonb,
          livepreview = ${livepreview},
          status = ${status},
          price = ${calcPrice},
          projecttype = ${projectType},
          technologies = ${JSON.stringify(technologies.length > 0  ? technologies : [])}::jsonb,
          features = ${JSON.stringify(features.length > 0  ? features : [])}::jsonb,
          platforms = ${JSON.stringify(platforms.length > 0  ? platforms : [])}::jsonb,
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

                          return  res.json({ success: true, message: "Project updated Successfully" });


                } catch (neonNotifError) {
                    console.error('Neon notification insert failed:', neonNotifError);
                }

          
     
    } catch (neonError) {
      return res.status(500).json({ success: false, message: `Neon update failed: ${neonError.message}` });
    }
    
  } else if (method === "DELETE") {
    const { projectId } = req.query;
    console.log(req.body, req.query)
    if (!projectId) return res.status(400).json({ success: false, message: "Project ID required" });
   
    // Delete from Neon (try, log if fails)
    try {
      await sql`DELETE FROM projects WHERE id = ${projectId}`;

            try {
                    await sql`
                        INSERT INTO notifications (
                            type, model, dataid, title, message, createddate
                        ) VALUES (
                            ${'delete'}, ${'Project'}, ${projectId}, ${'Project Deletion Performed'},
                            ${`Admin deleted A project,  ID: ${projectId} on ${formatDate(new Date())}, removing associated images and reviews. Consider implications for portfolio composition and client expectations. Retain audit trails and execute any necessary follow-up measures`},
                            CURRENT_TIMESTAMP
                        )`;
                          res.json({ success: true, message: "Project deleted Successfully" });
                } catch (neonNotifError) {
                    console.error('Neon notification insert failed:', neonNotifError);
                }


            
      
    } catch (neonError) {
      console.error('Neon delete failed:', neonError);
    }
    // Fetch all projects (Neon primary, fallback Mongo)
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
        review:pgProject.review,
        projectType: pgProject.projecttype,
        technologies: pgProject.technologies,
        features: pgProject.features,
        platforms:pgProject.platforms,
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
      console.error('Neon GET all after delete failed:', neonError);
     
    }
    return res.json({ success: true, data: projects });
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}