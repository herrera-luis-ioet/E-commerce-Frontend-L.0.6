import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * PUBLIC_INTERFACE
 * Home page component
 */
const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home | E-Commerce Platform</title>
        <meta name="description" content="Welcome to our E-Commerce Platform - a React-based product catalog management system." />
      </Helmet>
      
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold mb-6">Welcome to E-Commerce Platform</h1>
        <p className="text-xl mb-8">This is a React-based product catalog management system.</p>
        
        <div className="flex justify-center space-x-4">
          <Link 
            to="/products" 
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Browse Products
          </Link>
          <Link 
            to="/categories/electronics" 
            className="px-6 py-3 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
          >
            Electronics
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;