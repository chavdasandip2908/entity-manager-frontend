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
import Loading from '../components/Loading';
import DefaultCollectionImage from '../images/icons8-folder.svg';

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
    return <Loading />
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!collection) {
    return <div className="text-center py-8">Collection not found.</div>;
  }

  return (
    <AnimatedPage>
      <div className="bg-white rounded-lg shadow-lg p-8">
        {isEditing ? (
          <UpdateCollectionForm
            collection={collection}
            onUpdate={handleUpdateSuccess}
          />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-primary mb-4">
                {collection.name}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed">
                {collection.description}
              </p>
            </div>

            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors"
              >
                Edit Collection
              </button>
              <DeleteCollectionButton collectionId={collection._id} />
            </div>
          </>
        )}

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Child Collections */}
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Child Collections
            </h2>
            {collection.childCollections && collection.childCollections.length > 0 ? (
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {collection.childCollections.map((childCollection) => (
                  <motion.li
                    key={childCollection._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Collection Image */}
                      <img
                        src={childCollection.image || DefaultCollectionImage} // Fallback to default image if no image is available
                        alt={childCollection.name}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                      <Link
                        to={`/collections/${childCollection._id}`}
                        className="text-xl font-semibold text-blue-600 hover:underline"
                      >
                        {childCollection.name}
                      </Link>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mb-4">No child collections found.</p>
            )}
          </div>
          {/* Items on the Right */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Items</h2>
            {/* {items.length > 0 ? ( */}
            <ul className="space-y-4">
              {/* {items.map((item) => ( */}
              <motion.li
                key={"item._id"}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                  {"item.name"}
                </h3>
                <p className="text-gray-700 mb-2">{"item.description"}</p>
                <p className="text-sm text-gray-500">Type: {"item.type"}</p>
                {/* {item.image && ( */}
                <img
                  src={ DefaultCollectionImage}
                  alt={"item.name"}
                  className="mt-4 w-full h-40 object-cover rounded-lg shadow-md"
                />
                    {/* )} */}
              </motion.li>
              {/* ))} */}
            </ul>
            {/* // ) : (
            //   <p className="text-gray-600 mb-4">No items found in this collection.</p>
            // )} */}

          </div>
        </div>

        {/* Forms for Adding Child Collection and Item */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add Child Collection
            </h3>
            <CreateChildCollectionForm
              parentId={collection._id}
              onCreated={handleChildCollectionCreated}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Item
            </h3>
            <CreateItemForm
              collectionId={collection._id}
              onCreated={handleItemCreated}
            />
          </div>
        </div>
      </div>

    </AnimatedPage >


  );
}

export default CollectionDetail;