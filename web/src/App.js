import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Verify from './components/Auth/Verify';
import Login from './components/Auth/Login';
import Me from './components/Me/Me';
import Home from './components/Home';

const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/me" element={<Me />} />
            </Routes>
        </Router>
    );
};

export default App;
