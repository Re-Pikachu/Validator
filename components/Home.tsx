import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Validate from './Validate';
import Feed from './Feed';
import "./Styles/Home.css"

const Home: React.FC = () => {
  // const Posts = []

  const getPosts = async () => {
    const response = await fetch('/api/data/allPosts');
    const posts = await response.json();
    console.log('POSTS', posts);
    // .then((posts) => {
    //   console.log('POSTS', posts);
    // });
  };

  getPosts();
  // posts.push(<h1>{post}</h1>)

  return (
    <>
   <div className="app-container">
      <Sidebar 
        username={"username"}
      />
      <div className="content-container">
        <Validate />
        <Feed />
      </div>
    </div>
    </>
  );
};
export default Home;
