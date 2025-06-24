import React, { useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('tnstc-user'))?.user);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!image) return alert('Please select a file');
  setUploading(true);

  const formData = new FormData();
  formData.append('image', image);

  try {
    // 1. Upload image to Cloudinary
    const res = await axios.post('http://localhost:5000/api/upload/profile-photo', formData);
    const imageUrl = res.data.imageUrl;
    console.log('User ID:', user._id);
    // 2. Update user profile photo in MongoDB
    await axios.patch(`http://localhost:5000/api/user/${user._id}/profile-photo`, {
      profilePhoto: imageUrl,
    });

    // 3. Update localStorage and UI
    const updatedUser = { ...user, profilePhoto: imageUrl };
    localStorage.setItem('tnstc-user', JSON.stringify({ user: updatedUser }));

    alert('Profile photo updated!');
    setImage(null);

    // ✅ 4. Force UI refresh so Navbar updates too
    window.location.reload(); // 👈 This makes the new image reflect everywhere
  } catch (err) {
    console.error('Upload error:', err);
    alert('Upload failed!');
  } finally {
    setUploading(false);
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center w-full max-w-sm">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">My Profile</h2>
        <img
          src={user?.profilePhoto || 'https://ui-avatars.com/api/?name=TNSTC'}
          className="w-24 h-24 rounded-full mx-auto border-2 border-indigo-500"
          alt="Profile"
        />
        <p className="mt-4 text-lg font-medium">{user?.name}</p>
        <p className="text-sm text-gray-500 mb-4">{user?.role}</p>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          {uploading ? 'Uploading...' : 'Update Photo'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
