const { Schema, models, model } = require('mongoose');
const BlogSchema = new Schema({
    _id: { type: String },
    title: { type: String },
    slug: { type: String, required: true },
    images: [{ type: String,
        default: "https://picsum.photos/1920/1080?random=400"
     }],
    description: { type: String },
    blogcategory: { type: String }, // Changed to single String to match usage
    tags: [{ type: String }],
    status: { type: String },
    comments: [{
        type: Schema.Types.String, // Changed to String for UUID compatibility
        ref: 'Comment'
    }],
}, {
    timestamps: true,
    strict: false
});
export const Blog = models.Blog || model('Blog', BlogSchema, 'blogs');