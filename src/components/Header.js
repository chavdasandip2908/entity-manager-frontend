import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex items-center justify-between">
          <div className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
            <li><Link to="/users" className="hover:text-blue-200">Users</Link></li>
            <li><Link to="/collections" className="hover:text-blue-200">Collections</Link></li>
          </div>
          <div className="flex space-x-4">
            {isLoggedIn ? (
              <li><button onClick={handleLogout} className="hover:text-blue-200">Logout</button></li>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-blue-200">Login</Link></li>
                <li><Link to="/register" className="hover:text-blue-200">Register</Link></li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Header;