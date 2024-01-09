import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ModifyUserForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    // Extract user data from location state
    const { userData } = location.state || {};

    if (userData) {
      setName(userData.name || '');
      setUserImage(userData.userImage || '');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { userData } = location.state || {};
      console.log(userData);
      const { email, phone } = userData || {};
      const emailPhone = email || phone;

      const userDataToUpdate = { name, userImage };

      if (emailPhone) {
        await axios.put(`http://localhost:5000/api/user/${emailPhone}`, userDataToUpdate);
        navigate('/dashboard');
      } else {
        console.error('Email or phone is missing.');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div>
      <h1>Modify User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>User Image:</label>
          <input type="text" value={userImage} onChange={(e) => setUserImage(e.target.value)} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ModifyUserForm;
