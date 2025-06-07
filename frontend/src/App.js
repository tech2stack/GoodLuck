// src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary'; // Nayi ErrorBoundary file import karein

import Header from './components/Header';
import Footer from './components/Footer';

// Lazy-loaded page imports (jaisa upar bataya gaya hai)
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Login = React.lazy(() => import('./pages/Login'));
const Forgot = React.lazy(() => import('./pages/Forgot'));


function App() {
  return (
    <Router>
      <Header />
      {/* ErrorBoundary ko Suspense ke bahar wrap karein */}
      <ErrorBoundary>
        <Suspense fallback={<div>Loading page...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<Forgot />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </Router>
  );
}

export default App;