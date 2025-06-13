import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1', // Your backend base URL
    withCredentials: true, // IMPORTANT: This sends cookies (like your JWT) with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add a request interceptor to attach Authorization header if a token is present
api.interceptors.request.use(config => {
    // Check if token is in localStorage or other storage
    const token = localStorage.getItem('jwtToken'); // Adjust based on how you store your token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Optional: Add a response interceptor for global error handling or token refresh
api.interceptors.response.use(response => {
    return response;
}, error => {
    // Example: If 401, redirect to login (basic handling)
    if (error.response && error.response.status === 401) {
        console.error("Unauthorized request. Redirecting to login...");
        // You might want to clear local storage token and redirect
        // window.location.href = '/login'; 
    }
    return Promise.reject(error);
});


export default api;
