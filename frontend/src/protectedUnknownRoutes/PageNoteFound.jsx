import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNoteFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
  
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
          <p className="text-gray-500 mt-2">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>

    
        <div className="mb-8">
          <svg
            className="w-48 h-48 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

     
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 cursor-pointer bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
          
    
        </div>

        {/* Contact Support */}
        {/* <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-500">
            Still having trouble?{' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Contact Support
            </button>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default PageNoteFound;