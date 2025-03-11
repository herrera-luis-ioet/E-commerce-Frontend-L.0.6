import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductCatalogManager from './components/ProductCatalogManager';

// Layout component with header and footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">E-Commerce Platform</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/products" className="hover:underline">Products</a></li>
          </ul>
        </nav>
      </div>
    </header>
    <main className="container mx-auto py-6 flex-grow">
      {children}
    </main>
    <footer className="bg-secondary text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.</p>
      </div>
    </footer>
  </>
);

// Home page component
const Home: React.FC = () => (
  <div className="text-center">
    <h1 className="text-3xl font-bold mb-6">Welcome to E-Commerce Platform</h1>
    <p className="mb-4">This is a React-based product catalog management system.</p>
    <a 
      href="/products" 
      className="btn-primary inline-block"
    >
      Go to Product Catalog
    </a>
  </div>
);

// Main App component
const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductCatalogManager />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
