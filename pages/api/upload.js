import { mongooseConnect } from "@/lib/mongoose";
import { Project } from "@/models/Project";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Blog } from "@/models/Blog";

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDirs = [
            'public/uploads',
            
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
        bodyParser: false,
    },
};

export default async function handleproj(req, res) {
    await mongooseConnect();
    const { method } = req;

    // Handle file uploads
    if (method === 'POST') {
        return new Promise((resolve) => {
            upload(req, res, async (err) => {
                if (err) {
                    console.error('Upload error:', err);
                    
                    // Clean up any partially uploaded files
                    if (req.files && req.files.length > 0) {
                        req.files.forEach(file => {
                            try {
                                fs.unlinkSync(file.path);
                                // const frontendPath = path.join('../FRONTEND/public/uploads', file.filename);
                                // if (fs.existsSync(frontendPath)) {
                                //     fs.unlinkSync(frontendPath);
                                // }
                            } catch (cleanupErr) {
                                console.error('Error cleaning up file:', cleanupErr);
                            }
                        });
                    }
                    
                    let errorMessage = 'Upload failed';
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        errorMessage = 'File size too large (max 20MB)';
                    } else if (err.code === 'LIMIT_FILE_COUNT') {
                        errorMessage = 'Too many files (max 10)';
                    } else if (err.message.includes('Only images are allowed')) {
                        errorMessage = 'Only images are allowed (jpeg, jpg, png, gif)';
                    }
                    
                    return res.status(400).json({ 
                        success: false, 
                        error: errorMessage 
                    });
                }

                try {
                    if (!req.files || req.files.length === 0) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'No files were uploaded' 
                        });
                    }

                    // Copy files to frontend directory
                    // req.files.forEach(file => {
                    //     const frontendPath = path.join('../FRONTEND/public/uploads', file.filename);
                    //     fs.copyFileSync(file.path, frontendPath);
                    // });

                    // Return paths relative to backend public/uploads
                    const uploadedImages = req.files.map(file => {
                        return `/uploads/${file.filename}`;
                    });

                    res.status(200).json({ 
                        success: true, 
                        images: uploadedImages 
                    });
                } catch (error) {
                    console.error('Error processing upload:', error);
                    
                    // Clean up uploaded files on error (both locations)
                    req.files?.forEach(file => {
                        try {
                            fs.unlinkSync(file.path);
                            // const frontendPath = path.join('../FRONTEND/public/uploads', file.filename);
                            // if (fs.existsSync(frontendPath)) {
                            //     fs.unlinkSync(frontendPath);
                            // }
                        } catch (cleanupErr) {
                            console.error('Error cleaning up file:', cleanupErr);
                        }
                    });
                    
                    res.status(500).json({ 
                        success: false, 
                        error: 'Internal server error' 
                    });
                } finally {
                    resolve();
                }
            });
        });
    } 
    // Handle file deletion
    else if (method === 'DELETE') {
        try {
            const { imageUrl, id } = req.query;
           console.log("{ imageUrl, id }", { imageUrl, id })

           if (!id) {
             return res.status(404).json({                    
                    success: false, 
                    error: 'Project Id Is Missing' 
                });
           }
            if (!imageUrl) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Image URL is required' 
                });
            }

            const filename = path.basename(imageUrl);
            const backendPath = path.join(process.cwd(), 'public/uploads', filename);
           // const frontendPath = path.join(process.cwd(), '../FRONTEND/public/uploads', filename);

            // Delete from both locations
            let backendDeleted = false;
          //  let frontendDeleted = false;

            if (fs.existsSync(backendPath)) {
                fs.unlinkSync(backendPath);
                backendDeleted = true;
            }

            // if (fs.existsSync(frontendPath)) {
            //     fs.unlinkSync(frontendPath);
            //     frontendDeleted = true;
            // }

            if (!backendDeleted
                // && !frontendDeleted
                ) {
                const project = await Project.findById(id)
                const blog = await Blog.findById(id)
                if (project) {
                       project.images = [];
                project.save();
                console.log("project", project)
                }
                else if (blog)
                {
                 blog.images = [];
                 blog.save();
                console.log("project", blog)
                }
               
                
                return res.status(404).json({                    
                    success: false, 
                    error: 'File not found in either location' 
                });
            }

            return res.json({ 
                success: true,
                message: `File deleted ${backendDeleted ? 'from backend' : ''}${backendDeleted ? ' and ' : ''}`
            });
        } catch (error) {
            console.error('Error deleting image:', error);
            return res.status(500).json({ 
                success: false, 
                error: 'Error deleting image' 
            });
        }
    }
    // Handle other methods
    else {
        res.setHeader('Allow', ['POST', 'DELETE']);
        res.status(405).json({ 
            success: false, 
            error: `Method ${method} not allowed` 
        });
    }
}










// import { mongooseConnect } from "@/lib/mongoose";
// import cloudinary  from "cloudinary";
// import multiparty from "multiparty";

// cloudinary.v2.config({
//     cloud_name: "dtep5ehts",
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// export default async function handle(req, res) {
//      await mongooseConnect();

//      const form = new multiparty.Form();
//      const {fields, files} = await new Promise((resolve, reject) =>{
//         form.parse(req, (err, fields, files) => {
//             if (err)  reject(err);          
//             resolve({fields, files})
           
//         })
//      });

//    //  console.log("$$$$$$$$$$$$ files $$$$$$$$$$$", files);
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

//        // console.log("{links ====== link}", {links ,link});
        
//      }

//     // console.log("%%%%%%%%%%%% FIINAL Link", links)
//      return res.json({links})
// }

// export const config = {
//     api:{
//         bodyParser: false,
//     }
// }
