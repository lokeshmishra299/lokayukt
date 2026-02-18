import React, { useState } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { TbReport } from "react-icons/tb";

const EmployeeUserDashboard = () => {
  const [activeBox, setActiveBox] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4">
      
      {/* Container */}
      <div className="flex flex-col sm:flex-row gap-8">
        
        {/* Complaint Management */}
        <div 
          onClick={() => {
            setActiveBox('user');
            navigate('/dispatch/dashboard'); 
          }}
          className={`w-[360px] h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
            activeBox === 'user'
              ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
              : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
          }`}
        >
          <TbReport
            className={`text-[80px] mb-10 ${
              activeBox === 'user' ? 'text-blue-600' : 'text-[#8ea2b4]'
            }`}
          />

          <div
            className={`text-2xl font-bold whitespace-nowrap text-center ${
              activeBox === 'user' ? 'text-blue-600' : 'text-[#475569]'
            }`}
          >
            Complaint Management
          </div>
        </div>

        {/* Employee Management */}
        <div 
          onClick={() => {
            setActiveBox('employee');
            navigate('/employee/dashboard'); // ❌ navigation NOT changed
          }}
          className={`w-[360px] h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
            activeBox === 'employee'
              ? 'bg-blue-50 border-blue-600 scale-105 shadow-md'
              : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
          }`}
        >
          <FaUserTie
            className={`text-[80px] mb-10 ${
              activeBox === 'employee' ? 'text-blue-600' : 'text-[#8ea2b4]'
            }`}
          />

          <div
            className={`text-2xl font-bold whitespace-nowrap text-center ${
              activeBox === 'employee' ? 'text-blue-600' : 'text-[#475569]'
            }`}
          >
            Employee Management
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeUserDashboard;
