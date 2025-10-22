
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-red-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
        </div>
        <div className="mt-6 text-gray-900">
          <h3 className="text-xl font-bold text-red-600 mb-2">Searching Global Listings</h3>
          <p className="text-gray-600 animate-pulse">Finding the perfect Airbnb homes for your stay...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
