import { mongooseConnect } from "@/lib/mongoose";
import { Blog } from "@/models/Blog";
import { Comment } from "@/models/Comment";

export default async function handle(req, res) {
    await mongooseConnect();
    const {method} = req;
    const id = req.query?.id
    //console.log("if", id)
    
    if (method === 'GET') {
          try {

            if (req.query?.id) {
                            const CommentDoc = await Comment.findById(req.query.id);
                             if (!CommentDoc) {
                    return res.status(404).json({ 
                        success: false, 
                        message: "Comment not found" 
                    });
                }
                return res.json({ 
                    success: true, 
                    data: CommentDoc, 
                });
                
                          }

                          else{
                      const comments = await Comment.find().sort({createdAt: 1});
                        comments.forEach(async (Comment) => {
                             const getRecent = await Blog.findById(Comment.blog)
                             if (!getRecent) {
                                await Comment.deleteOne({_id: Comment._id})
                             }
                       })
                        const Updatedcomments = await Comment.find().sort({ createdAt: -1 });
                   
          // console.log("++++++++ comments ++++++++", comments);
        return res.status(201).json(Updatedcomments);
                          }

          } catch (error) {
               console.error("Error creating comment",error)
                res.status(500).json({message: "Failed to create comment"});
          }
           
    
    } 
    
    
       else {
     
        res.setHeader('Allow', ['POST']); 
        res.status(405).end(`Method ${method} is not allowed`);
        
    }
    
}
