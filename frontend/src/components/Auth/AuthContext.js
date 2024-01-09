import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // State to store user data

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/authJWT', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setAuthenticated(true);
          setUser(response.data.user); // Store user data in state
        } else {
          navigate('/login'); // Invalid token, redirect to login
        }

        setLoading(false);
      } catch (error) {
        console.error('Error validating token:', error);
        navigate('/login'); // Redirect to login in case of any error
        setLoading(false);
      }
    };

    validateToken();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token available');
      }

      const response = await axios.get('http://localhost:5000/api/user/emailPhone', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUser(response.data); // Update user data in state
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, loading, user, fetchUserData }}> {/* Provide user data and fetch function in the context */}
      {children}
    </AuthContext.Provider>
  );
};
