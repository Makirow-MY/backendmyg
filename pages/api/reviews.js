import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

export default async function handle(req, res) {
  const { method } = req;
 const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use env if needed
 
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
    if(method === 'POST') {
      const {
    projectId,
    projectTitle,
    projectSlug,
    name,
    email = 'makiayengue@gmail.com',
    role = '',
    company = 'MYG Tech',
    website = '/',
    message,
    rating = '⭐⭐⭐⭐⭐',
    image,
    consent = true
  } = req.body;

  if (!projectId || !name || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const reviewId = uuidv4();
    const finalImage = image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
console.log(req.body)
 const [project] = await sql`SELECT * FROM projects WHERE id = ${projectId}`;
          if (!project) {
            return res.status(404).json({ message: " No Project Found " });
          }
    await sql`
      INSERT INTO reviews (
        id, name, image, email, message, role, website, company,
        project_id, project_name, project_slug, rating, consent,
        createdat, updatedat
      ) VALUES (
        ${reviewId},
        ${name},
        ${finalImage},
        ${email},  
        ${message},
        ${role},
        ${website},
        ${company},
        ${projectId},
        ${projectTitle},
        ${projectSlug},
        ${rating},
        ${consent},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
    `;

 const updatedReviews = [...(project.review || []), reviewId];
         
            await sql`
            UPDATE projects
            SET review = ${JSON.stringify(updatedReviews)},
                updatedat = CURRENT_TIMESTAMP
            WHERE id = ${projectId}
          `;
    return res.json({ success: true, message: 'Review added by admin' });
  } catch (error) {
    console.error('Admin review error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add review' });
  }
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