// src/components/CreateChildCollectionForm.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Button from './Button';
import { createCollection, handleImageChange, MAX_IMAGE_SIZE, MAX_PAYLOAD_SIZE } from '../api';

function CreateChildCollectionForm({ parentId = null, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-primary mb-4">Create Child Collection</h3>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
          ></textarea>
        </div>
        <div>
          <label htmlFor="collectionImage" className="block text-sm font-medium text-gray-700 mb-1">
            Image (JPG or PNG, max {MAX_IMAGE_SIZE / 1024}KB)
          </label>
          <input
            type="file"
            id="collectionImage"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChangeWrapper}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {image && (
          <div className="mt-2">
            <img src={image} alt="Preview" className="max-w-full h-auto rounded-md" />
          </div>
        )}
        <Button type="submit" loading={loading} className="w-full">
          Create Child Collection
        </Button>
      </form>
    </motion.div>
  );
}

export default CreateChildCollectionForm;