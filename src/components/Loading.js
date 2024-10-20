import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-900">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-400"></div>
      <span className="ml-3 text-lg animate-pulse">Loading...</span>
    </div>
  );
};

export default Loading;
