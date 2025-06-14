import React, { useState, useEffect } from 'react'; // Import useEffect
import api from '../../services/api';
import { FaPlus, FaTimes } from 'react-icons/fa';

const CreateBranchForm = ({ onBranchCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('active');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Effect to clear success/error messages after a delay
    useEffect(() => {
        let timer;
        if (success || error) {
            timer = setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 5000); // Clear after 5 seconds
        }
        return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }, [success, error]); // Re-run effect when success or error changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Clear previous errors
        setSuccess(null); // Clear previous successes

        try {
            const response = await api.post('/branches', { name, location, status });
            setSuccess('Branch added successfully!');
            console.log('New branch created:', response.data);
            setName(''); // Clear form
            setLocation(''); // Clear form
            setStatus('active'); // Reset status

            if (onBranchCreated) {
                onBranchCreated(response.data.data); // Notify parent component (SuperAdminDashboard)
            }
        } catch (err) {
            console.error('Error creating branch:', err.response?.data || err);
            // Capture the specific backend message or a generic one
            setError(err.response?.data?.message || 'Failed to add branch. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Add New Branch</h2>
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
                        {loading ? 'Adding...' : <><FaPlus className="mr-2" /> Add Branch</>}
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

export default CreateBranchForm;