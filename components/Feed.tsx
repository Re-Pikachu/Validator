import React, { useEffect, useState } from 'react';
import './Styles/Feed.css';

// Define the type for the data items (adjust as per your actual data structure)
interface DataItem {
  id: number;
  title: string;
  userPrompt: string;
  chatGBT_response: string;
}

interface FeedProps {
    data: DataItem[]; // Pass the data as an array of DataItem
  }

const Feed: React.FC<FeedProps> = ({ data }) => {


  return (
    <div className="feed-container">
      {data.map((item) => (
        <div className="feed-item" key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.userPrompt}</p>
          <p>{item.chatGBT_response}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
