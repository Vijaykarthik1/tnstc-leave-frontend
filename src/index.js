import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // 👈 import toast styles

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId="958002439757-a6kis5bj5i5lt1nkb9idc54uqpg8jngd.apps.googleusercontent.com">
    <>
      <App />
      <ToastContainer position="top-center" />
    </>
  </GoogleOAuthProvider>
);
