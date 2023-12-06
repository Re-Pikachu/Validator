import React, { useState, useEffect } from 'react';

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
    <div>
      <h1>hello</h1>
      {/* {Posts} */}
    </div>
  );
};
export default Home;
