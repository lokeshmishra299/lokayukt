import React, { useState } from 'react';
import { FaUsers, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EmployeeUserDashboard = () => {
  const [activeBox, setActiveBox] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4">
      
      {/* Container for Boxes */}
      <div className="flex flex-col sm:flex-row gap-8">
        
        {/* Complaint Management Box */}
        <div 
          onClick={() => {
            setActiveBox('user');
            navigate('/operator/dashboard');
          }}
          className={`w-[280px] h-[280px] flex flex-col justify-center p-8 rounded-2xl shadow-sm cursor-pointer transition-all duration-300 border-2 ${
            activeBox === 'user' 
              ? 'bg-blue-50 border-blue-600 scale-105 shadow-md' 
              : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
          }`}
        >
          {/* Icon Wrapper (Centered) */}
          <div className="flex justify-center mb-10">
            <FaUsers className={`text-[80px] ${activeBox === 'user' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} />
          </div>
          
          {/* Text Wrapper (Left Aligned) */}
          <div className={`text-2xl font-bold leading-tight text-left ${activeBox === 'user' ? 'text-blue-600' : 'text-[#475569]'}`}>
            Complaint Management
          </div>
        </div>

        {/* Employee Management Box */}
        <div 
          onClick={() => setActiveBox('employee')}
          className={`w-[280px] h-[280px] flex flex-col justify-center p-8 rounded-2xl shadow-sm cursor-pointer transition-all duration-300 border-2 ${
            activeBox === 'employee' 
              ? 'bg-blue-50 border-blue-600 scale-105 shadow-md' 
              : 'bg-white border-transparent hover:shadow-md hover:-translate-y-1'
          }`}
        >
          {/* Icon Wrapper (Centered) */}
          <div className="flex justify-center mb-10">
            <FaUserTie className={`text-[80px] ${activeBox === 'employee' ? 'text-blue-600' : 'text-[#8ea2b4]'}`} />
          </div>
          
          {/* Text Wrapper (Left Aligned) */}
          <div className={`text-2xl font-bold leading-tight text-left ${activeBox === 'employee' ? 'text-blue-600' : 'text-[#475569]'}`}>
            Employee Management
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeUserDashboard;