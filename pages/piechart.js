import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  Title
} from 'chart.js';
import axios from 'axios';
import Spinner from '@/components/Spinner';



ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectCategoryPieChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isEmptyData, setIsEmptyData] = useState(false);

  const generateCategoryColors = (categories) => {
    const colors = {};
    const baseHueStep = 360 / Math.max(categories.length, 1);
    
    const MIN_SATURATION = 95;
    const LIGHTNESS = 50;
    const MIN_HUE_DIFFERENCE = 60;
    const usedHues = new Set();

    categories.forEach((category, index) => {
      let hue;
      let attempts = 0;
      
      do {
        hue = (Math.floor(baseHueStep * index) + Math.floor(Math.random() * 30)) % 360;
        attempts++;
        
        if (attempts > 10) hue = (index * MIN_HUE_DIFFERENCE) % 360;
      } while (
        Array.from(usedHues).some(usedHue => 
          Math.min(Math.abs(hue - usedHue), 360 - Math.abs(hue - usedHue)) < MIN_HUE_DIFFERENCE
        ) && attempts < 20
      );

      usedHues.add(hue);

      colors[category] = {
        border: `hsla(${hue}, ${MIN_SATURATION}%, 45%, 0.9)`,
        fill: `hsla(${hue}, ${MIN_SATURATION}%, 60%, 0.7)`,
        highlight: `hsla(${(hue + 60) % 360}, 95%, 70%, 0.9)`,
        text: `hsla(${(hue + 180) % 360}, 95%, 20%, 1)`
      };
    });

    return colors;
  };

  const addShimmerEffect = (color) => {
    return {
      ...color,
      fill: color.fill.replace('0.7)', '0.8)'),
      border: color.border.replace('0.9)', '1)')
    };
  };

  const verifyReviews = async (reviewIds) => {
    try {
      const validReviews = await Promise.all(
        reviewIds.map(async (reviewId) => {
          try {
            const res = await axios.get(`/api/comment?id=${reviewId}`);
            return res.data.data ? reviewId : null;
          } catch (err) {
            return null;
          }
        })
      );
      return validReviews.filter(id => id !== null);
    } catch (err) {
      console.error('Error verifying reviews:', err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsEmptyData(false);
        
        const projectsRes = await axios.get('/api/blogs');
        const projects = projectsRes.data.data.filter(project => project.status === 'publish');

        // Check if any projects have comments
        const hasComments = projects.some(project => 
          project.comments && project.comments.length > 0
        );
     console.log('Projects:', hasComments);
        if (!hasComments) {
          setIsEmptyData(true);
          setLoading(false);
          return;
        }

        const processedProjects = await Promise.all(
          projects.map(async (project) => {
            const validReviewIds = project.comments && project.comments.length > 0 
              ? await verifyReviews(project.comments)
              : [];
            
            return {
              ...project,
              validReviewCount: validReviewIds.length,
              primaryCategory: project.blogcategory?.[0] || 'Uncategorized'
            };
          })
        );

        const categoryData = processedProjects.reduce((acc, project) => {
          const category = project.primaryCategory;
          if (!acc[category]) {
            acc[category] = {
              reviewCount: 0,
              projects: []
            };
          }
          acc[category].reviewCount += project.validReviewCount;
          acc[category].projects.push({
            title: project.title,
            reviewCount: project.validReviewCount,
            client: project.client
          });
          return acc;
        }, {});

        const categories = Object.keys(categoryData).sort((a, b) => 
          categoryData[b].reviewCount - categoryData[a].reviewCount
        );
        
        const categoryColors = generateCategoryColors(categories);

        setChartData({
          labels: categories,
          datasets: [
            {
              data: categories.map(cat => categoryData[cat].reviewCount),
              backgroundColor: categories.map(cat => categoryColors[cat].fill),
              borderColor: categories.map(cat => categoryColors[cat].border),
              hoverBackgroundColor: categories.map(cat => addShimmerEffect(categoryColors[cat]).fill),
              hoverBorderColor: categories.map(cat => addShimmerEffect(categoryColors[cat]).border),
              borderWidth: 2,
              borderAlign: 'inner',
              textColors: categories.map(cat => categoryColors[cat].text),
              projectDetails: categories.map(cat => categoryData[cat].projects)
            }
          ]
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project analytics. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();

    const rotationInterval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.5) % 360);
    }, 50);

    const refreshInterval = setInterval(fetchData, 30 * 60 * 1000);
    
    return () => {
      clearInterval(rotationInterval);
      clearInterval(refreshInterval);
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeOutQuart'
    },
    rotation: rotationAngle,
    cutout: '55%',
    borderRadius: 0,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#4b5563',
          font: {
            size: 14,
            weight: '600',
            lineHeight: 1.5
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          boxHeight: 10,
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                
                let percentage = 0;
                if (total > 0 && !isNaN(value)) {
                  percentage = Math.round((value / total) * 100);
                }
                
                const capitalizedLabel = typeof label === 'string' 
                  ? label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()
                  : String(label);
                
                const displayLabel = capitalizedLabel.split(' ')[0];
                
                return {
                  text: `${displayLabel} ${percentage}%`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: 1,
                  fontColor: '#6b7280',
                  index: i
                };
              });
            }
            return [];
          }
        },
        onClick: (e, legendItem, legend) => {
          const chart = legend.chart;
          const meta = chart.getDatasetMeta(0);
          const item = meta.data[legendItem.index];
          item.hidden = !item.hidden;
          chart.update();
        },
        onHover: function(e) {
          e.native.target.style.cursor = 'pointer';
        },
        onLeave: function(e) {
          e.native.target.style.cursor = 'default';
        },
      },
      tooltip: {
        enabled: true,
        position: 'nearest',
        backgroundColor: '#1f2937',
        titleColor: '#e2e8f0',
        bodyColor: '#f8fafc',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 16,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
        callbacks: {
          labelColor: (context) => {
            return {
              borderColor: context.dataset.borderColor[context.dataIndex],
              backgroundColor: context.dataset.backgroundColor[context.dataIndex],
              borderWidth: 10
            };
          },
          labelTextColor: () => '#f8fafc',
          titleColor: (context) => {
            return {
              borderColor: context.dataset.borderColor[context.dataIndex],
              fontColor: context.dataset.backgroundColor[context.dataIndex],
              borderWidth: 10
            };
          },
          title: () => 'Blog Category',
          label: (context) => `→ ${context.label}`,
          afterLabel: (context) => {
            const projects = chartData.datasets[0].projectDetails[context.dataIndex];
            if (!projects || projects.length === 0) return null;
            
            return projects.map(proj => 
              `• ${proj.title} (${proj.reviewCount} Comments)`
            ).join('\n');
          }
        }
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderJoinStyle: 'round',
        hoverBorderWidth: 3,
        hoverOffset: 10
      }
    },
    onHover: (event, chartElements) => {
      if (chartElements.length > 0) {
        const chart = event.chart;
        chart.update();
      }
    }
  };

  return (
    <div className="chart-box" style={{
      overflow: 'hidden',
      padding: '2rem 0',
      position: 'relative',
      marginBottom: '2rem',
      boxShadow: 'none',
       display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column'
        }}>
          <Spinner size={48} />
          <p style={{ marginTop: '16px', color: '#64748b' }}>Loading comment analytics...</p>
        </div>
      ) : error ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            backgroundColor: '#fee2e2'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={{
            color: '#dc2626',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>Data Loading Error</h3>
          <p style={{
            color: '#64748b',
            fontSize: '14px',
            marginBottom: '16px',
            maxWidth: '300px'
          }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#dc2626'}
            onMouseOut={(e) => e.target.style.background = '#ef4444'}
          >
            Retry
          </button>
        </div>
      ) : isEmptyData ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px',
          marginBottom:'-1rem'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            backgroundColor: '#f1f5f9'
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9H9.01" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9H15.01" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={{
            color: '#334155',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>No Comments Found</h3>
          <p style={{
            color: '#64748b',
            fontSize: '15px',
           maxWidth: '300px'
          }}>
            There are no comments available for analysis yet. 
            <br />
            Check back later when users have commented on your blogs.
          </p>
        </div>
      ) : (
        <>
          <Pie 
            data={chartData} 
            options={options} 
            style={{
              transition: 'all 0.5s ease-out',
              maxHeight: '400px'
            }}
          />
          <div style={{
            position: 'absolute',
            left: '16px',
            bottom: '4px',
            paddingTop: '10px',
            zIndex: 10000,
            fontSize: '11px',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
              marginRight: '4px'
            }}>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectCategoryPieChart;