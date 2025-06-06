import React, { useState } from 'react';
import '../styles/Login.css';
import logo from '../assets/logo.jpg';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Placeholder logic – replace with real auth
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      alert('Login successful!');
      window.location.href = '/dashboard'; // adjust route as per your router setup
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="GoodLuck Logo" className="login-logo" />
        <h2>User Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>

        </form>
        <p className="forgot">  
          <a href="/forgot-password">
          Forgot Password?
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;
