import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Button from './Button';
import { createCollection, handleImageChange, MAX_IMAGE_SIZE, MAX_PAYLOAD_SIZE } from '../api';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

function CreateChildCollectionForm({ parentId = null, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChangeWrapper = (e) => {
    const file = e.target.files[0];
    handleImageChange(file, setImage, toast);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const collectionData = {
        name,
        description,
        image,
        parentId
      };

      if (!collectionData.name) {
        console.log('collection name is required');
        return 'collection name is required'
      }


      const payloadSize = JSON.stringify(collectionData).length;
      if (payloadSize > MAX_PAYLOAD_SIZE) {
        throw new Error(`Payload size (${payloadSize} bytes) exceeds the maximum allowed size (${MAX_PAYLOAD_SIZE} bytes).`);
      }

      await createCollection(collectionData);
      toast.success('Child collection created successfully!');
      setName('');
      setDescription('');
      setImage(null);
      parentId && onCreated();
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error(error.message || 'Failed to create child collection.');
    } finally {
      setLoading(false);
      navigate('/users');
    }
  };

  if (loading) {
    return <Loading />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto"
      >
        {/* Form Title */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
          Create Child Collection
        </h3>

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            placeholder="Enter collection name"
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            rows="3"
            placeholder="Enter collection description (optional)"
          ></textarea>
        </div>

        {/* Image Upload Field */}
        <div>
          <label
            htmlFor="collectionImage"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Image (JPG or PNG, max {MAX_IMAGE_SIZE / 1024}KB)
          </label>
          <input
            type="file"
            id="collectionImage"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChangeWrapper}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>

        {/* Image Preview */}
        {image && (
          <div className="mt-4">
            <img src={image} alt="Preview" className="max-w-full h-auto rounded-md shadow-md" />
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-300 shadow-md"
        >
          Create Child Collection
        </Button>
      </form>
    </motion.div>

  );
}

export default CreateChildCollectionForm;