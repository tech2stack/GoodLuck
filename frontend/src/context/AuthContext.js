// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Axios instance to make API calls

const AuthContext = createContext(null); // Initialize with null or a default object

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Initial loading state for auth context

    // Effect to initialize authentication state from localStorage on component mount
    useEffect(() => {
        console.log('AuthContext useEffect: Initialization started.');
        try {
            const storedUserData = localStorage.getItem('user_data');
            const storedToken = localStorage.getItem('jwtToken'); // Try to load the token from localStorage

            if (storedUserData && storedToken) {
                const parsedUserData = JSON.parse(storedUserData);
                // Basic validation for parsed user data
                if (parsedUserData && parsedUserData._id && parsedUserData.role) {
                    setUserData(parsedUserData);
                    setIsLoggedIn(true);
                    console.log('AuthContext: Loaded user data from localStorage (raw):', storedUserData);
                    console.log('AuthContext: Loaded user data from localStorage (parsed):', parsedUserData);
                } else {
                    console.log('AuthContext: Invalid user data or missing role/ID in localStorage. Clearing it.');
                    localStorage.clear(); // Clear potentially corrupted data
                    setIsLoggedIn(false);
                    setUserData(null);
                }
            } else {
                console.log('AuthContext: No user data or token found in localStorage.');
                setIsLoggedIn(false);
                setUserData(null);
            }
        } catch (error) {
            console.error('AuthContext: Error parsing stored data from localStorage:', error);
            localStorage.clear(); // Clear potentially corrupted data
            setIsLoggedIn(false);
            setUserData(null);
        } finally {
            setLoading(false);
            console.log('AuthContext: Initialization complete. Loading set to false.');
        }
    }, []); // Empty dependency array means this runs only once on mount

    // Function to handle user login
    const login = async (loginId, password, role) => {
        // No need to setLoading(true) here as it's typically done once per overall auth init
        // If you want a loading state for the login *form*, manage it within the form component.
        try {
            console.log('AuthContext: Attempting login for LoginID:', loginId, 'Role:', role);
            const payload = { loginId, password, role };
            console.log('AuthContext: Login payload being sent:', payload);

            const response = await api.post('/auth/login', payload);
            console.log('AuthContext: Login API response (response.data):', response.data);

            // FIX: Destructure directly from response.data, not response.data.data
            // Based on your console log: {success: true, user: {…}, token: '...'}
            const { token, user } = response.data; // Corrected destructuring

            if (!user || !user._id || !user.role) { // More robust user object validation
                console.error('AuthContext: API response has invalid or incomplete user object! Login failed.');
                localStorage.clear();
                setIsLoggedIn(false);
                setUserData(null);
                throw new Error('Invalid user data received from backend.');
            }

            if (!token) {
                console.error('AuthContext: No token found in API response! Login failed.');
                localStorage.clear();
                setIsLoggedIn(false);
                setUserData(null);
                throw new Error('Authentication token not received from backend.');
            }

            // Store token and user data in localStorage
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('user_data', JSON.stringify(user));

            setUserData(user);
            setIsLoggedIn(true);
            console.log('Login successful. Token and user data stored.');
            return { success: true, user }; // Indicate successful login and return user data
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message || 'Unknown login error');
            localStorage.clear(); // Clear all auth data on login failure
            setIsLoggedIn(false);
            setUserData(null);
            // Rethrow the error so the calling component (Login.jsx) can handle it
            throw error;
        }
    };

    // Function to handle user logout
    const logout = () => {
        console.log('AuthContext: User is logging out.');
        localStorage.clear(); // Clear all authentication related data
        setIsLoggedIn(false);
        setUserData(null);
        // You might also want to call a backend logout endpoint to clear server-side cookies
        // e.g., api.post('/auth/logout');
    };

    // Provide the auth state and functions to children components
    const authContextValue = {
        isLoggedIn,
        userData,
        loading, // AuthContext's loading state
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {/* Show children only when authentication check is complete */}
            {!loading ? children : <div className="min-h-screen flex items-center justify-center"><p className="text-xl font-semibold text-gray-700">Authentication loading...</p></div>}
        </AuthContext.Provider>
    );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
    // Ensure useContext is called within a component rendered inside AuthProvider
    return useContext(AuthContext);
};
