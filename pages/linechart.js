// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { 
//   Chart as ChartJS, 
//   CategoryScale, 
//   LinearScale, 
//   PointElement, 
//   LineElement, 
//   Title, 
//   Tooltip, 
//   Legend,
//   Filler
// } from 'chart.js';
// import axios from 'axios';
// import Spinner from '@/components/Spinner';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const centerTotalPlugin1 = {
//   id: 'UserTotal',
//   beforeDraw(chart) {
//     const { ctx, chartArea: { width, height } } = chart;
//     const centerX = width / 2;
//     const centerY = height / 2;
//     const total = chart.data.datasets[0]?.centerTotal || 0;

//     ctx.save();
    
//     // Dynamic font sizing based on chart size
//     const fontSize = Math.min(width, height) * 0.2;
//     const labelFontSize = fontSize * 0.4;

//     // Draw total number
//     ctx.font = `bold ${fontSize}px Inter, sans-serif`;
//     ctx.fillStyle = 'rgb(4, 182, 129)';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(total.toString() > 9 ? total.toString() : 0+total.toString() , centerX, centerY - labelFontSize/2);

//     // Draw label
//     ctx.font = `bold ${labelFontSize}px Inter, sans-serif`;
//     ctx.fillStyle = 'rgb(4, 182, 129)';
//     ctx.fillText('VISITORS', centerX, centerY + labelFontSize);
    
//     ctx.restore();
//   }

// };

// ChartJS.register(centerTotalPlugin1);

// const AnalyticsChart = () => {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//    const [rad, setrad] = useState(250);
//  const randomColor = (opacity) => {
//     const r = Math.floor(Math.random() * 240);
//     const g = Math.floor(Math.random() * 230);
//     const b = Math.floor(Math.random() * 220);
//     return `rgba(${r},${g},${b},${opacity})`;
//   };
//   const baseBrightness = 150;
//   // Fixed colors for consistency (random colors change on each render which isn't ideal)
//   const colors = {
//     reviews: {
//       border: `rgba(${Math.max(Math.floor(Math.random() * 200), baseBrightness)}, 0, ${Math.max(Math.floor(Math.random() * 200), baseBrightness)}, ${0.5})`, // purple
//       fill:  `rgba(${Math.max(Math.floor(Math.random() * 200), baseBrightness)}, 0, ${Math.max(Math.floor(Math.random() * 200), baseBrightness)},${0.1})`,
//     },
//     comments: {
//       border:  `rgba(0, ${Math.max(Math.floor(Math.random() * 200), baseBrightness)}, ${Math.max(Math.floor(Math.random() * 200), baseBrightness)}, ${0.5})`,// purple
//       fill: `rgba(0, ${Math.max(Math.floor(Math.random() * 200), baseBrightness)}, ${Math.max(Math.floor(Math.random() * 200), baseBrightness)}, ${0.1})`,
//     },
//     contacts: {
//        border:  `rgba( ${Math.max(Math.floor(Math.random() * 200), baseBrightness)}, ${Math.max(Math.floor(Math.random() * 200), baseBrightness)},  0, ${0.5})`,// purple
//       fill: `rgba(${Math.max(Math.floor(Math.random() * 200), baseBrightness)}, ${Math.max(Math.floor(Math.random() * 200), baseBrightness)},  0, ${0.1})`,
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Fetch all data in parallel
//         const [reviewsRes, commentsRes, contactsRes, blogRes] = await Promise.all([
//           axios.get('/api/reviews'),
//           axios.get('/api/comment'),
//           axios.get('/api/contacts'),
//           axios.get('/api/blogs')
//         ]);

//         // Process data - assuming each response has a 'data' array with items containing createdAt
//         const reviews = reviewsRes.data;
//         const comments = commentsRes.data;
//         const contacts = contactsRes.data.data;
//         const blog = blogRes.data.data 
      
//         // Group data by month
//         const groupedData = groupDataByMonth(reviews, comments, contacts);
// setrad(Math.floor(Math.random() * 250))
//         setChartData({
//           labels: groupedData.months,
//           datasets: [
//             {
//               label: 'Reviews',
//               data: groupedData.reviews,
//               borderColor: colors.reviews.border,
//               backgroundColor: colors.reviews.fill,
//               tension: 0.3,
//               fill: true,
//               pointBackgroundColor: colors.reviews.border,
//               pointRadius: 4,
//               pointHoverRadius: 6,
//               borderWidth: 2
//             },
//             {
//               label: 'Comments',
//               data: groupedData.comments,
//               borderColor: colors.comments.border,
//               backgroundColor: colors.comments.fill,
//               tension: 0.3,
//               fill: true,
//               pointBackgroundColor: colors.comments.border,
//               pointRadius: 4,
//               pointHoverRadius: 6,
//               borderWidth: 2
//             },
//             {
//               label: 'Contacts',
//               data: groupedData.contacts,
//               borderColor: colors.contacts.border,
//               backgroundColor: colors.contacts.fill,
//               tension: 0.3,
//               fill: true,
//               pointBackgroundColor: colors.contacts.border,
//               pointRadius: 4,
//               pointHoverRadius: 6,
//               borderWidth: 2
//             }
//           ]
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching chart data:', err);
//         setError('Failed to load analytics data. Please try again later.');
//         setLoading(false);
//       }
//     };

//     fetchData();

//     // Set up polling for real-time updates (every 5 minutes)
//     const intervalId = setInterval(fetchData,  10 * 1000);
    
//     return () => clearInterval(intervalId);
//   }, []);

//   // Helper function to group data by month
//   const groupDataByMonth = (reviews, comments, contacts) => {
//     // Get current year
//     const currentYear = new Date().getFullYear();
//     // Initialize monthly counters for each type
//     const monthlyCounts = {
//       reviews: Array(12).fill(0),
//       comments: Array(12).fill(0),
//       contacts: Array(12).fill(0)
//     };

//     // Process reviews
//     reviews.forEach(review => {
//       if (review.createdAt) {
//         const date = new Date(review.createdAt);
//         if (date.getFullYear() === currentYear) {
//           monthlyCounts.reviews[date.getMonth()]++;
//         }
//       }
//     });

//     // Process comments
//     comments.forEach(comment => {
//       if (comment.createdAt) {
//         const date = new Date(comment.createdAt);
//         if (date.getFullYear() === currentYear) {
//           monthlyCounts.comments[date.getMonth()]++;
//         }
//       }
//     });

//     // Process contacts
//     contacts.forEach(contact => {
//       if (contact.createdAt) {
//         const date = new Date(contact.createdAt);
//         if (date.getFullYear() === currentYear) {
//           monthlyCounts.contacts[date.getMonth()]++;
//         }
//       }
//     });

//     // Month names for labels
//     const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
//     // Get current month to only show up to current month
//     const currentMonth = new Date().getMonth();
//     const displayMonths = monthNames.slice(0, currentMonth + 1);

//     return {
//       months: displayMonths,
//       reviews: monthlyCounts.reviews.slice(0, currentMonth + 1),
//       comments: monthlyCounts.comments.slice(0, currentMonth + 1),
//       contacts: monthlyCounts.contacts.slice(0, currentMonth + 1)
//     };
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           color: '#6b7280',
//           font: {
//             family: 'Inter, sans-serif',
//             size: 12,
//             weight: '600'
//           },
//           padding: 20,
//           usePointStyle: true,
//           pointStyle: 'circle'
//         },
//          onHover: function(e) {
//           e.native.target.style.cursor = 'pointer';
//         },
//         onLeave: function(e) {
//           e.native.target.style.cursor = 'default';
//         },
//       },
//       tooltip: {
//         backgroundColor: '#1f2937',
//         titleColor: '#f9fafb',
//         bodyColor: '#f9fafb',
//         borderColor: '#374151',
//         borderWidth: 1,
//         padding: 12,
//         usePointStyle: true,
//         callbacks: {
//           label: (context) => {
//             return `${context.dataset.label}: ${context.raw}`;
//           }
//         }
//       },
//       title: {
//         display: true,
//         text: 'User Engagement Analytics',
//         color: '#ffffff',
//         font: {
//           family: 'Inter, sans-serif',
//           size: 16,
//           weight: 'bold'
//         },
//         padding: {
//           bottom: 20
//         }
//       }
//     },
//     scales: {
//       x: {
//         grid: {
//           color: 'var(--sec-bgcolor)',
//           drawBorder: false,
//           drawTicks: true,
//           tickLength: 6,
//           tickColor: 'rgba(209, 213, 219, 0.5)'
//         },
//         ticks: {
//           color: '#6b7280',
//           font: {
//             size: 12
//           }
//         }
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'var(--sec-bgcolor)',
//           drawBorder: false,
//           drawTicks: true,
//           tickLength: 6,
//           tickColor: 'rgba(209, 213, 219, 0.5)',
//           borderDash: [5, 5]
//         },
//         ticks: {
//           color: '#6b7280',
//           callback: (value) => {
//             return Number.isInteger(value) ? value : '';
//           },
//           font: {
//             size: 12
//           }
//         }
//       }
//     },
//     elements: {
//       line: {
//         borderWidth: 0.5
//       },
//       point: {
//         hoverRadius: 8
//       }
//     },
//     interaction: {
//       intersect: false,
//       mode: 'index'
//     }
//   };

//   return (
//     <div className="chart-box" style={{ 
//       height: '400px', 
//       width: '100%',
//       padding: '20px',
//       position: 'relative'
//     }}>
//       {loading ? (
//         <Spinner />
//       ) : error ? (
//         <div className="error-message" style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           height: '100%',
//           color: '#ef4444',
//           fontWeight: '500'
//         }}>
//           {error}
//         </div>
//       ) : (
//         <>
//           <Line data={chartData} options={options} />
//           <div style={{
//             position: 'absolute',
//             bottom: '10px',
//             right: '20px',
//             fontSize: '12px',
//             color: '#9ca3af'
//           }}>
//             Updated: {new Date().toLocaleTimeString()}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AnalyticsChart;




import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import axios from 'axios';
import Spinner from '@/components/Spinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Beautiful color palette
  const colors = {
    reviews: {
      border: 'rgba(101, 116, 205, 1)',
      fill: 'rgba(101, 116, 205, 0.1)'
    },
    comments: {
      border: 'rgba(246, 109, 155, 1)',
      fill: 'rgba(246, 109, 155, 0.1)'
    },
    contacts: {
      border: 'rgba(254, 174, 67, 1)',
      fill: 'rgba(254, 174, 67, 0.1)'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [reviewsRes, commentsRes, contactsRes] = await Promise.all([
          axios.get('/api/reviews'),
          axios.get('/api/comment'),
          axios.get('/api/contacts')
        ]);

        const reviews = reviewsRes.data;
        const comments = commentsRes.data;
        const contacts = contactsRes.data.data;

        // Group data by day for the last 14 days
        const groupedData = groupDataByDay(reviews, comments, contacts);

        setChartData({
          labels: groupedData.days,
          datasets: [
            {
              label: 'Reviews',
              data: groupedData.reviews,
              borderColor: colors.reviews.border,
              backgroundColor: colors.reviews.fill,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: colors.reviews.border,
              pointRadius: 4,
              pointHoverRadius: 8,
              borderWidth: 3,
              pointHoverBorderWidth: 2,
              pointHoverBorderColor: '#fff'
            },
            {
              label: 'Comments',
              data: groupedData.comments,
              borderColor: colors.comments.border,
              backgroundColor: colors.comments.fill,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: colors.comments.border,
              pointRadius: 4,
              pointHoverRadius: 8,
              borderWidth: 3,
              pointHoverBorderWidth: 2,
              pointHoverBorderColor: '#fff'
            },
            {
              label: 'Contacts',
              data: groupedData.contacts,
              borderColor: colors.contacts.border,
              backgroundColor: colors.contacts.fill,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: colors.contacts.border,
              pointRadius: 4,
              pointHoverRadius: 8,
              borderWidth: 3,
              pointHoverBorderWidth: 2,
              pointHoverBorderColor: '#fff'
            }
          ]
        });

        setLoading(false);
      } catch (err) {
        console.log('Error fetching chart data:', err);
        setError('Failed to load analytics data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling for real-time updates (every 5 minutes)
    const intervalId = setInterval(fetchData, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Helper function to group data by day for the last 14 days
  const groupDataByDay = (reviews, comments, contacts) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize array for the last 14 days
    const days = [];
    const dayCounts = {
      reviews: Array(14).fill(0),
      comments: Array(14).fill(0),
      contacts: Array(14).fill(0)
    };

    // Generate labels for the last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = dayNames[date.getDay()];
      const dayNum = date.getDate();
      const monthName = monthNames[date.getMonth()];
      days.push(`${dayName} ${dayNum} ${monthName}`);
    }

    // Process reviews
    reviews.forEach(review => {
      if (review.createdAt) {
        const reviewDate = new Date(review.createdAt);
        const today = new Date();
        const diffTime = today - reviewDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays < 14) {
          dayCounts.reviews[13 - diffDays]++;
        }
      }
    });

    // Process comments
    comments.forEach(comment => {
      if (comment.createdAt) {
        const commentDate = new Date(comment.createdAt);
        const today = new Date();
        const diffTime = today - commentDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays < 14) {
          dayCounts.comments[13 - diffDays]++;
        }
      }
    });

    // Process contacts
    contacts.forEach(contact => {
      if (contact.createdAt) {
        const contactDate = new Date(contact.createdAt);
        const today = new Date();
        const diffTime = today - contactDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays < 14) {
          dayCounts.contacts[13 - diffDays]++;
        }
      }
    });

    return {
      days,
      reviews: dayCounts.reviews,
      comments: dayCounts.comments,
      contacts: dayCounts.contacts
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
      delay: (context) => {
        if (context.type === 'data') {
          return context.dataIndex * 100;
        }
        return 0;
      },
      loop: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6b7280',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: '600'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        },
        onHover: function(e) {
          e.native.target.style.cursor = 'pointer';
        },
        onLeave: function(e) {
          e.native.target.style.cursor = 'default';
        },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}`;
          },
          title: (context) => {
            return context[0].label;
          }
        }
      },
      title: {
        display: true,
        text: '14-Day Visitors Engagement Analytics',
        color: '#ffffff',
        font: {
          family: 'Inter, sans-serif',
          size: 18,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(229, 231, 235, 0.1)',
          drawBorder: false,
          drawTicks: true,
          tickLength: 6,
          tickColor: 'rgba(209, 213, 219, 0.1)'
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.1)',          
          drawBorder: false,
          drawTicks: true,
          tickLength: 6,
          tickColor: 'rgba(209, 213, 219, 0.1)',
          borderDash: [5, 5]
        },
        ticks: {
          color: '#6b7280',
          callback: (value) => {
            return Number.isInteger(value) ? value : '';
          },
          font: {
            size: 12
          },
          padding: 10
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3
      },
      point: {
        hoverRadius: 8,
        hoverBorderWidth: 2
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="chart-container" style={{ 
      height: '450px', 
      width: '100%',
      padding: '20px',
      position: 'relative',
     
    }}>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}>
          <Spinner />
        </div>
      ) : error ? (
        <div className="error-message" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#ef4444',
          fontWeight: '500'
        }}>
          {error}
        </div>
      ) : (
        <>
          <Line 
            data={chartData} 
            options={options} 
            style={{
              animation: 'fadeIn 1s ease-in-out'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '20px',
            fontSize: '12px',
            color: '#9ca3af',
            fontFamily: 'Inter, sans-serif'
          }}>
            Updated: {new Date().toLocaleTimeString()}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsChart;