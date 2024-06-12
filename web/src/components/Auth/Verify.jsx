import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verify } from '../../services/api';
import './../../assets/styles/Auth.css';

const Verify = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await verify(code);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.user.token);
                navigate('/me');
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Verify</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Verification Code:
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
                </label>
                <br />
                <button type="submit">Verify</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Verify;
