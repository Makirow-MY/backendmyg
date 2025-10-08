
import { mongooseConnect } from "@/lib/mongoose";
import cloudinary  from "cloudinary";
import multiparty from "multiparty";

cloudinary.v2.config({
    cloud_name: "dyf21ulbr",
    api_key: "918656153585713",
    api_secret: "sEEFhHhCrldL5WDEkLsyJOiw_LY"
});


export default cloudinary;
// export default async function handle(req, res) {
//      await mongooseConnect();

//      const form = new multiparty.Form();
//      const {fields, files} = await new Promise((resolve, reject) =>{
//         form.parse(req, (err, fields, files) => {
//             if (err)  reject(err);          
//             resolve({fields, files})
           
//         })
//      });

//     console.log("$$$$$$$$$$$$ files $$$$$$$$$$$", files);
//     let links = [];
//      for (const file of files.file) {
//         const result = await cloudinary.v2.uploader.upload(
//             file.path, {
//                 folder: 'myportfolio',
//                 public_id: `file_${Date.now()}`,
//                 resource_type: 'auto'
//             }

//         );

//         const link = result.secure_url;
//         links.push(link);

//        console.log("{links ====== link}", {links ,link});
        
//      }

//     console.log("%%%%%%%%%%%% FIINAL Link", links)
//      return res.json({links})
// }

// export const config = {
//     api:{
//         bodyParser: false,
//     }
// }
