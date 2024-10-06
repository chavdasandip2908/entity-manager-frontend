// src/pages/Users.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import { getUsers } from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">Users</h1>
        <Button onClick={fetchUsers} loading={loading}>
          Refresh Users
        </Button>
        <motion.ul className="mt-6 space-y-4">
          {users.map((user) => (
            <motion.li
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Link to={`/users/${user._id}`} className="block">
                <h2 className="text-xl font-semibold text-primary">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </AnimatedPage>
  );
}

export default Users;