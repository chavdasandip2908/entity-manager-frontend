// src/components/UpdateCollectionForm.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from './Button';
import { updateCollection } from '../api';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          rows="3"
        ></textarea>
      </div>
      <Button type="submit" loading={loading}>
        Update Collection
      </Button>
    </form>
  );
}

export default UpdateCollectionForm;