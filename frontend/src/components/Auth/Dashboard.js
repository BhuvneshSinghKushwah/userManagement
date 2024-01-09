import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { loading, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(user);

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  const { email, phone, name, role, userImage } = userData;

  const handleModify = () => {
    // Navigate to edit-user page with user data
    navigate('/edit-user', {
      state: { userData },
    });
  };

  const handleDelete = async () => {
    try {
      const emailPhone = email || phone;
      const token = localStorage.getItem('token');

      const confirmDelete = window.confirm('Are you sure you want to delete your data?');
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/api/users/${emailPhone}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // After successful deletion, navigate to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const emailPhone = email || phone;
      const token = localStorage.getItem('token');
      
      await axios.put(
        `http://localhost:5000/api/users/${emailPhone}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome, {name}</h1>
        <p>Email: {email}</p>
        <p>Phone: {phone ? phone : 'N/A'}</p>
        <p>Role: {role}</p>
        <img src={userImage} alt="UserImage" />

        {/* Input fields for modifying user data */}
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={userData.name} onChange={handleChange} />
        </div>
        <div>
          <label>User Image:</label>
          <input type="text" name="userImage" value={userData.userImage} onChange={handleChange} />
        </div>

        <button onClick={handleSaveChanges}>Save Changes</button>

        <div>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
