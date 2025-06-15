import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Make sure your api service is correctly configured
import { FaSave, FaTimes } from 'react-icons/fa';

const UpdateBranchForm = ({ branchData, onBranchUpdated, onCancel }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('active');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Populate form fields with existing branch data when component mounts or branchData changes
    useEffect(() => {
        if (branchData) {
            setName(branchData.name || '');
            setLocation(branchData.location || '');
            setStatus(branchData.status || 'active');
        }
    }, [branchData]);

    // Effect to clear success/error messages after a delay (flash messages)
    useEffect(() => {
        let timer;
        if (success || error) {
            timer = setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 5000); // Clear after 5 seconds
        }
        return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }, [success, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous errors
        setSuccess(null); // Clear previous successes

        try {
            // The API call for update: ensure it's a PATCH or PUT to the correct endpoint
            // It should be /branches/:id
            const response = await api.patch(`/branches/${branchData._id}`, { name, location, status }); // <-- Using PATCH here
            setSuccess('Branch updated successfully!');
            console.log('Branch updated:', response.data);

            if (onBranchUpdated) {
                onBranchUpdated(response.data.data); // Notify parent component (SuperAdminDashboard)
            }
        } catch (err) {
            console.error('Error updating branch:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to update branch. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Update Branch</h2>
            <form onSubmit={handleSubmit} className="form-content">
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        aria-label="Branch Name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location" className="form-label">Location:</label>
                    <input
                        type="text"
                        id="location"
                        className="form-input"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        aria-label="Branch Location"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status" className="form-label">Status:</label>
                    <select
                        id="status"
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        aria-label="Branch Status"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : <><FaSave className="mr-2" /> Update</>}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        <FaTimes className="mr-2" /> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateBranchForm;