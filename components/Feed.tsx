import React, { useEffect, useState } from 'react';
import './Styles/Feed.css';

// Define the type for the data items (adjust as per your actual data structure)
interface DataItem {
  id: number;
  title: string;
  content: string;
}

const Feed: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch('localhost:3000/api/data'); // Adjust the URL as needed
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="feed-container">
      {data.map((item) => (
        <div className="feed-item" key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
