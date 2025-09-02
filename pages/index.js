import { useEffect, useState } from "react";
import Header from "../components/Header";
import Aside from "../components/Aside";
import { IoHomeOutline } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaBloggerB } from "react-icons/fa";
import { FiFileText, FiFolder, FiPackage, FiUsers } from "react-icons/fi";
import axios from "axios";
import AnalyticsChart from "./linechart";
import ProjectCategoryPieChart from "./piechart";
import UserTable from "./UserTable";
import ProjectCategoryStats from "./visitorRating";
import Link from "next/link";
import Head from "next/head";
import LoginLayout from "@/components/LoginLayout";
import { useSearch } from "../components/search";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { search, setSearch } = useSearch();
  const [reviewData, setReviewData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [allVisitors, setAllVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCounts, setLikeCounts] = useState({});

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Blogs Created Monthly by Year'
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/reviews');
        const responseProj = await axios.get('/api/blogs');
        
        setBlogData(responseProj.data.data);
        setReviewData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const monthlyData = reviewData.reduce((acc, review) => {
    const year = new Date(review.createdAt).getFullYear();
    const month = new Date(review.createdAt).getMonth();
    const week = new Date(review.createdAt).getDay();
    acc[year] = acc[year] || Array(12).fill(0);
    acc[year][month]++;
    return acc;
  }, {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, commentsRes, contactsRes, projectsRes] = await Promise.all([
          axios.get('/api/reviews'),
          axios.get('/api/comment'),
          axios.get('/api/contacts'),
          axios.get('/api/projects'),
        ]);
        
        const projects = projectsRes.data.data;
        const reviews = reviewsRes.data;
        const comments = commentsRes.data;
        const contacts = contactsRes.data.data;

        const combinedData = [
          ...reviews.map(review => ({
            id: review._id,
            name: review.name,
            email: review.email,
            createdAt: new Date(review.createdAt),
            status: 'Testified',
            image: review.image,
            type: 'review',
            detailUrl: `/reviews/view/${review._id}`
          })),
          
          ...comments.map(comment => ({
            id: comment._id,
            name: comment.name,
            email: comment.email,
            createdAt: new Date(comment.createdAt),
            status: 'Commented',
            image: comment.image,
            type: 'comment',
            detailUrl: `/comments/view/${comment._id}`
          })),
          
          ...contacts.map(contact => ({
            id: contact._id,
            name: `${contact.clientInfo.firstName} ${contact.clientInfo.lastName || ''}`.trim(),
            email: contact.clientInfo.email,
            createdAt: new Date(contact.createdAt),
            status: 'Contacted',
            image: contact.clientInfo.profilePicture || null,
            type: 'contact',
            detailUrl: `/contacts/view/${contact._id}`
          }))
        ];

        combinedData.sort((a, b) => b.createdAt - a.createdAt);
        setAllVisitors(combinedData);
        setProjectData(projects);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Object.keys(monthlyData);
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dataSets = years.map(year => ({
    label: `${year}`,
    data: monthlyData[year] || Array(12).fill(0),
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)},0.5)`
  }));

  const data = {
    labels,
    datasets: dataSets
  };

  useEffect(() => {
    const countLikes = () => {
      const counts = {};
      blogData.forEach(blog => {
        blog.blogcategory.forEach(category => {
          counts[category] = (counts[category] || 0) + 1;
        });
      });
      setLikeCounts(counts);
    };

    if (blogData.length > 0) {
      countLikes();
    }
  }, [blogData]);

  return (
    <LoginLayout>
      <>
        <Head>
          <title>Portfolio Backend</title>
          <meta name="description" content="Blog website backend" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <div>
          {search === '' && (
            <>
              <div className="dashboard-header">
                <div>
                  <h2><span>Dashboard</span></h2>
                  <p>Managing website</p>
                </div>
              </div>
              <div className="cards">
                <div className="card">
                  <FiFolder className="text-lg" />
                  <div className="sub"><h3>Total Projects</h3><span>{projectData.length <= 9 ? '0'+projectData.length : projectData.length}</span></div>
                </div>
                <div className="card">
                  <FiUsers className="text-lg" />
                  <div className="sub"><h3>Total Visitors</h3><span>{allVisitors.length > 9 ? allVisitors.length : '0'+allVisitors.length}</span></div>
                </div>
                <div className="card">
                  <FiFileText className="text-lg" />
                  <div className="sub"><h3>Total Blogs</h3><span>{blogData.length <= 9 ? '0'+blogData.length : blogData.length}</span></div>
                </div>
                <div className="card">
                  <FiPackage className="text-lg" />
                  <div className="sub"><h3>Total Products</h3><span>{projectData.filter(ab => ab.status === 'publish' && ab.projectType === 'For Sale' ).length <= 9 ? '0'+projectData.filter(ab => ab.status === 'publish' && ab.projectType === 'For Sale' ).length : projectData.filter(ab => ab.status === 'publish' && ab.projectType === 'For Sale' ).length}</span></div>
                </div>
              </div>
              <div className="overview">
                <div className="chart-box">
                  <AnalyticsChart />
                  <ProjectCategoryStats/>
                </div>
                <div className="category-box">
                  <h3>Blog Comment Analytics</h3>
                  <div>
                    <ProjectCategoryPieChart/>
                  </div>
                  <h3>Blogs By Category</h3>
                  <table>
                    <thead>
                      <tr><th>Category</th><th>Total</th></tr>
                    </thead>
                    <tbody>
                      {Object.entries(likeCounts).map(([category, count]) => (
                        <tr key={category}>
                          <td>{category}</td>
                          <td>{count > 9 ? count : '0'+count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          <div className="chart-box" style={{marginTop: '1rem'}}> 
            <div className="flex flex-sb">
              <h3>Recent Visitors</h3>
              <Link href={`/visitors`}><button>Show All</button></Link>
            </div>
            <UserTable search={search}/>
          </div>
        </div>
      </>
    </LoginLayout>
  );
}