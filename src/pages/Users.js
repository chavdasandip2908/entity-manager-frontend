import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AnimatedPage from '../components/AnimatedPage';
import UserIcon from '../images/download.png'
import Loading from '../components/Loading'; // Import the Loading component
import { getUsers, handleLogout } from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data.data);
      toast.success('Users fetched successfully!');
    } catch (error) {
      if (error.response.data.code === 'TOKEN_EXPIRE') {
        handleLogout(navigate);
      }
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />; // Show loading component while fetching users
  }

  return (
    <AnimatedPage>
      <div className="bg-white rounded-lg shadow-soft p-6 w-full">
        <h1 className="text-3xl font-bold text-primary mb-6">Users</h1>

        {/* Responsive grid layout for users */}
        <motion.div
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {users.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center"
            >
              <Link to={`/users/${user._id}`} className="block text-center">
                <img
                  src={user.avatar || UserIcon} // Default image if avatar is not available
                  alt={<img
                    src={UserIcon} // Default image if avatar is not available
                    alt={UserIcon}
                    className="w-full h-1/1 rounded mb-4"
                  />}
                  className="w-full h-1/1 rounded mb-4"
                />
                <h2 className="text-xl font-semibold text-primary">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </Link>
            </motion.div>

          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  );
}

export default Users;
