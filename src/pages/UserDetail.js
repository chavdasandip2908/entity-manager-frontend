// src/pages/UserDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import { getUser, getUserCollections, handleLogout } from '../api';
import Loading from '../components/Loading';
import CollectionImage from '../images/icons8-folder.svg';
import UserImage from '../images/download.png';


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
      if (error.response.data.code === 'TOKEN_EXPIRE') {
        handleLogout(navigate);
      }
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
      if (error.response.data.code === 'TOKEN_EXPIRE') {
        handleLogout(navigate);
      }
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
    return <Loading />;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <AnimatedPage>
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">{user.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 pb-2">Personal Details</h2>
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
              {/* User Image */}
              <div className="w-32 h-32 mb-4 md:mb-0">
                <img
                  src={user.image || UserImage} // Fallback to UserImage if user.image is not available
                  alt={user.name || 'Default User'} // Fallback alt text if user.name is not available
                  className="w-full h-full rounded-full object-cover shadow-md"
                />
              </div>

              {/* User Information */}
              <div className="text-center md:text-left">
                <p className="text-gray-700">
                  <strong className="font-semibold text-primary">Name:</strong> {user.name}
                </p>
                <p className="text-gray-700">
                  <strong className="font-semibold text-primary">Email:</strong> {user.email}
                </p>
                <p className="text-gray-700">
                  <strong className="font-semibold text-primary">Mobile:</strong> {user.mobile}
                </p>
              </div>
            </div>
          </div>


          <div>
            <h2 className="text-xl font-semibold mb-4">Main Collections</h2>
            {collections.length > 0 ? (
              <motion.ul
                className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {collections.map((collection) => (
                  <motion.li
                    key={collection._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center hover:scale-105  "
                  >
                    <Link to={`/collections/${collection._id}`} className="block text-center transition-all duration-300 hover:scale-105">
                      <img
                        src={collection.image || CollectionImage} // Default image if collection image is not available
                        alt={collection.name} // Collection name as the alt text
                        className="w-24 h-24 rounded-sm mb-4 object-cover "
                      />
                      <h3 className="text-xl font-semibold text-primary">{collection.name}</h3>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
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