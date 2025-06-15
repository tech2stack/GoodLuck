// src/components/reports/BranchDetailsReport.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get branch ID from URL
import api from '../../services/api';
import '../../styles/Report.css';
import { FaDownload } from 'react-icons/fa';

const BranchDetailsReport = () => {
    const { id } = useParams(); // Get the branch ID from the URL (e.g., /reports/branch-details/123)
    const [branchData, setBranchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchBranchDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                // Call the backend endpoint for a specific branch's details
                const response = await api.get(`/reports/branch-details/${id}`);
                setBranchData(response.data.data);
            } catch (err) {
                console.error(`Error fetching details for branch ${id}:`, err.response?.data || err);
                setError(err.response?.data?.message || `Failed to fetch details for branch ${id}.`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBranchDetails();
        } else {
            setError("No branch ID provided in the URL."); // This error means the URL is missing the ID
            setLoading(false);
        }
    }, [id]);

    const handleDownloadCSV = async () => {
        setDownloading(true);
        try {
            const response = await api.get(`/reports/branch-details/${id}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const contentDisposition = response.headers['content-disposition'];
            let filename = `Branch_Details_Report_${id}_${Date.now()}.csv`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(`Error downloading CSV for branch ${id}:`, err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to download report.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return <div className="report-loading">Loading Branch Details...</div>;
    }

    if (error) {
        return <div className="report-error">Error: {error}</div>;
    }

    if (!branchData) {
        return <div className="report-container"><p>No data found for this branch.</p></div>;
    }

    return (
        <div className="report-container">
            <h3 className="report-title">Details for Branch: {branchData.name || 'N/A'}</h3>

            <div className="report-actions">
                <button onClick={handleDownloadCSV} className="btn btn-primary" disabled={downloading}>
                    {downloading ? 'Downloading...' : <><FaDownload className="mr-2" /> Download Details CSV</>}
                </button>
            </div>

            <div className="branch-details-card">
                <p><strong>Location:</strong> {branchData.location}</p>
                <p><strong>Status:</strong> <span className={`status-${branchData.status}`}>{branchData.status}</span></p>
                <p><strong>Total Employees:</strong> {branchData.employeeCount}</p>
                {branchData.adminName && <p><strong>Branch Admin:</strong> {branchData.adminName}</p>}
                {branchData.adminEmail && <p><strong>Admin Email:</strong> {branchData.adminEmail}</p>}
                {branchData.contactEmail && <p><strong>Contact Email:</strong> {branchData.contactEmail}</p>}

                {branchData.employees && branchData.employees.length > 0 && (
                    <div className="employee-list-section">
                        <h4>Employees in this Branch:</h4>
                        <ul className="employee-list">
                            {branchData.employees.map(emp => (
                                <li key={emp._id}>{emp.name} ({emp.position}) - {emp.email}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BranchDetailsReport;