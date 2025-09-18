import React, { useEffect, useState } from 'react'
import Dataloading from '../components/Dataloading'
import useFetchData from '@/hooks/useFetchData';
import { Link } from 'lucide-react';
import { FaRegEye } from 'react-icons/fa';
import axios from 'axios';
import Spinner from '@/components/Spinner';

function UserTable({search}) {
  const [allData, setAllData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currP, setCurrP] = useState(1);
  const [pagePage, setPagePage] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
       setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [reviewsRes, commentsRes, contactsRes] = await Promise.all([
          axios.get('/api/reviews'),
          axios.get('/api/comment'),
          axios.get('/api/contacts'),
        ]);

        // Process data
        const reviews = reviewsRes.data;
        const comments = commentsRes.data;
        const contacts = contactsRes.data.data;

        // Combine all data into a single array
        const combinedData = [
          // Process reviews
          ...reviews.map(review => ({
            id: review._id,
            name: review.name,
            email: review.email,
            createdAt: new Date(review.createdAt),
            status: 'Testified',
            image: review.image,
            type: 'review',
            detailUrl: `/visitors/view/${review._id}`
          })),
          
          // Process comments
          ...comments.map(comment => ({
            id: comment._id,
            name: comment.name,
            email: comment.email,
            createdAt: new Date(comment.createdAt),
            status: 'Commented',
            image: comment.image,
            type: 'comment',
            detailUrl: `/visitors/view/${comment._id}`
          })),
          
          // Process contacts
          ...contacts.map(contact => ({
            id: contact._id,
            name: `${contact.clientInfo.firstName} ${contact.clientInfo.lastName || ''}`.trim(),
            email: contact.clientInfo.email,
            createdAt: new Date(contact.createdAt),
            status: 'Contacted',
            image: contact.clientInfo.profilePicture || null,
            type: 'contact',
            detailUrl: `/visitors/view/${contact._id}`
          }))
        ];

        // Sort by createdAt in descending order (newest first)
        combinedData.sort((a, b) => b.createdAt - a.createdAt);

        setAllData(combinedData);
        setLoading(false);
     
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterData = search.trim().toLowerCase() === '' 
    ? allData 
    : allData.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.email.toLowerCase().includes(search.toLowerCase())
      );

        useEffect(() => {
            const filterData = () => {
          let filtered = [...allData];
        
          if (search.trim().toLowerCase() !== '') {
            filtered = filtered.filter(item => 
              item.name.toLowerCase().includes(search.toLowerCase()) || 
              item.email.toLowerCase().includes(search.toLowerCase())
            );
          }
        }
        filterData();
      },[search])

  const indexfirstString = (currP - 1) * pagePage;
  const indexlastString = currP * pagePage;
  const currentData = filterData.slice(indexfirstString, indexlastString);

const getStatusColor = (status) => {
  const baseBrightness = 150; // Minimum brightness threshold
      const r = Math.max(Math.floor(Math.random() * 200), baseBrightness);
      const b = Math.max(Math.floor(Math.random() * 200), baseBrightness);
  switch(status) {
    case 'review': 
      // Ensure at least one channel is bright (above 150)
      
      return {
        backgroundColor: `rgba(${r}, 0, 0, 0.5)`,
        color: '#ffffff' // White text for better contrast
      };
    case 'comment': 
      return {
        backgroundColor: `rgba(0, ${r}, 0,  0.5)`, // Light green
        color: '#ffffff' // Dark green text
      };
    case 'contact': 
      return {
        backgroundColor:  `rgba( 0, 0, ${r},  0.5)`, // Light purple
        color: '#ffffff' // Dark purple text
      };
    default: 
      return {
        backgroundColor: 'rgba(243, 244, 246, 1)', // Light gray
        color: 'rgba(55, 65, 81, 1)' // Dark gray text
      };
  }
};

useEffect(() => {
if (search !== '') {
     setPagePage(allData.length)
}
else{
   setPagePage(7) 
}
}, [search])


  return (
    <div>
      <table className="table table-styling">
        <thead>
          <tr>
            <th>#</th>
            <th>Visitor</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Date</th>
            <th>Action</th>                                
          </tr>
        </thead>
        <tbody>
          {loading && currentData.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center wh_50" style={{padding: '5rem', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Spinner />
              </td>
            </tr>
          ) 
        }
         {    !loading &&  currentData.length === 0 &&(
              <tr>
                <td colSpan={7} className="text-center" style={{padding: '5rem'}}>
                  No Data Found
                </td>
              </tr>
         )
} {
 !loading &&  currentData.length > 0 &&   currentData.map((item, index) => (
                <tr key={item.id}>
                  <td style={{width: '30px'}}>
                    {(indexfirstString + index + 1) > 9 ? 
                      indexfirstString + index + 1 : 
                      '0'+ (indexfirstString + index + 1)}
                  </td>
                  <td style={{textAlign:'center', width: '50px'}}>
                    <img 
                      src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=random`} 
                      alt={item.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td style={{textTransform:'lowercase'}}>{item.email}</td>
                  <td>
                    <span style={{
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      ...getStatusColor(item.type)
    }}
    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.createdAt.toLocaleString()}</td>
                  <td>
                    <a href={item.detailUrl} className="text-blue-600 hover:underline">
                      View
                    </a>
                  </td>
                </tr>
              ))
            
          }
        </tbody>
      </table>
    </div>
  )
}

export default UserTable;