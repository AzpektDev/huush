import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Verify from './components/Auth/Verify';
import Login from './components/Auth/Login';
import Me from './components/Me/Me';
import Home from './components/Home';
import Chat from './components/Chat/chat';

const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/chat" element={<Me />} />
                <Route path="/me" element={<Chat />} />
            </Routes>
        </Router>
    );
};

export default App;
