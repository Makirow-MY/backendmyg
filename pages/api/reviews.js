import { mongooseConnect } from "@/lib/mongoose";
import { Project } from "@/models/Project";
import { Review } from "@/models/Review";
import { ObjectId } from 'mongodb';

export default async function handle(req, res) {
    await mongooseConnect();
    const { method } = req;

    try {
        if (method === 'GET') {
            if (req.query?.id) {
                const review = await Review.findById(req.query.id);
                if (!review) {
                    return res.status(404).json({ 
                        success: false, 
                        message: "Review not found" 
                    });
                }
                return res.json({ 
                    success: true, 
                    data: review 
                });
            }

            const reviews = await Review.find().sort({ createdAt: -1 });
            reviews.forEach(async (review) => {
                  const getRecent = await Project.findById(review.project)
                  if (!getRecent) {
                     await Review.deleteOne({_id: review._id})
                  }
            })
             const UpdatedReviews = await Review.find().sort({ createdAt: -1 });
            return res.json(UpdatedReviews);
        }

        return res.status(405).json({ 
            success: false, 
            message: "Method not allowed" 
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error",
            error: error.message 
        });
    }
}