const { Schema, models, model } = require('mongoose');
const CommentSchema = new Schema({
    _id: { type: String },
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String },
    title: { type: String },
    contentPera: { type: String },
    mainComment: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    blog: { type: Schema.Types.String, ref: 'Blog' },
    blogTitle: { type: String },
    parent: { type: Schema.Types.String, ref: 'Comment' },
    children: [{ type: Schema.Types.String, ref: 'Comment' }],
    parentName: { type: String },
    parentImage: { type: String },
}, {
    timestamps: true,
    strict: false
});
export const Comment = models.Comment || model('Comment', CommentSchema, 'comments');