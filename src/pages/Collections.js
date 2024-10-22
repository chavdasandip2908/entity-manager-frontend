import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AnimatedPage from '../components/AnimatedPage';
import { getCollections } from '../api';
import { Link } from 'react-router-dom';
import DefaultCollectionImage from '../images/icons8-folder.svg';
import Loading from '../components/Loading';

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

  if (loading) {
    return <Loading />
  }

  return (
    <AnimatedPage>
      <div className="bg-white rounded-lg shadow-soft p-6 w-full">
        <h1 className="text-3xl font-bold text-primary mb-6">Collections</h1>

        {/* Responsive grid layout for collections */}
        <motion.div
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {collections.map((collection) => (
            <motion.div
              key={collection._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center"
              title={collection.description}
            >
              <Link to={`/collections/${collection._id}`} className="block text-center w-full">
                {/* Collection Image */}
                <img
                  src={collection.image || DefaultCollectionImage}
                  alt={collection.name}
                  className="w-full max-h-auto h-1/1 object-cover rounded-lg mb-4"
                />

                {/* Collection Name */}
                <h2 className="text-xl font-semibold text-primary">{collection.name}</h2>

                {/* Collection Description */}
                {/* <p className="text-gray-600 ">{collection.description}</p> */}

                {/* Parent ID */}
                <p className="text-sm text-gray-500 ">
                  Parent ID: {collection.parentId || 'None'}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>

  );
}

export default Collections;