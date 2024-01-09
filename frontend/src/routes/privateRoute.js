import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setAuthenticated(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/authJWT', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  return authenticated ? <Route {...rest} element={<Component />} /> : <Navigate to="/" />;
};

export default PrivateRoute;
