import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * PUBLIC_INTERFACE
 * NotFoundPage component for 404 errors
 */
const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | E-Commerce Platform</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>
      
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <div className="flex space-x-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Go Home
          </Link>
          <Link 
            to="/products" 
            className="px-6 py-3 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;