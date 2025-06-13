import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Path: from components/forms to services
import { FaSave, FaTimes } from 'react-icons/fa'; // Icons

const CreateBranchAdminForm = ({ onBranchAdminCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [branchId, setBranchId] = useState(''); // State for selected Branch ID
    const [branches, setBranches] = useState([]); // State for list of branches (for dropdown)
    const [loading, setLoading] = useState(false); // State for form submission loading
    const [error, setError] = useState(null); // State for form errors
    const [successMessage, setSuccessMessage] = useState(null); // State for success messages
    const [loadingBranches, setLoadingBranches] = useState(true); // State for loading branches for dropdown

    // Fetch list of branches when the component mounts for the dropdown
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await api.get('/branches');
                setBranches(response.data.data);
                // If branches are available, set the first one as default selected
                if (response.data.data.length > 0) {
                    setBranchId(response.data.data[0]._id);
                }
            } catch (err) {
                console.error('Error loading branches:', err.response || err);
                setError('Failed to load branches for dropdown.');
            } finally {
                setLoadingBranches(false);
            }
        };
        fetchBranches();
    }, []); // Empty dependency array means this runs once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous error
        setSuccessMessage(null); // Clear previous success message

        // Log the payload being sent
        const payload = { name, email, password, branchId };
        console.log('Sending Create Branch Admin request with payload:', payload);

        try {
            // Send request to create branch admin
            const response = await api.post('/branch-admins', payload);
            console.log('Create Branch Admin API Response:', response.data);
            setSuccessMessage('Branch Admin created successfully!');
            setName(''); // Clear form fields
            setEmail('');
            setPassword('');
            // branchId can remain selected or reset, depending on preference
            // Notify parent component about successful creation
            if (onBranchAdminCreated) {
                onBranchAdminCreated(response.data.data);
            }
        } catch (err) {
            console.error('Error creating Branch Admin:', err.response || err);
            // More detailed error message from backend
            setError(err.response?.data?.message || 'Failed to create Branch Admin.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading state for branches dropdown
    if (loadingBranches) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl text-center">
                <p className="text-gray-700">Loading branches...</p>
            </div>
        );
    }

    // If no branches are available, inform the user
    if (branches.length === 0) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl text-center">
                <p className="text-red-600 font-semibold mb-4">No branches available. Please create a branch first to add a Branch Admin.</p>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md flex items-center mx-auto transition duration-200 transform hover:scale-105"
                >
                    <FaTimes className="mr-2" /> Cancel
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Add New Branch Admin</h2>
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
                    <label htmlFor="adminName" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        id="adminName"
                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="adminEmail" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        id="adminEmail"
                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="adminPassword" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        id="adminPassword"
                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="branchSelect" className="block text-gray-700 text-sm font-bold mb-2">Select Branch:</label>
                    <select
                        id="branchSelect"
                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        required
                        disabled={loading || loadingBranches} // Disable if loading branches
                    >
                        {branches.map(branch => (
                            <option key={branch._id} value={branch._id}>
                                {branch.name} ({branch.location})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-200 transform hover:scale-105"
                        disabled={loading || branches.length === 0} // Disable if no branches or loading
                    >
                        {loading ? 'Creating...' : <><FaSave className="mr-2" /> Create Admin</>}
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

export default CreateBranchAdminForm;
