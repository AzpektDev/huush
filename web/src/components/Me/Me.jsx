import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateToken, createChat } from '../../services/api';

const Me = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const validateUserToken = async () => {
            try {
                const response = await validateToken(token);
                if (response.status !== 200) {
                    navigate('/');
                }
            } catch (error) {
                navigate('/');
            }
        };

        validateUserToken();
    }, [navigate, token]);

    const handleCreateChat = async () => {
        try {
            const response = await createChat(token);
            if (response.status !== 200) {
                setError(response.message);
                navigate('/me');
            } else {
                console.log('Chat created successfully:', response.data.chat);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Me</h2>
            <button onClick={handleCreateChat}>Create Chat</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Me;
