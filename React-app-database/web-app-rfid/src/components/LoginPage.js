import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission
    try {
      const response = await axios.post('/api/loginUser', { 
        email, 
        password
      });
      if (response.status === 200) {
        setMessage('Login successful.');
      } else {
        setMessage('Failed to login user.');
      }
    } catch (error) {
      setMessage(`Error logging in user: ${error.response?.data?.message || 'User might not exist or password is incorrect.'}`);
    }
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <buttonLogin type="submit">Login</buttonLogin>
        <div className="login-actions">
          <a href="/forgot-password" className="forgot-password">
          <Link to="/forgot-password" className="register">
            Forgot Password?
          </Link>
          </a>
          <br></br>
          <br></br>
          <a href="/register" className="register">
          <Link to="/register" className="register">
            Register
          </Link>
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
