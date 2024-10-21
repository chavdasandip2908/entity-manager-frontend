// src/components/UpdateCollectionForm.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from './Button';
import { updateCollection } from '../api';
import Loading from './Loading';

function UpdateCollectionForm({ collection, onUpdate }) {
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCollection(collection._id, { name, description });
      toast.success('Collection updated successfully!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update collection.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg flex flex-col mx-auto mt-4 w-[26rem] max-w-screen">
      {/* Name Field */}
      <div className='w-full text-center'>
        <h1 className="text-4xl font-bold text-primary">
          Update Collection
        </h1>
      </div>
      <div className='w-full'>
        <label htmlFor="name" className="block text-base font-semibold text-gray-800 mb-1">
          Collection Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 block w-full px-4 py-2 border rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
          placeholder="Enter collection name"
          required
        />
      </div>

      {/* Description Field */}
      <div className='w-full'>
        <label htmlFor="description" className="block text-base font-semibold text-gray-800 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 block w-full px-4 py-2 border rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
          rows="4"
          placeholder="Enter collection description"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          loading={loading}
          className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200"
        >
          Update Collection
        </Button>
      </div>
    </form>

  );
}

export default UpdateCollectionForm;