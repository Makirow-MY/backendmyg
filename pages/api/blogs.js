import { mongooseConnect } from "@/lib/mongoose";
import { Blog } from "@/models/Blog";
import { Comment } from "@/models/Comment";
import { defaultBlogs, generateRandomComments } from '@/lib/default';
import { neon } from '@netlify/neon';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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

async function cleanupOldNotifications() {
  try {
    // Delete from Neon
    await sql`DELETE FROM notifications WHERE createddate < CURRENT_DATE - INTERVAL '3 months'`;
  } catch (neonError) {
    console.error('Neon notification cleanup failed:', neonError);
  }

}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDirs = [
            'public/uploads',
            ];
        uploadDirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
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

async function deleteImages(images) {
    for (const imageUrl of images) {
        try {
            const filename = path.basename(imageUrl);
            const backendPath = path.join(process.cwd(), 'public/uploads', filename);
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
                console.log(`File ${filename} not found in either location`);
            } else {
                console.log(`File ${filename} deleted ${backendDeleted ? 'from backend' : ''}${backendDeleted && frontendDeleted ? ' and ' : ''}${frontendDeleted ? 'from frontend' : ''}`);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }
}

export default async function handle(req, res) {
    await mongooseConnect();
 const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed
  // Use process.env.DATABASE_URL if needed
    const { method } = req;

    if (method === "POST") {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            const { title, slug, description, blogcategory, tags } = req.body;
            const images = req.files?.map(file => `/uploads/${file.filename}`) ||[
            `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,          
            `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,
            `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,          
            `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,
    ];
            const status = (title && slug && description && blogcategory) ? 'publish' : 'draft';
            const id = uuidv4();

            // Write to Neon
            try {
                await sql`
                    INSERT INTO blogs (
                        id, title, slug, images, description, blogcategory, tags, status
                    ) VALUES (
                        ${id}, ${title}, ${slug}, ${JSON.stringify(images)}::jsonb, ${description}, 
                        ${blogcategory}, ${JSON.stringify(tags || [])}::jsonb, ${status}
                    )`;
                    // Insert into Neon

 try {
                    await sql`
                        INSERT INTO notifications (
                            type, model, dataid, title, message, createddate
                        ) VALUES (
                            'add', 'Blog', ${id}, 'Blog Post Creation Documented',
                            ${` Admin published blog post "${title}" (category: ${blogcategory}, status: ${status}) on ${formatDate(new Date())}. Included elements: tags ${JSON.stringify(tags)}, images ${JSON.stringify(images)}, content overview ${description.slice(0, 150)}.... Evaluate for alignment with content strategy and prepare for distribution.`},
                            CURRENT_TIMESTAMP
                        )`;
                } catch (neonNotifError) {
                    console.error('Neon notification insert failed:', neonNotifError);
                }

   return res.json({
                    success: true,
                    message: `Blog Added Successfully`
                   
                });

          

// For update, similar but type: 'update'
                    
            } catch (neonError) {
                return res.status(500).json({ success: false, message: `Neon insert failed: ${neonError.message}` });
            }

            // // Write to Mongo
            // try {
            //     const blogDoc = await Blog.create({
            //         _id: id,
            //         title, slug, images, description, blogcategory, tags, status
            //     });
            //     return res.json({
            //         success: true,
            //         data: blogDoc,
            //     });
            // } catch (mongoError) {
            //     // Rollback Neon
            //     try {
            //         await sql`DELETE FROM blogs WHERE id = ${id}`;
            //     } catch (rollbackError) {
            //         console.error('Rollback failed:', rollbackError);
            //     }
            //     return res.status(500).json({ success: false, message: `Mongo insert failed: ${mongoError.message}` });
            // }
        });
    } else if (method === "GET") {
        if (req.query?.id || req.query?.blogId) {
            const queryId = req.query.id || req.query.blogId;
            console.log("Query ID:", req.query);
            let blog = null;
            try {
                const pgBlogs = await sql`SELECT * FROM blogs WHERE id = ${queryId}`;
                if (pgBlogs.length > 0) {
                    const pgBlog = pgBlogs[0];
                    blog = {
                        _id: pgBlog.id,
                        title: pgBlog.title,
                        slug: pgBlog.slug,
                        images: pgBlog.images,
                        description: pgBlog.description,
                        blogcategory: pgBlog.blogcategory,
                        tags:pgBlog.tags,
                        status: pgBlog.status,
                        comments: pgBlog.comments,
                        createdAt: pgBlog.createdat,
                        updatedAt: pgBlog.updatedat
                    };
                }
            } catch (neonError) {
                console.error('Neon GET single failed:', neonError);
            }
          
            if (blog) {
                return res.json({
                    success: true,
                    data: blog,
                    message: ""
                });
            } else {
                return res.json({
                    success: false,
                    data: null,
                    message: "Failed to get blog document, verify blog id"
                });
            }
        } else {
            let blogs = [];
            try {
                const pgBlogs = await sql`SELECT * FROM blogs ORDER BY createdat DESC`;
                blogs = pgBlogs.map(pgBlog => ({
                    _id: pgBlog.id,
                    title: pgBlog.title,
                    slug: pgBlog.slug,
                    images: pgBlog.images,
                    description: pgBlog.description,
                    blogcategory: pgBlog.blogcategory,
                    tags: pgBlog.tags,
                    status: pgBlog.status,
                    comments: pgBlog.comments,
                    createdAt: pgBlog.createdat,
                    updatedAt: pgBlog.updatedat
                }));
            } catch (neonError) {
                console.error('Neon GET all failed:', neonError);
                blogs = await Blog.find().sort({ createdAt: -1 });
            }
            return res.json({
                success: true,
                data: blogs,
                message: ""
            });
        }
    } else if (method === "PUT") {
        const { _id, title, slug, images, description, blogcategory, tags,} = req.body;
        console.log("PUT body", req.body)
        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Error! _Id Missing"
            });
        }
       const defaultImage = [  
                    `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,          
            `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,
            `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,          
            `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}`,
         ];
        // Update Neon
          const status = (title && slug && description && blogcategory) ? 'publish' : 'draft';
        try {
            await sql`
                UPDATE blogs SET
                    title = ${title},
                    slug = ${slug},
                    images = ${JSON.stringify(images.length > 0 ? images : defaultImage)}::jsonb,
                    description = ${description},
                    blogcategory = ${blogcategory},
                    tags = ${JSON.stringify(tags.length > 0 ? tags : [defaultImage])}::jsonb,
                    status = ${status},
                    updatedat = CURRENT_TIMESTAMP
                WHERE id = ${_id}
            `;

          
 try {
                    await sql`
                        INSERT INTO notifications (
                            type, model, dataid, title, message, createddate
                        ) VALUES (
                            'update', 'Blog', ${_id}, 'Blog Post Update Registered',
                            ${`Admin updated blog post "${title}"  on ${formatDate(new Date())}. Revisions: category to ${blogcategory}, tags to ${JSON.stringify(tags)}, status to ${status}, content adjustments applied. Assess implications for audience reach and maintain version history for reference.`},
                            CURRENT_TIMESTAMP
                        )`;
                } catch (neonNotifError) {
                    console.error('Neon notification insert failed:', neonNotifError);
                }

   return res.json({
                success: true,
                message: "Blog updated successfully"
            });

        
           
            
        } catch (neonError) {
            return res.status(500).json({ success: false, message: `Failed to update: ${neonError.message}` });
        }
        // // Update Mongo
        // try {
        //     await Blog.updateOne({ _id }, {
        //         title, slug, images, description, blogcategory, tags, status
        //     });
        //     return res.json({
        //         success: true,
        //         message: "Blog updated successfully"
        //     });
        // } catch (mongoError) {
        //     return res.status(500).json({ success: false, message: `Mongo update failed: ${mongoError.message}` });
        // }
    } else if (method === "DELETE") {
        const queryId = req.query?.id || req.query?.blogId;
        if (!queryId) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }
      
        // // Delete images
        // if (blog.images?.length) {
        //     await deleteImages(blog.images);
        // }
        // Delete from Neon
        try {
            await sql`DELETE FROM blogs WHERE id = ${queryId}`;
            try {
                    await sql`
                        INSERT INTO notifications (
                            type, model, dataid, title, message, createddate
                        ) VALUES (
                            'delete', 'Blog', ${queryId}, 'Blog Post Deletion Performed',
                            ${`Admin deleted a blog post ID: ${queryId}on ${formatDate(new Date())}, encompassing images and comments. Potential consequences include altered site navigation and search rankings. Document rationale and implement redirects as required`},
                            CURRENT_TIMESTAMP
                        )`;
                } catch (neonNotifError) {
                    console.error('Neon notification insert failed:', neonNotifError);
                }
   res.json({ success: true, message: "Blog deleted Successfully" });

            
        } catch (neonError) {
            console.error('Neon delete failed:', neonError);
        }
     
        // Fetch remaining blogs
        let blogs = [];
        try {
            const pgBlogs = await sql`SELECT * FROM blogs ORDER BY createdat DESC`;
            blogs = pgBlogs.map(pgBlog => ({
                _id: pgBlog.id,
                title: pgBlog.title,
                slug: pgBlog.slug,
                images: pgBlog.images,
                description: pgBlog.description,
                blogcategory: pgBlog.blogcategory,
                tags: pgBlog.tags,
                status: pgBlog.status,
                comments: pgBlog.comments,
                createdAt: pgBlog.createdat,
                updatedAt: pgBlog.updatedat
            }));
             return res.json({
            success: true,
            data: blogs
        });
        } catch (neonError) {
            console.error('Neon GET all after delete failed:', neonError);
            return res.json({
            success: false,
            message: "Failed to load"
        });
        }
       
    } else {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }
}











// import { mongooseConnect } from "@/lib/mongoose";
// import { Blog } from "@/models/Blog";
// import { Comment } from "@/models/Comment";
// import { defaultBlogs,  generateRandomComments } from '@/lib/default';
// import {faker} from 'faker'
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';





// // Configure multer storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const uploadDirs = [
//             'public/uploads',
           
//         ];
        
//         // Create directories if they don't exist
//         uploadDirs.forEach(dir => {
//             if (!fs.existsSync(dir)) {
//                 fs.mkdirSync(dir, { recursive: true });
//             }
//         });
        
//         // Multer only saves to one destination, we'll manually copy to the other
//         cb(null, 'public/uploads');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         cb(null, uniqueSuffix + ext);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
    
//     if (extname && mimetype) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
//     }
// };

// const upload = multer({ 
//     storage: storage,
//     limits: { 
//         fileSize: 20 * 1024 * 1024, // 20MB limit
//         files: 10 // Max 10 files
//     },
//     fileFilter
// }).array('images', 10);

// export const config = {
//     api: {
//         bodyParser: true,
//     },
// };





// export default async function handle(req, res) {

//     await mongooseConnect();
//     const {method} = req;

//     if (method === "POST") {
//         const {blogId, title, slug, images, description, blogcategory, tags} = req.body;
//   const status = (title && slug && description  && blogcategory && images) ? 'publish' : 'draft'
//     if (title && slug && description  && blogcategory && images){
//         const blogDoc = await Blog.create({
//             title, slug, images, description, blogcategory, tags, status
//         })

//         return res.json({
//             success: true,
//             data: blogDoc,
//         })
   
//     }
//      if (blogId) {
//       //  console.log("blogId ++++++++++ ",blogId)

//         try {
           
                     
//          const chooseProject = await Blog.findById(blogId);
       
//                 chooseProject.images.forEach((imageUrl) => {
//                           try {
                                   
                                               
//                                    const filename = path.basename(imageUrl);
//                                    const backendPath = path.join(process.cwd(), 'public/uploads', filename);
//                                    const frontendPath = path.join(process.cwd(), '../FRONTEND/public/uploads', filename);
                       
//                                    // Delete from both locations
//                                    let backendDeleted = false;
//                                    let frontendDeleted = false;
                       
//                                    if (fs.existsSync(backendPath)) {
//                                        fs.unlinkSync(backendPath);
//                                        backendDeleted = true;
//                                    }
                       
//                                    if (fs.existsSync(frontendPath)) {
//                                        fs.unlinkSync(frontendPath);
//                                        frontendDeleted = true;
//                                    }
                       
//                                    if (!backendDeleted && !frontendDeleted) {
//                                        console.log('File not found in either location');
                                      
//                                    }
                       
//                                   console.log( `File deleted ${backendDeleted ? 'from backend' : ''}${backendDeleted && frontendDeleted ? ' and ' : ''}${frontendDeleted ? 'from frontend' : ''}`);
//                                } catch (error) {
//                                    console.error('Error occurred while deleting image:', error);
//                                     return res.json({
//                        success: false,
//                        message: "Error occurred while deleting image",
                       
//                    })
//                                }
//                 })
       
//                     await Blog.deleteOne({ _id: blogId });
           
//            // Return remaining projects (sorted by createdAt)
//            const remainingBlog = await Blog.find().sort({ createdAt: -1 });
           
//            return res.json(remainingProjects);
                  

       
//          } catch (error) {
//            console.error("Server error:", error);
//            return res.status(500).json({ 
//              success: false, 
//              message: "Internal server error" 
//            });
//          }
        
//      }

//     } else if (method === "GET") {


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



//           if (req.query?.id) {
//             const blogDoc = await Blog.findById(req.query?.id);

//             if (blogDoc) {
//                 return res.json({
//                     success: true,
//                     data: blogDoc,
//                     message: ""
//                 })
//             }
//          else{
//             return res.json({
//                 success: false,
//                 data: null,
//                 message: "failed to get blog document, verify blog id"
//             })
//          }

//           }

//           else if(req.query?.blogId){
//                                const blogId = req.query?.blogId;
          
//             try {
              
//             if (!blogId) {
//                 return res.status(400).json({ 
//                   success: false, 
//                   message: "Project ID is required" 
//                 });
//               }
//                   if (blogId) {
//             const chooseProject = await Blog.findById(blogId);
//               if (chooseProject.images.length > 0) {
//                     chooseProject.images.forEach((imageUrl) => {
//                              try {
                                      
                                                  
//                                       const filename = path.basename(imageUrl);
//                                       const backendPath = path.join(process.cwd(), 'public/uploads', filename);
//                                       const frontendPath = path.join(process.cwd(), '../FRONTEND/public/uploads', filename);
                          
//                                       // Delete from both locations
//                                       let backendDeleted = false;
//                                       let frontendDeleted = false;
                          
//                                       if (fs.existsSync(backendPath)) {
//                                           fs.unlinkSync(backendPath);
//                                           backendDeleted = true;
//                                       }
                          
//                                       if (fs.existsSync(frontendPath)) {
//                                           fs.unlinkSync(frontendPath);
//                                           frontendDeleted = true;
//                                       }
                          
//                                       if (!backendDeleted && !frontendDeleted) {
//                                           chooseProject.images = [];
//                                          chooseProject.save();
                                                
//                                         console.log('File not found in either location');
//                                           return res.json({
//                           success: false,
//                           message: "File not found in either location",
                          
//                       })
//                                       }
                          
//                                      console.log( `File deleted ${backendDeleted ? 'from backend' : ''}${backendDeleted && frontendDeleted ? ' and ' : ''}${frontendDeleted ? 'from frontend' : ''}`);
//                                   } catch (error) {
//                                       console.error('Error occurred while deleting image:', error);
//                                        return res.json({
//                           success: false,
//                           message: "Error occurred while deleting image",
                          
//                       })
//                                   }
//                    })
//               }
                   
          
//                        await Blog.deleteOne({ _id: blogId });
              
//               // Return remaining projects (sorted by createdAt)
//               const remainingProjects = await Blog.find().sort({ createdAt: -1 });
              
//               return res.json({ 
//                 success: true,
//                 data: remainingProjects 
//               });
                     
//                     } else {
                      
//                       return res.json({
//                           success: false,
//                           message: "Failed to delete blog",
                          
//                       })
          
//                     }
          
//             } catch (error) {
//               console.error("Server error:", error);
//               return res.status(500).json({ 
//                 success: false, 
//                 message: "Internal server error" 
//               });
//             }
//                     }
//           else {
            
//             const blogDoc = (await Blog.find()).reverse();
            
//             return res.json({
//                 success: true,
//                  data: blogDoc,
//                  message: ""
//             })

//           }
//     }

//     else if (method === "PUT"){
//         const {_id, title, slug, images, description, blogcategory, tags, status} = req.body;
//         if (!_id) {
//             return res.json({
//                 success: false,
//                 message: "Error! _Id Missing",
                
//             })
//         }
//         else{
//             await Blog.updateOne({_id}, {
//                 title, slug, images, description, blogcategory, tags, status
//             })

//             return res.json({
//                 success: true,
//                 message: "_Id Missing",
               
//             })
//         }
//     }

//     else if (method === "DELETE"){
//         if (req.query?.id) {
//             await Blog.deleteOne(req.query?.id);
        
//             return res.json({
//                 success: true,
//                 message: "",
                
//             })

//           } else {
            
//             return res.json({
//                 success: false,
//                 message: "Failed to delete blog",
                
//             })

//           }
//     }
    
// } 