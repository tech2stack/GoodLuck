import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
// Icons for buttons and tables
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaBuilding, FaUsers, FaUserTie, FaEye, FaHome, FaTimes, FaCheckCircle, FaExclamationCircle, FaChartBar } from 'react-icons/fa'; // Added FaChartBar for the new Reports button
import { useNavigate } from 'react-router-dom';

// Import all form components
import CreateBranchForm from '../components/forms/CreateBranchForm';
import UpdateBranchForm from '../components/forms/UpdateBranchForm';
import CreateBranchAdminForm from '../components/forms/CreateBranchAdminForm';
import UpdateBranchAdminForm from '../components/forms/UpdateBranchAdminForm';
import CreateEmployeeForm from '../components/forms/CreateEmployeeForm';
import UpdateEmployeeForm from '../components/forms/UpdateEmployeeForm';
// Removed: OverallReportsComponent, BranchDetailsReport, BranchSelector as they are now handled by ReportsHub

// Import CSS file (provides general styles for forms and tables, and now the new flash/confirm styles)
import '../styles/SuperAdminDashboard.css';

// Reusable Flash Message Component
const FlashMessage = ({ message, type, onClose, className }) => {
    if (!message) return null;

    const Icon = type === 'success' ? FaCheckCircle : FaExclamationCircle;
    const messageClass = `flash-message flash-message-${type} ${className}`;

    return (
        <div className={messageClass} role="alert">
            <div className="flash-message-content">
                <Icon className="flash-message-icon" />
                <p>{message}</p>
            </div>
            <button onClick={onClose} className="flash-message-close-btn">
                <FaTimes />
            </button>
        </div>
    );
};

// Reusable Confirmation Dialog Component
const ConfirmDialog = ({ show, message, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="confirm-dialog-backdrop">
            <div className="confirm-dialog-content">
                <p className="confirm-dialog-message">{message}</p>
                <div className="confirm-dialog-actions">
                    <button onClick={onConfirm} className="btn btn-primary">
                        Confirm
                    </button>
                    <button onClick={onCancel} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


const SuperAdminDashboard = () => {
    const { userData, loading: authLoading, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // State for storing fetched data
    const [branches, setBranches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [branchAdmins, setBranchAdmins] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    // Flash Message State
    const [flashMessage, setFlashMessage] = useState(null);
    const [flashMessageType, setFlashMessageType] = useState(''); // 'success' or 'error'
    const [flashMessageAnimationClass, setFlashMessageAnimationClass] = useState(''); // New state for animation

    // Confirmation Dialog State
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // Stores the ID of the item to delete
    const [onConfirmAction, setOnConfirmAction] = useState(null); // Stores the function to call on confirmation

    // States for controlling dropdown visibility
    const [showBranchesDropdown, setShowBranchesDropdown] = useState(false);
    const [showAdminsDropdown, setShowAdminsDropdown] = useState(false);
    const [showEmployeesDropdown, setShowEmployeesDropdown] = useState(false);
    // Removed: [showReportsDropdown, setShowReportsDropdown] = useState(false);

    // Refs for handling clicks outside dropdowns (to close them)
    const branchesDropdownRef = useRef(null);
    const adminsDropdownRef = useRef(null);
    const employeesDropdownRef = useRef(null);
    // Removed: reportsDropdownRef = useRef(null);


    // State to control which section is displayed in the main content area
    const [activeView, setActiveView] = useState('summary');

    // States for managing data during update operations
    const [editingBranchData, setEditingBranchData] = useState(null);
    const [editingBranchAdminData, setEditingBranchAdminData] = useState(null);
    const [editingEmployeeData, setEditingEmployeeData] = useState(null);

    // Removed: activeReportView, selectedBranchId as they are now handled by ReportsHub

    // Function to show flash messages with animation and auto-hide
    const showFlashMessage = useCallback((message, type) => {
        // Clear any existing timeouts to prevent conflicts
        clearTimeout(window.flashMessageTimeout);
        clearTimeout(window.flashMessageHideTimeout);

        setFlashMessage(message);
        setFlashMessageType(type);
        setFlashMessageAnimationClass('show'); // Start show animation

        // Set timeout to start hide animation after 2 seconds
        window.flashMessageTimeout = setTimeout(() => {
            setFlashMessageAnimationClass('hide'); // Start hide animation

            // After hide animation completes, actually clear the message
            window.flashMessageHideTimeout = setTimeout(() => {
                setFlashMessage(null);
                setFlashMessageType('');
                setFlashMessageAnimationClass(''); // Reset animation class
            }, 500); // This duration should match your CSS transition duration (0.5s)
        }, 2000); // Message visible for 2 seconds
    }, []);

    // Function to fetch all dashboard data
    const fetchData = useCallback(async () => {
        try {
            setLoadingData(true);
            setError(null);

            const [branchesResponse, employeesResponse, branchAdminsResponse] = await Promise.all([
                api.get('/branches'),
                api.get('/employees'),
                api.get('/branch-admins')
            ]);

            setBranches(branchesResponse.data.data);
            setEmployees(employeesResponse.data.data);
            setBranchAdmins(branchAdminsResponse.data.data);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response ? err.response.data.message : 'Failed to load dashboard data. Please check your network or API connection.');
            showFlashMessage(err.response ? err.response.data.message : 'Failed to load data.', 'error');
        } finally {
            setLoadingData(false);
        }
    }, [showFlashMessage]);

    // useEffect for initial data fetch and auth check
    useEffect(() => {
        if (authLoading) {
            setLoadingData(true);
            return;
        }

        if (!isLoggedIn || !userData || userData.role !== 'super_admin') {
            setError('You do not have permission to access this dashboard. Please log in as a Super Admin.');
            setLoadingData(false);
            showFlashMessage('Access Denied: Please log in as a Super Admin.', 'error');
            navigate('/login');
            return;
        }

        fetchData();
    }, [userData, authLoading, isLoggedIn, navigate, fetchData, showFlashMessage]);

    // useEffect to handle clicks outside dropdowns to close them
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (branchesDropdownRef.current && !branchesDropdownRef.current.contains(event.target)) {
                setShowBranchesDropdown(false);
            }
            if (adminsDropdownRef.current && !adminsDropdownRef.current.contains(event.target)) {
                setShowAdminsDropdown(false);
            }
            if (employeesDropdownRef.current && !employeesDropdownRef.current.contains(event.target)) {
                setShowEmployeesDropdown(false);
            }
            // Removed: if (reportsDropdownRef.current && !reportsDropdownRef.current.contains(event.target)) { setShowReportsDropdown(false); }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Dropdown togglers
    const toggleBranchesDropdown = () => setShowBranchesDropdown(prev => !prev);
    const toggleAdminsDropdown = () => setShowAdminsDropdown(prev => !prev);
    const toggleEmployeesDropdown = () => setShowEmployeesDropdown(prev => !prev);
    // Removed: const toggleReportsDropdown = () => setShowReportsDropdown(prev => !prev);


    // --- Branch Handlers ---
    const handleCreateBranchClick = () => {
        setShowBranchesDropdown(false);
        setActiveView('createBranch');
    };

    const handleViewBranches = () => {
        setShowBranchesDropdown(false);
        setActiveView('branches');
        fetchData();
    };

    const handleUpdateBranch = (branch) => {
        setShowBranchesDropdown(false);
        setEditingBranchData(branch);
        setActiveView('updateBranch');
    };

    const handleDeleteBranch = (branchId) => {
        setItemToDelete(branchId);
        setOnConfirmAction(() => async () => {
            try {
                await api.delete(`/branches/${branchId}`);
                showFlashMessage("Branch deleted successfully!", 'success');
                fetchData();
            } catch (err) {
                console.error("Error deleting branch:", err.response || err);
                showFlashMessage(`Failed to delete branch: ${err.response?.data?.message || err.message}`, 'error');
            } finally {
                setShowConfirmDialog(false); // Close dialog
                setItemToDelete(null); // Clear item
                setOnConfirmAction(null); // Clear action
            }
        });
        setShowConfirmDialog(true);
    };

    // Callback function for CreateBranchForm after successful creation
    const onBranchCreated = (newBranch) => {
        showFlashMessage('New branch created successfully!', 'success');
        fetchData();
        setActiveView('branches');
    };

    // Callback for UpdateBranchForm after successful update
    const onBranchUpdated = (updatedBranch) => {
        showFlashMessage('Branch updated successfully!', 'success');
        fetchData();
        setActiveView('branches');
        setEditingBranchData(null);
    };

    // --- Branch Admin Handlers ---
    const handleCreateBranchAdminClick = () => {
        setShowAdminsDropdown(false);
        setActiveView('createBranchAdmin');
    };

    const handleViewBranchAdmins = () => {
        setShowAdminsDropdown(false);
        setActiveView('branchAdmins');
        fetchData();
    };

    const handleUpdateBranchAdmin = (admin) => {
        setShowAdminsDropdown(false);
        setEditingBranchAdminData(admin);
        setActiveView('updateBranchAdmin');
    };

    const handleDeleteBranchAdmin = (adminId) => {
        setItemToDelete(adminId);
        setOnConfirmAction(() => async () => {
            try {
                await api.delete(`/branch-admins/${adminId}`);
                showFlashMessage("Branch Admin deleted successfully!", 'success');
                fetchData();
            } catch (err) {
                console.error("Error deleting branch admin:", err.response || err);
                showFlashMessage(`Failed to delete branch admin: ${err.response?.data?.message || err.message}`, 'error');
            } finally {
                setShowConfirmDialog(false);
                setItemToDelete(null);
                setOnConfirmAction(null);
            }
        });
        setShowConfirmDialog(true);
    };

    // Callback for CreateBranchAdminForm after successful creation
    const onBranchAdminCreated = (newAdmin) => {
        showFlashMessage('New branch admin created successfully!', 'success');
        fetchData();
        setActiveView('branchAdmins');
    };

    // Callback for UpdateBranchAdminForm after successful update
    const onBranchAdminUpdated = (updatedAdmin) => {
        showFlashMessage('Branch Admin updated successfully!', 'success');
        fetchData();
        setActiveView('branchAdmins');
        setEditingBranchAdminData(null);
    };

    // --- Employee Handlers ---
    const handleCreateEmployeeClick = () => {
        setShowEmployeesDropdown(false);
        setActiveView('createEmployee');
    };

    const handleViewEmployees = () => {
        setShowEmployeesDropdown(false);
        setActiveView('employees');
        fetchData();
    };

    const handleUpdateEmployee = (employee) => {
        setShowEmployeesDropdown(false);
        setEditingEmployeeData(employee);
        setActiveView('updateEmployee');
    };

    const handleDeleteEmployee = (employeeId) => {
        setItemToDelete(employeeId);
        setOnConfirmAction(() => async () => {
            try {
                await api.delete(`/employees/${employeeId}`);
                showFlashMessage("Employee deleted successfully!", 'success');
                fetchData();
            } catch (err) {
                console.error("Error deleting employee:", err.response || err);
                showFlashMessage(`Failed to delete employee: ${err.response?.data?.message || err.message}`, 'error');
            } finally {
                setShowConfirmDialog(false);
                setItemToDelete(null);
                setOnConfirmAction(null);
            }
        });
        setShowConfirmDialog(true);
    };

    // Callback for CreateEmployeeForm after successful creation
    const onEmployeeCreated = (newEmployee) => {
        showFlashMessage('New employee created successfully!', 'success');
        fetchData();
        setActiveView('employees');
    };

    // Callback for UpdateEmployeeForm after successful update
    const onEmployeeUpdated = (updatedEmployee) => {
        showFlashMessage('Employee updated successfully!', 'success');
        fetchData();
        setActiveView('employees');
        setEditingEmployeeData(null);
    };

    // --- New Report Navigation Handler ---
    const handleGoToReportsHub = () => {
        // This will navigate to the new ReportsHub component
        navigate('/reports-hub');
        // Close any open dropdowns
        setShowBranchesDropdown(false);
        setShowAdminsDropdown(false);
        setShowEmployeesDropdown(false);
    };

    // --- General Navigation ---
    const handleGoHome = () => {
        setActiveView('summary');
        // Close all dropdowns
        setShowBranchesDropdown(false);
        setShowAdminsDropdown(false);
        setShowEmployeesDropdown(false);
        // Removed: setShowReportsDropdown(false);
        // Clear all editing states
        setEditingBranchData(null);
        setEditingBranchAdminData(null);
        setEditingEmployeeData(null);
        // Removed: activeReportView, selectedBranchId
        fetchData(); // Re-fetch data for summary
    };

    // Handle confirmation dialog actions
    const handleConfirm = () => {
        if (onConfirmAction) {
            onConfirmAction();
        }
    };

    const handleCancel = () => {
        setShowConfirmDialog(false);
        setItemToDelete(null);
        setOnConfirmAction(null);
    };

    // Helper component for dropdown buttons (for cleaner JSX)
    const DropdownButton = ({ onClick, children, icon: IconComponent }) => (
        <button
            onClick={onClick}
            className="dropdown-item"
        >
            {IconComponent && <IconComponent className="mr-2" />}
            {children}
        </button>
    );

    // Render loading or error states
    // Consolidated loading/error logic to prevent redundancy
    if (authLoading || loadingData) {
        return (
            <div className="loading-screen">
                <p>Dashboard is loading...</p>
                {/* You can add a spinner here if you have one in your CSS */}
                {/* <div className="loading-spinner"></div> */}
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-screen">
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="super-admin-dashboard-container">
            {/* Flash Message Display Area */}
            <FlashMessage
                message={flashMessage}
                type={flashMessageType}
                onClose={() => {
                    clearTimeout(window.flashMessageTimeout); // Clear auto-hide
                    clearTimeout(window.flashMessageHideTimeout);
                    setFlashMessageAnimationClass('hide'); // Immediately start hide animation
                    setTimeout(() => {
                        setFlashMessage(null);
                        setFlashMessageType('');
                        setFlashMessageAnimationClass('');
                    }, 500); // Matches CSS transition
                }}
                className={flashMessageAnimationClass} // Pass the animation class
            />

            {/* Confirmation Dialog */}
            <ConfirmDialog
                show={showConfirmDialog}
                message="Are you sure you want to delete this item? This action cannot be undone."
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />

            <h1 className="dashboard-title">Super Admin Dashboard</h1>

            {/* Welcome message section */}
            <div className="welcome-message-card">
                <p className="welcome-text">
                    Hello, {userData?.name || userData?.username || 'Super Admin'}!
                </p>
                <p>Your Role: <span className="font-bold">{userData?.role}</span></p>
                <p>From here you can manage branches, admins, and employees.</p>
            </div>

            {/* Main Action Buttons with Dropdowns */}
            <div className="main-actions-grid">
                {/* Home/Summary Button */}
                <button
                    onClick={handleGoHome}
                    className="action-button home-button"
                >
                    <FaHome className="icon" />
                    <span>View Summary</span>
                </button>

                {/* Branches Button and Dropdown */}
                <div className="relative-dropdown" ref={branchesDropdownRef}>
                    <button
                        onClick={toggleBranchesDropdown}
                        className="action-button branch-button"
                    >
                        <FaBuilding className="icon" />
                        <span>Branches</span>
                        <FaChevronDown className={`dropdown-arrow ${showBranchesDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showBranchesDropdown && (
                        <div className="dropdown-menu">
                            <DropdownButton onClick={handleCreateBranchClick} icon={FaPlus}>Add New Branch</DropdownButton>
                            <DropdownButton onClick={handleViewBranches} icon={FaEye}>View Branches</DropdownButton>
                        </div>
                    )}
                </div>

                {/* Admins Button and Dropdown */}
                <div className="relative-dropdown" ref={adminsDropdownRef}>
                    <button
                        onClick={toggleAdminsDropdown}
                        className="action-button admin-button"
                    >
                        <FaUsers className="icon" />
                        <span>Admins</span>
                        <FaChevronDown className={`dropdown-arrow ${showAdminsDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showAdminsDropdown && (
                        <div className="dropdown-menu">
                            <DropdownButton onClick={handleCreateBranchAdminClick} icon={FaPlus}>Add New Branch Admin</DropdownButton>
                            <DropdownButton onClick={handleViewBranchAdmins} icon={FaEye}>View Branch Admins</DropdownButton>
                        </div>
                    )}
                </div>

                {/* Employees Button and Dropdown */}
                <div className="relative-dropdown" ref={employeesDropdownRef}>
                    <button
                        onClick={toggleEmployeesDropdown}
                        className="action-button employee-button"
                    >
                        <FaUserTie className="icon" />
                        <span>Employees</span>
                        <FaChevronDown className={`dropdown-arrow ${showEmployeesDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showEmployeesDropdown && (
                        <div className="dropdown-menu">
                            <DropdownButton onClick={handleCreateEmployeeClick} icon={FaPlus}>Add New Employee</DropdownButton>
                            <DropdownButton onClick={handleViewEmployees} icon={FaEye}>View Employees</DropdownButton>
                        </div>
                    )}
                </div>

                {/* --- NEW REPORTS BUTTON (Navigates to ReportsHub) --- */}
                <button
                    onClick={handleGoToReportsHub}
                    className="action-button report-button"
                >
                    <FaChartBar className="icon" />
                    <span>View Reports</span>
                </button>
            </div>

            {/* Dynamic Content Area based on activeView */}
            {activeView === 'summary' && (
                <div className="summary-section">
                    <h2 className="section-title">System Summary</h2>
                    <div className="summary-cards-grid">
                        <div className="summary-card">
                            <FaBuilding className="summary-icon purple" />
                            <p className="summary-text">Total Branches:</p>
                            <p className="summary-count">{branches.length}</p>
                        </div>
                        <div className="summary-card">
                            <FaUsers className="summary-icon indigo" />
                            <p className="summary-text">Total Branch Admins:</p>
                            <p className="summary-count">{branchAdmins.length}</p>
                        </div>
                        <div className="summary-card">
                            <FaUserTie className="summary-icon teal" />
                            <p className="summary-text">Total Employees:</p>
                            <p className="summary-count">{employees.length}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Branch Forms */}
            {activeView === 'createBranch' && (
                <CreateBranchForm
                    onBranchCreated={onBranchCreated}
                    onCancel={() => setActiveView('branches')}
                />
            )}

            {activeView === 'updateBranch' && editingBranchData && (
                <UpdateBranchForm
                    branchData={editingBranchData}
                    onBranchUpdated={onBranchUpdated}
                    onCancel={() => setActiveView('branches')}
                />
            )}

            {/* Branch Admin Forms */}
            {activeView === 'createBranchAdmin' && (
                <CreateBranchAdminForm
                    onBranchAdminCreated={onBranchAdminCreated}
                    onCancel={() => setActiveView('branchAdmins')}
                    branches={branches}
                />
            )}

            {activeView === 'updateBranchAdmin' && editingBranchAdminData && (
                <UpdateBranchAdminForm
                    adminData={editingBranchAdminData}
                    onBranchAdminUpdated={onBranchAdminUpdated}
                    onCancel={() => setActiveView('branchAdmins')}
                    branches={branches}
                />
            )}

            {/* Employee Forms */}
            {activeView === 'createEmployee' && (
                <CreateEmployeeForm
                    onEmployeeCreated={onEmployeeCreated}
                    onCancel={() => setActiveView('employees')}
                    branches={branches}
                />
            )}

            {activeView === 'updateEmployee' && editingEmployeeData && (
                <UpdateEmployeeForm
                    employeeData={editingEmployeeData}
                    onEmployeeUpdated={onEmployeeUpdated}
                    onCancel={() => setActiveView('employees')}
                    branches={branches}
                />
            )}

            {/* Tables for viewing data */}
            {activeView === 'branches' && (
                <div className="table-section">
                    <div className="table-header">
                        <h2 className="table-title">All Branches</h2>
                        <button onClick={handleCreateBranchClick} className="btn btn-primary">
                            <FaPlus className="mr-2" /> Add New Branch
                        </button>
                    </div>
                    {branches.length === 0 ? (
                        <p className="no-data-message">No branches available. Please add a new branch to see it here.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead className="table-head">
                                    <tr>
                                        <th className="table-th">Name</th>
                                        <th className="table-th">Location</th>
                                        <th className="table-th">Status</th>
                                        <th className="table-th actions-th">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {branches.map(branch => (
                                        <tr key={branch._id} className="table-row">
                                            <td className="table-td">{branch.name}</td>
                                            <td className="table-td">{branch.location}</td>
                                            <td className="table-td">
                                                <span className={`status-badge ${
                                                    branch.status === 'active' ? 'status-active' : 'status-inactive'
                                                }`}>
                                                    {branch.status}
                                                </span>
                                            </td>
                                            <td className="table-td action-buttons">
                                                <button
                                                    onClick={() => handleUpdateBranch(branch)}
                                                    className="action-icon-button edit-button"
                                                    title="Update Branch"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBranch(branch._id)}
                                                    className="action-icon-button delete-button"
                                                    title="Delete Branch"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeView === 'branchAdmins' && (
                <div className="table-section">
                    <div className="table-header">
                        <h2 className="table-title">All Branch Admins</h2>
                        <button onClick={handleCreateBranchAdminClick} className="btn btn-primary">
                            <FaPlus className="mr-2" /> Add New Branch Admin
                        </button>
                    </div>
                    {branchAdmins.length === 0 ? (
                        <p className="no-data-message">No branch admins available. Please add a new branch admin.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead className="table-head">
                                    <tr>
                                        <th className="table-th">Name</th>
                                        <th className="table-th">Email</th>
                                        <th className="table-th">Branch</th>
                                        <th className="table-th actions-th">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {branchAdmins.map(admin => (
                                        <tr key={admin._id} className="table-row">
                                            <td className="table-td">{admin.name}</td>
                                            <td className="table-td">{admin.email}</td>
                                            <td className="table-td">
                                                {/* Ensure branchId is populated by your backend for name to show */}
                                                {admin.branchId ? admin.branchId.name || 'N/A' : 'N/A'}
                                            </td>
                                            <td className="table-td action-buttons">
                                                <button
                                                    onClick={() => handleUpdateBranchAdmin(admin)}
                                                    className="action-icon-button edit-button"
                                                    title="Update Branch Admin"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBranchAdmin(admin._id)}
                                                    className="action-icon-button delete-button"
                                                    title="Delete Branch Admin"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeView === 'employees' && (
                <div className="table-section">
                    <div className="table-header">
                        <h2 className="table-title">All Employees</h2>
                        <button onClick={handleCreateEmployeeClick} className="btn btn-primary">
                            <FaPlus className="mr-2" /> Add New Employee
                        </button>
                    </div>
                    {employees.length === 0 ? (
                        <p className="no-data-message">No employees available. Please add a new employee.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead className="table-head">
                                    <tr>
                                        <th className="table-th">Name</th>
                                        <th className="table-th">Email</th>
                                        <th className="table-th">Role</th>
                                        <th className="table-th">Branch</th>
                                        <th className="table-th actions-th">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {employees.map(employee => (
                                        <tr key={employee._id} className="table-row">
                                            <td className="table-td">{employee.name}</td>
                                            <td className="table-td">{employee.email}</td>
                                            <td className="table-td">{employee.role}</td>
                                            <td className="table-td">
                                                {/* Ensure branchId is populated by your backend for name to show */}
                                                {employee.branchId ? employee.branchId.name || 'N/A' : 'N/A'}
                                            </td>
                                            <td className="table-td action-buttons">
                                                <button
                                                    onClick={() => handleUpdateEmployee(employee)}
                                                    className="action-icon-button edit-button"
                                                    title="Update Employee"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEmployee(employee._id)}
                                                    className="action-icon-button delete-button"
                                                    title="Delete Employee"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Removed all conditional rendering for reports here.
                The ReportsHub component will now handle displaying reports. */}
            {/* {activeView === 'reports' && activeReportView === 'overall' && (...) } */}
            {/* {activeView === 'reports' && activeReportView === 'branchDetails' && selectedBranchId && (...) } */}
            {/* {activeView === 'reports' && activeReportView === 'branchDetails' && !selectedBranchId && (...) } */}
            {/* Removed the direct BranchSelector as it's part of ReportsHub now */}
            {/* <div className="dashboard-section">
                <h2>View Specific Branch Reports</h2>
                <BranchSelector />
                <p className="mt-2 text-muted">Select a branch to view its detailed report.</p>
            </div> */}
        </div>

    );
};

export default SuperAdminDashboard;