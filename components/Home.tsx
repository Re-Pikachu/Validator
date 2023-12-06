import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Validate from './Validate';
import Feed from './Feed';
import "./Styles/Home.css"

interface DataItem {
  id: number;
  title: string;
  userPrompt: string;
  chatGBT_response: string;
}

const Home: React.FC = () => {
  // const Posts = []

  const [data, setData] = useState<DataItem[]>([]);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data/allPosts'); // Adjust the URL as needed
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
    <>
   <div className="app-container">
      <Sidebar 
        username={"username"}
      />
      <div className="content-container">
        <Validate 
        getPosts={fetchData}
        />
        <Feed 
        data={data}
        />
      </div>
    </div>
    </>
  );
};
export default Home;
