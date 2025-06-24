import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // detect route change

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tnstc-user'));
    setUserData(saved);
  }, [location]); // update when route changes

  const handleLogout = () => {
    localStorage.removeItem('tnstc-user');
    navigate('/');
  };

  const role = userData?.user?.role;
  const profileUrl = userData?.user?.profilePhoto || 'https://ui-avatars.com/api/?name=TNSTC';

  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
      <h1 className="text-2xl font-bold text-center sm:text-left">TNSTC Leave</h1>

      <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4">
        {userData ? (
          <>
            {(role === 'driver' || role === 'conductor') && (
              <>
                <Link to="/apply-leave" className="hover:underline">Apply</Link>
                <Link to="/leave-history" className="hover:underline">My Leaves</Link>
              </>
            )}
            {role === 'admin' && (
              <Link to="/admin" className="hover:underline">Admin</Link>
            )}
            {/* 👇 Profile photo with name */}
            <Link to="/profile" className="flex items-center space-x-2 hover:underline">
              <img src={profileUrl} alt="Profile" className="w-8 h-8 rounded-full border" />
              <span className="text-sm">{userData.user.name}</span>
            </Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
