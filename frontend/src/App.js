import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollTop'; // 👈 Add this
import ScrollTopButton from "./components/ScrollTopButton"; // 👈 Import it
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import Home from './pages/Home';
// import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Preloader from './components/Preloader';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading || !isOnline) {
    return <Preloader />;
  }

  return (
    <ErrorBoundary>
      <Router>
      <ScrollToTop /> {/* 👈 Add here inside Router */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/shop" element={<Shop />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
        </Routes>
        <ScrollTopButton /> {/* 👈 Add it here */}
        <Footer />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
