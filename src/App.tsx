import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes/index';

/**
 * Main App component
 * Sets up the Router and HelmetProvider for the application
 */
const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <AppRoutes />
      </Router>
    </HelmetProvider>
  );
};

export default App;
