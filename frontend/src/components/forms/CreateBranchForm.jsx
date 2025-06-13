import React, { useState } from 'react';
import api from '../../services/api'; // Path: from components/forms to services
import { FaSave, FaTimes } from 'react-icons/fa'; // Icons

const CreateBranchForm = ({ onBranchCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous error
        setSuccessMessage(null); // Clear previous success message

        // Log the payload being sent
        const payload = { name, location };
        console.log('Sending Create Branch request with payload:', payload);

        try {
            const response = await api.post('/branches', payload);
            console.log('Create Branch API Response:', response.data);
            setSuccessMessage('Branch created successfully!');
            setName(''); // Clear form fields
            setLocation('');
            // Notify parent component about successful creation
            if (onBranchCreated) {
                onBranchCreated(response.data.data);
            }
        } catch (err) {
            console.error('Error creating branch:', err.response || err);
            // More detailed error message from backend
            setError(err.response?.data?.message || 'Failed to create branch.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Add New Branch</h2>
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md">
                    <p className="font-bold">{successMessage}</p>
                </div>
            )}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
                    <p className="font-bold">Error: {error}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Branch Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
                    <input
                        type="text"
                        id="location"
                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-200 transform hover:scale-105"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : <><FaSave className="mr-2" /> Create Branch</>}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-200 transform hover:scale-105"
                        disabled={loading}
                    >
                        <FaTimes className="mr-2" /> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBranchForm;
