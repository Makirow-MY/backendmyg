import { Blog } from "@/models/Blog";
import { Comment } from "@/models/Comment";
import { neon } from '@netlify/neon';
import { v4 as uuidv4 } from 'uuid';

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

export default async function handle(req, res) {
    
   //const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed
 const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed

    const { method } = req;
    const id = req.query?.id;
    if (method === 'GET') {
        try {
            if (id) {
                let comment = null;
                try {
                    const pgComments = await sql`SELECT * FROM comments WHERE id = ${id}`;
                    if (pgComments.length > 0) {
                        const pgComment = pgComments[0];
                        comment = {
                            _id: pgComment.id,
                            name: pgComment.name,
                            image: pgComment.image,
                            email: pgComment.email,
                            title: pgComment.title,
                            contentPera: pgComment.contentpera,
                            mainComment: pgComment.maincomment,
                            createdAt: pgComment.createdat,
                            blog: pgComment.blog,
                            blogTitle: pgComment.blogtitle,
                            parent: pgComment.parent,
                            children: pgComment.children,
                            parentName: pgComment.parentname,
                            parentImage: pgComment.parentimage,
                            updatedAt: pgComment.updatedat
                        };
                    }
                } catch (neonError) {
                   //console.log('Neon GET single failed:', neonError);
                }
             
                if (!comment) {
                    return res.status(404).json({
                        success: false,
                        message: "Comment not found"
                    });
                }
                return res.json({
                    success: true,
                    data: comment,
                });
            } else {
//await sql`DELETE FROM comments WHERE maincomment = false  OR maincomment= true`;
                let comments = [];
                try {
                    const pgComments = await sql`SELECT * FROM comments ORDER BY createdat ASC`;
                    comments = pgComments.map(pgComment => ({
                        _id: pgComment.id,
                        name: pgComment.name,
                        image: pgComment.image,
                        email: pgComment.email,
                        title: pgComment.title,
                        contentPera: pgComment.contentpera,
                        mainComment: pgComment.maincomment,
                        createdAt: pgComment.createdat,
                        blog: pgComment.blog,
                        blogTitle: pgComment.blogtitle,
                        parent: pgComment.parent,
                        children: pgComment.children,
                        parentName: pgComment.parentname,
                        parentImage: pgComment.parentimage,
                        updatedAt: pgComment.updatedat
                    }));

                    //console.log("pgComments",comments)
                } catch (neonError) {
                    //console.log('Neon GET all commmments failed:', neonError);
                   //omments = await Comment.find().sort({ createdAt: 1 });
                }

                // Cleanup: Delete comments with invalid blog IDs
                for (const comment of comments) {
                    let blogExists = false;
                    try {
                        const pgBlogs = await sql`SELECT id FROM blogs WHERE id = ${comment.blog}`;
                        if (pgBlogs.length > 0) {
                            blogExists = true;
                        }
                    } catch (neonError) {
                       //console.log('Neon blog check failed:', neonError);
                    }
                    
                    if (!blogExists) {
                        try {
                            await sql`DELETE FROM comments WHERE id = ${comment._id}`;
                        } catch (neonError) {
                           //console.log('Neon delete comment failed:', neonError);
                        }
                       //wait Comment.deleteOne({ _id: comment._id });
                    }
                }

                // Fetch updated comments
                let updatedComments = [];
                try {
                    const pgComments = await sql`SELECT * FROM comments ORDER BY createdat DESC`;
                    updatedComments = pgComments.map(pgComment => ({
                        _id: pgComment.id,
                        name: pgComment.name,
                        image: pgComment.image,
                        email: pgComment.email,
                        title: pgComment.title,
                        contentPera: pgComment.contentpera,
                        mainComment: pgComment.maincomment,
                        createdAt: pgComment.createdat,
                        blog: pgComment.blog,
                        blogTitle: pgComment.blogtitle,
                        parent: pgComment.parent,
                        children: pgComment.children,
                        parentName: pgComment.parentname,
                        parentImage: pgComment.parentimage,
                        updatedAt: pgComment.updatedat
                    }));
                  
                } catch (neonError) {
                    //console.log('Neon GET updated failed:', neonError);
                    //datedComments = await Comment.find().sort({ createdAt: -1 });
                }
               
                return res.status(200).json( updatedComments);
            }
        } catch (error) {
           //console.log("Error fetching comments:", error);
            return res.status(500).json({ success: false, message: "Failed to fetch comments" });
        }
    } 
    else if (method === 'POST'){
      try {
        const { name, title, slug, image, email, contentPera, mainComment, parent} = req.body;
//console.log({ name, title, slug, image, email, contentPera, mainComment, parent})

        if (name && title && slug && email && contentPera ) {
          let blog = null;
          try {
            const pgBlogs = await sql`SELECT * FROM blogs WHERE slug = ${slug}`;
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
            } else {
              return res.status(404).json({ message: " No Blog Found " });
            }
          } catch (neonError) {
            //console.log('Neon GET single failed:', neonError);
            return res.status(500).json({
              error: true,
              message: `Failed to retrieve that particular data`
            });
          }

          if (!blog) {
            return res.status(404).json({ message: " No Blog Found " });
          } 

          else if (parent) {
           
            let parentcomment = null;
            try {
              const pgComments = await sql`SELECT * FROM comments WHERE id = ${parent}`;
              if (pgComments.length > 0) {
                const pgComment = pgComments[0];
                parentcomment = {
                  _id: pgComment.id,
                  name: pgComment.name,
                  image: pgComment.image,
                  email: pgComment.email,
                  title: pgComment.title,
                  contentPera: pgComment.contentpera,
                  mainComment: pgComment.maincomment,
                  createdAt: pgComment.createdat,
                  blog: pgComment.blog,
                  blogTitle: pgComment.blogtitle,
                  parent: pgComment.parent,
                  children: pgComment.children,
                  parentName: pgComment.parentname,
                  parentImage: pgComment.parentimage,
                  updatedAt: pgComment.updatedat
                };
              }
            } catch (neonError) {
              console.error('Neon GET single failed:', neonError);
               return res.status(404).json({ message: " Failed to find main comment " });
         
            }

            
            if (!parentcomment) {
              return res.status(404).json({ message: " Parent Comment Not Found! " });
            }

            // Insert new reply comment
            const replyId = uuidv4();
            try{
            await sql`
              INSERT INTO comments (
               id, name, image, email, title, contentpera, maincomment,
                createdat, blog, blogtitle, parent, children, parentname, parentimage
              )
              VALUES (
                ${replyId}, ${name}, ${image},
                ${email}, ${title}, ${contentPera}, ${mainComment}, CURRENT_TIMESTAMP,
                ${blog._id}, ${blog.title}, ${parentcomment._id}, ${JSON.stringify([])},
                ${parentcomment.name}, ${parentcomment.image}
              )
            `;
         
          }
            catch(error){
     console.error("failed to insert reply comment", error)
    return res.status(404).json({ message: " Failed to insert reply comment " });       
    } 
   try{
              await sql`
            INSERT INTO notifications (type, model, dataid, title, message, createddate)
            VALUES (
              'add',
              'Comment',
              ${replyId},
              'Comment Submission Noted',
              ${`User ${name} (email: ${email}) replied to a comment submitted by "${parentcomment.name}" on the blog titled "${blog.title}", through the website on ${formatDate(new Date())}. Details: title "${title}", content "${contentPera}", parent reference ${parentcomment.name}. Perform moderation to uphold content standards and facilitate engagement.`},
              CURRENT_TIMESTAMP
            )
          `;
        }
        catch(error){
          console.error(error)
 return res.status(404).json({ message: " Parent Comment Not Found! " });
         
        }
           

            // Update parent comment's children array
            const updatedChildren = [...parentcomment.children, replyId];
          
          try {
              await sql`
              UPDATE comments
              SET children = ${JSON.stringify(updatedChildren)},
                  updatedat = CURRENT_TIMESTAMP
              WHERE id = ${parentcomment._id}
            `;

          } catch (error) {
               return res.status(404).json({ message: " Failed to insert reply comment " });       
 
          }

            // Update blog's comments array
            const updatedComments = [...blog.comments, replyId];
            await sql`
              UPDATE blogs
              SET comments = ${JSON.stringify(updatedComments)},
                  updatedat = CURRENT_TIMESTAMP
              WHERE id = ${blog._id}
            `;
            
            // Fetch the new reply comment

            const [newReply] = await sql`SELECT * FROM comments WHERE id = ${replyId}`;

            return res.status(201).json({
                success: true, message: "Reply Comment added successfully", 
             data: {
             _id: newReply.id,
              name: newReply.name,
              title: newReply.title,
              image: newReply.image,
              email: newReply.email,
              contentPera: newReply.contentpera,
              mainComment: newReply.maincomment,
              parent: newReply.parent,
              blog: newReply.blog,
              blogTitle: newReply.blogtitle,
              parentName: newReply.parentname,
              parentImage: newReply.parentimage,
              createdAt: newReply.createdat,
              updatedAt: newReply.updatedat}
            });
          } else {
            // Insert new main comment
            const mainId = uuidv4();
            await sql`
              INSERT INTO comments (
                id, name, image, email, title, contentpera, maincomment,
                createdat, blog, blogtitle, parent, children, parentname, parentimage
              )
              VALUES (
                ${mainId}, ${name}, ${image },
                ${email}, ${title}, ${contentPera}, ${mainComment}, CURRENT_TIMESTAMP,
                ${blog._id}, ${blog.title}, NULL, ${JSON.stringify([])}, '', ''
              )
            `;

             try{
              await sql`
            INSERT INTO notifications (type, model, dataid, title, message, createddate)
            VALUES (
              'add',
              'Comment',
              ${mainId},
              'Comment Submission Noted',
              ${`User ${name} (email: ${email}) submitted a comment to the blog "${blog.title}", through the website on ${formatDate(new Date())}. Details: title "${title}", content "${contentPera}", parent reference  "none". Perform moderation to uphold content standards and facilitate engagement.`},
              CURRENT_TIMESTAMP
            )
          `;
        }
        catch(error){
  return res.status(404).json({ message: "Failed to create notification " });

        }

            // Update blog's comments array
            const updatedComments = [...blog.comments, mainId];
            await sql`
              UPDATE blogs
              SET comments = ${JSON.stringify(updatedComments)},
                  updatedat = CURRENT_TIMESTAMP
              WHERE id = ${blog._id}
            `;

            // Fetch the new main comment
            const [newMain] = await sql`SELECT * FROM comments WHERE id = ${mainId}`;

            return res.status(201).json(
              {
                success: true, message: "Comment added successfully", 
             data:{
              _id: newMain.id,
              name: newMain.name,
              title: newMain.title,
              image: newMain.image,
              email: newMain.email,
              contentPera: newMain.contentpera,
              mainComment: newMain.maincomment,
              parent: newMain.parent,
              blog: newMain.blog,
              blogTitle: newMain.blogtitle,
              parentName: newMain.parentname,
              parentImage: newMain.parentimage,
              createdAt: newMain.createdat,
              updatedAt: newMain.updatedat
            }});
          }
          
        } 
        
      } catch (error) {
        res.status(500).json({ message: "Server Error" });
      }
   

    }
    else if (method === 'DELETE') {

        const id = req.query?.id;
         if (!id) {
            return res.status(400).json({ success: false, message: "Comment ID is required" });
        }

        try {
            // Fetch the comment to determine if it's main or reply
            let comment = null;
            const pgComments = await sql`SELECT * FROM comments WHERE id = ${id}`;
            if (pgComments.length > 0) {
                const pgComment = pgComments[0];
                comment = {
                    _id: pgComment.id,
                    mainComment: pgComment.maincomment,
                    parent: pgComment.parent,
                    children: pgComment.children
                };
            }

            if (!comment) {
                return res.status(404).json({ success: false, message: "Comment not found" });
            }

            if (comment.mainComment) {
                // Delete all child replies
                await sql`DELETE FROM comments WHERE parent = ${id}`;
                // Delete the main comment
                await sql`DELETE FROM comments WHERE id = ${id}`;
            } else {
                // Delete the reply
                await sql`DELETE FROM comments WHERE id = ${id}`;
                // Remove the reply ID from parent's children array (assuming children is text[])
                if (comment.parent) {
                    await sql`
                    UPDATE comments 
                    SET children = children - ${id}::text 
                    WHERE id = ${comment.parent}
                      AND children ? ${id}
                `;
                }
            }

            return res.status(200).json({ success: true, message: "Comment deleted successfully" });
        } catch (error) {
            //console.log("Error deleting comment:", error);
            return res.status(500).json({ success: false, message: "Failed to delete comment" });
        }
    } else {
        res.setHeader('Allow', ['GET', 'DELETE', 'POST']);
        res.status(405).end(`Method ${method} is not allowed`);
    }
}