import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const BranchOverviewReport = ({ showFlashMessage }) => {
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOverviewReport = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/reports/branch-overview');
            // IMPORTANT: Log the full response to check its structure
            console.log("Branch Overview API Full Response:", response.data); 
            
            // Adjust 'response.data.data' if your API structure is different (e.g., response.data)
            setOverviewData(response.data.data); 
            
            if (typeof showFlashMessage === 'function') {
                showFlashMessage('Branch overview loaded successfully!', 'success');
            }
        } catch (err) {
            console.error('Error fetching branch overview:', err.response?.data?.message || err.message || err);
            setError(err.response?.data?.message || 'Failed to fetch branch overview.');
            if (typeof showFlashMessage === 'function') {
                showFlashMessage(err.response?.data?.message || 'Failed to fetch branch overview.', 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [showFlashMessage]);

    useEffect(() => {
        if (typeof showFlashMessage === 'function') {
            fetchOverviewReport();
        } else {
             console.warn("BranchOverviewReport: showFlashMessage prop is not a function.");
        }
    }, [fetchOverviewReport, showFlashMessage]);

    if (loading) {
        return <p className="text-center my-4">Loading branch overview...</p>;
    }

    if (error) {
        return <p className="text-center my-4 text-danger">Error: {error}</p>;
    }

    return (
        <div className="branch-overview-report p-3 border rounded">
            <h3 className="mb-3">All Branch Overview</h3>
            <p className="report-description text-muted mb-4">This report summarizes key metrics for all registered branches.</p>

            {overviewData ? (
                <div className="report-data-display">
                    <p>Total Branches: <strong>{overviewData.totalBranches !== undefined ? overviewData.totalBranches : 'N/A'}</strong></p>
                    <p>Active Branches: <strong>{overviewData.activeBranches !== undefined ? overviewData.activeBranches : 'N/A'}</strong></p>
                    <p>Inactive Branches: <strong>{overviewData.inactiveBranches !== undefined ? overviewData.inactiveBranches : 'N/A'}</strong></p>

                    {/* CRITICAL FIX: Check if branches array exists and is valid before mapping */}
                    {overviewData.branches && Array.isArray(overviewData.branches) && overviewData.branches.length > 0 ? (
                        <div className="mt-4">
                            <h5 className="mb-3">Detailed Branch List:</h5>
                            <ul className="list-group branch-list">
                                {overviewData.branches.map(branch => (
                                    // Use branch._id if your backend sends it, otherwise branch.id
                                    <li key={branch._id || branch.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{branch.name || 'N/A'}</strong> <small className="text-muted">({branch.location || 'N/A'})</small>
                                        </div>
                                        <span className={`badge ${branch.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                            Status: {branch.status || 'N/A'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-center text-info mt-4">No detailed branch data available or branches list is empty.</p>
                    )}
                </div>
            ) : (
                <p className="text-center text-muted">No branch overview data to display. Please check the API response.</p>
            )}
        </div>
    );
};

export default BranchOverviewReport;