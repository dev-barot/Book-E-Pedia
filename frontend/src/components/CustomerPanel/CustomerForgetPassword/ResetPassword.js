import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setError('Invalid or missing token. Please request a new password reset link.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token || !password || !email) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/password_reset/confirm/', {
        token,
        password,
        email
      });
      if (response.data.status === 'OK') {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Error: ' + (response.data.detail || 'Could not reset password.'));
      }
    } catch (error) {
      setError('Reset failed: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="reset-password-body">
      <div className="reset-password-container">
        <h1>Reset Your Password</h1>
        <p>Enter your email and new password to reset your account.</p>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="reset-password-input"
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="reset-password-input"
          />
          <button type="submit" className="reset-password-btn">Reset Password</button>
        </form>
        {message && <p className="reset-password-success">{message}</p>}
        {error && <p className="reset-password-error">{error}</p>}
        <p><a href="#" onClick={() => navigate('/login')} className="reset-password-back-link">Back to Login</a></p>
      </div>
    </div>
  );
};

export default ResetPassword;