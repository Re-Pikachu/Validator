import React from 'react';
import "./Styles/sidebar.css"

interface SidebarProps {
  username: string;
}

const Sidebar: React.FC<SidebarProps> = ({ username }) => {
  return (
    <div className="sidebar">
      <div className="username">{username}</div>
      <button className="nav-button">Home</button>
      <button className="nav-button">Liked</button>
    </div>
  );
};

export default Sidebar;

