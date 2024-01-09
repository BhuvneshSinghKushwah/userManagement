import React, { useState } from 'react';
import axios from 'axios';
import '../../componentsCSS/Signup.css'; 

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
    password: '',
    userImage: null,
    role: 'user',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    // Convert the selected image to base64
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({
        ...formData,
        userImage: reader.result, // Store base64 data in formData
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataWithImage = new FormData();
      for (const key in formData) {
        if (formData[key] !== '') { // Exclude empty values
          formDataWithImage.append(key, formData[key]);
        }
      }

      formDataWithImage.append('userImage', formData.userImage);

      const response = await axios.post('http://localhost:5000/api/auth/signup', formDataWithImage, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data for file upload
        },
      });

      if (response.status === 201) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error(error);
      // Handle error cases here
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" />
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required />
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required />
        <input type="file" name="userImage" onChange={handleImageChange} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
