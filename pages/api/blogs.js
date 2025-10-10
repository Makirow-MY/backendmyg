import { Blog } from "@/models/Blog";
import { Comment } from "@/models/Comment";
import { defaultBlogs, generateRandomComments } from '@/lib/default';
import { neon } from '@netlify/neon';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from "./upload";

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

// Disable Next.js bodyParser to allow Multer to handle multipart/form-data
export const config = { api: { bodyParser: false } };

const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

export default async function handle(req, res) {
  const { method } = req;

  if (method === "POST" || method === "PUT") {
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

      const { title, slug, description, blogcategory, tags, _id, existingImages } = req.body;
      const parsedTags = JSON.parse(tags || '[]');
      const parsedExistingImages = existingImages
        ? Array.isArray(existingImages)
          ? existingImages
          : [existingImages]
        : [];

      const newImageUrls = [];
      if (req.files && req.files.length > 0) {
        console.log('Uploaded files:', req.files); // Verify files in logs
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
          }
        }
      }

      const images = [...parsedExistingImages, ...newImageUrls];
      const status = (title && slug && description && blogcategory && images.length > 0) ? 'publish' : 'draft';

      if (method === "POST") {
        const id = uuidv4();
        try {
          await sql`
            INSERT INTO blogs (
              id, title, slug, images, description, blogcategory, tags, status
            ) VALUES (
              ${id}, ${title}, ${slug}, ${JSON.stringify(images)}::jsonb, ${description},
              ${blogcategory}, ${JSON.stringify(parsedTags)}::jsonb, ${status}
            )`;
          try {
            await sql`
              INSERT INTO notifications (
                type, model, dataid, title, message, createddate
              ) VALUES (
                'add', 'Blog', ${id}, 'Blog Post Creation Documented',
                ${`Admin published blog post "${title}" (category: ${blogcategory}, status: ${status}) on ${formatDate(new Date())}. Included elements: tags ${JSON.stringify(parsedTags)}, content overview ${description.slice(0, 150)}.... Evaluate for alignment with content strategy and prepare for distribution.`},
                CURRENT_TIMESTAMP
              )`;
          } catch (neonNotifError) {
            console.log('Neon notification insert failed:', neonNotifError);
          }
          return res.json({ success: true, message: "Blog Added Successfully" });
        } catch (neonError) {
          return res.status(500).json({ success: false, message: `Neon insert failed: ${neonError.message}` });
        }
      } else if (method === "PUT") {
        if (!_id) {
          return res.status(400).json({ success: false, message: "Error! _Id Missing" });
        }
        try {
          await sql`
            UPDATE blogs SET
              title = ${title},
              slug = ${slug},
              images = ${JSON.stringify(images)}::jsonb,
              description = ${description},
              blogcategory = ${blogcategory},
              tags = ${JSON.stringify(parsedTags)}::jsonb,
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
                ${`Admin updated blog post "${title}" on ${formatDate(new Date())}. Revisions: category to ${blogcategory}, tags to ${JSON.stringify(parsedTags)}, status to ${status}, content adjustments applied. Assess implications for audience reach and maintain version history for reference.`},
                CURRENT_TIMESTAMP
              )`;
          } catch (neonNotifError) {
          console.log('Neon notification insert failed:', neonNotifError);
          }
          return res.json({ success: true, message: "Blog updated successfully" });
        } catch (neonError) {
          return res.status(500).json({ success: false, message: `Failed to update: ${neonError.message}` });
        }
      }
    });
  } else if (method === "GET") {
    if (req.query?.id || req.query?.blogId) {
      const queryId = req.query.id || req.query.blogId;
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
            tags: pgBlog.tags,
            status: pgBlog.status,
            comments: pgBlog.comments,
            createdAt: pgBlog.createdat,
            updatedAt: pgBlog.updatedat
          };
        }
      } catch (neonError) {
        console.log('Neon GET single failed:', neonError);
      }
      return res.json(blog ? { success: true, data: blog } : { success: false, message: "Blog not found" });
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
        console.log('Neon GET all failed:', neonError);
      }
      return res.json({ success: true, data: blogs });
    }
  } else if (method === "DELETE") {
    const queryId = req.query?.id || req.query?.blogId;
    if (!queryId) {
      return res.status(400).json({ success: false, message: "Blog ID is required" });
    }
    try {
      await sql`DELETE FROM blogs WHERE id = ${queryId}`;
      try {
        await sql`
          INSERT INTO notifications (
            type, model, dataid, title, message, createddate
          ) VALUES (
            'delete', 'Blog', ${queryId}, 'Blog Post Deletion Performed',
            ${`Admin deleted a blog post ID: ${queryId} on ${formatDate(new Date())}, encompassing images and comments. Potential consequences include altered site navigation and search rankings. Document rationale and implement redirects as required`},
            CURRENT_TIMESTAMP
          )`;
      } catch (neonNotifError) {
        console.log('Neon notification insert failed:', neonNotifError);
      }
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
        console.log('Neon GET all after delete failed:', neonError);
      }
      return res.json({ success: true, data: blogs, message: "Blog deleted Successfully" });
    } catch (neonError) {
      return res.status(500).json({ success: false, message: `Neon delete failed: ${neonError.message}` });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}




// import { Blog } from "@/models/Blog";
// import { Comment } from "@/models/Comment";
// import { defaultBlogs, generateRandomComments } from '@/lib/default';
// import { neon } from '@netlify/neon';
// import { v4 as uuidv4 } from 'uuid';
// import multer from 'multer';
// import path from 'path';
// import cloudinary from "./upload";

// const formatDate = (date) => {
//   if (!date || isNaN(date)) {
//     return '';
//   }
//   const options = {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour12: true
//   };
//   return new Intl.DateTimeFormat('en-US', options).format(date);
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'public/uploads';
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// async function cleanupOldNotifications() {
//   try {
//     // Delete from Neon
//     await sql`DELETE FROM notifications WHERE createddate < CURRENT_DATE - INTERVAL '3 months'`;
//   } catch (neonError) {
//     console.log('Neon notification cleanup failed:', neonError);
//   }

// }

// // Configure multer storage

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


 
// const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed

// export default async function handle(req, res) {
// // Use process.env.DATABASE_URL if needed
//     const { method } = req;

//    if (method === "POST") {
//   upload(req, res, async (err) => {
//     if (err) return res.status(400).json({ success: false, message: err.message });
//     const { title, slug, description, blogcategory, tags, attachments } = req.body;
//     const status = (title && slug && description && blogcategory && (attachments && attachments.length > 0)) ? 'publish' : 'draft';
//     const id = uuidv4();
//     let images = [];
//     if (attachments?.length > 0) {
//       for (const attachment of attachments) {
//         try {
//           const result = await cloudinary.v2.uploader.upload(attachment.data, {
//             folder: 'myportfolio',
//             public_id: `file_${Date.now()}`,
//             resource_type: 'auto'
//           });
//           images.push(result.secure_url);
//         } catch (error) {
//           console.log('Cloudinary upload error:', error);
//           // Continue processing other images
//         }
//       }
//     }
//     try {
//       await sql`
//         INSERT INTO blogs (
//           id, title, slug, images, description, blogcategory, tags, status
//         ) VALUES (
//           ${id}, ${title}, ${slug}, ${JSON.stringify(images || [])}::jsonb, ${description},
//           ${blogcategory}, ${JSON.stringify(tags || [])}::jsonb, ${status}
//         )`;
//       try {
//         await sql`
//           INSERT INTO notifications (
//             type, model, dataid, title, message, createddate
//           ) VALUES (
//             'add', 'Blog', ${id}, 'Blog Post Creation Documented',
//             ${`Admin published blog post "${title}" (category: ${blogcategory}, status: ${status}) on ${formatDate(new Date())}. Included elements: tags ${JSON.stringify(tags)}, content overview ${description.slice(0, 150)}.... Evaluate for alignment with content strategy and prepare for distribution.`},
//             CURRENT_TIMESTAMP
//           )`;
//       } catch (neonNotifError) {
//         console.log('Neon notification insert failed:', neonNotifError);
//         return res.json({
//           success: false,
//           message: `Failed to notify admin about this action`
//         });
//       }
//       return res.json({ success: true, message: `Blog Added Successfully` });
//     } catch (neonError) {
//       return res.status(500).json({ success: false, message: `Neon insert failed: ${neonError.message}` });
//     }
//   });
// } else if (method === "GET") {
// const queryId = "publish";
// //await sql`DELETE FROM blogs WHERE status   = ${queryId}`;

//    if (req.query?.id || req.query?.blogId) {
//             const queryId = req.query.id || req.query.blogId;
//             let blog = null;
//             try {
//                 const pgBlogs = await sql`SELECT * FROM blogs WHERE id = ${queryId}`;
//                 if (pgBlogs.length > 0) {
//                     const pgBlog = pgBlogs[0];
//                     blog = {
//                         _id: pgBlog.id,
//                         title: pgBlog.title,
//                         slug: pgBlog.slug,
//                         images: pgBlog.images,
//                         description: pgBlog.description,
//                         blogcategory: pgBlog.blogcategory,
//                         tags:pgBlog.tags,
//                         status: pgBlog.status,
//                         comments: pgBlog.comments,
//                         createdAt: pgBlog.createdat,
//                         updatedAt: pgBlog.updatedat
//                     };
//                 }
//             } catch (neonError) {
//                 console.log('Neon GET single failed:', neonError);
//             }
          
//             if (blog) {
//                 return res.json({
//                     success: true,
//                     data: blog,
//                     message: ""
//                 });
//             } else {
//                 return res.json({
//                     success: false,
//                     data: null,
//                     message: "Failed to get blog document, verify blog id"
//                 });
//             }
//         } else {

// //                                              try {
// //   let createdCount = 0;
// //   for (const blog of defaultBlogs) {
// //     // Check if blog exists by slug and title

// //     const existingBlog = await sql`
// //       SELECT slug id FROM blogs WHERE id = ${blog.id}
// //     `;
// //     if (existingBlog.length > 0) {
// //      console.log('already exist')
// //          // Skip to next blog if it already exists
// //     }
// // else{
// //     // Insert new blog
// //     const [createdBlog] = await sql`
// //       INSERT INTO blogs (id,
// //       title, slug, images, description, blogcategory, tags, status, comments, createdat)
// //       VALUES (
// //       ${blog.id},
// //         ${blog.title},
// //         ${blog.slug},
// //         ${JSON.stringify(blog.images)},
// //         ${blog.description},
// //         ${blog.blogcategory},
// //         ${JSON.stringify(blog.tags)},
// //         ${blog.status},
// //         ${JSON.stringify([])},
// //         CURRENT_TIMESTAMP
// //       )
// //       RETURNING id
// //     `;
// //     const blogId = createdBlog.id;

// //     // Insert blog creation notification (admin action)
// //     try {
// //       await sql`
// //         INSERT INTO notifications (type, model, dataid, title, message, createddate)
// //         VALUES (
// //           'add',
// //           'Blog',
// //           ${blogId},
// //           'Blog Post Creation Documented',
// //           ${`Admin published blog post "${blog.title}" (ID: ${blogId}, slug: ${blog.slug}, category: ${blog.blogcategory}, status: ${blog.status}) on ${formatDate(new Date())}. Included elements: tags ${JSON.stringify(blog.tags)}, content overview ${blog.description.slice(0, 150)}.... Evaluate for alignment with content strategy and prepare for distribution.`},
// //           CURRENT_TIMESTAMP
// //         )
// //       `;
// //     } catch (neonNotifError) {
       
// //       console.log('Neon blog notification insert failed:', neonNotifError);
// //    //eturn
// //     }

// //     // Generate and insert comments
// //     const commentGroups = generateRandomComments(blog, blogId);
// //     const commentIds = [];
// //     for (const group of commentGroups) {
// //       try {
// //         // Insert main comment
// //         const [mainComment] = await sql`
// //           INSERT INTO comments (
// //             name, image, email, title, contentpera, maincomment, createdat,
// //             blog, blogtitle, parent, children, parentname, parentimage
// //           )
// //           VALUES (
// //             ${group.mainComment.name},
// //             ${group.mainComment.image},
// //             ${group.mainComment.email},
// //             ${group.mainComment.title},
// //             ${group.mainComment.contentPera},
// //             ${group.mainComment.mainComment},
// //             CURRENT_TIMESTAMP,
// //             ${blogId},
// //             ${blog.title},
// //             NULL,
// //             ${JSON.stringify([])},
// //             ${group.mainComment.parentName || ''},
// //             ${group.mainComment.parentImage || ''}
// //           )
// //           RETURNING id
// //         `;
// //         const mainCommentId = mainComment.id;
// //         commentIds.push(mainCommentId);

// //         // Insert main comment notification (user action)
// //     try{
// //             await sql`
// //           INSERT INTO notifications (type, model, dataid, title, message, createddate)
// //           VALUES (
// //             'add',
// //             'Comment',
// //             ${mainCommentId},
// //             'Comment Submission Noted',
// //             ${`User ${group.mainComment.name} ( email: ${group.mainComment.email}) submitted a comment to blog "${blog.title}" through the website on ${formatDate(new Date())}. Details: title "${group.mainComment.title}", content "${group.mainComment.contentPera}", parent reference ${group.mainComment.parentName || 'none'}. Perform moderation to uphold content standards and facilitate engagement.`},
// //             CURRENT_TIMESTAMP
// //           )
// //         `;
// //     }
// //     catch(error){

// //     }

// //         // Prepare and insert reply comments
// //         const replyCommentIds = [];
// //         for (const reply of group.replyComments) {
// //           const [createdReply] = await sql`
// //            INSERT INTO comments (
// //             name, image, email, title, contentpera, maincomment, createdat,
// //             blog, blogtitle, parent, children, parentname, parentimage
// //           )
// //             VALUES (
// //               ${reply.name},
// //               ${reply.image},
// //               ${reply.email},
// //               ${reply.title},
// //               ${reply.contentPera},
// //               ${reply.mainComment},
// //               CURRENT_TIMESTAMP,
// //               ${blogId},
// //               ${blog.title},
// //               ${mainCommentId},
// //               ${JSON.stringify([])},
// //               ${reply.parentName || group.mainComment.name},
// //               ${reply.parentImage || group.mainComment.image}
// //             )
// //             RETURNING id
// //           `;
// //           const replyId = createdReply.id;
// //           replyCommentIds.push(replyId);
// //           commentIds.push(replyId);

// //           // Insert reply comment notification (user action)
// //         try{
// //               await sql`
// //             INSERT INTO notifications (type, model, dataid, title, message, createddate)
// //             VALUES (
// //               'add',
// //               'Comment',
// //               ${replyId},
// //               'Comment Submission Noted',
// //               ${`User ${reply.name} (email: ${reply.email}) replied to a comment submitted by ${reply.parentName} on the blog titled "${blog.title}" through the website on ${formatDate(new Date())}. Details: title "${reply.title}", content "${reply.contentPera}", parent reference ${reply.parentName || 'none'}. Perform moderation to uphold content standards and facilitate engagement.`},
// //               CURRENT_TIMESTAMP
// //             )
// //           `;
// //         }
// //         catch(error){
           
// //         }

// //         }

// //         // Update main comment with children IDs
// //         await sql`
// //           UPDATE comments
// //           SET children = ${JSON.stringify(replyCommentIds)}
// //           WHERE id = ${mainCommentId}
// //         `;
// //       } catch (commentError) {
// //      // console.log(`Error processing comments for blog "${blog.title}":`, commentError);
// //         // Continue to next group without stopping
// //       }
// //     }

// //     // Update blog with all comment IDs
// //     await sql`
// //       UPDATE blogs
// //       SET comments = ${JSON.stringify(commentIds)}
// //       WHERE id = ${blogId}
// //     `;
// //     createdCount++;
// //    } }
// // } catch (error) {
// //   //nsole.error('Error populating default blogs, comments, or notifications:', error);
// // //return res.status(500).json({ success: false, message: `Error: ${error.message}` });
// // }

//             let blogs = [];
//             try {
//                 const pgBlogs = await sql`SELECT * FROM blogs ORDER BY createdat DESC`;
//                 blogs = pgBlogs.map(pgBlog => ({
//                     _id: pgBlog.id,
//                     title: pgBlog.title,
//                     slug: pgBlog.slug,
//                     images: pgBlog.images,
//                     description: pgBlog.description,
//                     blogcategory: pgBlog.blogcategory,
//                     tags: pgBlog.tags,
//                     status: pgBlog.status,
//                     comments: pgBlog.comments,
//                     createdAt: pgBlog.createdat,
//                     updatedAt: pgBlog.updatedat
//                 }));
//             } catch (neonError) {
//                 console.log('Neon GET all failed:', neonError);
//                 blogs = await Blog.find().sort({ createdAt: -1 });
//             }

//          let cleanedReferenceCount = 0;

//     // For each blog, validate and clean the comments array
//     for (const blog of blogs) {

//       try {
//         // Get current comment IDs from the blog
//         const currentCommentIds = blog.comments || [];

//         if (currentCommentIds.length > 0) {
       
//         // Fetch all existing comment IDs
//         const existingComments = await sql`
//           SELECT id FROM comments WHERE id = ANY(${currentCommentIds})
//         `;

//         const validCommentIds = existingComments.map(c => c.id);

//         // If there are invalid references, update the blog
//         if (validCommentIds.length !== currentCommentIds.length) {
//           await sql`
//             UPDATE blogs
//             SET comments = ${JSON.stringify(validCommentIds)}
//             WHERE id = ${blog._id}
//           `;
//           cleanedReferenceCount += (currentCommentIds.length - validCommentIds.length);
//           blog.comments = validCommentIds; // Update in-memory for response
//         }
//     }
//       } catch (neonError) {
//         // Silently continue to next blog
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       data: blogs,
//       message: `Fetched ${blogs.length} blogs. Cleaned ${cleanedReferenceCount} invalid comment references.`
//     });
//         }
     
//     } else if (method === "PUT") {
//   const { _id, title, slug, attachments, description, blogcategory, tags } = req.body;
//   console.log("PUT body", req.body);
//   if (!_id) {
//     return res.status(400).json({ success: false, message: "Error! _Id Missing" });
//   }
//   const status = (title && slug && description && blogcategory && (attachments && attachments.length > 0)) ? 'publish' : 'draft';
//   let images = [];
//   if (attachments?.length > 0) {
//     for (const attachment of attachments) {
//       if (attachment.isExisting) {
//         images.push(attachment.data); // Preserve existing URL
//       } else {
//         try {
//           const result = await cloudinary.v2.uploader.upload(attachment.data, {
//             folder: 'myportfolio',
//             public_id: `file_${Date.now()}`,
//             resource_type: 'auto'
//           });
//           images.push(result.secure_url);
//         } catch (error) {
//           console.log('Cloudinary upload error:', error);
//           // Continue processing other images
//         }
//       }
//     }
//   }
//   try {
//     await sql`
//       UPDATE blogs SET
//         title = ${title},
//         slug = ${slug},
//         images = ${JSON.stringify(images || [])}::jsonb,
//         description = ${description},
//         blogcategory = ${blogcategory},
//         tags = ${JSON.stringify(tags || [])}::jsonb,
//         status = ${status},
//         updatedat = CURRENT_TIMESTAMP
//       WHERE id = ${_id}
//     `;
//     try {
//       await sql`
//         INSERT INTO notifications (
//           type, model, dataid, title, message, createddate
//         ) VALUES (
//           'update', 'Blog', ${_id}, 'Blog Post Update Registered',
//           ${`Admin updated blog post "${title}" on ${formatDate(new Date())}. Revisions: category to ${blogcategory}, tags to ${JSON.stringify(tags)}, status to ${status}, content adjustments applied. Assess implications for audience reach and maintain version history for reference.`},
//           CURRENT_TIMESTAMP
//         )`;
//     } catch (neonNotifError) {
//       console.log('Neon notification insert failed:', neonNotifError);
//     }
//     return res.json({ success: true, message: "Blog updated successfully" });
//   } catch (neonError) {
//     return res.status(500).json({ success: false, message: `Failed to update: ${neonError.message}` });
//   }
//     }else if (method === "DELETE") {
//         const queryId = req.query?.id || req.query?.blogId;
//         if (!queryId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Blog ID is required"
//             });
//         }
      
//         // // Delete images
//         // if (blog.images?.length) {
//         //     await deleteImages(blog.images);
//         // }
//         // Delete from Neon
//         try {
//             await sql`DELETE FROM blogs WHERE id = ${queryId}`;
//             try {
//                     await sql`
//                         INSERT INTO notifications (
//                             type, model, dataid, title, message, createddate
//                         ) VALUES (
//                             'delete', 'Blog', ${queryId}, 'Blog Post Deletion Performed',
//                             ${`Admin deleted a blog post ID: ${queryId}on ${formatDate(new Date())}, encompassing images and comments. Potential consequences include altered site navigation and search rankings. Document rationale and implement redirects as required`},
//                             CURRENT_TIMESTAMP
//                         )`;
//                 } catch (neonNotifError) {
//                     console.log('Neon notification insert failed:', neonNotifError);
//                 }
//    res.json({ success: true, message: "Blog deleted Successfully" });

            
//         } catch (neonError) {
//             console.log('Neon delete failed:', neonError);
//         }
     
//         // Fetch remaining blogs
//         let blogs = [];
//         try {
//             const pgBlogs = await sql`SELECT * FROM blogs ORDER BY createdat DESC`;
//             blogs = pgBlogs.map(pgBlog => ({
//                 _id: pgBlog.id,
//                 title: pgBlog.title,
//                 slug: pgBlog.slug,
//                 images: pgBlog.images,
//                 description: pgBlog.description,
//                 blogcategory: pgBlog.blogcategory,
//                 tags: pgBlog.tags,
//                 status: pgBlog.status,
//                 comments: pgBlog.comments,
//                 createdAt: pgBlog.createdat,
//                 updatedAt: pgBlog.updatedat
//             }));
//              return res.json({
//             success: true,
//             data: blogs
//         });
//         } catch (neonError) {
//             console.log('Neon GET all after delete failed:', neonError);
//             return res.json({
//             success: false,
//             message: "Failed to load"
//         });
//         }
       
//     } else {
//         return res.status(405).json({
//             success: false,
//             message: "Method not allowed"
//         });
//     }
// }











// // import { mongooseConnect } from "@/lib/mongoose";
// // import { Blog } from "@/models/Blog";
// // import { Comment } from "@/models/Comment";
// // import { defaultBlogs,  generateRandomComments } from '@/lib/default';
// // import {faker} from 'faker'
// // import multer from 'multer';
// // import path from 'path';
// // import fs from 'fs';





// // // Configure multer storage
// // const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //         const uploadDirs = [
// //             'public/uploads',
           
// //         ];
        
// //         // Create directories if they don't exist
// //         uploadDirs.forEach(dir => {
// //             if (!fs.existsSync(dir)) {
// //                 fs.mkdirSync(dir, { recursive: true });
// //             }
// //         });
        
// //         // Multer only saves to one destination, we'll manually copy to the other
// //         cb(null, 'public/uploads');
// //     },
// //     filename: function (req, file, cb) {
// //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //         const ext = path.extname(file.originalname);
// //         cb(null, uniqueSuffix + ext);
// //     }
// // });

// // const fileFilter = (req, file, cb) => {
// //     const filetypes = /jpeg|jpg|png|gif/;
// //     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// //     const mimetype = filetypes.test(file.mimetype);
    
// //     if (extname && mimetype) {
// //         cb(null, true);
// //     } else {
// //         cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
// //     }
// // };

// // const upload = multer({ 
// //     storage: storage,
// //     limits: { 
// //         fileSize: 20 * 1024 * 1024, // 20MB limit
// //         files: 10 // Max 10 files
// //     },
// //     fileFilter
// // }).array('images', 10);

// // export const config = {
// //     api: {
// //         bodyParser: true,
// //     },
// // };





// // export default async function handle(req, res) {

// //     await mongooseConnect();
// //     const {method} = req;

// //     if (method === "POST") {
// //         const {blogId, title, slug, images, description, blogcategory, tags} = req.body;
// //   const status = (title && slug && description  && blogcategory && images) ? 'publish' : 'draft'
// //     if (title && slug && description  && blogcategory && images){
// //         const blogDoc = await Blog.create({
// //             title, slug, images, description, blogcategory, tags, status
// //         })

// //         return res.json({
// //             success: true,
// //             data: blogDoc,
// //         })
   
// //     }
// //      if (blogId) {
// //       //  console.log("blogId ++++++++++ ",blogId)

// //         try {
           
                     
// //          const chooseProject = await Blog.findById(blogId);
       
// //                 chooseProject.images.forEach((imageUrl) => {
// //                           try {
                                   
                                               
// //                                    const filename = path.basename(imageUrl);
// //                                    const backendPath = path.join(process.cwd(), 'public/uploads', filename);
// //                                    const frontendPath = path.join(process.cwd(), '../FRONTEND/public/uploads', filename);
                       
// //                                    // Delete from both locations
// //                                    let backendDeleted = false;
// //                                    let frontendDeleted = false;
                       
// //                                    if (fs.existsSync(backendPath)) {
// //                                        fs.unlinkSync(backendPath);
// //                                        backendDeleted = true;
// //                                    }
                       
// //                                    if (fs.existsSync(frontendPath)) {
// //                                        fs.unlinkSync(frontendPath);
// //                                        frontendDeleted = true;
// //                                    }
                       
// //                                    if (!backendDeleted && !frontendDeleted) {
// //                                        console.log('File not found in either location');
                                      
// //                                    }
                       
// //                                   console.log( `File deleted ${backendDeleted ? 'from backend' : ''}${backendDeleted && frontendDeleted ? ' and ' : ''}${frontendDeleted ? 'from frontend' : ''}`);
// //                                } catch (error) {
// //                                    console.log('Error occurred while deleting image:', error);
// //                                     return res.json({
// //                        success: false,
// //                        message: "Error occurred while deleting image",
                       
// //                    })
// //                                }
// //                 })
       
// //                     await Blog.deleteOne({ _id: blogId });
           
// //            // Return remaining projects (sorted by createdAt)
// //            const remainingBlog = await Blog.find().sort({ createdAt: -1 });
           
// //            return res.json(remainingProjects);
                  

       
// //          } catch (error) {
// //            console.log("Server error:", error);
// //            return res.status(500).json({ 
// //              success: false, 
// //              message: "Internal server error" 
// //            });
// //          }
        
// //      }

// //     } else if (method === "GET") {


// //     try {
// //     for (const blog of defaultBlogs) {
// //         const existingBlog = await Blog.findOne({ 
// //             $and: [
// //                 { slug: blog.slug },
// //                 { title: blog.title }
// //             ] 
// //         });
        
// //         if (!existingBlog) {
// //             const createdBlog = await Blog.create(blog);
// //             //console.log(`Created blog "${blog.title}" with ID: ${createdBlog._id}`);

// //             const commentGroups = generateRandomComments(blog, createdBlog._id);
// //             const commentIds = [];

// //             for (const group of commentGroups) {
// //                 try {
// //                     // Create main comment with blog reference
// //                     const mainCommentData = {
// //                         ...group.mainComment,
// //                         blog: createdBlog._id, // Add blog reference
// //                         blogTitle: createdBlog.title // Add blog slug for easy reference
// //                     };
// //                     const mainComment = await Comment.create(mainCommentData);
// //                     commentIds.push(mainComment._id);
// //                   //  console.log(`Created main comment "${mainComment.title}" for blog "${blog.title}"`);

// //                     // Prepare reply comments with both parent and blog references
// //                     const replyComments = group.replyComments.map(reply => ({
// //                         ...reply,
// //                         parent: mainComment._id,
// //                         blog: createdBlog._id, // Add blog reference to replies too
// //                         blogTitle: createdBlog.title
// //                     }));

// //                     // Insert reply comments
// //                     const createdReplies = await Comment.insertMany(replyComments);
// //                   //  console.log(`Created ${createdReplies.length} reply comments for main comment "${mainComment.title}"`);

// //                     // Update main comment with children IDs
// //                     await Comment.updateOne(
// //                         { _id: mainComment._id },
// //                         { $set: { children: createdReplies.map(reply => reply._id) } }
// //                     );
// //                    // console.log(`Updated main comment "${mainComment.title}" with ${createdReplies.length} children IDs`);

// //                     // Add reply comment IDs to blog
// //                     commentIds.push(...createdReplies.map(reply => reply._id));
// //                 } catch (commentError) {
// //                     console.log(`Error processing comments for blog "${blog.title}":`, commentError);
// //                 }
// //             }

// //             // Update blog with all comment IDs
// //             await Blog.updateOne(
// //                 { _id: createdBlog._id },
// //                 { $set: { comments: commentIds } } // Using $set instead of $push to ensure complete array
// //             );
// //             //console.log(`Updated blog "${blog.title}" with ${commentIds.length} comment IDs`);
// //         } else {
// //           //  console.log(`Blog "${blog.title}" already exists, skipping comment creation`);
// //         }
// //     }
// // } catch (error) {
// //     console.log("Error populating default blogs or comments:", error);
// // }



// //           if (req.query?.id) {
// //             const blogDoc = await Blog.findById(req.query?.id);

// //             if (blogDoc) {
// //                 return res.json({
// //                     success: true,
// //                     data: blogDoc,
// //                     message: ""
// //                 })
// //             }
// //          else{
// //             return res.json({
// //                 success: false,
// //                 data: null,
// //                 message: "failed to get blog document, verify blog id"
// //             })
// //          }

// //           }

// //           else if(req.query?.blogId){
// //                                const blogId = req.query?.blogId;
          
// //             try {
              
// //             if (!blogId) {
// //                 return res.status(400).json({ 
// //                   success: false, 
// //                   message: "Project ID is required" 
// //                 });
// //               }
// //                   if (blogId) {
// //             const chooseProject = await Blog.findById(blogId);
// //               if (chooseProject.images.length > 0) {
// //                     chooseProject.images.forEach((imageUrl) => {
// //                              try {
                                      
                                                  
// //                                       const filename = path.basename(imageUrl);
// //                                       const backendPath = path.join(process.cwd(), 'public/uploads', filename);
// //                                       const frontendPath = path.join(process.cwd(), '../FRONTEND/public/uploads', filename);
                          
// //                                       // Delete from both locations
// //                                       let backendDeleted = false;
// //                                       let frontendDeleted = false;
                          
// //                                       if (fs.existsSync(backendPath)) {
// //                                           fs.unlinkSync(backendPath);
// //                                           backendDeleted = true;
// //                                       }
                          
// //                                       if (fs.existsSync(frontendPath)) {
// //                                           fs.unlinkSync(frontendPath);
// //                                           frontendDeleted = true;
// //                                       }
                          
// //                                       if (!backendDeleted && !frontendDeleted) {
// //                                           chooseProject.images = [];
// //                                          chooseProject.save();
                                                
// //                                         console.log('File not found in either location');
// //                                           return res.json({
// //                           success: false,
// //                           message: "File not found in either location",
                          
// //                       })
// //                                       }
                          
// //                                      console.log( `File deleted ${backendDeleted ? 'from backend' : ''}${backendDeleted && frontendDeleted ? ' and ' : ''}${frontendDeleted ? 'from frontend' : ''}`);
// //                                   } catch (error) {
// //                                       console.log('Error occurred while deleting image:', error);
// //                                        return res.json({
// //                           success: false,
// //                           message: "Error occurred while deleting image",
                          
// //                       })
// //                                   }
// //                    })
// //               }
                   
          
// //                        await Blog.deleteOne({ _id: blogId });
              
// //               // Return remaining projects (sorted by createdAt)
// //               const remainingProjects = await Blog.find().sort({ createdAt: -1 });
              
// //               return res.json({ 
// //                 success: true,
// //                 data: remainingProjects 
// //               });
                     
// //                     } else {
                      
// //                       return res.json({
// //                           success: false,
// //                           message: "Failed to delete blog",
                          
// //                       })
          
// //                     }
          
// //             } catch (error) {
// //               console.log("Server error:", error);
// //               return res.status(500).json({ 
// //                 success: false, 
// //                 message: "Internal server error" 
// //               });
// //             }
// //                     }
// //           else {
            
// //             const blogDoc = (await Blog.find()).reverse();
            
// //             return res.json({
// //                 success: true,
// //                  data: blogDoc,
// //                  message: ""
// //             })

// //           }
// //     }

// //     else if (method === "PUT"){
// //         const {_id, title, slug, images, description, blogcategory, tags, status} = req.body;
// //         if (!_id) {
// //             return res.json({
// //                 success: false,
// //                 message: "Error! _Id Missing",
                
// //             })
// //         }
// //         else{
// //             await Blog.updateOne({_id}, {
// //                 title, slug, images, description, blogcategory, tags, status
// //             })

// //             return res.json({
// //                 success: true,
// //                 message: "_Id Missing",
               
// //             })
// //         }
// //     }

// //     else if (method === "DELETE"){
// //         if (req.query?.id) {
// //             await Blog.deleteOne(req.query?.id);
        
// //             return res.json({
// //                 success: true,
// //                 message: "",
                
// //             })

// //           } else {
            
// //             return res.json({
// //                 success: false,
// //                 message: "Failed to delete blog",
                
// //             })

// //           }
// //     }
    
// // } 