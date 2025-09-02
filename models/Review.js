import { Schema, models, model } from 'mongoose';

const ReviewSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  email: { type: String },
  message: { type: String },
  role: { type: String },
  website: { type: String },
  company: { type: String },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  projectName: { type: String },
  projectSlug: { type: String },
  rating: { type: String, default: '⭐⭐⭐⭐⭐' },
  consent: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Review = models.Review || model('Review', ReviewSchema, 'testimonials');