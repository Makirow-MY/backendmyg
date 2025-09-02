const {Schema, models, model}  = require('mongoose')

const ProjectSchema = new Schema({
    title:{
        type: String
    },
    slug:{
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    client:  {
        type: String
    },
    description:{
        type: String,
    },
    projectcategory: { 
    type: String, 
    required: true,
    enum: ['Website Development', 'Mobile Development', 'Network Design', 'Video Editing', 'Graphic Design']
  },
    tags : [
        {
            type: String
        }
    ],
    livepreview:  {
        type: String
    },
    status: { type: String, enum: ['draft', 'publish'], default: 'draft' },
       price:  {
        type: Number
    },
    review: [{
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }],
         projectType: { 
    type: String, 
    enum: ['For Sale', 'Showcase'], 
    default: 'Showcase' 
  },
  
  technologies: [{ type: String }], // e.g., ["React", "Node.js", "MySQL", "5G"]
  features: [{ type: String }], // Key functionalities
  platforms: [{ type: String }], // ["Web", "iOS", "Android", "Cloud"]
  projectYear: { type: Number }, // Completion year
  repositoryUrl: { type: String }, // GitHub/GitLab link (if public)
  documentationUrl: { type: String }, // Technical docs
  isResponsive: { type: Boolean }, // For Web/UI projects
  licenseType: { type: String }, // MIT, GPL, Custom (if for sale)
  supportAvailable: { type: Boolean }, // For paid projects

},
    {
          timestamps: true
    }
);

export const Project = models.Project || model('Project', ProjectSchema, 'projects');

