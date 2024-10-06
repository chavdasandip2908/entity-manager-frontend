// src/pages/UserDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import { getUser, getUserCollections } from '../api';

function UserDetail() {
  const [user, setUser] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
    fetchUserCollections();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await getUser(userId);
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCollections = async () => {
    try {
      const response = await getUserCollections(userId);
      setCollections(response.data.data.collections);

    } catch (error) {
      console.error('Error fetching user collections:', error);
      toast.error('Failed to fetch user collections.');
    }
  };

  const handleCreateCollection = () => {
    // Navigate to create collection page or open a modal
    navigate('/create-collection');
  };

  // Check if the logged-in user matches the user being viewed
  const isOwnProfile = () => {
    const loggedInUserId = localStorage.getItem('userId'); // Assume we store userId in localStorage on login
    return loggedInUserId === userId;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <AnimatedPage>
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">{user.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Personal Details</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Main Collections</h2>
            {collections.length > 0 ? (
              <ul className="space-y-2">
                {collections.map((collection) => (
                  <motion.li
                    key={collection._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={`/collections/${collection._id}`}
                      className="text-primary hover:underline"
                    >
                      {collection.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p>No collections found.</p>
            )}
          </div>
        </div>

        {isOwnProfile() && (
          <div className="mt-6">
            <Button onClick={handleCreateCollection} className="bg-primary text-white">
              Create New Collection
            </Button>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}

export default UserDetail;