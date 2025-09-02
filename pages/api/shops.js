import { mongooseConnect } from "@/lib/mongoose";
import { Shop } from "@/models/Shop";




export default async function handleprod(req, res) {

    await mongooseConnect();
    const {method} = req;
 //console.log("{method}", {method})
    if (method === "POST") {
        const {productId, title, slug, images, description, price, afilink, tags, status} = req.body;
  //console.log({ title, slug, images, description, price, afilink, tags, status})
        if(title && slug && description && status && afilink && price ){
       
        const blogDoc = await Shop.create({
            title, slug, images, description, price, afilink, tags, status
        })

        return res.json({
            success: true,
            data: blogDoc,
        })
    }

     if (productId) {
       // console.log("blogId ++++++++++ ",productId)

        await Shop.deleteOne({_id: productId});
        
        const blogDoc = (await Shop.find()).reverse();
            
      //  console.log("blogId ++++++++++ blogDoc ",blogDoc)
            return res.json(blogDoc);
        
     }

    } else if (method === "GET") {
          if (req.query?.id) {
            const blogDoc = await Shop.findById(req.query?.id);

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
            
            const Doc = (await Shop.find()).reverse();
            
            return res.json({
                success: true,
                 data: Doc,
                 message: ""
            })

          }
    }

    else if (method === "PUT"){
        const {_id, title, slug, images, description, price, afilink, tags, status } = req.body;
        if (!_id) {
            return res.json({
                success: false,
                message: "Error! _Id Missing",
                
            })
        }
        else{
            await Shop.updateOne({_id}, {
                title, slug, images, description, price, afilink, tags, status
            })

            return res.json({
                success: true,
                message: "_Id Missing",
               
            })
        }
    }

    else if (method === "DELETE"){
        if (req.query?.id) {
            await Shop.deleteOne(req.query?.id);
        
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