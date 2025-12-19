import React from "react";

const MovementHistory = () => {
  const items = [
    {
      title: "PS to Lokayukta (Shri ABC) → Lokayukta",
      desc: "File marked for review and orders",
      time: "15 Jan 2025, 3:00 PM",
      status: "Marked",
    },
    {
      title: "UpLokayukta → PS to Lokayukta (Shri ABC)",
      desc: "Please prepare draft order for investigation",
      time: "13 Jan 2025, 11:30 AM",
      status: "Marked",
    },
  ];

  return (
    <div className="p-6">

      <div className="flex items-center gap-2 mb-4">
        <span className="text-[18px] text-gray-700">Movement</span>
        <span className="text-[18px] text-gray-700">History</span>
      </div>

   
      <div className="relative pl-10">


        <div className="absolute left-[14px] top-[20px] bottom-[20px] w-[2px] bg-blue-300"></div>

     
        {items.map((item, index) => (
          <div key={index} className="relative mb-4">

       
<div className="absolute left-[-32px] top-2 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center">
    
    
    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>

</div>


         
            <div className="bg-white rounded-xl shadow border p-4 pr-6 flex justify-between items-start">
              <div>
                <p className="text-[15px] text-gray-900 font-medium">
                  {item.title}
                </p>
                <p className="text-[12px] text-gray-500 mt-1">{item.time}</p>
                <p className="text-[13px] text-gray-600 mt-1">{item.desc}</p>
              </div>

              <span className="text-[12px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                {item.status}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MovementHistory;
