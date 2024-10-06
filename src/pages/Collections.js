import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import { getCollections } from '../api';

function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await getCollections();
      setCollections(response.data.data);
      toast.success('Collections fetched successfully!');
    } catch (error) {
      toast.error('Failed to fetch collections.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">Collections</h1>
        <Button onClick={fetchCollections} loading={loading}>
          Refresh Collections
        </Button>
        <motion.ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <motion.li
              key={collection._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-primary">{collection.name}</h2>
              <p className="text-gray-600 mt-2">{collection.description}</p>
              {collection.image && (
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="mt-4 w-full h-40 object-cover rounded-md"
                />
              )}
              <p className="text-sm text-gray-500 mt-2">
                Parent ID: {collection.parentId || 'None'}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </AnimatedPage>
  );
}

export default Collections;