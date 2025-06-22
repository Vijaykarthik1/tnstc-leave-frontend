import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const userData = JSON.parse(localStorage.getItem('tnstc-user'));
  const navigate = useNavigate();
  const role = userData?.user?.role;

  const handleLogout = () => {
    localStorage.removeItem('tnstc-user');
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
      <h1 className="text-2xl font-bold text-center sm:text-left">TNSTC Leave</h1>

      <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4">
        {!userData ? (
          <Link to="/login" className="hover:underline">Login</Link>
        ) : (
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
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
