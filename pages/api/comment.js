import { mongooseConnect } from "@/lib/mongoose";
import { Blog } from "@/models/Blog";
import { Comment } from "@/models/Comment";
import { neon } from '@netlify/neon';

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
                    console.error('Neon GET single failed:', neonError);
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
                } catch (neonError) {
                    console.log('Neon GET all commmments failed:', neonError);
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
                        console.error('Neon blog check failed:', neonError);
                    }
                    
                    if (!blogExists) {
                        try {
                            await sql`DELETE FROM comments WHERE id = ${comment._id}`;
                        } catch (neonError) {
                            console.error('Neon delete comment failed:', neonError);
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
                    console.log('Neon GET updated failed:', neonError);
                    //datedComments = await Comment.find().sort({ createdAt: -1 });
                }
               
                return res.status(200).json( updatedComments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            return res.status(500).json({ success: false, message: "Failed to fetch comments" });
        }
    } else {
        res.setHeader('Allow', ['GET']); // Only GET is supported
        res.status(405).end(`Method ${method} is not allowed`);
    }
}