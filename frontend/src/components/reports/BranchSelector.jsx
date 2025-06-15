import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const BranchSelector = ({ showFlashMessage }) => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchBranches = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/branches'); // Your API to get all branches
            // Console log to debug API response structure
            console.log("Branch Selector API Response for /branches:", response.data); 
            
            // Adjust 'response.data.data' if your API structure is different (e.g., response.data)
            // Ensure response.data.data is an array. If not, handle it.
            setBranches(Array.isArray(response.data.data) ? response.data.data : []); 
            
            if (typeof showFlashMessage === 'function') {
                showFlashMessage('Branches loaded for selection!', 'success');
            }
        } catch (err) {
            console.error('Error fetching branches for selector:', err.response?.data?.message || err.message || err);
            setError(err.response?.data?.message || 'Failed to load branches for selection.');
            if (typeof showFlashMessage === 'function') {
                showFlashMessage('Failed to load branches for selection.', 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [showFlashMessage]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const handleSelectChange = (event) => {
        setSelectedBranch(event.target.value);
    };

    const handleViewReport = () => {
        if (selectedBranch) {
            navigate(`/reports/branch-details/${selectedBranch}`);
        } else {
            if (typeof showFlashMessage === 'function') {
                showFlashMessage('Please select a branch to view its details.', 'warning');
            }
        }
    };

    if (loading) return <p className="text-center my-4">Loading branches...</p>;
    if (error) return <p className="text-center my-4 text-danger">Error loading branches: {error}</p>;

    return (
        <div className="branch-selector p-3 border rounded">
            <div className="form-group mb-3">
                <label htmlFor="branch-select" className="form-label">Select a Branch:</label>
                <select
                    id="branch-select"
                    className="form-control"
                    value={selectedBranch}
                    onChange={handleSelectChange}
                >
                    <option value="">-- Choose a Branch --</option>
                    {/* CRITICAL FIX: Use branch._id for value and key */}
                    {/* Ensure your API returns _id for MongoDB documents. If it's 'id', use branch.id */}
                    {branches.length > 0 ? (
                        branches.map(branch => (
                            <option key={branch._id || branch.id} value={branch._id || branch.id}>
                                {branch.name || 'N/A'} - {branch.location || 'N/A'}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>No branches available</option>
                    )}
                </select>
            </div>
            <button onClick={handleViewReport} className="btn btn-primary mt-3">
                View Branch Report
            </button>
        </div>
    );
};

export default BranchSelector;