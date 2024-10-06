// src/components/DeleteCollectionButton.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from './Button';
import { deleteCollection } from '../api';

function DeleteCollectionButton({ collectionId }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      setLoading(true);
      try {
        await deleteCollection(collectionId);
        toast.success('Collection deleted successfully!');
        navigate('/collections');
      } catch (error) {
        toast.error('Failed to delete collection.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button onClick={handleDelete} loading={loading} className="bg-red-600 hover:bg-red-700">
      Delete Collection
    </Button>
  );
}

export default DeleteCollectionButton;