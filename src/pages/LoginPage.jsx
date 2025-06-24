import React, { useEffect, useState } from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('tnstc-user');
    if (saved) {
      const parsedUser = JSON.parse(saved).user;
      setUser(parsedUser);

      // 👇 Auto-redirect if already logged in
      if (parsedUser.role === 'driver' || parsedUser.role === 'conductor') {
        navigate('/apply-leave');
      } else if (parsedUser.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [navigate]);

  // 👇 Call this after login
const handleLogin = (userData) => {
  setUser(userData);

  if (!userData.profilePhoto) {
    return navigate('/upload-profile'); // 👈 redirect to upload
  }

  if (userData.role === 'driver' || userData.role === 'conductor') {
    navigate('/apply-leave');
  } else if (userData.role === 'admin') {
    navigate('/admin');
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4">TNSTC Leave Management</h1>

        {!user ? (
          <>
            <p className="mb-4 text-gray-600">Login with your official Google account</p>
            <GoogleLoginButton onLogin={handleLogin} />
          </>
        ) : (
          <div className="space-y-3">
            <h2 className="text-lg font-medium text-gray-800">Welcome, {user.name}</h2>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
            <button
              onClick={() => {
                localStorage.removeItem('tnstc-user');
                setUser(null);
                navigate('/');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
