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
  const [isChildFormVisible, setIsChildFormVisible] = useState(false); // Toggle form visibility
  const [isItemFormVisible, setIsItemFormVisible] = useState(false); // Toggle item form visibility
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
    return <Loading />;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!collection) {
    return <div className="text-center py-8">Collection not found.</div>;
  }

  {
    // flex-direction: column;
    // flex-wrap: nowrap;
    // /* align-content: center; */
    // justify-content: center;
    // align-items: center;
  }

  return (
    <AnimatedPage>
      <div className="bg-white rounded-lg shadow-lg p-8 h-screen">
        {isEditing ? (
          <UpdateCollectionForm
            collection={collection}
            onUpdate={handleUpdateSuccess}
          />
        ) : (
          <>
            {/* Collection Name and Description */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-primary">{collection.name}</h1>
                <p className="text-gray-700 text-lg leading-relaxed mt-2">
                  {collection.description}
                </p>
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Collection
                </button>
                <DeleteCollectionButton collectionId={collection._id} />
              </div>
            </div>

            {/* Child Collections */}
            <div className="w-full mb-8">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">Child Collections</h2>
              {collection.childCollections && collection.childCollections.length > 0 ? (
                <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">


                  {collection.childCollections.map((childCollection) => (
                    <motion.li
                      key={childCollection._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col items-center">
                        {/* Child Collection Image */}
                        <img
                          src={childCollection.image || DefaultCollectionImage}
                          alt={childCollection.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <Link
                          to={`/collections/${childCollection._id}`}
                          className="text-xl font-semibold text-blue-600 hover:underline mt-4"
                        >
                          {childCollection.name}
                        </Link>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No child collections found.</p>
              )}
              <button
                onClick={() => setIsChildFormVisible(!isChildFormVisible)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {isChildFormVisible ? 'Close Child Collection Form' : 'Create Child Collection'}
              </button>
              {isChildFormVisible && (
                <CreateChildCollectionForm
                  parentId={collection._id}
                  onCreated={handleChildCollectionCreated}
                />
              )}
            </div>

            {/* Items Section */}
            <div className="w-full mb-8">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">Items</h2>
              {items.length > 0 ? (
                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
                  {items.map((item) => (
                    <motion.li
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-xl font-semibold text-blue-600 mb-2">{item.name}</h3>
                      <p className="text-gray-700 mb-2 break-words">{item.description}</p>
                      <p className="text-sm text-gray-500">Type: {item.type}</p>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="mt-4 h-28 w-full bg-slate-800 object-cover rounded-lg shadow-md"
                        />
                      )}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No items found in this collection.</p>
              )}
              <button
                onClick={() => setIsItemFormVisible(!isItemFormVisible)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {isItemFormVisible ? 'Close Item Form' : 'Create Item'}
              </button>
              {isItemFormVisible && (
                <CreateItemForm
                  collectionId={collection._id}
                  onCreated={handleItemCreated}
                />
              )}
            </div>
          </>
        )}

      </div>
    </AnimatedPage>
  );
}

export default CollectionDetail;
