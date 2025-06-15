import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { FaDownload, FaEye } from 'react-icons/fa';

const OverallReportsComponent = ({ showFlashMessage }) => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOverallReport = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/reports/overall');
            // Console log to debug API response structure
            console.log("Overall Report API Response:", response.data); 
            
            // Adjust 'response.data.data' if your API structure is different (e.g., response.data)
            setReportData(response.data.data); 
            
            if (typeof showFlashMessage === 'function') {
                showFlashMessage('Overall report loaded successfully!', 'success');
            }
        } catch (err) {
            console.error('Error fetching overall report:', err.response?.data?.message || err.message || err);
            setError(err.response?.data?.message || 'Failed to fetch overall report.');
            if (typeof showFlashMessage === 'function') {
                showFlashMessage(err.response?.data?.message || 'Failed to fetch overall report.', 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [showFlashMessage]);

    const downloadOverallReport = useCallback(async () => {
        try {
            const response = await api.get('/reports/overall/download', {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'overall_report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            if (typeof showFlashMessage === 'function') {
                showFlashMessage('Overall report download started!', 'success');
            }
        } catch (err) {
            console.error('Error downloading overall report:', err);
            if (err.response && err.response.data instanceof Blob) {
                const errorText = await err.response.data.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    if (typeof showFlashMessage === 'function') {
                        showFlashMessage(errorJson.message || 'Failed to download overall report.', 'error');
                    }
                } catch (parseError) {
                    if (typeof showFlashMessage === 'function') {
                        showFlashMessage(errorText || 'Failed to download overall report. (Non-JSON error)', 'error');
                    }
                }
            } else {
                if (typeof showFlashMessage === 'function') {
                    showFlashMessage(err.response?.data?.message || 'Failed to download overall report.', 'error');
                }
            }
        }
    }, [showFlashMessage]);

    useEffect(() => {
        // Ensure showFlashMessage is a function before calling fetchOverallReport
        if (typeof showFlashMessage === 'function') {
            fetchOverallReport();
        } else {
             console.warn("OverallReportsComponent: showFlashMessage prop is not a function.");
        }
    }, [fetchOverallReport, showFlashMessage]);

    if (loading) {
        return <p className="text-center my-4">Loading overall report...</p>;
    }

    if (error) {
        return <p className="text-center my-4 text-danger">Error: {error}</p>;
    }

    return (
        <div className="report-content p-3 border rounded">
            <h3 className="mb-3">Overall Business Summary</h3>
            <p className="report-description text-muted mb-4">This report provides a high-level overview of all branches, admins, and employees.</p>

            <div className="report-actions mb-4">
                <button onClick={fetchOverallReport} className="btn btn-info report-action-btn me-2">
                    <FaEye className="me-2" /> View Latest Data
                </button>
                <button onClick={downloadOverallReport} className="btn btn-success report-action-btn">
                    <FaDownload className="me-2" /> Download PDF
                </button>
            </div>

            {reportData ? (
                <div className="report-data-display">
                    {/* Defensive checks for each property */}
                    <p>Total Branches: <strong>{reportData.totalBranches !== undefined ? reportData.totalBranches : 'N/A'}</strong></p>
                    <p>Total Branch Admins: <strong>{reportData.totalBranchAdmins !== undefined ? reportData.totalBranchAdmins : 'N/A'}</strong></p>
                    <p>Total Employees: <strong>{reportData.totalEmployees !== undefined ? reportData.totalEmployees : 'N/A'}</strong></p>
                    <p>Active Branches: <strong>{reportData.activeBranches !== undefined ? reportData.activeBranches : 'N/A'}</strong></p>
                    <p>Inactive Branches: <strong>{reportData.inactiveBranches !== undefined ? reportData.inactiveBranches : 'N/A'}</strong></p>
                  
                </div>
            ) : (
                <p className="text-center text-muted">No overall report data available. Click "View Latest Data" to load.</p>
            )}
        </div>
    );
};

export default OverallReportsComponent;