import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogout } from '../api';


const Header = () => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');


  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side: Links */}
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/users" className="hover:text-gray-300">
            User
          </Link>
          <Link to="/collections" className="hover:text-gray-300">
            Collection
          </Link>
        </div>

        {/* Right side: Conditional Links */}
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <>
              <button className="hover:text-gray-300" onClick={() => handleLogout(navigate)}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
