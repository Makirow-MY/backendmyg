import { Photos } from "@/models/Photo";




export default async function handleproj(req, res) {

    await mongooseConnect();
    const {method} = req;

    if (method === "POST") {
        const {projectId, title, slug, images} = req.body;
  
        if(title && slug && images){
       
        const blogDoc = await Photos.create({
            title, slug, images
        })

        return res.json({
            success: true,
            data: blogDoc,
        })
    }

     if (projectId) {
      //  console.log("blogId ++++++++++ ",projectId)

        await Photos.deleteOne({_id: projectId});
        
        const blogDoc = (await Photos.find()).reverse();
            
     //   console.log("blogId ++++++++++ blogDoc ",blogDoc)
            return res.json(blogDoc);
        
     }

    } else if (method === "GET") {
          if (req.query?.id) {
            const blogDoc = await Photos.findById(req.query?.id);

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

          } else {
            
            const Doc = (await Photos.find()).reverse();
            
            return res.json({
                success: true,
                 data: Doc,
                 message: ""
            })

          }
    }

    else if (method === "PUT"){
        const {_id, title, slug, images} = req.body;
        if (!_id) {
            return res.json({
                success: false,
                message: "Error! _Id Missing",
                
            })
        }
        else{
            await Photos.updateOne({_id}, {
                title, slug, images
            })

            return res.json({
                success: true,
                message: "_Id Missing",
               
            })
        }
    }

    else if (method === "DELETE"){
        if (req.query?.id) {
            await Photos.deleteOne(req.query?.id);
        
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