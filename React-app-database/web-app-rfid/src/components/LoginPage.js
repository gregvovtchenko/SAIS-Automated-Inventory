import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here, e.g., by sending a request to your backend
    console.log('Login Submitted', { email, password });
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
