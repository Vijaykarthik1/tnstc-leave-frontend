import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = ({ onLogin }) => {
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', { token });
      localStorage.setItem('tnstc-user', JSON.stringify(res.data));
      onLogin(res.data.user);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Google Login Failed')}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
