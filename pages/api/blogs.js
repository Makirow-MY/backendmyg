import { mongooseConnect } from "@/lib/mongoose";
import { Blog } from "@/models/Blog";
import { Comment } from "@/models/Comment";
import { defaultBlogs,  generateRandomComments } from '@/lib/default';
import {faker} from 'faker'
import multer from 'multer';
import path from 'path';
import fs from 'fs';





// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDirs = [
            'public/uploads',
            '../FRONTEND/public/uploads'
        ];
        
        // Create directories if they don't exist
        uploadDirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
        
        // Multer only saves to one destination, we'll manually copy to the other
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 20 * 1024 * 1024, // 20MB limit
        files: 10 // Max 10 files
    },
    fileFilter
}).array('images', 10);

export const config = {
    api: {
        bodyParser: true,
    },
};





export default async function handle(req, res) {

    await mongooseConnect();
    const {method} = req;

    if (method === "POST") {
        const {blogId, title, slug, images, description, blogcategory, tags} = req.body;
  const status = (title && slug && description  && blogcategory && images) ? 'publish' : 'draft'
    if (title && slug && description  && blogcategory && images){
        const blogDoc = await Blog.create({
            title, slug, images, description, blogcategory, tags, status
        })

        return res.json({
            success: true,
            data: blogDoc,
        })
   
    }
     if (blogId) {
      //  console.log("blogId ++++++++++ ",blogId)

        try {
           
                     
         const chooseProject = await Blog.findById(blogId);
       
                chooseProject.images.forEach((imageUrl) => {
                          try {
                                   
                                               
                                   const filename = path.basename(imageUrl);
                                   const backendPath = path.join(process.cwd(), 'public/uploads', filename);
                                   const frontendPath = path.join(process.cwd(), '../FRONTEND/public/uploads', filename);
                       
                                   // Delete from both locations
                                   let backendDeleted = false;
                                   let frontendDeleted = false;
                       
                                   if (fs.existsSync(backendPath)) {
                                       fs.unlinkSync(backendPath);
                                       backendDeleted = true;
                                   }
                       
                                   if (fs.existsSync(frontendPath)) {
                                       fs.unlinkSync(frontendPath);
                                       frontendDeleted = true;
                                   }
                       
                                   if (!backendDeleted && !frontendDeleted) {
                                       console.log('File not found in either location');
                                      
                                   }
                       
                                  console.log( `File deleted ${backendDeleted ? 'from backend' : ''}${backendDeleted && frontendDeleted ? ' and ' : ''}${frontendDeleted ? 'from frontend' : ''}`);
                               } catch (error) {
                                   console.error('Error occurred while deleting image:', error);
                                    return res.json({
                       success: false,
                       message: "Error occurred while deleting image",
                       
                   })
                               }
                })
       
                    await Blog.deleteOne({ _id: blogId });
           
           // Return remaining projects (sorted by createdAt)
           const remainingBlog = await Blog.find().sort({ createdAt: -1 });
           
           return res.json(remainingProjects);
                  

       
         } catch (error) {
           console.error("Server error:", error);
           return res.status(500).json({ 
             success: false, 
             message: "Internal server error" 
           });
         }
        
     }

    } else if (method === "GET") {


//     try {
//     for (const blog of defaultBlogs) {
//         const existingBlog = await Blog.findOne({ 
//             $and: [
//                 { slug: blog.slug },
//                 { title: blog.title }
//             ] 
//         });
        
//         if (!existingBlog) {
//             const createdBlog = await Blog.create(blog);
//             //console.log(`Created blog "${blog.title}" with ID: ${createdBlog._id}`);

//             const commentGroups = generateRandomComments(blog, createdBlog._id);
//             const commentIds = [];

//             for (const group of commentGroups) {
//                 try {
//                     // Create main comment with blog reference
//                     const mainCommentData = {
//                         ...group.mainComment,
//                         blog: createdBlog._id, // Add blog reference
//                         blogTitle: createdBlog.title // Add blog slug for easy reference
//                     };
//                     const mainComment = await Comment.create(mainCommentData);
//                     commentIds.push(mainComment._id);
//                   //  console.log(`Created main comment "${mainComment.title}" for blog "${blog.title}"`);

//                     // Prepare reply comments with both parent and blog references
//                     const replyComments = group.replyComments.map(reply => ({
//                         ...reply,
//                         parent: mainComment._id,
//                         blog: createdBlog._id, // Add blog reference to replies too
//                         blogTitle: createdBlog.title
//                     }));

//                     // Insert reply comments
//                     const createdReplies = await Comment.insertMany(replyComments);
//                   //  console.log(`Created ${createdReplies.length} reply comments for main comment "${mainComment.title}"`);

//                     // Update main comment with children IDs
//                     await Comment.updateOne(
//                         { _id: mainComment._id },
//                         { $set: { children: createdReplies.map(reply => reply._id) } }
//                     );
//                    // console.log(`Updated main comment "${mainComment.title}" with ${createdReplies.length} children IDs`);

//                     // Add reply comment IDs to blog
//                     commentIds.push(...createdReplies.map(reply => reply._id));
//                 } catch (commentError) {
//                     console.error(`Error processing comments for blog "${blog.title}":`, commentError);
//                 }
//             }

//             // Update blog with all comment IDs
//             await Blog.updateOne(
//                 { _id: createdBlog._id },
//                 { $set: { comments: commentIds } } // Using $set instead of $push to ensure complete array
//             );
//             //console.log(`Updated blog "${blog.title}" with ${commentIds.length} comment IDs`);
//         } else {
//           //  console.log(`Blog "${blog.title}" already exists, skipping comment creation`);
//         }
//     }
// } catch (error) {
//     console.error("Error populating default blogs or comments:", error);
// }



          if (req.query?.id) {
            const blogDoc = await Blog.findById(req.query?.id);

            if (blogDoc) {
                return res.json({
                    success: true,
                    data: blogDoc,
                    message: ""
                })
            }
         else{
            return res.json({
                success: false,
                data: null,
                message: "failed to get blog document, verify blog id"
            })
         }

          }

          else if(req.query?.blogId){
                               const blogId = req.query?.blogId;
          
            try {
              
            if (!blogId) {
                return res.status(400).json({ 
                  success: false, 
                  message: "Project ID is required" 
                });
              }
                  if (blogId) {
            const chooseProject = await Blog.findById(blogId);
              if (chooseProject.images.length > 0) {
                    chooseProject.images.forEach((imageUrl) => {
                             try {
                                      
                                                  
                                      const filename = path.basename(imageUrl);
                                      const backendPath = path.join(process.cwd(), 'public/uploads', filename);
                                      const frontendPath = path.join(process.cwd(), '../FRONTEND/public/uploads', filename);
                          
                                      // Delete from both locations
                                      let backendDeleted = false;
                                      let frontendDeleted = false;
                          
                                      if (fs.existsSync(backendPath)) {
                                          fs.unlinkSync(backendPath);
                                          backendDeleted = true;
                                      }
                          
                                      if (fs.existsSync(frontendPath)) {
                                          fs.unlinkSync(frontendPath);
                                          frontendDeleted = true;
                                      }
                          
                                      if (!backendDeleted && !frontendDeleted) {
                                          chooseProject.images = [];
                                         chooseProject.save();
                                                
                                        console.log('File not found in either location');
                                          return res.json({
                          success: false,
                          message: "File not found in either location",
                          
                      })
                                      }
                          
                                     console.log( `File deleted ${backendDeleted ? 'from backend' : ''}${backendDeleted && frontendDeleted ? ' and ' : ''}${frontendDeleted ? 'from frontend' : ''}`);
                                  } catch (error) {
                                      console.error('Error occurred while deleting image:', error);
                                       return res.json({
                          success: false,
                          message: "Error occurred while deleting image",
                          
                      })
                                  }
                   })
              }
                   
          
                       await Blog.deleteOne({ _id: blogId });
              
              // Return remaining projects (sorted by createdAt)
              const remainingProjects = await Blog.find().sort({ createdAt: -1 });
              
              return res.json({ 
                success: true,
                data: remainingProjects 
              });
                     
                    } else {
                      
                      return res.json({
                          success: false,
                          message: "Failed to delete blog",
                          
                      })
          
                    }
          
            } catch (error) {
              console.error("Server error:", error);
              return res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
              });
            }
                    }
          else {
            
            const blogDoc = (await Blog.find()).reverse();
            
            return res.json({
                success: true,
                 data: blogDoc,
                 message: ""
            })

          }
    }

    else if (method === "PUT"){
        const {_id, title, slug, images, description, blogcategory, tags, status} = req.body;
        if (!_id) {
            return res.json({
                success: false,
                message: "Error! _Id Missing",
                
            })
        }
        else{
            await Blog.updateOne({_id}, {
                title, slug, images, description, blogcategory, tags, status
            })

            return res.json({
                success: true,
                message: "_Id Missing",
               
            })
        }
    }

    else if (method === "DELETE"){
        if (req.query?.id) {
            await Blog.deleteOne(req.query?.id);
        
            return res.json({
                success: true,
                message: "",
                
            })

          } else {
            
            return res.json({
                success: false,
                message: "Failed to delete blog",
                
            })

          }
    }
    
} 