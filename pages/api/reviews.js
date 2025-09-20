import { neon } from '@neondatabase/serverless';


const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed

export default async function handle(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      if (req.query?.id) {
        // Fetch single review by id
        const [review] = await sql`SELECT * FROM reviews WHERE id = ${req.query.id}`;
        if (!review) {
          return res.status(404).json({
            success: false,
            message: "Review not found"
          });
        }
        return res.json({
          success: true,
          data: {
            _id: review.id,
            name: review.name,
            image: review.image,
            email: review.email,
            message: review.message,
            role: review.role,
            website: review.website,
            company: review.company,
            project: review.project_id,
            projectName: review.project_name,
            projectSlug: review.project_slug,
            rating: review.rating,
            consent: review.consent,
            createdAt: review.createdat,
            updatedAt: review.updatedat
          }
        });
      }

      // Fetch all reviews
      const reviews = await sql`SELECT * FROM reviews ORDER BY createdat DESC`;
      let deletedCount = 0;

      // Check and delete reviews with invalid project_id
      for (const review of reviews) {
        try {
          const [project] = await sql`SELECT id FROM projects WHERE id = ${review.project_id}`;
          if (!project) {
            await sql`DELETE FROM reviews WHERE id = ${review.id}`;
            deletedCount++;
          }
        } catch (neonError) {
          // Silently continue to next review
        }
      }

      // Fetch updated reviews
      const updatedReviews = await sql`
        SELECT * FROM reviews ORDER BY createdat DESC
      `;
      const mappedReviews = updatedReviews.map(review => ({
        _id: review.id,
        name: review.name,
        image: review.image,
        email: review.email,
        message: review.message,
        role: review.role,
        website: review.website,
        company: review.company,
        project: review.project_id,
        projectName: review.project_name,
        projectSlug: review.project_slug,
        rating: review.rating,
        consent: review.consent,
        createdAt: review.createdat,
        updatedAt: review.updatedat
      }));
 console.log("updatedComments",mappedReviews, "mappedReviews");
      return res.json(mappedReviews);
    }

    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}