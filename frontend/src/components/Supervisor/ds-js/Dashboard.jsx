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
import { useNavigate } from 'react-router-dom';


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
const Dashboard = ({ userRole = "supervisor" }) => {

  const navigate = useNavigate()
  //  API State Management + Date Picker State
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]); //  Weekly data state
  const [showMonthlyTab, setShowMonthlyTab] = useState(false);
  
  //  Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));


  //  NEW: Fetch Weekly Graph Data
  const fetchWeeklyData = async () => {
    try {
      console.log('Fetching weekly graph data...');
      const response = await api.get('/admin/getWeeklyGraph');
      console.log('Weekly API Response:', response.data);
      
      if (response.data && response.data.labels) {
        const { labels, progress, disposed, ui } = response.data;
        
        //  Transform API data to chart format (without total)
        const weeklyChartData = labels.map((label, index) => ({
          day: label,
          progress: progress[index] || 0,
          disposed: disposed[index] || 0,
          underInvestigation: ui[index] || 0
        }));
        
        console.log('Transformed weekly data:', weeklyChartData);
        setWeeklyData(weeklyChartData);
      }
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      // Fallback data if API fails
      setWeeklyData([
        { day: 'Mon', progress: 0, disposed: 0, underInvestigation: 0 },
        { day: 'Tue', progress: 0, disposed: 0, underInvestigation: 0 },
        { day: 'Wed', progress: 0, disposed: 0, underInvestigation: 0 },
        { day: 'Thu', progress: 0, disposed: 0, underInvestigation: 0 },
        { day: 'Fri', progress: 0, disposed: 0, underInvestigation: 0 },
        { day: 'Sat', progress: 0, disposed: 0, underInvestigation: 0 },
        { day: 'Sun', progress: 0, disposed: 0, underInvestigation: 0 }
      ]);
    }
  };


  //  API Data Fetching Function
  const fetchDashboardData = async (monthParam) => {
    try {
      // 1. Dashboard Stats API
      const dashResponse = await api.get(`/supervisor/dashboard/${monthParam}`);
      if (dashResponse.data.status) {
        setDashboardData(dashResponse.data.dataDashboard);
      }


      // 2. Monthly Complaint API
      const monthlyResponse = await api.get('/supervisor/montly-complaint');
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
      const statusResponse = await api.get('/supervisor/status-distribution');
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
      const deptResponse = await api.get('/supervisor/department-wise-complaint');
      if (deptResponse.data.status) {
        const deptData = Object.entries(deptResponse.data.data).map(([department, complaints]) => ({
          department,
          complaints,
          percentage: Math.round((complaints / Object.values(deptResponse.data.data).reduce((a, b) => a + b, 0)) * 100)
        }));
        setDepartmentData(deptData);
      }


      // 5. District-wise API
      const districtResponse = await api.get('/supervisor/district-wise-company-type');
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


      //  6. Fetch Weekly Data
      await fetchWeeklyData();


    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };


  //  Initial Data Fetch
  useEffect(() => {
    fetchDashboardData(currentMonth);
  }, [currentMonth]);


  //  Handle Date Picker Change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    const newMonth = date.toISOString().slice(0, 7); // YYYY-MM format
    setCurrentMonth(newMonth);
    fetchDashboardData(newMonth);
  };


  //  Refresh to Current Month
  const handleRefresh = () => {
    const now = new Date();
    setSelectedDate(now);
    const currentMonthYear = now.toISOString().slice(0, 7);
    setCurrentMonth(currentMonthYear);
    fetchDashboardData(currentMonthYear);
  };


  // Sample data for charts with realistic values (keeping original for other tabs)
  const processingTimeData = [
    { stage: 'Entry to Verification', avg: 2.3, target: 3 },
    { stage: 'Verification to Forward', avg: 4.1, target: 5 },
    { stage: 'Forward to Assignment', avg: 1.8, target: 2 },
    { stage: 'Assignment to Investigation', avg: 12.5, target: 15 },
    { stage: 'Investigation to Decision', avg: 18.7, target: 20 },
    { stage: 'Decision to Disposal', avg: 3.2, target: 5 }
  ];


  const workloadData = [
    { role: 'RO/ARO', pending: 23, completed: 156 },
    { role: 'Section Officer', pending: 18, completed: 134 },
    { role: 'DS/JS', pending: 12, completed: 98 },
    { role: 'Secretary', pending: 8, completed: 87 },
    { role: 'CIO/IO', pending: 15, completed: 45 },
    { role: 'LokAyukta', pending: 6, completed: 78 }
  ];


  const slaCompliance = [
    { metric: 'Entry SLA', value: 95, target: 90 },
    { metric: 'Verification SLA', value: 87, target: 85 },
    { metric: 'Investigation SLA', value: 78, target: 80 },
    { metric: 'Disposal SLA', value: 82, target: 85 }
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

  // Custom styles for the date picker
  const datePickerCustomStyles = `
    .custom-datepicker-wrapper .react-datepicker {
      border: none !important;
      background-color: transparent !important;
      font-family: inherit;
    }
    .custom-datepicker-wrapper .react-datepicker__header {
      background-color: #fff !important;
      border-bottom: 1px solid #e5e7eb !important;
      padding: 0.5rem 0 !important;
    }
    .custom-datepicker-wrapper .react-datepicker__current-month {
      font-size: 1rem !important;
      font-weight: 600 !important;
      color: #111827 !important;
      padding-bottom: 0.5rem;
    }
    .custom-datepicker-wrapper .react-datepicker__navigation {
      top: 0.75rem !important;
    }
    .custom-datepicker-wrapper .react-datepicker__month-container {
      padding: 0.5rem;
    }
    .custom-datepicker-wrapper .react-datepicker__month-wrapper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.25rem;
    }
    .custom-datepicker-wrapper .react-datepicker__month-text {
      border-radius: 0.375rem; /* rounded-md */
      padding: 0.5rem 0;
      transition: background-color 0.2s, color 0.2s;
      cursor: pointer;
      text-align: center;
      font-size: 0.875rem;
      color: #374151; /* gray-700 */
    }
    .custom-datepicker-wrapper .react-datepicker__month-text:hover {
      background-color: #f3f4f6; /* gray-100 */
    }
    .custom-datepicker-wrapper .react-datepicker__month--selected,
    .custom-datepicker-wrapper .react-datepicker__month-text--selected {
      background-color: #2563eb !important; /* blue-600 */
      color: white !important;
    }
    .custom-datepicker-wrapper .react-datepicker__month-text--keyboard-selected {
        background-color: #d1d5db !important; /* gray-300 */
    }
  `;


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Add styles for chart cursor pointer */}
      <style>{chartStyles}</style>
      {/* Add custom styles for date picker */}
      <style>{datePickerCustomStyles}</style>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard / डैशबोर्ड</h1>
          <p className="text-gray-600">
            Welcome Back, {userRole} • Last Updated: {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 relative">
          {/*  Month-Year Picker Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <FaCalendarAlt className="h-4 w-4 mr-2 text-blue-500" />
            {selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </Button>


          {/*  Date Picker Dropdown (IMPROVED DESIGN) */}
          {showDatePicker && (
            <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="custom-datepicker-wrapper">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    minDate={new Date('2022-01-01')}
                    maxDate={new Date('2025-12-31')}
                    inline
                />
              </div>
            </div>
          )}


          {/*  Refresh Button */}
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <FaChartLine className="h-4 w-4 mr-2 text-green-500" />
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
 <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">


        {/* Total Complaints */}
        <div
        onClick={()=>{
          navigate("/supervisor/all-complaints ")
        }}
         className="p-5 rounded-2xl shadow-md border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
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
          <div className="text-sm text-blue-700">All Time</div>
        </div>


        {/* Today's Entry */}
        <div
         onClick={()=>{
          navigate("/supervisor/pending-complaints")
        }}
         className="p-5 rounded-2xl shadow-md border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
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
          <div className="text-sm text-indigo-700">New Complaints</div>
        </div>


        {/* Approved */}
        <div 
          onClick={()=>{
          navigate("/supervisor/approved-complaints")
        }}
        className="p-5 rounded-2xl shadow-md border border-green-200 bg-green-50 hover:bg-green-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-2xl text-green-600" />
              <h3 className="text-sm font-medium text-green-800">Disposed</h3>
            </div>
            <div className="text-green-600 text-sm font-semibold">↑</div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-green-900">
            {dashboardData?.approvedcomplains || 0}
          </div>
          <div className="text-sm text-green-700">Disposed Cases</div>
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
        <div
          onClick={()=>{
          navigate("/supervisor/pending-complaints")
        }}
         className="p-5 rounded-2xl shadow-md border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <FaExclamationTriangle className="text-2xl text-yellow-600" />
              <h3 className="text-sm font-medium text-yellow-800">In Progress</h3>
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-yellow-900">
            {dashboardData?.pendingcomplains || 0}
          </div>
          <div className="text-sm text-yellow-700">In Progress</div>
        </div>


        {/* Avg. Processing */}
        <div
          onClick={()=>{
          navigate("/supervisor/pending-complaints")
        }}
         className="p-5 rounded-2xl shadow-md border border-teal-200 bg-teal-50 hover:bg-teal-100 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <FaClock className="text-2xl text-teal-600" />
              <h3 className="text-sm font-medium text-teal-800">Avg. Pending</h3>
            </div>
            <div className="text-red-600 text-sm font-semibold">↓</div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-teal-900">
            {dashboardData?.avgPendingDays || '0'} days
          </div>
          <div className="text-sm text-teal-700">Average Time</div>
        </div>


      </div>


      <Tabs defaultValue="overview" className="space-y-6">
        {/* <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList> */}


        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
            {/* <Card className="cursor-pointer">
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
            </Card> */}


        
            {/* <Card className="cursor-pointer">
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
            </Card> */}
          </div>


          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
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
          </div> */}
        </TabsContent>


        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <Card className="cursor-pointer">
              <CardHeader>
                <CardTitle>Weekly Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={weeklyData}>
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
            {slaCompliance.map((item, index) => (
              <Card key={index} className="cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{item.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {item.value}%
                    </div>
                    <Badge 
                      variant={item.value >= item.target ? "default" : "destructive"}
                      className={item.value >= item.target ? "bg-green-100 text-green-600" : ""}
                    >
                      Target: {item.target}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 cursor-pointer">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${item.value >= item.target ? 'bg-green-600' : 'bg-red-600'}`}
                      style={{ width: `${Math.min(item.value, 100)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>


        {/* <TabsContent value="workload" className="space-y-6">
    
          <Card className="cursor-pointer">
            <CardHeader>
              <CardTitle>Role-wise Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={workloadData} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="role" type="category" width={100} stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent> */}


        {/* <TabsContent value="compliance" className="space-y-6">
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
                  <div className="text-4xl font-bold text-green-600">86%</div>
                  <p className="text-sm text-gray-500">Meeting SLA targets</p>
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
                  <div className="text-4xl font-bold">24</div>
                  <p className="text-sm text-gray-500">Currently online</p>
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
                  <div className="text-4xl font-bold">8</div>
                  <p className="text-sm text-gray-500">Total departments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};


export default Dashboard;
