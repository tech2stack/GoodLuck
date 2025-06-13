import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
// Icons for buttons and tables
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaBuilding, FaUsers, FaUserTie, FaEye, FaHome, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Import the new form components
import CreateBranchForm from '../components/forms/CreateBranchForm';
import CreateBranchAdminForm from '../components/forms/CreateBranchAdminForm';

const SuperAdminDashboard = () => {
    const { userData, loading: authLoading, isLoggedIn } = useAuth();
    const navigate = useNavigate(); // For navigating to other pages (e.g., update forms)

    // State for storing fetched data
    const [branches, setBranches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [branchAdmins, setBranchAdmins] = useState([]); // State for branch admins data
    const [loadingData, setLoadingData] = useState(true); // State to track overall data fetching
    const [error, setError] = useState(null); // State for error messages

    // States for controlling dropdown visibility
    const [showBranchesDropdown, setShowBranchesDropdown] = useState(false);
    const [showAdminsDropdown, setShowAdminsDropdown] = useState(false);
    const [showEmployeesDropdown, setShowEmployeesDropdown] = useState(false);

    // Refs for handling clicks outside dropdowns (to close them)
    const branchesDropdownRef = useRef(null);
    const adminsDropdownRef = useRef(null);
    const employeesDropdownRef = useRef(null);

    // State to control which section is displayed in the main content area
    // Options: 'summary', 'branches', 'employees', 'branchAdmins', 'createBranch', 'createBranchAdmin', 'createEmployee'
    const [activeView, setActiveView] = useState('summary');

    // Function to fetch all necessary dashboard data
    const fetchData = async () => {
        try {
            setLoadingData(true);
            setError(null); // Clear previous errors

            // Fetch branches data
            const branchesResponse = await api.get('/branches');
            setBranches(branchesResponse.data.data);
            console.log('Branches fetched:', branchesResponse.data.data);

            // Fetch employees data
            const employeesResponse = await api.get('/employees');
            setEmployees(employeesResponse.data.data);
            console.log('Employees fetched:', employeesResponse.data.data);

            // Fetch branch admins data (assuming this endpoint exists and returns data.data)
            const branchAdminsResponse = await api.get('/branch-admins');
            setBranchAdmins(branchAdminsResponse.data.data);
            console.log('Branch Admins fetched:', branchAdminsResponse.data.data);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response ? err.response.data.message : 'Failed to load data.');
        } finally {
            setLoadingData(false);
        }
    };

    // useEffect to manage data fetching based on authentication status
    useEffect(() => {
        // 1. Wait for AuthContext to finish loading
        if (authLoading) {
            setLoadingData(true);
            return;
        }

        // 2. If user is not logged in or not a Super Admin, show permission error
        if (!isLoggedIn || !userData || userData.role !== 'super_admin') {
            setError('You do not have permission to access this dashboard. Please log in as a Super Admin.');
            setLoadingData(false); // Stop data fetching loading as there's an error
            return;
        }

        // If we reach here, it means the user is authenticated as a Super Admin.
        // Fetch dashboard data.
        fetchData();
    }, [userData, authLoading, isLoggedIn]); // Dependencies: userData, authLoading, isLoggedIn from AuthContext

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

    // Dropdown action handlers and view setters
    const handleCreateBranchClick = () => {
        setShowBranchesDropdown(false); // Close dropdown
        setActiveView('createBranch'); // Set active view to show CreateBranchForm
    };

    const handleViewBranches = () => {
        setShowBranchesDropdown(false); // Close dropdown
        setActiveView('branches'); // Set active view to show branches table
    };

    const handleUpdateBranch = (branchId) => {
        setShowBranchesDropdown(false); // Close dropdown
        // This would typically navigate to an edit form for a specific branch.
        // For now, we'll navigate to a generic update page or open a modal.
        // You would replace this with your actual route: navigate(`/branches/update/${branchId}`);
        console.log("Navigating to update branch:", branchId);
        alert(`Implement update for branch ID: ${branchId}`); // Temporary alert
    };

    // New: Handle Branch Delete
    const handleDeleteBranch = async (branchId) => {
        if (window.confirm("Are you sure you want to delete this branch? This action cannot be undone.")) {
            try {
                await api.delete(`/branches/${branchId}`);
                console.log("Branch deleted successfully:", branchId);
                fetchData(); // Refresh branches list after deletion
                alert("Branch deleted successfully!");
            } catch (err) {
                console.error("Error deleting branch:", err.response || err);
                alert(`Failed to delete branch: ${err.response?.data?.message || err.message}`);
            }
        }
    };


    const handleCreateBranchAdminClick = () => {
        setShowAdminsDropdown(false); // Close dropdown
        setActiveView('createBranchAdmin'); // Set active view to show CreateBranchAdminForm
    };

    const handleViewBranchAdmins = () => {
        setShowAdminsDropdown(false); // Close dropdown
        setActiveView('branchAdmins'); // Set active view to show branch admins table
    };

    const handleUpdateBranchAdmin = (adminId) => {
        setShowAdminsDropdown(false); // Close dropdown
        // You would replace this with your actual route: navigate(`/branch-admins/update/${adminId}`);
        console.log("Navigating to update branch admin:", adminId);
        alert(`Implement update for branch admin ID: ${adminId}`); // Temporary alert
    };

    // New: Handle Branch Admin Delete
    const handleDeleteBranchAdmin = async (adminId) => {
        if (window.confirm("Are you sure you want to delete this branch admin? This action cannot be undone.")) {
            try {
                await api.delete(`/branch-admins/${adminId}`);
                console.log("Branch Admin deleted successfully:", adminId);
                fetchData(); // Refresh branch admins list after deletion
                alert("Branch Admin deleted successfully!");
            } catch (err) {
                console.error("Error deleting branch admin:", err.response || err);
                alert(`Failed to delete branch admin: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    const handleCreateEmployeeClick = () => {
        setShowEmployeesDropdown(false); // Close dropdown
        setActiveView('createEmployee'); // Set active view to show CreateEmployeeForm
        // navigate('/create-employee'); // If you want to navigate to a separate page
    };

    const handleViewEmployees = () => {
        setShowEmployeesDropdown(false); // Close dropdown
        setActiveView('employees'); // Set active view to show employees table
    };

    const handleUpdateEmployee = (employeeId) => {
        setShowEmployeesDropdown(false); // Close dropdown
        // You would replace this with your actual route: navigate(`/employees/update/${employeeId}`);
        console.log("Navigating to update employee:", employeeId);
        alert(`Implement update for employee ID: ${employeeId}`); // Temporary alert
    };

    // New: Handle Employee Delete (placeholder for now)
    const handleDeleteEmployee = async (employeeId) => {
        if (window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
            try {
                // await api.delete(`/employees/${employeeId}`); // Uncomment and implement when ready
                console.log("Employee delete logic to be implemented:", employeeId);
                // fetchData(); // Refresh employees list after deletion
                alert("Employee delete functionality is pending implementation!");
            } catch (err) {
                console.error("Error deleting employee:", err.response || err);
                alert(`Failed to delete employee: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    // Go back to the summary view
    const handleGoHome = () => {
        setActiveView('summary');
        // Close all dropdowns when navigating to home
        setShowBranchesDropdown(false);
        setShowAdminsDropdown(false);
        setShowEmployeesDropdown(false);
    };

    // Callback function for CreateBranchForm after successful creation
    const onBranchCreated = (newBranch) => {
        console.log('New branch created successfully:', newBranch);
        fetchData(); // Refresh all data to show the new branch in the list
        setActiveView('branches'); // Optionally, switch to viewing branches after creation
    };

    // Callback function for CreateBranchAdminForm after successful creation
    const onBranchAdminCreated = (newAdmin) => {
        console.log('New branch admin created successfully:', newAdmin);
        fetchData(); // Refresh all data to show the new admin in the list
        setActiveView('branchAdmins'); // Optionally, switch to viewing branch admins
    };

    // Helper component for dropdown buttons (for cleaner JSX)
    const DropdownButton = ({ onClick, children, icon: IconComponent }) => (
        <button
            onClick={onClick}
            className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
        >
            {IconComponent && <IconComponent className="mr-2" />}
            {children}
        </button>
    );

    // Render loading or error states
    if (authLoading || loadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">Dashboard is loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                <p className="text-xl font-semibold">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                सुपर एडमिन डैशबोर्ड
            </h1>

            {/* Welcome message section */}
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8 rounded-md shadow-sm">
                <p className="font-semibold text-lg">
                    नमस्ते, {userData?.name || userData?.username}!
                </p>
                <p>आपकी भूमिका: <span className="font-bold">{userData?.role}</span></p>
                <p>आप यहाँ से शाखाओं, एडमिन और कर्मचारियों का प्रबंधन कर सकते हैं।</p>
            </div>

            {/* Main Action Buttons with Dropdowns */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
                {/* Home/Summary Button */}
                <button
                    onClick={handleGoHome}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-transform duration-200 transform hover:scale-105"
                >
                    <FaHome className="text-xl" />
                    <span>सारांश देखें</span>
                </button>

                {/* Branches Button and Dropdown */}
                <div className="relative" ref={branchesDropdownRef}>
                    <button
                        onClick={toggleBranchesDropdown}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-transform duration-200 transform hover:scale-105"
                    >
                        <FaBuilding className="text-xl" />
                        <span>शाखाएँ</span>
                        <FaChevronDown className={`ml-2 transition-transform duration-200 ${showBranchesDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showBranchesDropdown && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-200">
                            <DropdownButton onClick={handleCreateBranchClick} icon={FaPlus}>नई शाखा जोड़ें</DropdownButton>
                            <DropdownButton onClick={handleViewBranches} icon={FaEye}>शाखाएँ देखें</DropdownButton>
                            <DropdownButton onClick={() => handleUpdateBranch('')} icon={FaEdit}>शाखा अपडेट करें</DropdownButton> {/* Generic update for now */}
                        </div>
                    )}
                </div>

                {/* Admins Button and Dropdown */}
                <div className="relative" ref={adminsDropdownRef}>
                    <button
                        onClick={toggleAdminsDropdown}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-transform duration-200 transform hover:scale-105"
                    >
                        <FaUsers className="text-xl" />
                        <span>एडमिन</span>
                        <FaChevronDown className={`ml-2 transition-transform duration-200 ${showAdminsDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showAdminsDropdown && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-200">
                            <DropdownButton onClick={handleCreateBranchAdminClick} icon={FaPlus}>नया ब्रांच एडमिन जोड़ें</DropdownButton>
                            <DropdownButton onClick={handleViewBranchAdmins} icon={FaEye}>ब्रांच एडमिन देखें</DropdownButton>
                            <DropdownButton onClick={() => handleUpdateBranchAdmin('')} icon={FaEdit}>ब्रांच एडमिन अपडेट करें</DropdownButton>
                        </div>
                    )}
                </div>

                {/* Employees Button and Dropdown */}
                <div className="relative" ref={employeesDropdownRef}>
                    <button
                        onClick={toggleEmployeesDropdown}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-transform duration-200 transform hover:scale-105"
                    >
                        <FaUserTie className="text-xl" />
                        <span>कर्मचारी</span>
                        <FaChevronDown className={`ml-2 transition-transform duration-200 ${showEmployeesDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showEmployeesDropdown && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-200">
                            <DropdownButton onClick={handleCreateEmployeeClick} icon={FaPlus}>नया कर्मचारी जोड़ें</DropdownButton>
                            <DropdownButton onClick={handleViewEmployees} icon={FaEye}>कर्मचारी देखें</DropdownButton>
                            <DropdownButton onClick={() => handleUpdateEmployee('')} icon={FaEdit}>कर्मचारी अपडेट करें</DropdownButton>
                        </div>
                    )}
                </div>
            </div>

            {/* Dynamic Content Area based on activeView */}
            {activeView === 'summary' && (
                <div className="text-center text-gray-600 text-lg p-8 bg-white rounded-lg shadow-md">
                    <p>डैशबोर्ड में आपका स्वागत है! प्रबंधन शुरू करने के लिए ऊपर दिए गए विकल्पों में से किसी एक को चुनें।</p>
                    <div className="mt-8 flex flex-wrap justify-around items-center gap-6">
                        <div className="text-center p-4 bg-gray-100 rounded-lg shadow-sm w-48">
                            <FaBuilding className="text-5xl text-purple-600 mx-auto mb-2" />
                            <p className="text-xl font-semibold">कुल शाखाएँ: {branches.length}</p>
                        </div>
                        <div className="text-center p-4 bg-gray-100 rounded-lg shadow-sm w-48">
                            <FaUsers className="text-5xl text-indigo-600 mx-auto mb-2" />
                            <p className="text-xl font-semibold">कुल ब्रांच एडमिन: {branchAdmins.length}</p>
                        </div>
                        <div className="text-center p-4 bg-gray-100 rounded-lg shadow-sm w-48">
                            <FaUserTie className="text-5xl text-teal-600 mx-auto mb-2" />
                            <p className="text-xl font-semibold">कुल कर्मचारी: {employees.length}</p>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'createBranch' && (
                <CreateBranchForm
                    onBranchCreated={onBranchCreated}
                    onCancel={() => setActiveView('branches')} // Go back to branches view on cancel
                />
            )}

            {activeView === 'createBranchAdmin' && (
                <CreateBranchAdminForm
                    onBranchAdminCreated={onBranchAdminCreated}
                    onCancel={() => setActiveView('branchAdmins')} // Go back to branch admins view on cancel
                />
            )}

            {/* Placeholder for Create Employee Form */}
            {activeView === 'createEmployee' && (
                 <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-200 text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">नया कर्मचारी जोड़ें</h2>
                    <p className="text-gray-600 mb-4">कर्मचारी फॉर्म यहाँ जाएगा।</p>
                    <button
                        type="button"
                        onClick={() => setActiveView('employees')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center mx-auto transition duration-200 transform hover:scale-105"
                    >
                        <FaTimes className="mr-2" /> रद्द करें
                    </button>
                </div>
            )}

            {activeView === 'branches' && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-semibold text-gray-700">सभी शाखाएँ</h2>
                    </div>
                    {branches.length === 0 ? (
                        <p className="text-gray-600">कोई शाखा उपलब्ध नहीं है।</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">नाम</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">स्थान</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">स्थिति</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">कार्यवाही</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {branches.map(branch => (
                                        <tr key={branch._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{branch.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    branch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {branch.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {/* Update button */}
                                                <button
                                                    onClick={() => handleUpdateBranch(branch._id)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    title="Update Branch"
                                                >
                                                    <FaEdit />
                                                </button>
                                                {/* Delete button */}
                                                <button
                                                    onClick={() => handleDeleteBranch(branch._id)}
                                                    className="text-red-600 hover:text-red-900"
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
                <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-semibold text-gray-700">सभी ब्रांच एडमिन</h2>
                    </div>
                    {branchAdmins.length === 0 ? (
                        <p className="text-gray-600">कोई ब्रांच एडमिन उपलब्ध नहीं है।</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">नाम</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ईमेल</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">शाखा</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">कार्यवाही</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {branchAdmins.map(admin => (
                                        <tr key={admin._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{admin.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {/* Ensure branchId is populated and has a 'name' property from backend */}
                                                {admin.branchId ? admin.branchId.name || 'N/A' : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {/* Update button */}
                                                <button
                                                    onClick={() => handleUpdateBranchAdmin(admin._id)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    title="Update Branch Admin"
                                                >
                                                    <FaEdit />
                                                </button>
                                                {/* Delete button */}
                                                <button
                                                    onClick={() => handleDeleteBranchAdmin(admin._id)}
                                                    className="text-red-600 hover:text-red-900"
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
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-semibold text-gray-700">सभी कर्मचारी</h2>
                    </div>
                    {employees.length === 0 ? (
                        <p className="text-gray-600">कोई कर्मचारी उपलब्ध नहीं है।</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">नाम</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ईमेल</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">भूमिका</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">शाखा</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">कार्यवाही</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {employees.map(employee => (
                                        <tr key={employee._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {/* Ensure branchId is populated and has a 'name' property from backend */}
                                                {employee.branchId ? employee.branchId.name || 'N/A' : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {/* Update button */}
                                                <button
                                                    onClick={() => handleUpdateEmployee(employee._id)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    title="Update Employee"
                                                >
                                                    <FaEdit />
                                                </button>
                                                {/* Delete button */}
                                                <button
                                                    onClick={() => handleDeleteEmployee(employee._id)}
                                                    className="text-red-600 hover:text-red-900"
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
        </div>
    );
};

export default SuperAdminDashboard;
