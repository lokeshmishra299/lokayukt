import React, { useState } from 'react';
// React icons import kar rahe hain
import { FaUsers, FaUserTie } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const EmployUserDashboard = () => {
  const [activeBox, setActiveBox] = useState('');
  const navigate = useNavigate()

  return (
    // Screen ke bilkul center me lane ke liye
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans p-4">
      
      {/* Container for Boxes */}
      <div className="flex flex-col sm:flex-row gap-10">
        
        {/* User Management Box */}
        <div 
          onClick={()=>{
            navigate("/operator/dashboard")
          }}
          className={`w-64 h-64 flex flex-col items-center justify-center gap-6 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 border-4 ${
            activeBox === 'user' 
              ? 'bg-blue-50 border-blue-600 scale-105' 
              : 'bg-white border-transparent hover:shadow-xl hover:-translate-y-2'
          }`}
        >
          <FaUsers className={`text-7xl ${activeBox === 'user' ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`text-2xl font-bold ${activeBox === 'user' ? 'text-blue-600' : 'text-gray-600'}`}>
            User
          </span>
        </div>

        {/* Employee Box */}
        <div 
          onClick={() => setActiveBox('employee')}
          className={`w-64 h-64 flex flex-col items-center justify-center gap-6 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 border-4 ${
            activeBox === 'employee' 
              ? 'bg-blue-50 border-blue-600 scale-105' 
              : 'bg-white border-transparent hover:shadow-xl hover:-translate-y-2'
          }`}
        >
          <FaUserTie className={`text-7xl ${activeBox === 'employee' ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`text-2xl font-bold ${activeBox === 'employee' ? 'text-blue-600' : 'text-gray-600'}`}>
            Employee
          </span>
        </div>

      </div>

    

    </div>
  );
};

export default EmployUserDashboard;