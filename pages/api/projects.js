import { mongooseConnect } from "@/lib/mongoose";
import { Project } from "@/models/Project";
import { Review } from '@/models/Review';
import { defaultProjects, generateRandomReviews } from '@/lib/default';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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
      const images = req.files?.map(file => `/uploads/${file.filename}`) || [];
      const status = title && slug && description && projectcategory ? 'publish' : 'draft';
      try {
        const project = await Project.create({
          title, slug, images, price: projectType === 'Showcase' ? 0 : price, description,
          projectcategory, client, tags, livepreview, projectType, technologies,
          features, platforms, projectYear, repositoryUrl, documentationUrl,
          isResponsive, licenseType: projectType === 'Showcase' ? '' : licenseType,
          supportAvailable, status, ...categoryFields
        });
        return res.json({ success: true, data: project });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    });
  } else if (method === "GET") {
       try {
        for (const project of defaultProjects) {
        
          const existingProject = await Project.findOne({  $and: [
        { slug: project.slug },
        { title: project.title }
      ] });
          if (!existingProject) {
            const createdProject = await Project.create(project);
          //  console.log(`Created Project "${project.title}" with ID: ${createdProject._id}`);
    
            const reviews = generateRandomReviews(project, createdProject._id);
            const reviewIds = [];
    
            for (const review of reviews) {
              try {
                const createdReview = await Review.create(review);
                reviewIds.push(createdReview._id);
              //  console.log(`Created Review for Project "${project.title}"`);
              } catch (reviewError) {
               // console.error(`Error creating review for Project "${project.title}":`, reviewError);
              }
            }
    
            await Project.updateOne(
              { _id: createdProject._id },
              { $set: { review: reviewIds } }
            );
          //  console.log(`Updated Project "${project.title}" with ${reviewIds.length} review IDs`);
          } else {
            //console.log(`Project "${project.title}" already exists, skipping review creation`);
          }
        }
      } catch (error) {
       // console.error('Error populating default projects or reviews:', error);
        throw error;
      }
    if (req.query?.id) {
      
      const project = await Project.findById(req.query.id);
      return res.json(project ? { success: true, data: project } : { success: false, message: "Project not found" });
    }
    else if (req.query?.projId) {
      
      const project = await Project.findById(req.query.projId);
      return res.json(project ? { success: true, data: project } : { success: false, message: "Project not found" });
    }

           const reviews = await Review.find().sort({ createdAt: -1 });
                reviews.forEach(async (review) => {
                      const getRecent = await Project.findById(review.project)
                      if (!getRecent) {
                         await Review.deleteOne({_id: review._id})
                      }
                })
    const projects = (await Project.find().sort({ createdAt: -1 }));
    return res.json({ success: true, data: projects });
  } else if (method === "PUT") {
    const {
      _id, title, slug, price, images, description, projectcategory, client, tags,
      livepreview, projectType, technologies, features, platforms, projectYear,
      repositoryUrl, documentationUrl, isResponsive, licenseType, supportAvailable,
      ...categoryFields
    } = req.body;
    if (!_id) return res.status(400).json({ success: false, message: "Project ID required" });
    try {
      const status = title && slug && description && projectcategory ? 'publish' : 'draft';
      await Project.updateOne(
        { _id },
        {
          title, slug, images, price: projectType === 'Showcase' ? 0 : price, description,
          projectcategory, client, tags, livepreview, projectType, technologies,
          features, platforms, projectYear, repositoryUrl, documentationUrl,
          isResponsive, licenseType: projectType === 'Showcase' ? '' : licenseType,
          supportAvailable, status, ...categoryFields
        }
      );
      return res.json({ success: true, message: "Project updated" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else if (method === "DELETE") {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ success: false, message: "Project ID required" });
    try {
      const project = await Project.findById(projectId);
      if (project?.images?.length) {
        for (const imageUrl of project.images) await deleteImage(imageUrl);
      }
      await Project.deleteOne({ _id: projectId });
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: projects });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}