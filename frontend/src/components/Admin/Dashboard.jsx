import React, { useState, useEffect } from 'react';
import { 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle, 
  FaArrowUp,
  FaUsers,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBullseye,
  FaChartLine
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Tooltip,
  Legend
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

// Create axios instance with token if it exists
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// ✅ NEW: Role Mapping Function
const mapRoleToDisplayName = (apiRole) => {
  const roleMapping = {
    'ro-aro': 'RO/ARO',
    'entry-operator': 'Entry Operator',
    'review-operator': 'Review Operator', 
    'so-us': 'Section Officer',
    'ds-js': 'DS/JS',
    'sec': 'Secretary',
    'cio-io': 'CIO/IO',
    'dea-assis': 'DEA Assistant'
  };
  
  // Convert to lowercase for comparison and return mapped name or original
  const normalizedRole = apiRole?.toLowerCase?.() || '';
  return roleMapping[normalizedRole] || apiRole || 'Unknown Role';
};

// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Card Components
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-white text-gray-900 shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Badge Component
const Badge = ({ children, variant = "default", className, ...props }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        getVariantClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Button Component
const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900';
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-9 rounded-md px-3 text-sm';
      case 'lg':
        return 'h-11 rounded-md px-8';
      default:
        return 'h-10 px-4 py-2';
    }
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Tabs Components
const Tabs = ({ value, onValueChange, children, defaultValue, className, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value);
  
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, onTabChange: handleTabChange })
      )}
    </div>
  );
};

const TabsList = ({ children, className, activeTab, onTabChange, ...props }) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
      className
    )}
    {...props}
  >
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, onTabChange })
    )}
  </div>
);

const TabsTrigger = ({ value, children, activeTab, onTabChange, className, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
      activeTab === value ? "bg-white text-gray-900 shadow-sm" : "",
      className
    )}
    onClick={() => onTabChange(value)}
    {...props}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab, className, ...props }) => {
  if (activeTab !== value) return null;
  
  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Custom Tooltip Components
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg cursor-pointer">
        <p className="text-gray-900 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Main Dashboard Component
const Dashboard = ({ userRole = "Administrator" }) => {
  // ✅ API State Management + Date Picker State
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [workloadData, setWorkloadData] = useState([]);
  const [showMonthlyTab, setShowMonthlyTab] = useState(false);
  
  // ✅ NEW: Performance Dashboard State
  const [performanceData, setPerformanceData] = useState(null);
  
  // ✅ NEW: Compliance Section State
  const [complianceData, setComplianceData] = useState({
    overallCompliance: 86,
    totalComplaints: 0,
    approvedPercentage: 0
  });
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  
  // ✅ Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));

  // ✅ NEW: Fetch Performance Dashboard Data
  const fetchPerformanceData = async () => {
    try {
      console.log('🔄 Fetching performance dashboard data...');
      const response = await api.get('/admin/get-performance-dashboard');
      console.log('📊 Performance Dashboard API Response:', response.data);
      
      if (response.data && response.data.status && response.data.data) {
        setPerformanceData(response.data.data);
        console.log('✅ Performance data updated successfully');
      }
    } catch (error) {
      console.error('💥 Error fetching performance data:', error);
    }
  };

  // ✅ NEW: Fetch Compliance Data
  const fetchComplianceData = async () => {
    try {
      console.log('🔄 Fetching compliance data...');
      const response = await api.get('/admin/get-compliance');
      console.log('📊 Compliance API Response:', response.data);
      
      if (response.data && response.data.status && response.data.data) {
        const { total_complaints, approved_percentage } = response.data.data;
        setComplianceData({
          overallCompliance: parseFloat(approved_percentage) || 0,
          totalComplaints: parseInt(total_complaints) || 0,
          approvedPercentage: parseFloat(approved_percentage) || 0
        });
        console.log('✅ Compliance data updated successfully');
      }
    } catch (error) {
      console.error('💥 Error fetching compliance data:', error);
    }
  };

  // ✅ NEW: Fetch Active Users Count
  const fetchActiveUsersCount = async () => {
    try {
      console.log('🔄 Fetching active users count...');
      const response = await api.get('/admin/get-all-active-users');
      console.log('👥 Active Users API Response:', response.data);
      
      if (response.data && response.data.status) {
        setActiveUsersCount(parseInt(response.data.data) || 0);
        console.log('✅ Active users count updated successfully');
      }
    } catch (error) {
      console.error('💥 Error fetching active users count:', error);
    }
  };

  // ✅ NEW: Fetch Department Count
  const fetchDepartmentCount = async () => {
    try {
      console.log('🔄 Fetching department count...');
      const response = await api.get('/admin/get-all-department-count');
      console.log('🏢 Department Count API Response:', response.data);
      
      if (response.data && response.data.status) {
        setDepartmentCount(parseInt(response.data.data) || 0);
        console.log('✅ Department count updated successfully');
      }
    } catch (error) {
      console.error('💥 Error fetching department count:', error);
    }
  };

  // ✅ NEW: Fetch Weekly Graph Data
  const fetchWeeklyData = async () => {
    try {
      console.log('🔄 Fetching weekly graph data...');
      const response = await api.get('/admin/getWeeklyGraph');
      console.log('📊 Weekly API Response:', response.data);
      
      if (response.data && response.data.labels) {
        const { labels, progress, disposed, ui } = response.data;
        
        // ✅ Transform API data to chart format (WITHOUT total)
        const weeklyChartData = labels.map((label, index) => ({
          day: label,
          progress: progress[index] || 0,      // ✅ In progress
          disposed: disposed[index] || 0,      // ✅ Disposed
          underInvestigation: ui[index] || 0   // ✅ Under investigation
        }));
        
        console.log('🔄 Transformed weekly data:', weeklyChartData);
        
        // ✅ Force state update
        setWeeklyData([...weeklyChartData]);
        
        console.log('✅ WeeklyData state updated successfully');
      } else {
        console.error('❌ Invalid API response structure:', response.data);
      }
    } catch (error) {
      console.error('💥 Error fetching weekly data:', error);
      console.error('💥 Error details:', error.response?.data);
    }
  };

  // ✅ UPDATED: Fetch Role-wise Workload Data with Role Mapping
  const fetchWorkloadData = async () => {
    try {
      console.log('🔄 Fetching role-wise workload data...');
      const response = await api.get('/admin/role-wise-reports');
      console.log('📊 Workload API Response:', response.data);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // ✅ Transform API data to chart format with role mapping
        const workloadChartData = response.data.data.map((role) => ({
          role: mapRoleToDisplayName(role.sub_role_name), // ✅ Use mapped role name
          pending: parseInt(role.total_pending_complains) || 0,   // ✅ Pending complaints
          completed: parseInt(role.total_approved_complains) || 0  // ✅ Approved/Completed complaints
        }));
        
        console.log('🔄 Transformed workload data with role mapping:', workloadChartData);
        
        // ✅ Set workload data
        setWorkloadData(workloadChartData);
        
        console.log('✅ WorkloadData state updated successfully');
      } else {
        console.error('❌ Invalid workload API response structure:', response.data);
      }
    } catch (error) {
      console.error('💥 Error fetching workload data:', error);
      console.error('💥 Error details:', error.response?.data);
      
      // ✅ Fallback to empty array if API fails
      setWorkloadData([]);
    }
  };

  // ✅ Add useEffect to log state changes
  useEffect(() => {
    console.log('🔄 WeeklyData state changed:', weeklyData);
  }, [weeklyData]);

  useEffect(() => {
    console.log('🔄 WorkloadData state changed:', workloadData);
  }, [workloadData]);

  // ✅ UPDATED: API Data Fetching Function
  const fetchDashboardData = async (monthParam) => {
    try {
      // 1. Dashboard Stats API
      const dashResponse = await api.get(`/admin/dashboard/${monthParam}`);
      if (dashResponse.data.status) {
        setDashboardData(dashResponse.data.dataDashboard);
      }

      // 2. Monthly Complaint API
      const monthlyResponse = await api.get('/admin/montly-complaint');
      if (monthlyResponse.data) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyTrends = months.map((month, index) => ({
          month,
          received: monthlyResponse.data.total[index] || 0,
          disposed: monthlyResponse.data.approved[index] || 0,
          rejected: monthlyResponse.data.rejected[index] || 0
        }));
        setMonthlyData(monthlyTrends);
      }

      // 3. Status Distribution API
      const statusResponse = await api.get('/admin/status-distribution');
      if (statusResponse.data && statusResponse.data.data) {
        const statusInfo = statusResponse.data.data;
        const statusDistribution = [
          { 
            name: 'Pending', 
            value: Math.round((parseFloat(statusInfo.pending_percentage) / 100) * statusInfo.total_complains),
            color: '#f59e0b' 
          },
          { 
            name: 'Approved', 
            value: Math.round((parseFloat(statusInfo.approved_percentage) / 100) * statusInfo.total_complains),
            color: '#10b981' 
          },
          { 
            name: 'Rejected', 
            value: Math.round((parseFloat(statusInfo.rejected_percentage) / 100) * statusInfo.total_complains),
            color: '#ef4444' 
          },
          { 
            name: 'Investigation', 
            value: Math.round((parseFloat(statusInfo.investigation_percentage) / 100) * statusInfo.total_complains),
            color: '#3b82f6' 
          }
        ];
        setStatusData(statusDistribution);
      }

      // 4. Department-wise API
      const deptResponse = await api.get('/admin/department-wise-complaint');
      if (deptResponse.data.status) {
        const deptData = Object.entries(deptResponse.data.data).map(([department, complaints]) => ({
          department,
          complaints,
          percentage: Math.round((complaints / Object.values(deptResponse.data.data).reduce((a, b) => a + b, 0)) * 100)
        }));
        setDepartmentData(deptData);
      }

      // 5. District-wise API
      const districtResponse = await api.get('/admin/district-wise-company-type');
      if (districtResponse.data) {
        const { district, total, allegations, grievances } = districtResponse.data;
        const districtFormatted = district.map((districtName, index) => ({
          district: districtName,
          total: total[index] || 0,
          allegation: parseInt(allegations[index]) || 0,
          grievance: parseInt(grievances[index]) || 0
        }));
        setDistrictData(districtFormatted);
      }

      // ✅ 6. Fetch Weekly Data
      await fetchWeeklyData();

      // ✅ 7. Fetch Workload Data
      await fetchWorkloadData();

      // ✅ 8. NEW: Fetch Performance Dashboard Data
      await fetchPerformanceData();

      // ✅ 9. NEW: Fetch Compliance Section Data
      await fetchComplianceData();
      await fetchActiveUsersCount();
      await fetchDepartmentCount();

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // ✅ Initial Data Fetch
  useEffect(() => {
    fetchDashboardData(currentMonth);
  }, [currentMonth]);

  // ✅ Handle Date Picker Change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    const newMonth = date.toISOString().slice(0, 7); // YYYY-MM format
    setCurrentMonth(newMonth);
    fetchDashboardData(newMonth);
  };

  // ✅ Refresh to Current Month
  const handleRefresh = () => {
    const now = new Date();
    setSelectedDate(now);
    const currentMonthYear = now.toISOString().slice(0, 7);
    setCurrentMonth(currentMonthYear);
    fetchDashboardData(currentMonthYear);
  };

  // Sample data for charts with realistic values (keeping original for other tabs)
  const processingTimeData = [
    { stage: 'Entry to Rejected', avg: 2.3, target: 3 },
    { stage: 'Rejected to Forward', avg: 4.1, target: 5 },
    { stage: 'Forward to Assignment', avg: 1.8, target: 2 },
    { stage: 'Assignment to Investigation', avg: 12.5, target: 15 },
    { stage: 'Investigation to Decision', avg: 18.7, target: 20 },
    { stage: 'Decision to Disposal', avg: 3.2, target: 5 }
  ];

  // Add CSS class for cursor pointer on chart elements
  const chartStyles = `
    .recharts-bar-rectangle,
    .recharts-line-dot,
    .recharts-line,
    .recharts-area,
    .recharts-pie-sector,
    .recharts-legend-item {
      cursor: pointer !important;
    }
    .recharts-tooltip-wrapper {
      cursor: pointer !important;
    }
  `;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Add styles for chart cursor pointer */}
      <style>{chartStyles}</style>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard / डैशबोर्ड</h1>
          <p className="text-gray-600">
            Welcome back, {userRole} • Last updated: {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 relative">
          {/* ✅ UPDATED: Month-Year Picker Button with Purple Icon */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <FaCalendarAlt className="h-4 w-4 mr-2 text-purple-600" />
            {selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </Button>

          {/* ✅ Date Picker Dropdown */}
          {showDatePicker && (
            <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                showFullMonthYearPicker
                minDate={new Date('2022-01-01')}
                maxDate={new Date('2025-12-31')}
                inline
                className="border-0"
              />
            </div>
          )}

          {/* ✅ UPDATED: Refresh Button with Orange Icon */}
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <FaChartLine className="h-4 w-4 mr-2 text-orange-600" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Monthly Tab */}
      {showMonthlyTab && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Monthly Data - {selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center cursor-pointer">
              <div className="text-2xl font-bold text-blue-600">{dashboardData?.totalcomplains || 0}</div>
              <div className="text-sm text-gray-600">Total This Month</div>
            </div>
            <div className="text-center cursor-pointer">
              <div className="text-2xl font-bold text-green-600">{dashboardData?.approvedcomplains || 0}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center cursor-pointer">
              <div className="text-2xl font-bold text-red-600">{dashboardData?.rejectedcomplains || 0}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="text-center cursor-pointer">
              <div className="text-2xl font-bold text-yellow-600">{dashboardData?.pendingcomplains || 0}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      )}

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">

        {/* Total Complaints */}
        <div className="p-5 rounded-2xl shadow-md border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <FaFileAlt className="text-2xl text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">Total Complaints</h3>
            </div>
            <div className="text-green-600 text-sm font-semibold">↑</div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-blue-900">
            {dashboardData?.totalcomplains || 0}
          </div>
          <div className="text-sm text-blue-700">All time</div>
        </div>

        {/* Today's Entry */}
        <div className="p-5 rounded-2xl shadow-md border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <FaClock className="text-2xl text-indigo-600" />
              <h3 className="text-sm font-medium text-indigo-800">Today's Entry</h3>
            </div>
            <div className="text-green-600 text-sm font-semibold">↑</div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-indigo-900">
            {dashboardData?.todaycomplains || 0}
          </div>
          <div className="text-sm text-indigo-700">New complaints</div>
        </div>

        {/* Approved */}
        <div className="p-5 rounded-2xl shadow-md border border-green-200 bg-green-50 hover:bg-green-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-2xl text-green-600" />
              <h3 className="text-sm font-medium text-green-800">Approved</h3>
            </div>
            <div className="text-green-600 text-sm font-semibold">↑</div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-green-900">
            {dashboardData?.approvedcomplains || 0}
          </div>
          <div className="text-sm text-green-700">Disposed cases</div>
        </div>

        {/* Rejected */}
        <div className="p-5 rounded-2xl shadow-md border border-red-200 bg-red-50 hover:bg-red-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <FaTimesCircle className="text-2xl text-red-600" />
              <h3 className="text-sm font-medium text-red-800">Rejected</h3>
            </div>
            <div className="text-red-600 text-sm font-semibold">↓</div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-red-900">
            {dashboardData?.rejectedcomplains || 0}
          </div>
          <div className="text-sm text-red-700">Rejected cases</div>
        </div>

        {/* Pending */}
        <div className="p-5 rounded-2xl shadow-md border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <FaExclamationTriangle className="text-2xl text-yellow-600" />
              <h3 className="text-sm font-medium text-yellow-800">Pending</h3>
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-yellow-900">
            {dashboardData?.pendingcomplains || 0}
          </div>
          <div className="text-sm text-yellow-700">In progress</div>
        </div>

        {/* Avg. Processing */}
        <div className="p-5 rounded-2xl shadow-md border border-teal-200 bg-teal-50 hover:bg-teal-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <FaClock className="text-2xl text-teal-600" />
              <h3 className="text-sm font-medium text-teal-800">Avg. pending</h3>
            </div>
            <div className="text-red-600 text-sm font-semibold">↓</div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-teal-900">
            {dashboardData?.avgPendingDays || '0'} days
          </div>
          <div className="text-sm text-teal-700">Average time</div>
        </div>

      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends Chart */}
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle>Monthly Complaint Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="received" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      name="Received"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="disposed" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      name="Approved"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rejected" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      name="Rejected"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution Pie Chart */}
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle>Current Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department-wise Bar Chart */}
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle>Department-wise Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={departmentData} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="department" type="category" width={100} stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="complaints" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* District-wise Stacked Bar Chart */}
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle>District-wise Allegations vs Grievances</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={districtData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="district" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="allegation" stackId="a" fill="#ef4444" name="Allegations" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="grievance" stackId="a" fill="#f59e0b" name="Grievances" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ✅ Weekly Activity Area Chart with API Data (WITHOUT Total) */}
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle>Weekly Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart 
                    data={weeklyData} 
                    key={JSON.stringify(weeklyData)} // ✅ Force re-render when data changes
                  >
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDisposed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="progress" 
                      stackId="1" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorProgress)"
                      name="In Progress"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="disposed" 
                      stackId="1" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorDisposed)"
                      name="Disposed"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="underInvestigation" 
                      stackId="1" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorUI)"
                      name="Under Investigation"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Processing Time vs Target */}
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle>Processing Time vs Target (Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={processingTimeData} layout="vertical" margin={{ left: 150 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis dataKey="stage" type="category" width={150} stroke="#6b7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="avg" fill="#3b82f6" name="Actual Time" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="target" fill="#e5e7eb" name="Target Time" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
      
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* <Card className="cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceData?.total_complaints || 0}
                </div>
                <div className="text-sm text-gray-500">All complaints</div>
              </CardContent>
            </Card> */}

            <Card className="cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pending SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {performanceData?.pending_percentage || 0}%
                  </div>
                  <Badge 
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-600"
                  >
                    In Progress
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2 cursor-pointer">
                  <div 
                    className="h-2 rounded-full transition-all duration-300 bg-yellow-600"
                    style={{ width: `${Math.min(parseFloat(performanceData?.pending_percentage || 0), 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Investigation SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {performanceData?.investigation_percentage || 0}%
                  </div>
                  <Badge 
                    variant="default"
                    className="bg-blue-100 text-blue-600"
                  >
                    Active
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2 cursor-pointer">
                  <div 
                    className="h-2 rounded-full transition-all duration-300 bg-blue-600"
                    style={{ width: `${Math.min(parseFloat(performanceData?.investigation_percentage || 0), 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Approved SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {performanceData?.approved_percentage || 0}%
                  </div>
                  <Badge 
                    variant="default"
                    className="bg-green-100 text-green-600"
                  >
                    Completed
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2 cursor-pointer">
                  <div 
                    className="h-2 rounded-full transition-all duration-300 bg-green-600"
                    style={{ width: `${Math.min(parseFloat(performanceData?.approved_percentage || 0), 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Rejected SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {performanceData?.rejected_percentage || 0}%
                  </div>
                  <Badge 
                    variant="destructive"
                    className="bg-red-100 text-red-600"
                  >
                    Closed
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2 cursor-pointer">
                  <div 
                    className="h-2 rounded-full transition-all duration-300 bg-red-600"
                    style={{ width: `${Math.min(parseFloat(performanceData?.rejected_percentage || 0), 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          {/* ✅ UPDATED: Role-wise Workload with API Data and Role Mapping */}
          <Card className="cursor-pointer">
            <CardHeader>
              <CardTitle>SubRole-wise Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={workloadData} 
                  layout="vertical" 
                  margin={{ left: 130 }} // ✅ Increased left margin for longer role names
                  key={JSON.stringify(workloadData)} // ✅ Force re-render when data changes
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis 
                    dataKey="role" 
                    type="category" 
                    width={130} // ✅ Increased width for longer role names
                    stroke="#6b7280" 
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* ✅ UPDATED: Compliance Section with API Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaBullseye className="h-5 w-5" />
                  Overall Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    {complianceData.approvedPercentage.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-500">
                    {/* {complianceData.totalComplaints} total complaints */}
                    Meeting SLA targets
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaUsers className="h-5 w-5" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold">{activeUsersCount}</div>
                  <p className="text-sm text-gray-500">Currently active</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaBuilding className="h-5 w-5" />
                  Departments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold">{departmentCount}</div>
                  <p className="text-sm text-gray-500">Total departments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
