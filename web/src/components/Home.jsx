import React from 'react';
import { Link } from 'react-router-dom';
import './../assets/styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1>Huush</h1>
            <p className="tagline">Nobody has to know bout' your messages</p>
            <Link to="/register" className="auth-button">register</Link>
            <Link to="/login" className="auth-button">login</Link>
        </div>
    );
};

export default Home;
