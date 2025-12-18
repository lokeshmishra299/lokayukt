import React, { useRef } from "react";
import { FaPrint } from "react-icons/fa";
import html2pdf from "html2pdf.js";

const PreView = ({ complaintData }) => {
  const contentRef = useRef(null);


  const safeData = (data, fallback = "—") => 
    (data !== null && data !== undefined && data !== "null" && data !== "") ? data : fallback;

 
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };


  const data = complaintData?.data || complaintData || {};


  const validComplainants = Array.isArray(data.complainants) 
    ? data.complainants 
    : [];

  const validRespondents = Array.isArray(data.respondant) 
    ? data.respondant
    : [];

  const validSupport = Array.isArray(data.support) ? data.support : [];
  const validWitness = Array.isArray(data.witness) ? data.witness : [];

  // PDF Download Handler
  const handlePdfDownload = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0, 
      filename: `शिकायत_${safeData(data.complain_no)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        backgroundColor: "#FFFBF2", 
        useCORS: true 
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="w-full h-full bg-[#FFFBF2] rounded-lg flex flex-col overflow-hidden shadow-xl border ">
      
      
      <div className="flex items-center justify-between px-6 py-4   bg-white shrink-0">
        <h2 className="text-xl font-bold text-gray-800">
          शिकायत पूर्वावलोकन - {safeData(data.complain_no)}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePdfDownload}
            className="flex items-center relative right-8 gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            <FaPrint className="text-xs" />
            <span>डाउनलोड करें</span>
          </button>
        </div>
      </div>

   
      <div className="flex-1 overflow-y-auto bg-[#FFFBF2] p-6 md:p-8 flex justify-center">
        {/* Added bg-[#FFFBF2] and p-8 here so the captured element has the color */}
        <div ref={contentRef} className="w-full max-w-4xl text-[13px] text-gray-900 leading-relaxed bg-[#FFFBF2] p-8">
          
          <div className="text-center mb-8">
            <h1 className="font-semibold text-sm">
              "शिकायत", "अभिकथन" उत्तर प्रदेश लोक आयुक्त तथा माननीय उप लोक आयुक्त अधिनियम, 1975
            </h1>
          </div>

          <div className="space-y-4">
            
         
            <div className="flex gap-2">
              <span className="min-w-[20px]">1.</span>
              <div className="flex-1">
                <span>परिवादी का नाम :</span>
                {validComplainants.length > 0 ? (
                  validComplainants.map((comp, index) => (
                    <div key={index} className="pl-4 mt-1 font-medium  border-gray-300 pb-1 last:border-0">
                      <span className="font-bold text-gray-700">परिवादी {index + 1}:</span> {safeData(comp.complainant_name)}
                    </div>
                  ))
                ) : <div className="pl-4 mt-0.5 font-medium">NA</div>}
              </div>
            </div>

       
            <div className="flex gap-2">
              <span className="min-w-[20px]">2.</span>
              <div className="flex-1">
                <span>पिता का नाम :</span>
                {validComplainants.length > 0 ? (
                  validComplainants.map((comp, index) => (
                    <div key={index} className="pl-4 mt-1 font-medium  border-gray-300 pb-1 last:border-0">
                      <span className="font-bold text-gray-700">परिवादी {index + 1}:</span> {safeData(comp.father_name)}
                    </div>
                  ))
                ) : <div className="pl-4 mt-0.5 font-medium">NA</div>}
              </div>
            </div>

         
            <div className="flex gap-2">
              <span className="min-w-[20px]">3.</span> 
              <div className="flex-1 space-y-2">
                
        
                <div>
                    <span>(क) व्यवसाय :</span>
                    {validComplainants.length > 0 ? (
                      validComplainants.map((comp, index) => (
                        <div key={index} className="pl-4 mt-1 font-medium  border-gray-300 pb-1 last:border-0">
                          <span className="font-bold text-gray-700">परिवादी {index + 1}:</span> {safeData(comp.occupation)}
                        </div>
                      ))
                    ) : <div className="pl-4 mt-0.5 font-medium">NA</div>}
                </div>

             
                <div>
                    <span>(ख) क्या आप लोक सेवक हैं या नहीं :</span>
                    {validComplainants.length > 0 ? (
                      validComplainants.map((comp, index) => (
                        <div key={index} className="pl-4 mt-1 font-medium  border-gray-300 pb-1 last:border-0">
                          <span className="font-bold text-gray-700">परिवादी {index + 1}:</span> {safeData(comp.is_public_servant)}
                        </div>
                      ))
                    ) : <div className="pl-4 mt-0.5 font-medium">NA</div>}
                </div>
              </div>
            </div>

          
            <div className="flex gap-2">
              <span className="min-w-[20px]">4.</span>
              <div className="flex-1">
                <span>स्थायी पता :</span>
                {validComplainants.length > 0 ? (
                    validComplainants.map((comp, index) => (
                        <div key={index} className="pl-4 mt-2 font-medium rounded p-2 mb-2 border border-dashed border-gray-400">
                             <div className="font-bold text-blue-800 underline mb-1">परिवादी {index + 1}</div>
                             <p><span className="font-semibold text-gray-700">(क) स्थान :</span> {safeData(comp.permanent_place)}</p>
                             <p><span className="font-semibold text-gray-700">(ख) डाकघर :</span> {safeData(comp.permanent_post_office)}</p>
                             <p><span className="font-semibold text-gray-700">(ग) जिला :</span> {safeData(comp.district_name)}</p>
                        </div>
                    ))
                ) : <div className="pl-4 mt-0.5 font-medium">NA</div>}
              </div>
            </div>

        
            <div className="flex gap-2">
              <span className="min-w-[20px]">5.</span>
              <div className="flex-1">
                <span>पता जिसपर सूचना भेजी जाय :</span>
                <div className="pl-4 mt-0.5 space-y-0.5 font-medium">
                  <p>(क) नाम : {safeData(data.correspondence_name)}</p>
                  <p>(ख) स्थान : {safeData(data.correspondence_place)}</p>
                  <p>(ग) डाकघर/थाना : {safeData(data.correspondence_post_office)}</p>
                  <p>(घ) जिला : {safeData(data.correspondence_district)}</p>
                </div>
              </div>
            </div>

         
            <div className="flex gap-2">
              <span className="min-w-[20px]">6.</span>
              <div className="flex-1">
                <span>
                   (1) जिस व्यक्ति के विरूद्ध परिवाद किया जा रहा है उसका नाम, पदनाम और पता :
                </span>
                
                <div className="pl-4 mt-2 space-y-4">
                  {validRespondents.length > 0 ? (
                    validRespondents.map((resp, index) => (
                        <div key={index} className="p-3 rounded shadow-sm border ">
                            <div className="font-bold underline decoration-gray-400 mb-2 text-blue-800">
                                विपक्षी संख्या {index + 1}
                            </div>
                            <div className="space-y-1 font-medium text-gray-800 text-sm">
                                <div className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">नाम:</span> <span>{safeData(resp.respondent_name)}</span></div>
                                <div className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">पदनाम:</span> <span>{safeData(resp.designation)}</span></div>
                                <div className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">विभाग:</span> <span>{safeData(resp.department_name)}</span></div>
                                <div className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">जिला:</span> <span>{safeData(resp.district_name || resp.respondent_district)}</span></div>
                                <div className="grid grid-cols-[80px_1fr]"><span className="font-semibold text-gray-900">पता:</span> <span>{safeData(resp.current_address)}</span></div>
                            </div>
                        </div>
                    ))
                  ) : (
                    <div className="font-medium">NA</div>
                  )}
                </div>

                <div className="mt-4">
                   (2) दिनांक जब परिवाद का कारण उत्पन्न हुआ हो : 
                   <span className="pl-2 font-medium">{formatDate(data.cause_date)}</span>
                </div>
                
                <div className="mt-2">
                   (3) परिवाद विलम्ब से प्रस्तुत करने का कारण :
                   <div className="pl-4 mt-0.5 font-medium">{safeData(data.delay_reason, "कोई विलम्ब नहीं")}</div>
                </div>
                
                <div className="mt-2">
                   (4) क्या परिवाद पहले किसी वरिष्ठ अधिकारी के समक्ष किया गया था?
                   <div className="pl-4 mt-0.5 font-medium">
                     {data.previously_submitted === "yes" ? "हाँ" : "नहीं"} 
                     {data.previously_submitted === "yes" && ` - ${safeData(data.previously_submitted_details)}`}
                   </div>
                </div>
              </div>
            </div>

       
            <div className="flex gap-2">
               <span className="min-w-[20px]">7.</span>
               <div>
                 क्या यह (क) कोई अभिकथन है? या (ख) शिकायत है?
                 <div className="pl-4 mt-0.5 font-medium">
                   श्रेणी : {safeData(data.category)}
                 </div>
               </div>
            </div>

       
            <div className="flex gap-2">
               <span className="min-w-[20px]">8.</span>
               <div className="flex-1">
                 <span>चालान का विवरण (यदि लागू हो) :</span>
                 <div className="pl-4 mt-0.5 space-y-0.5 font-medium">
                   <p>चालान संख्या: {safeData(data.challan_number) || "NA"}</p>
                   <p>दिनांक: {formatDate(data.challan_date) || "NA"}</p>
                   {data.challan_file && (
                     <p className="text-xs text-blue-600">(चालान फाइल संलग्न)</p>
                   )}
                 </div>
               </div>
            </div>
            
      <div className="flex gap-2">
  <span className="min-w-[20px]">9.</span>

  <div className="flex-1">
    <span>उन व्यक्तियों के नाम और पते जो शपथ पत्र देंगे :</span>

    {validSupport.length > 0 ? (
      <ul className="pl-4 mt-1 list-decimal list-inside space-y-2">
        {validSupport.map((person, idx) => (
          <li key={idx} className="font-medium">
            <div>
              <span className="font-bold">नाम :</span>{" "}
              {safeData(person.support_name)}
            </div>
            <div className="text-gray-600 text-sm">
              <span className="font-semibold">पता :</span>{" "}
              {safeData(person.support_address)}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="pl-4 mt-0.5 font-medium">NA</div>
    )}
  </div>
</div>


     
             <div className="flex gap-2">
  <span className="min-w-[20px]">10.</span>

  <div className="flex-1">
    <span>अन्य गवाहों के नाम और पते :</span>

    {validWitness.length > 0 ? (
      <ul className="pl-4 mt-1 list-decimal list-inside space-y-2">
        {validWitness.map((person, idx) => (
          <li key={idx} className="font-medium">
            <div>
              <span className="font-bold">नाम :</span>{" "}
              {safeData(person.witness_name)}
            </div>
            <div className="text-gray-600 text-sm">
              <span className="font-semibold">पता :</span>{" "}
              {safeData(person.witness_address)}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="pl-4 mt-0.5 font-medium">NA</div>
    )}
  </div>
</div>


      
            <div className="flex gap-2">
              <span className="min-w-[20px]">11.</span>
              <div className="flex-1">
                <span>परिवाद से सम्बन्धित संलग्न दस्तावेजों की सूची :</span>
                <div className="pl-4 mt-0.5 font-medium break-all">
                  {safeData(data.attached_documents_description)}
                </div>
              </div>
            </div>

             <div className="flex gap-2">
              <span className="min-w-[20px]">12.</span>
              <div className="flex-1">
                <span>परिवाद का विवरण - कृपया यहाँ पर परिवाद के सम्पूर्ण तथ्य बतायें।</span>
                <div className="pl-4 mt-1 whitespace-pre-wrap break-words font-medium p-3 rounded">
                   {safeData(data.complaint_description)}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
    
export default PreView;
