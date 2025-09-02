import Head from "next/head";
import { Bar, Pie, Line } from 'react-chartjs-2';
import Loading from "@/components/Loading";
import { IoHomeOutline } from "react-icons/io5";
import { BarChart } from "lucide-react";
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale } from "chart.js";
import React, { useEffect, useState } from "react";
import LoginLayout from "@/components/LoginLayout";


 function Home() {

  ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale);

  const [blogData, setBlogData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [photoData, setPhotoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await fetch('/api/blogs'); // Adjust the endpoint as necessary
        const responseProj = await fetch('/api/projects'); 
        const responseProd = await fetch('/api/shops'); 
        const responsePhoto = await fetch('/api/photos'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const dataproj = await responseProj.json();
        const dataphoto = await responsePhoto.json();
       // console.log("++++++++ data.data ++++++++", data.data, data.projectData);
        const dataprod = await responseProd.json();
        
        setProductData(dataprod.data)
        setPhotoData(dataphoto.data)
        setBlogData(data.data);
        setProjectData(dataproj.data)
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //setBlogData(datalist[0]);

 // console.log(" monthlyData blogData", blogData);

  const monthlyData = blogData.filter(dat => dat.status === 'publish').reduce((acc, blog) => {
    const year = new Date(blog.createdAt).getFullYear();
    const month = new Date(blog.createdAt).getMonth();
    const week = new Date(blog.createdAt).getDay();
    acc[year] = acc[year] || Array(12).fill(0);
    acc[year][month]++;
    return acc;
  }, {});

  const weeklyData = blogData.filter(dat => dat.status === 'publish').reduce((acc, blog) => {
    const week = new Date(blog.createdAt).getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const month = new Date(blog.createdAt).getMonth();
    acc[month] = acc[month] || Array(12).fill(0);
  //  console.log("week", daysOfWeek[week])
    daysOfWeek[week];
    acc[month][week]++;
    return acc;
  }, {});

 // console.log("weeklyData", weeklyData)

  const currentYear = new Date().getFullYear();
  const years = Object.keys(monthlyData);
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dataSets = years.map(year => ({
    label: `${year}`,
    data: monthlyData[year] || Array(12).fill(0),
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},0.5)`
  }));

  const data = {
    labels,
    datasets: dataSets // Corrected from 'dataSets' to 'datasets'
  };
  const [likeCounts, setLikeCounts] = useState({});
  useEffect(() => {
    const countLikes = () => {
      const counts = {};

      blogData.forEach(blogs => {
        blogs.blogcategory.forEach(like => {
          counts[like] = (counts[like] || 0) + 1; // Increment the count for each like
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
<div className="dashboard">
<div className="titledashboard flex flex-sb">
               <div>
                 <h2>Admin <span>Dashboard</span></h2> 
               <h3>ADMIN PANEL</h3>
               </div>
                   
                   <div className="breadcrumb">
                        <IoHomeOutline /> <span>/</span><span>Dashboard</span>
                   </div>
        </div>

        <div className="topfourcards flex flex-sb">
                     <div className="four_card">
                     <h2>Total Blogs</h2>
                     <span>{blogData.filter(data => data.status === 'publish').length}</span>
                     </div>
                     <div className="four_card">
                     <h2>Total Projects</h2>
                     <span>{projectData.filter(data => data.status === 'publish').length}</span>
                     </div>
                     <div className="four_card">
                     <h2>Total Products</h2>
                     <span>{productData.filter(data => data.status === 'publish').length}</span>
                     </div>
                     <div className="four_card">
                     <h2>Gallery  Photos</h2>
                     <span>{photoData.length}</span>
                     </div>
        </div>

        <div className="year_overview flex flex-sb">
                   <div className="leftyearoverview">
                <div className="flex flex-sb">
                        <h3>Year Overview</h3>
                        <ul className="creative-dots">
                             <li className="big-dot"></li>
                             <li className="semi-big-dot"></li>
                             <li className="medium-dot"></li>
                             <li className="semi-medium-dot"></li>
                             <li className="semi-small-dot"></li>
                             <li className="small-dot"></li>
                        </ul>
                        <h3 className="text-right">10 / 365 <br />
                        <span>Total Published   </span>
                        </h3>
                </div>
                <Bar data={data} options={options} />
                   </div>

                   <div className="right_salescont">
         <div>
          <h3>Blogs By Category</h3>
          <ul className="creative-dots">
                     <li className="big-dot"></li>
                             <li className="semi-big-dot"></li>
                             <li className="medium-dot"></li>
                             <li className="semi-medium-dot"></li>
                             <li className="semi-small-dot"></li>
                             <li className="small-dot"></li>
          </ul>
         </div>
         <div className="blogscategory flex flex-center overflow-y-scroll" style={{
          overflowY: "auto"
         }} >
            <table>
              <thead>
                  <tr>
                     <td>Categories</td>
                     <td>Total
</td>
                  </tr>

 
{Object.entries(likeCounts).map(([technology, count]) => (
            <tr key={technology}>
              <td>{technology}</td>
              <td>{count} person{count !== 1 ? 's' : ''}</td>
            </tr>
          ))}
                 
                  
              </thead>
            </table>
         </div>
                   </div>
        </div>
</div>
       


      </>
</LoginLayout>
  );



}

export default Home
