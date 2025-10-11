// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer 
      className="
        w-full 
        bg-gradient-to-r 
        from-slate-100 
        via-slate-200 
        to-slate-100 
        text-center 
        text-slate-700 
        py-4 
        text-sm 
        sm:text-base 
        shadow-inner 
        mt-auto
        border-t
        border-slate-300
      "
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-x-1 gap-y-2">
          {/* <span 
            onClick={() => window.open("https://rahat.up.nic.in/")} 
            className="font-bold cursor-pointer text-black hover:text-gray-700 transition-colors duration-200">
            Office of the Relief Commissioner
          </span> */}
          <span className="text-slate-600">Copyright © 2025 LokAyukta Office | Developed by&nbsp;</span>
             
          
          <span 
            onClick={() => window.open("https://techsseract.com/")} 
            className="font-semibold cursor-pointer text-emerald-600 hover:text-emerald-700 transition-colors duration-200">
            CMP Techsseract LLP
          </span>
          <span className="text-slate-600">&nbsp;| Powered by&nbsp;</span>
          <span 
            onClick={() => window.open("https://upite.gov.in/Pages/Updesco")} 
            className="font-semibold cursor-pointer text-fuchsia-600 hover:text-fuchsia-700 transition-colors duration-200">
            UPDESCO
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
