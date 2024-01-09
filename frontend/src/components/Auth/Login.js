import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../componentsCSS/Login.css"

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    emailPhone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!credentials.emailPhone || !credentials.password) {
        setError('Please fill in all fields.');
        return;
      }

      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      const { token } = response.data;

      localStorage.setItem('token', token);
      setLoading(false);

      console.log(token);

      // Redirect or navigate to the next page after successful login
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="emailPhone"
          placeholder="Email or Phone"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
