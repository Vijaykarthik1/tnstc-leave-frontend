// pages/ProfileUploadPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileUploadPage = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const userData = JSON.parse(localStorage.getItem('tnstc-user'));

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) return alert('Please select a photo');

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/api/upload/profile-photo', formData);
      const imageUrl = res.data.imageUrl;

      // Now update user data in your backend (optional step if needed)
      const updatedUser = {
        ...userData.user,
        profilePhoto: imageUrl,
      };

      localStorage.setItem('tnstc-user', JSON.stringify({ user: updatedUser }));

      // ✅ Redirect to respective dashboard
      if (updatedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/apply-leave');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center w-full max-w-sm">
        <h2 className="text-xl font-bold text-indigo-600 mb-4">Upload Your Profile Photo</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Upload & Continue
        </button>
      </div>
    </div>
  );
};

export default ProfileUploadPage;
