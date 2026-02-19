// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ForgetPassword = () => {
//   const [email, setEmail] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('Form submitted with email:', email); // Debug log
//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/password_reset/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });
//       console.log('Response status:', response.status); // Debug log
//       if (response.ok) {
//         alert('Password reset email sent successfully! Check your inbox.');
//         navigate('/login');
//       } else {
//         const errorData = await response.json();
//         console.log('Error response:', errorData); // Debug log
//         alert('Error: ' + (errorData.email || 'Something went wrong.'));
//       }
//     } catch (error) {
//       console.error('Error sending password reset request:', error);
//       alert('An error occurred. Please try again later.');
//     }
//   };

//   return (
//     <div>
//       <h2>Forgot Password</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Send Reset Link</button>
//       </form>
//     </div>
//   );
// };

// export default ForgetPassword;

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import profileImage from "./profile.jpeg";
import './CustomerForgetPassword.css';
import axios from 'axios'; // Import axios for API calls

function CustomerForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const baseUrl = "http://127.0.0.1:8000/api";

  const handleResetRequest = () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setMessage('');
    setError('');

    // Send reset request to backend
    axios.post(`${baseUrl}/password_reset/`, { email }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.data.status === "OK") {
        setMessage("A password reset link has been sent to your email.");
      }
    })
    .catch((err) => {
      setError("Error: Could not send reset email. Please check your email address.");
      console.error(err);
    });
  };

  return (
    <div className='cust-fp-body'>
      <div className="cust-fp-container">
        <div className="cust-fp-illustration">
          <img src={profileImage} alt="Profile Illustration" />
        </div>
        <div className="cust-fp-form-container">
          <h1>Forgot Your Password?</h1>
          <p>Enter your email address below and we'll send you instructions to reset your password.</p>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleResetRequest}>Send Reset Link</button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <p><a href="#" onClick={() => navigate('/login')}>Back to login</a></p>
        </div>
      </div>
    </div>
  );
}

export default CustomerForgetPassword;