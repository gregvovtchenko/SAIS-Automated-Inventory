import React, { useState } from 'react';
import '../RegisterPage.css'; // Ensure this CSS file exists
import axios from 'axios';

const RegisterPage = () => {
  const [userName, setUsername] = useState('');
  const [passwordHash, setPassword] = useState('');
  const [roleName, setRole] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission
    try {
      const response = await axios.post('/api/registerUser', { 
        userName, 
        passwordHash, 
        roleName 
      });
      if (response.status === 200) {
        setMessage('User registered successfully.');
      } else {
        setMessage('Failed to register user.');
      }
    } catch (error) {
      setMessage(`Error registering user: ${error.response?.data?.message || 'User might already exist.'}`);
    }
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}> {/* Use onSubmit here */}
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="userName">Username:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordHash">Password:</label>
          <input
            type="password" // Corrected type
            id="passwordHash"
            value={passwordHash}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="roleName">Role:</label>
          <select
            id="roleName"
            value={roleName}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            <option value="Admin">Admin</option>
            <option value="InventoryManager">Inventory Manager</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterPage;
