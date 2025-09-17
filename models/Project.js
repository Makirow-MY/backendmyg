const { Schema, models, model } = require('mongoose');
const ProjectSchema = new Schema({
    _id: { type: String },
    title: { type: String },
    slug: { type: String, required: true },
    images: [{ type: String }],
    client: { type: String },
    description: { type: String },
    projectcategory: {
        type: String,
        required: true,
        enum: ['Graphic & UI/UX Design', 'Website Development', 'Mobile Development', 'Network Design', 'Video Editing']
    },
    tags: [{ type: String }],
    livepreview: { type: String },
    status: { type: String, enum: ['draft', 'publish'], default: 'draft' },
    price: { type: Number },
    review: [{
        type: Schema.Types.String, // Changed to String to match UUID
        ref: 'Review'
    }],
    projectType: {
        type: String,
        enum: ['For Sale', 'Showcase'],
        default: 'Showcase'
    },
    technologies: [{ type: String }],
    features: [{ type: String }],
    platforms: [{ type: String }],
    projectYear: { type: Number },
    repositoryUrl: { type: String },
    documentationUrl: { type: String },
    isResponsive: { type: Boolean },
    licenseType: { type: String },
    supportAvailable: { type: Boolean },
}, {
    timestamps: true,
    strict: false // Allow dynamic category-specific fields
});
export const Project = models.Project || model('Project', ProjectSchema, 'projects');