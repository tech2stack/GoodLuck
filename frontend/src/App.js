// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// AuthProvider को import करें - यह आपके `src/context/AuthContext.js` से आएगा
import { AuthProvider } from './context/AuthContext'; 

// आपके मौजूदा components को import करें (paths को adjust करें अगर ज़रूरत हो)
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollTop'; 
import ScrollTopButton from "./components/ScrollTopButton"; 
import Preloader from './components/Preloader';
import ErrorBoundary from './components/ErrorBoundary';

// आपके मौजूदा pages को import करें (paths को adjust करें अगर ज़रूरत हो)
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

// Dashboard Components को उनके संबंधित files से import karein
// Ensure ki aapne SuperAdminDashboard.js, BranchAdminDashboard.js, EmployeeDashboard.js files banayi hain
// aur unmein unka code hai.
import SuperAdminDashboard from './pages/SuperAdminDashboard';
// Import BranchAdminDashboard from './pages/BranchAdminDashboard'; // Ise banayein
// Import EmployeeDashboard from './pages/EmployeeDashboard';     // Ise banayein

// Note: Humne ab yahan dashboard components ko inline declare karna hata diya hai,
// kyunki unhein unki apni files se import kiya ja raha hai.
// const SuperAdminDashboard = () => <div className="p-4"><h2>Super Admin Dashboard Content</h2><p>यह सुपर एडमिन के लिए आपका डैशबोर्ड है।</p></div>;
// const BranchAdminDashboard = () => <div className="p-4"><h2>Branch Admin Dashboard Content</h2><p>यह ब्रांच एडमिन के लिए आपका डैशबोर्ड है।</p></div>;
// const EmployeeDashboard = () => <div className="p-4"><h2>Employee Dashboard Content</h2><p>यह सामान्य कर्मचारी के लिए आपका डैशबोर्ड है।</p></div>;


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds preloader

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

  // Preloader और ऑफलाइन चेक
  if (isLoading || !isOnline) {
    return <Preloader />;
  }

  return (
    <ErrorBoundary>
      <Router>
        {/* AuthProvider पूरे Router को wrap करेगा ताकि लॉगिन स्थिति पूरे ऐप में उपलब्ध हो */}
        <AuthProvider> 
          <ScrollToTop /> {/* Router के अंदर ScrollToTop */}
          <Header /> {/* Header component */}
          <div className="main-content"> {/* Main content area */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot" element={<Forgot />} />
              
              {/* Dashboard Routes */}
              <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
              {/* Apni BranchAdminDashboard aur EmployeeDashboard ko bhi yahan import karein aur routes banayein */}
              {/* <Route path="/branch-admin-dashboard" element={<BranchAdminDashboard />} /> */}
              {/* <Route path="/employee-dashboard" element={<EmployeeDashboard />} /> */}

              {/* आप यहां अन्य Routes जोड़ सकते हैं */}
              {/* <Route path="/shop" element={<Shop />} /> */}
            </Routes>
          </div>
          <ScrollTopButton /> {/* ScrollTopButton */}
          <Footer /> {/* Footer component */}
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
