import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './SignIn'
import Home from './Home'


const App: React.FC = () => {
    return (
        <>
    <Router>
    <Routes>
        <Route path="/" element={<Navigate replace to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
    </Routes>
</Router>
</>
    );
};



export default App; 