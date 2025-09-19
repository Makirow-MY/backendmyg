import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Spinner from '@/components/Spinner';

const StarRating = ({ rating }) => {
  const stars = [];
  const numericRating = typeof rating === 'string' ? rating.length : rating;

  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= numericRating ? 
      <IoStar key={i} /> : 
      <IoStarOutline key={i}  />
    );
  }

  return <div className="starRating">{stars}</div>;
};

const ProjectCategoryStats = () => {
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, projectRes] = await Promise.all([
          axios.get('/api/reviews'),
          axios.get('/api/projects'),
        ]);

        setReviews(reviewsRes.data);
        setProjects(projectRes.data.data.filter(project => project.status === 'publish'));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Process data to get category statistics
  const getCategoryStats = () => {
    const categoryMap = {};

    // Group projects by their first category
    projects.forEach(project => {
      if (project.projectcategory) {
        const firstCategory = project.projectcategory;
        
        if (!categoryMap[firstCategory]) {
          categoryMap[firstCategory] = {
            projects: [],
            reviewCount: 0,
            totalRating: 0
          };
        }
        
        categoryMap[firstCategory].projects.push(project._id);
      }
    });

    // Calculate review count and ratings for each category
    reviews.forEach(review => {
      for (const category in categoryMap) {
        if (categoryMap[category].projects.includes(review.project)) {
          categoryMap[category].reviewCount += 1;
          categoryMap[category].totalRating += review.rating.length;
        }
      }
    });

    // Convert to array and calculate average rating
    return Object.keys(categoryMap).map(category => {
      const avgRating = categoryMap[category].reviewCount > 0
        ? categoryMap[category].totalRating / categoryMap[category].reviewCount
        : 0;

      return {
        category,
        reviewCount: categoryMap[category].reviewCount,
        averageRating: avgRating
      };
    }).sort((a, b) => b.reviewCount - a.reviewCount); // Sort by review count descending
  };

  const categoryStats = getCategoryStats();

  return (
    <div >
      <h3 >Project Category Performance</h3>
      
      <div className="overflow-x-auto">
        <table className="visit">
          <thead className="bg-gray-50">
            <tr>
              <th >
                Category
              </th>
              <th >
                Total Reviews
              </th>
              <th >
                Average Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            { loading &&
              <div className="text-center py-4"><Spinner/></div>
            }
            {
              !loading && categoryStats.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-2 whitespace-nowrap text-sm text-center text-gray-500">
                      No categories with reviews found.
                      </td>
                      </tr>)
            }
            { !loading &&  categoryStats.length > 0 && categoryStats.map((stat, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stat.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {stat.reviewCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <StarRating rating={stat.averageRating} />
                    <span className="ml-2 text-sm text-gray-500">
                      ({stat.averageRating.toFixed(1)})
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectCategoryStats;