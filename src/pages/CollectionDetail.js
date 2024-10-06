// src/pages/CollectionDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AnimatedPage from '../components/AnimatedPage';
import UpdateCollectionForm from '../components/UpdateCollectionForm';
import DeleteCollectionButton from '../components/DeleteCollectionButton';
import CreateChildCollectionForm from '../components/CreateChildCollectionForm';
import CreateItemForm from '../components/CreateItemForm';
import { getCollection, getCollectionItems } from '../api';

function CollectionDetail() {
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { collectionId } = useParams();
  

  useEffect(() => {
    fetchCollectionDetails();
    fetchCollectionItems();
  }, [collectionId]);

  const fetchCollectionDetails = async () => {
    try {
      setLoading(true);
      const response = await getCollection(collectionId);
      setCollection(response.data.data);
    } catch (error) {
      console.error('Error fetching collection details:', error);
      setError('Failed to fetch collection details. Please try again later.');
      toast.error('Failed to fetch collection details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionItems = async () => {
    try {
      const response = await getCollectionItems(collectionId);
      setItems(response.data.data);
      
    } catch (error) {
      console.error('Error fetching collection items:', error);
      toast.error('Failed to fetch collection items.');
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    fetchCollectionDetails();
  };

  const handleChildCollectionCreated = () => {
    fetchCollectionDetails();
  };

  const handleItemCreated = () => {
    fetchCollectionItems();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!collection) {
    return <div className="text-center py-8">Collection not found.</div>;
  }

  return (
    <AnimatedPage>
      <div className="bg-white rounded-lg shadow-soft p-6">
        {isEditing ? (
          <UpdateCollectionForm collection={collection} onUpdate={handleUpdateSuccess} />
        ) : (
          <>
            <h1 className="text-3xl font-bold text-primary mb-6">{collection.name}</h1>
            <p className="text-gray-600 mb-4">{collection.description}</p>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Edit Collection
              </button>
              <DeleteCollectionButton collectionId={collection._id} />
            </div>
          </>
        )}
        
        <h2 className="text-2xl font-semibold mb-4">Child Collections</h2>
        {collection.childCollections && collection.childCollections.length > 0 ? (
          <ul className="space-y-2 mb-6">
            {collection.childCollections.map((childCollection) => (
              <motion.li
                key={childCollection._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to={`/collections/${childCollection._id}`}
                  className="text-primary hover:underline"
                >
                  {childCollection.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="mb-6">No child collections found.</p>
        )}

        <h2 className="text-2xl font-semibold my-6">Items</h2>
        {items.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {items.map((item) => (
              <motion.li
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-md p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-primary">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-500 mt-2">Type: {item.type}</p>
                {item.image && (
                  <img src={item.image} alt={item.name} className="mt-2 w-full h-32 object-cover rounded" />
                )}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="mb-6">No items found in this collection.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <CreateChildCollectionForm
              parentId={collection._id}
              onCreated={handleChildCollectionCreated}
            />
          </div>
          <div>
            <CreateItemForm
              collectionId={collection._id}
              onCreated={handleItemCreated}
            />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default CollectionDetail;