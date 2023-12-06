import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Validate from './Validate';
import Feed from './Feed';
import "./Styles/Home.css"

const Home: React.FC = () => {
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
}
export default Home