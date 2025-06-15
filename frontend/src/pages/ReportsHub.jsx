import React from 'react';
import OverallReportsComponent from '../components/reports/OverallReportsComponent';
import BranchOverviewReport from '../components/reports/BranchOverviewReport';
import BranchSelector from '../components/reports/BranchSelector';

const ReportsHub = ({ showFlashMessage }) => {
    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Business Reports Dashboard</h2>

            {/* Overall Report Section */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white py-3">
                    <h4 className="mb-0">Overall Business Summary</h4>
                </div>
                <div className="card-body">
                    <OverallReportsComponent showFlashMessage={showFlashMessage} />
                </div>
            </div>

            {/* Branch Overview Section */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-info text-white py-3">
                    <h4 className="mb-0">All Branches Overview</h4>
                </div>
                <div className="card-body">
                    <BranchOverviewReport showFlashMessage={showFlashMessage} />
                </div>
            </div>

            {/* Branch Specific Details Selector */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-success text-white py-3">
                    <h4 className="mb-0">View Specific Branch Details</h4>
                </div>
                <div className="card-body">
                    <BranchSelector showFlashMessage={showFlashMessage} />
                    <p className="mt-3 text-muted text-center">
                        Select a branch from the dropdown above to view its detailed report.
                        The details will appear on a new page.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReportsHub;