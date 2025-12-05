import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

/**
 * A4 PRINT VIEW – Updated styling to ensure background covers all content including point 12
 */
const ComplaintPrintView = React.forwardRef(({ complainants, persons, formData }, ref) => {
  const formatYesNo = (val) =>
    val === 'हाँ' || val === 'नहीं'
      ? val
      : val === '1'
      ? 'हाँ'
      : val === '0'
      ? 'नहीं'
      : '';

  return (
    <div ref={ref} className="a4-sheet shadow-lg rounded-md text-[12px] leading-relaxed text-gray-900">
      {/* Added h-full to ensure inner padding container stretches */}
      <div className="w-full h-full px-8 pt-8 pb-10">

        {/* HEADER */}
        <div className="text-center mb-2">
          <p className="font-semibold text-[13px]">
            "शिकायत"
         
          </p>
        </div>

        {/* BODY */}
        <div className=" text-[12px]">
          {/* 1 */}
          <div className="flex gap-2">
            <span className="min-w-[18px]">1.</span>
            <div className="flex-1">
              <span>परिवादी का नाम :</span>
              <div className="mt-0.5 pl-4 space-y-0.5">
                {complainants.map((c, idx) => (
                  <div key={c.id || idx}>परिवादी {idx + 1} : {c.name || '——'}</div>
                ))}
              </div>
            </div>
          </div>

          {/* 2 */}
          <div className="flex gap-2">
            <span className="min-w-[18px]">2.</span>
            <div className="flex-1">
              <span>पिता का नाम :</span>
              <div className="mt-0.5 pl-4 space-y-0.5">
                {complainants.map((c, idx) => (
                  <div key={c.id || idx}>परिवादी {idx + 1} : {c.fatherName || '——'}</div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 (क)(ख)(ग) */}
          <div className="flex gap-2">
            <span className="min-w-[18px]">3.</span>
            <div className="flex-1 space-y-0.5">
              <div>
                <span>(क) व्यवसाय :</span>
                <div className="mt-0.5 pl-4 space-y-0.5">
                  {complainants.map((c, idx) => (
                    <div key={c.id || idx}>परिवादी {idx + 1} : {c.occupation || '——'}</div>
                  ))}
                </div>
              </div>
              <div>
                <span>(ख) क्या आप लोक सेवक हैं या नहीं :</span>
                <div className="mt-0.5 pl-4 space-y-0.5">
                  {complainants.map((c, idx) => (
                    <div key={c.id || idx}>
                      परिवादी {idx + 1} : {formatYesNo(c.isPublicServant) || '——'}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span>
                  (ग) यदि परिवाद किसी दूसरे व्यक्ति की ओर से है तो उस व्यक्ति के साथ अपना संबंध बतायें। यह साबित करने के लिए कि
                  आप उसकी सम्पदा का प्रतिनिधित्व करतें हैं या उसने इस निमित्त आपको प्राधिकृत किया है, दस्तावेज भी यदि कोई हो,
                  संलग्न करें।
                </span>
                <div className="mt-0.5 pl-4">
                  {formData.relation || '——'}
                  {formData.authorizationFile && (
                    <div className="mt-0.5 text-[11px] text-gray-700">
                      (संलग्न दस्तावेज़: {formData.authorizationFile.name})
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4 स्थायी पता */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">4.</span>
            <div className="flex-1 space-y-0.5">
              <div>स्थायी पता :</div>
              <div className="pl-4 space-y-0.5">
                <div>(क) नाम : {formData.permanentAddress.name || '——'}</div>
                <div>(ख) स्थान : {formData.permanentAddress.place || '——'}</div>
                <div>(ग) डाकघर या पुलिस थाना : {formData.permanentAddress.postOffice || '——'}</div>
                <div>(घ) जिला : {formData.permanentAddress.district || '——'}</div>
              </div>
            </div>
          </div>

          {/* 5 पत्राचार पता */}
          <div className="flex gap-2">
            <span className="min-w-[18px]">5.</span>
            <div className="flex-1 space-y-0.5">
              <div>पता जिसपर सूचना भेजी जाय :</div>
              <div className="pl-4 space-y-0.5">
                <div>(क) नाम : {formData.correspondenceAddress.name || '——'}</div>
                <div>(ख) स्थान : {formData.correspondenceAddress.place || '——'}</div>
                <div>(ग) डाकघर या पुलिस थाना : {formData.correspondenceAddress.postOffice || '——'}</div>
                <div>(घ) जिला : {formData.correspondenceAddress.district || '——'}</div>
              </div>
            </div>
          </div>

          {/* 6 प्रतिवादी */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">6.</span>
            <div className="flex-1 space-y-0.5">
              <div>
                (1) जिस व्यक्ति के विरूद्ध परिवाद किया जा रहा है उसका नाम, पदनाम जो मामले के विषय में परिवाद किये जाने के समय पर रहा हो और वर्तमान
                पता यदि ज्ञात हो :
              </div>
              <div className="pl-4 space-y-0.5">
                {persons.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="border border-dashed border-orange-300 px-2 py-1 rounded-sm"
                  >
                    <div>व्यक्ति {idx + 1}</div>
                    <div>नाम : {p.name || '——'}</div>
                    <div>पदनाम : {p.designation || '——'}</div>
                    <div>वर्तमान पता : {p.currentAddress || '——'}</div>
                  </div>
                ))}
              </div>
              <div className="mt-0.5">
                (2) दिनांक जब परिवाद का कारण उत्पन्न हुआ हो : {formData.complaintDate || '——'}
              </div>
              <div>
                (3) परिवाद विलम्ब से प्रस्तुत करने का कारण, यदि परिवाद धारा 8 की उपधारा (4) के अधीन समय व्यतीत हो जाने पर किया गया हो :
                <div className="mt-0.5 pl-4">{formData.delayReason || '——'}</div>
              </div>
              <div>
                (4) क्या परिवाद पहले किसी वरिष्ठ अधिकारी के समक्ष किया गया था? या किसी अधिकरण या न्यायालय के समक्ष कार्यवाही की गई थी, यदि हों तो
                उसका क्या परिणाम निकला, यदि नही, कृपया संक्षेप में कारण बतायें।
                <div className="mt-0.5 pl-4">
                  {formData.previousComplaint
                    ? `उत्तर : ${formData.previousComplaint}${
                        formData.previousComplaint === 'हाँ' && formData.previousComplaintDetails
                          ? `, विवरण : ${formData.previousComplaintDetails}`
                          : ''
                      }`
                    : '——'}
                </div>
              </div>
            </div>
          </div>

          {/* 7 */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">7.</span>
            <div className="flex-1">
              क्या यह,
              (क) कोई अभिकथन अधिनियम की धारा 2 (ख) में यथा परिभाषित, है? या शिकायत अधिनियम की धारा 2 (घ) में यथा परिभाषित, है।
              <div className="mt-0.5 pl-4">
                श्रेणी : {formData.complaintType || '——'}
              </div>
            </div>
          </div>

          {/* 8 चालान */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">8.</span>
            <div className="flex-1 space-y-0.5">
              <div>
                चालान संख्या और नियम-4 के अधीन खर्च के लिए प्रतिभूति जमा करने का दिनांक -
                <div className="mt-0.5 pl-4 space-y-0.5">
                  <div>चालान संख्या : {formData.challanNumber || '——'}</div>
                  <div>दिनांक : {formData.challanDate || '——'}</div>
                  {formData.challanFile && (
                    <div>फ़ाइल : {formData.challanFile.name}</div>
                  )}
                </div>
              </div>
              <div className="pl-4 text-[11px] text-gray-700 space-y-0.5">
                <div>
                  टिप्पणी (1) उक्त धनराशि शीर्षक "8443-सिविल निक्षेप-00-103-प्रतिभूति निक्षेप-00-00" के अधीन भारतीय स्टेट बैंक की किसी भी
                  शाखा में जमा की जा सकती है।
                </div>
                <div>(2) किसी "शिकायत" की स्थिति में कोई धनराशि जमा करना अपेक्षित नहीं है।</div>
                <div>(3) चालान की एक प्रति परिवाद के साथ संलग्न की जाए। नियम 8 (2) देखिए,</div>
              </div>
            </div>
          </div>

          {/* 9 */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">9.</span>
            <div className="flex-1">
              ऐसे व्यक्तियों की सूची जिन्होने परिवाद के समर्थन में शपथपत्र दिये हों।
              <div className="mt-0.5 pl-4">
                {formData.supportingPersons || '——'}
              </div>
            </div>
          </div>

          {/* 10 */}
          <div className="flex gap-2">
            <span className="min-w-[18px]">10.</span>
            <div className="flex-1">
              क्या ऐसे अन्य व्यक्ति भी है जिन्हे परिवाद से सम्बन्धित तथ्यों के बारे में जानकारी हो, जिन्हे लोक आयुक्त/उप लोक आयुक्त द्वारा समन करना चाहें।
              <div className="mt-0.5 pl-4">
                {formData.otherPersons || '——'}
              </div>
            </div>
          </div>

          {/* 11 */}
          <div className="flex gap-2">
            <span className="min-w-[18px]">11.</span>
            <div className="flex-1">
              परिवाद से सम्बन्धित संलग्न दस्तावेजों की सूची जिसमें परिवादी का शपथपत्र भी सम्मिलित है।
              <div className="mt-0.5 pl-4">
                {formData.attachedDocumentsFile ? formData.attachedDocumentsFile.name : (formData.attachedDocuments || '——')}
              </div>
            </div>
          </div>

          {/* 12 */}
          <div className="flex gap-2">
            <span className="min-w-[18px]">12.</span>
            <div className="flex-1">
              परिवाद का विवरण - कृपया यहाँ पर परिवाद के सम्पूर्ण तथ्य बतायें। (अधिकतम 2000 अक्षर)
              <div className="mt-0.5 pl-4 whitespace-pre-wrap break-words">
                {formData.complaintDescription || '——'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

ComplaintPrintView.displayName = 'ComplaintPrintView';

const Complaints = () => {
  const printRef = useRef(null);

  // State for परिवादी (complainants)
  const [complainants, setComplainants] = useState([
    {
      id: 1,
      name: '',
      fatherName: '',
      occupation: '',
      isPublicServant: 'चुनें',
    }
  ]);

  const [showComplainants, setShowComplainants] = useState({ 1: true });

  // State for व्यक्ति (persons against complaint)
  const [persons, setPersons] = useState([
    {
      id: 1,
      name: '',
      designation: '',
      currentAddress: ''
    }
  ]);

  const [showPersons, setShowPersons] = useState({ 1: true });

  // State for other form fields
  const [formData, setFormData] = useState({
    relation: '',
    authorizationFile: null,
    permanentAddress: { name: '', place: '', postOffice: '', district: '' },
    correspondenceAddress: { name: '', place: '', postOffice: '', district: '' },
    complaintDate: '',
    delayReason: '',
    previousComplaint: '',
    previousComplaintDetails: '',
    complaintType: '',
    challanNumber: '',
    challanDate: '',
    challanFile: null,
    supportingPersons: '',
    otherPersons: '',
    attachedDocuments: '',
    attachedDocumentsFile: null,
    complaintDescription: ''
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

const handleDownloadPDF = async () => {
  setIsDownloadingPDF(true);
  try {
    if (!printRef.current) {
      toast.error("PDF generate error");
      return;
    }

    const element = printRef.current;
    
    // Temporarily remove any transform for accurate capture
    const originalTransform = element.style.transform;
    element.style.transform = 'none';
    
    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Restore original transform
    element.style.transform = originalTransform;

    // A4 dimensions
    const A4_WIDTH = 210;
    const A4_HEIGHT = 297;
    const imgWidth = A4_WIDTH;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let position = 0;
    const imgData = canvas.toDataURL("image/png");

    // Pages add karte hain - full content
    while (position < imgHeight) {
      pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
      position += A4_HEIGHT;
      if (position < imgHeight) {
        pdf.addPage();
      }
    }

    const fileName = `Complaint_${new Date().getTime()}.pdf`;
    pdf.save(fileName);

    toast.success("PDF successfully downloaded!", {
      position: "top-right",
      autoClose: 3000,
    });
  } catch (error) {
    console.error("PDF download error:", error);
    toast.error("PDF download error", {
      position: "top-right",
      autoClose: 3000,
    });
  } finally {
    setIsDownloadingPDF(false);
  }
};

  const addComplainant = () => {
    const newComplainant = {
      id: complainants.length + 1,
      name: '',
      fatherName: '',
      occupation: '',
      isPublicServant: 'चुनें',
    };
    setComplainants([...complainants, newComplainant]);
    setShowComplainants({ ...showComplainants, [newComplainant.id]: true });
  };

  const removeComplainant = (id) => {
    if (complainants.length > 1) {
      setComplainants(complainants.filter(c => c.id !== id));
      const newShowComplainants = { ...showComplainants };
      delete newShowComplainants[id];
      setShowComplainants(newShowComplainants);
    }
  };

  const updateComplainant = (id, field, value) => {
    setComplainants(complainants.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const toggleComplainant = (id) => {
    setShowComplainants({
      ...showComplainants,
      [id]: !showComplainants[id]
    });
  };

  const addPerson = () => {
    const newPerson = {
      id: persons.length + 1,
      name: '',
      designation: '',
      currentAddress: ''
    };
    setPersons([...persons, newPerson]);
    setShowPersons({ ...showPersons, [newPerson.id]: true });
  };

  const removePerson = (id) => {
    if (persons.length > 1) {
      setPersons(persons.filter(p => p.id !== id));
      const newShowPersons = { ...showPersons };
      delete newShowPersons[id];
      setShowPersons(newShowPersons);
    }
  };

  const updatePerson = (id, field, value) => {
    setPersons(persons.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const togglePerson = (id) => {
    setShowPersons({
      ...showPersons,
      [id]: !showPersons[id]
    });
  };

  const handleFileChange = (fieldName, file) => {
    setFormData({ ...formData, [fieldName]: file });

    if (errors[fieldName] || (fieldName === 'attachedDocumentsFile' && errors.attached_documents)) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      if (fieldName === 'attachedDocumentsFile') delete newErrors.attached_documents;
      setErrors(newErrors);
    }
  };

  const handleFormDataChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    complainants.forEach((complainant, index) => {
      if (!complainant.name.trim()) {
        newErrors.complainant_name = [`परिवादी ${index + 1} का नाम आवश्यक है।`];
      }
      if (!complainant.fatherName.trim()) {
        newErrors.father_name = [`परिवादी ${index + 1} के पिता का नाम आवश्यक है।`];
      }
      if (!complainant.occupation.trim()) {
        newErrors.occupation = [`परिवादी ${index + 1} का व्यवसाय आवश्यक है।`];
      }
      if (complainant.isPublicServant === 'चुनें') {
        newErrors.is_public_servant = [`परिवादी ${index + 1} के लिए लोक सेवक स्थिति चुनें।`];
      }
    });

    if (!formData.relation.trim()) {
      newErrors.relation_with_person = ['संबंध का विवरण आवश्यक है।'];
    }

    if (!formData.authorizationFile) {
      newErrors.authorization_document = ['प्राधिकरण दस्तावेज़ अपलोड करना आवश्यक है।'];
    }

    if (!formData.permanentAddress.name.trim()) {
      newErrors.permanent_name = ['स्थायी पते का नाम आवश्यक है।'];
    }
    if (!formData.permanentAddress.place.trim()) {
      newErrors.permanent_place = ['स्थायी पते का स्थान आवश्यक है।'];
    }
    if (!formData.permanentAddress.postOffice.trim()) {
      newErrors.permanent_post_office = ['डाकघर/पुलिस थाना आवश्यक है।'];
    }
    if (!formData.permanentAddress.district.trim()) {
      newErrors.permanent_district = ['जिला आवश्यक है।'];
    }

    if (!formData.correspondenceAddress.name.trim()) {
      newErrors.correspondence_name = ['पत्राचार पते का नाम आवश्यक है।'];
    }
    if (!formData.correspondenceAddress.place.trim()) {
      newErrors.correspondence_place = ['पत्राचार पते का स्थान आवश्यक है।'];
    }
    if (!formData.correspondenceAddress.postOffice.trim()) {
      newErrors.correspondence_post_office = ['डाकघर/पुलिस थाना आवश्यक है।'];
    }
    if (!formData.correspondenceAddress.district.trim()) {
      newErrors.correspondence_district = ['जिला आवश्यक है।'];
    }

    persons.forEach((person, index) => {
      if (!person.name.trim()) {
        newErrors.respondent_name = [`व्यक्ति ${index + 1} का नाम आवश्यक है।`];
      }
      if (!person.designation.trim()) {
        newErrors.designation = [`व्यक्ति ${index + 1} का पदनाम आवश्यक है।`];
      }
      if (!person.currentAddress.trim()) {
        newErrors.current_address = [`व्यक्ति ${index + 1} का वर्तमान पता आवश्यक है।`];
      }
    });

    if (!formData.complaintDate) {
      newErrors.cause_date = ['शिकायत की तिथि आवश्यक है।'];
    }

    if (!formData.delayReason.trim()) {
      newErrors.delay_reason = ['विलम्ब का कारण आवश्यक है।'];
    }

    if (!formData.previousComplaint) {
      newErrors.previously_submitted = ['कृपया पूर्व शिकायत का चयन करें (हाँ/नहीं)।'];
    }

    if (formData.previousComplaint === 'हाँ' && !formData.previousComplaintDetails.trim()) {
      newErrors.previously_submitted_details = ['यदि पहले प्रस्तुत किया है तो विवरण आवश्यक है।'];
    }

    if (!formData.complaintType) {
      newErrors.category = ['शिकायत की श्रेणी चुनें (अभिकथन/शिकायत)।'];
    }

    if (!formData.challanNumber.trim()) {
      newErrors.challan_number = ['चालान संख्या आवश्यक है।'];
    }
    if (!formData.challanDate) {
      newErrors.challan_date = ['चालान की तिथि आवश्यक है।'];
    }
    if (!formData.challanFile) {
      newErrors.challan_file = ['चालान फाइल अपलोड करना आवश्यक है।'];
    }

    if (!formData.supportingPersons.trim()) {
      newErrors.supporting_affidavit_list = ['शपथपत्र की सूची आवश्यक है।'];
    }

    if (!formData.otherPersons.trim()) {
      newErrors.other_witnesses = ['अन्य साक्षियों का विवरण आवश्यक है।'];
    }

    if (!formData.attachedDocumentsFile) {
      newErrors.attached_documents = ['संलग्न दस्तावेजों की फाइल आवश्यक है।'];
    }

    if (!formData.complaintDescription.trim()) {
      newErrors.complaint_description = ['शिकायत का विवरण आवश्यक है।'];
    }

    return newErrors;
  };

  const handlePreview = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('कृपया सभी आवश्यक फ़ील्ड भरें!', {
        position: "top-right",
        autoClose: 3000,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setShowPreview(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const submitData = new FormData();

      complainants.forEach((complainant, index) => {
        submitData.append(`complainant_name[${index}]`, complainant.name);
        submitData.append(`father_name[${index}]`, complainant.fatherName);
        submitData.append(`occupation[${index}]`, complainant.occupation);
        submitData.append(
          `is_public_servant[${index}]`,
          complainant.isPublicServant === 'हाँ' ? 'yes' : 'no'
        );
      });

      persons.forEach((person, index) => {
        submitData.append(`respondent_name[${index}]`, person.name);
        submitData.append(`designation[${index}]`, person.designation);
        submitData.append(`current_address[${index}]`, person.currentAddress);
      });

      submitData.append('relation_with_person', formData.relation);
      if (formData.authorizationFile) {
        submitData.append('authorization_document', formData.authorizationFile);
      }

      submitData.append('permanent_name', formData.permanentAddress.name);
      submitData.append('permanent_place', formData.permanentAddress.place);
      submitData.append('permanent_post_office', formData.permanentAddress.postOffice);
      submitData.append('permanent_district', formData.permanentAddress.district);

      submitData.append('correspondence_name', formData.correspondenceAddress.name);
      submitData.append('correspondence_place', formData.correspondenceAddress.place);
      submitData.append('correspondence_post_office', formData.correspondenceAddress.postOffice);
      submitData.append('correspondence_district', formData.correspondenceAddress.district);

      submitData.append('cause_date', formData.complaintDate);
      submitData.append('delay_reason', formData.delayReason);

      const prevVal =
        formData.previousComplaint === 'हाँ'
          ? 'yes'
          : formData.previousComplaint === 'नहीं'
          ? 'no'
          : '';
      submitData.append('previously_submitted', prevVal);
      if (prevVal === 'yes') {
        submitData.append('previously_submitted_details', formData.previousComplaintDetails || '');
      }

      const categoryVal =
        formData.complaintType === 'अभिकथन'
          ? 'assertion'
          : formData.complaintType === 'शिकायत'
          ? 'complaint'
          : '';
      submitData.append('category', categoryVal);

      submitData.append('challan_number', formData.challanNumber);
      submitData.append('challan_date', formData.challanDate);

      if (formData.challanFile) {
        submitData.append('challan_file', formData.challanFile);
      }

      submitData.append('supporting_affidavit_list', formData.supportingPersons);
      submitData.append('other_witnesses', formData.otherPersons);

      if (formData.attachedDocumentsFile) {
        submitData.append('attached_documents', formData.attachedDocumentsFile);
      }

      submitData.append('complaint_description', formData.complaintDescription);

      await api.post('/operator/add-complaint', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('शिकायत सफलतापूर्वक सबमिट हो गई है!', {
        position: "top-right",
        autoClose: 3000,
      });
      setShowPreview(false);
      handleReset();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        setShowPreview(false);
        toast.error(error.response.data.message || 'कृपया त्रुटियों को ठीक करें।', {
          position: "top-right",
          autoClose: 3000,
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error('कुछ गलत हो गया। कृपया पुनः प्रयास करें।', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setComplainants([{
      id: 1,
      name: '',
      fatherName: '',
      occupation: '',
      isPublicServant: 'चुनें',
    }]);
    setPersons([{
      id: 1,
      name: '',
      designation: '',
      currentAddress: ''
    }]);
    setFormData({
      relation: '',
      authorizationFile: null,
      permanentAddress: { name: '', place: '', postOffice: '', district: '' },
      correspondenceAddress: { name: '', place: '', postOffice: '', district: '' },
      complaintDate: '',
      delayReason: '',
      previousComplaint: '',
      previousComplaintDetails: '',
      complaintType: '',
      challanNumber: '',
      challanDate: '',
      challanFile: null,
      supportingPersons: '',
      otherPersons: '',
      attachedDocuments: '',
      attachedDocumentsFile: null,
      complaintDescription: ''
    });
    setShowComplainants({ 1: true });
    setShowPersons({ 1: true });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-white rounded-md py-8">
      <ToastContainer />

      <div className="max-w-6xl mx-auto">
        {/* Form Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
            "शिकायत", "अभिकथन" उत्तर प्रदेश लोक आयुक्त तथा माननीय उप लोक आयुक्त अधिनियम, 1975
          </h1>
          <p className="text-gray-600 text-center text-base mb-3">
            धारा 2 (ख) और (घ) में यथापरिभाषित, संबंधी परिवाद का प्रपत्र जो लोक आयुक्त / माननीय उप लोक आयुक्त को दिया जायेगा।
          </p>
          {/* <p className="text-gray-500 text-center text-sm">
            (तीन प्रतियों में भरा जायेगा)
          </p> */}
        </div>

        <form onSubmit={handlePreview}>
          {/* 1–3 complainants */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">
                1. परिवादी का नाम, 2. पिता का नाम, 3 (क) व्यवसाय, 3 (ख) क्या आप लोक सेवक हैं या नहीं :
              </h3>
              <button
                type="button"
                className="bg-white text-[12px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap"
                onClick={addComplainant}
              >
                + अन्य परिवादी जोड़ें
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              प्रत्येक कार्ड एक परिवादी के लिए है। आवश्यकता अनुसार अतिरिक्त परिवादी जोड़े जा सकते हैं।
            </p>

          

            {complainants.map((complainant, index) => (
              <div key={complainant.id} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-b border-gray-200">
                  <h4 className="text-base font-medium text-gray-700">परिवादी {index + 1}</h4>
                  <div className="flex gap-2">
                    {complainants.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 hover:bg-red-50 border border-red-600 px-3 py-1 rounded text-sm transition-all duration-200"
                        onClick={() => removeComplainant(complainant.id)}
                      >
                        हटाएँ
                      </button>
                    )}
                    <button
                      type="button"
                      className="bg-white hover:bg-gray-100 border border-gray-300 px-3 py-1 rounded text-lg font-bold transition-all duration-200 min-w-[35px]"
                      onClick={() => toggleComplainant(complainant.id)}
                    >
                      {showComplainants[complainant.id] ? '−' : '+'}
                    </button>
                  </div>
                </div>

                {showComplainants[complainant.id] && (
                  <div className="p-5 animate-slideDown">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          परिवादी का नाम (1) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            errors.complainant_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={complainant.name}
                          onChange={(e) => updateComplainant(complainant.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                         <label className="block text-gray-700 text-sm font-medium mb-2">
                          पिता का नाम (2) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            errors.father_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={complainant.fatherName}
                          onChange={(e) => updateComplainant(complainant.id, 'fatherName', e.target.value)}
                        />
                      </div>
                    </div>
                    

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          व्यवसाय (3 (क)) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            errors.occupation ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={complainant.occupation}
                          onChange={(e) => updateComplainant(complainant.id, 'occupation', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          क्या आप लोक सेवक हैं या नहीं (3 (ख)) <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            errors.is_public_servant ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={complainant.isPublicServant}
                          onChange={(e) => updateComplainant(complainant.id, 'isPublicServant', e.target.value)}
                        >
                          <option value="चुनें">चुनें</option>
                          <option value="हाँ">हाँ</option>
                          <option value="नहीं">नहीं</option>
                        </select>
                      </div>
                        {errors.complainant_name && (
              <p className="text-red-500 text-sm mb-2">{errors.complainant_name[0]}</p>
            )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 3(ग) relation */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              3 (ग) यदि परिवाद किसी दूसरे व्यक्ति की ओर से है तो उस व्यक्ति के साथ अपना संबंध बतायें। <span className="text-red-500">*</span>
            </h3>
            <textarea
              placeholder="संबंध का विवरण लिखें"
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y ${
                errors.relation_with_person ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.relation}
              onChange={(e) => handleFormDataChange('relation', e.target.value)}
            />
            {errors.relation_with_person && (
              <p className="text-red-500 text-sm mt-1">{errors.relation_with_person[0]}</p>
            )}
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              यह साबित करने के लिए कि आप उसकी सम्पदा का प्रतिनिधित्व करते हैं या उसने इस निमित्त आपको प्राधिकृत किया है, संबंधित दस्तावेज संलग्न करें।
            </p>
            <div className="mt-4 flex items-center gap-4">
              <label
                className={`bg-orange-100 text-orange-600 font-semibold px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  errors.authorization_document ? 'border-2 border-red-500' : ''
                }`}
              >
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange('authorizationFile', e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              <span className="text-gray-500 text-sm">
                {formData.authorizationFile ? formData.authorizationFile.name : 'No file chosen'}
              </span>
            </div>
            {errors.authorization_document && (
              <p className="text-red-500 text-sm mt-1">{errors.authorization_document[0]}</p>
            )}
          </div>

          {/* 4 permanent address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              4. स्थायी पता : <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (क) नाम <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.permanent_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.permanentAddress.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permanentAddress: { ...formData.permanentAddress, name: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (ख) स्थान <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.permanent_place ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.permanentAddress.place}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permanentAddress: { ...formData.permanentAddress, place: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (ग) डाकघर या पुलिस थाना <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.permanent_post_office ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.permanentAddress.postOffice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permanentAddress: { ...formData.permanentAddress, postOffice: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (घ) जिला <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.permanent_district ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.permanentAddress.district}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permanentAddress: { ...formData.permanentAddress, district: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* 5 correspondence address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              5. पता जिस पर सूचना भेजी जाये : <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (क) नाम <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.correspondence_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.correspondenceAddress.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correspondenceAddress: { ...formData.correspondenceAddress, name: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (ख) स्थान <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.correspondence_place ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.correspondenceAddress.place}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correspondenceAddress: { ...formData.correspondenceAddress, place: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (ग) डाकघर या पुलिस थाना <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.correspondence_post_office ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.correspondenceAddress.postOffice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correspondenceAddress: { ...formData.correspondenceAddress, postOffice: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (घ) जिला <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.correspondence_district ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.correspondenceAddress.district}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correspondenceAddress: { ...formData.correspondenceAddress, district: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* 6 respondents */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">
                6. जिस व्यक्ति के विरुद्ध परिवाद किया जा रहा है उसका विवरण :
              </h3>
              <button
                type="button"
                className="bg-white text-[12px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap"
                onClick={addPerson}
              >
                + अन्य व्यक्ति जोड़ें
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              (1) नाम, पदनाम जो मामले के विषय में परिवाद किये जाने के समय पर रहा हो और वर्तमान पता (यदि ज्ञात हो)
            </p>

            {errors.respondent_name && (
              <p className="text-red-500 text-sm mb-2">{errors.respondent_name[0]}</p>
            )}

            {persons.map((person, index) => (
              <div key={person.id} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-b border-gray-200">
                  <h4 className="text-base font-medium text-gray-700">व्यक्ति {index + 1}</h4>
                  <div className="flex gap-2">
                    {persons.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 hover:bg-red-50 border border-red-600 px-3 py-1 rounded text-sm transition-all duration-200"
                        onClick={() => removePerson(person.id)}
                      >
                        हटाएँ
                      </button>
                    )}
                    <button
                      type="button"
                      className="bg-white hover:bg-gray-100 border border-gray-300 px-3 py-1 rounded text-lg font-bold transition-all duration-200 min-w-[35px]"
                      onClick={() => togglePerson(person.id)}
                    >
                      {showPersons[person.id] ? '−' : '+'}
                    </button>
                  </div>
                </div>

                {showPersons[person.id] && (
                  <div className="p-5 animate-slideDown">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          नाम <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            errors.respondent_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={person.name}
                          onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          पदनाम <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            errors.designation ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={person.designation}
                          onChange={(e) => updatePerson(person.id, 'designation', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        वर्तमान पता (यदि ज्ञात हो) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y ${
                          errors.current_address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={person.currentAddress}
                        onChange={(e) => updatePerson(person.id, 'currentAddress', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                (2) दिनांक जब परिवाद का कारण उत्पन्न हुआ : <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                  errors.cause_date ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.complaintDate}
                onChange={(e) => handleFormDataChange('complaintDate', e.target.value)}
              />
              {errors.cause_date && (
                <p className="text-red-500 text-sm mt-1">{errors.cause_date[0]}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                (3) यदि परिवाद धारा 8 (4) के अधीन समय व्यतीत हो जाने पर किया गया है तो विलम्ब का कारण : <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y ${
                  errors.delay_reason ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.delayReason}
                onChange={(e) => handleFormDataChange('delayReason', e.target.value)}
              />
              {errors.delay_reason && (
                <p className="text-red-500 text-sm mt-1">{errors.delay_reason[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-3">
                (4) क्या परिवाद पहले किसी वरिष्ठ अधिकारी / अधिकरण / न्यायालय के समक्ष किया गया था? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="previousComplaint"
                    value="हाँ"
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    checked={formData.previousComplaint === 'हाँ'}
                    onChange={(e) => handleFormDataChange('previousComplaint', e.target.value)}
                  />
                  <span className="text-gray-700">हाँ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="previousComplaint"
                    value="नहीं"
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    checked={formData.previousComplaint === 'नहीं'}
                    onChange={(e) => handleFormDataChange('previousComplaint', e.target.value)}
                  />
                  <span className="text-gray-700">नहीं</span>
                </label>
              </div>
              {errors.previously_submitted && (
                <p className="text-red-500 text-sm mb-2">{errors.previously_submitted[0]}</p>
              )}
              {errors.previously_submitted_details && (
                <p className="text-red-500 text-sm mb-2">{errors.previously_submitted_details[0]}</p>
              )}
              {formData.previousComplaint === 'हाँ' && (
                <textarea
                  placeholder="यदि हाँ, तो परिणाम / स्थिति तथा यदि नहीं, तो संक्षेप में कारण लिखें।"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y"
                  value={formData.previousComplaintDetails}
                  onChange={(e) => handleFormDataChange('previousComplaintDetails', e.target.value)}
                />
              )}
            </div>
          </div>

          {/* 7 complaint type */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">7. क्या यह – <span className="text-red-500">*</span></h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="complaintType"
                  value="अभिकथन"
                  className="w-4 h-4 mt-1 text-orange-500 focus:ring-orange-500"
                  checked={formData.complaintType === 'अभिकथन'}
                  onChange={(e) => handleFormDataChange('complaintType', e.target.value)}
                />
                <span className="text-gray-700">
                  कोई अभिकथन (अधिनियम की धारा 2 (ख) में यथा परिभाषित)
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="complaintType"
                  value="शिकायत"
                  className="w-4 h-4 mt-1 text-orange-500 focus:ring-orange-500"
                  checked={formData.complaintType === 'शिकायत'}
                  onChange={(e) => handleFormDataChange('complaintType', e.target.value)}
                />
                <span className="text-gray-700">
                  शिकायत (अधिनियम की धारा 2 (घ) में यथा परिभाषित)
                </span>
              </label>
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-2">{errors.category[0]}</p>
            )}
          </div>

          {/* 8 challan */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              8. चालान संख्या और नियम-4 के अधीन खर्च के लिए प्रतिभूति जमा करने का दिनांक : <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  चालान संख्या <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.challan_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.challanNumber}
                  onChange={(e) => handleFormDataChange('challanNumber', e.target.value)}
                />
                {errors.challan_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.challan_number[0]}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  दिनांक <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.challan_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.challanDate}
                  onChange={(e) => handleFormDataChange('challanDate', e.target.value)}
                />
                {errors.challan_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.challan_date[0]}</p>
                )}
              </div>
            </div>

            <div className="p-4 mb-4 rounded">
              <p className="text-gray-700 text-sm mb-2">
                <strong>टिप्पणी</strong> (1) उक्त धनराशि शीर्षक "8443-सिविल निक्षेप-00-103-प्रतिभूति निक्षेप-00-00" के अधीन भारतीय स्टेट बैंक की किसी भी शाखा में जमा की जा सकती है।
              </p>
              <p className="text-gray-700 text-sm mb-2">
                (2) किसी "शिकायत" की स्थिति में कोई धनराशि जमा करना अपेक्षित नहीं है।
              </p>
              <p className="text-gray-700 text-sm">
                (3) चालान की एक प्रति परिवाद के साथ संलग्न की जाए (नियम 8 (2) देखें)।
              </p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                चालान की प्रति (स्कैन / PDF) <span className="text-red-500">*</span>
              </label>
              <div className="mt-4 flex items-center gap-4">
                <label
                  className={`bg-orange-100 text-orange-600 font-semibold px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                    errors.challan_file ? 'border-2 border-red-500' : ''
                  }`}
                >
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange('challanFile', e.target.files[0])}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
                <span className="text-gray-500 text-sm">
                  {formData.challanFile ? formData.challanFile.name : 'No file chosen'}
                </span>
              </div>
              {errors.challan_file && (
                <p className="text-red-500 text-sm mt-1">{errors.challan_file[0]}</p>
              )}
            </div>
          </div>

          {/* 9 supporting persons */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              9. ऐसे व्यक्तियों की सूची जिन्होने परिवाद के समर्थन में शपथपत्र दिये हों : <span className="text-red-500">*</span>
            </h3>
            <textarea
              placeholder="नाम, पता आदि लिखें"
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y ${
                errors.supporting_affidavit_list ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.supportingPersons}
              onChange={(e) => handleFormDataChange('supportingPersons', e.target.value)}
            />
            {errors.supporting_affidavit_list && (
              <p className="text-red-500 text-sm mt-1">{errors.supporting_affidavit_list[0]}</p>
            )}
          </div>

          {/* 10 other persons */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              10. क्या ऐसे अन्य व्यक्ति भी हैं जिन्हे परिवाद से सम्बन्धित तथ्यों के बारे में जानकारी हो, जिन्हे लोक आयुक्त / उप लोक आयुक्त द्वारा समन किया जा सके : <span className="text-red-500">*</span>
            </h3>
            <textarea
              placeholder="ऐसे व्यक्तियों के नाम और पते उल्लेख करें"
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y ${
                errors.other_witnesses ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.otherPersons}
              onChange={(e) => handleFormDataChange('otherPersons', e.target.value)}
            />
            {errors.other_witnesses && (
              <p className="text-red-500 text-sm mt-1">{errors.other_witnesses[0]}</p>
            )}
          </div>

          {/* 11 attached docs */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              11. परिवाद से सम्बन्धित संलग्न दस्तावेजों की सूची (परिवादी का शपथपत्र सहित) : <span className="text-red-500">*</span>
            </h3>
            <textarea
              placeholder="दस्तावेज क्रमवार लिखें (वैकल्पिक). वास्तविक फाइल नीचे अपलोड करें।"
              rows="3"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y mb-3"
              value={formData.attachedDocuments}
              onChange={(e) => handleFormDataChange('attachedDocuments', e.target.value)}
            />

            <div className="flex items-center gap-4">
              <label
                className={`bg-orange-100 text-orange-600 font-semibold px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  errors.attached_documents ? 'border-2 border-red-500' : ''
                }`}
              >
                संलग्न दस्तावेज़ फाइल अपलोड करें
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange('attachedDocumentsFile', e.target.files[0])}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              <span className="text-gray-500 text-sm">
                {formData.attachedDocumentsFile ? formData.attachedDocumentsFile.name : 'No file chosen'}
              </span>
            </div>
            {errors.attached_documents && (
              <p className="text-red-500 text-sm mt-1">{errors.attached_documents[0]}</p>
            )}
          </div>

          {/* 12 complaint description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              12. परिवाद का विवरण – कृपया यहाँ पर परिवाद के सम्पूर्ण तथ्य बतायें (अधिकतम 2000 अक्षर) : <span className="text-red-500">*</span>
            </h3>
            <textarea
              placeholder="सम्पूर्ण विवरण स्पष्ट एवं संक्षेप में लिखें"
              rows="8"
              maxLength="2000"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y ${
                errors.complaint_description ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.complaintDescription}
              onChange={(e) => handleFormDataChange('complaintDescription', e.target.value)}
            />
            {errors.complaint_description && (
              <p className="text-red-500 text-sm mt-1">{errors.complaint_description[0]}</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              * यह बॉक्स 2000 अक्षरों तक सीमित है। ({formData.complaintDescription.length}/2000)
            </p>
          </div>

          {/* buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              className="bg-gray-600 text-[12px] hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              onClick={handleReset}
            >
              रीसेट
            </button>
            <button
              type="submit"
              className="bg-orange-500 text-[12px] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              पूर्वावलोकन / सबमिट
            </button>
          </div>
        </form>
      </div>

      {/* PREVIEW MODAL WITH A4 SHEET AND PDF DOWNLOAD */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print-modal-overlay">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">शिकायत पूर्वावलोकन</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content - Main scrollable area */}
            <div className="flex-1 overflow-auto bg-slate-100 px-2 md:px-4 py-4 flex justify-center min-h-0">
              <ComplaintPrintView
                ref={printRef}
                complainants={complainants}
                persons={persons}
                formData={formData}
              />
            </div>

            {/* Footer */}
            <div className="shrink-0 bg-gray-50 px-6 py-3 flex justify-end gap-4 border-t border-gray-200 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloadingPDF}
                className="md:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isDownloadingPDF ? 'डाउनलोड हो रहा है...' : '📥 PDF डाउनलोड'}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200"
                disabled={isSubmitting}
              >
                संपादित करें
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'सबमिट हो रहा है...' : 'अंतिम सबमिट करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        /* UPDATED AND FIXED CSS FOR FULL COVERAGE */
        .a4-sheet {
          width: 100%;
          min-height: 297mm;
          height: auto !important; /* Ensure height grows with content */
          margin: 0 auto;
          background: linear-gradient(to bottom right, #fff7ed, #ffedd5, #fff7ed) !important;
          display: flow-root; /* Establishes a new block formatting context */
          overflow: visible; /* Ensure content doesn't get hidden */
        }
        
        @media screen {
          .a4-sheet {
            max-width: 100%;
            min-width: 100%; /* Force full width in preview */
          }
        }
        
        @media print {
          body {
            margin: 0;
          }
          .print-modal-overlay {
            position: static !important;
            background: none !important;
            padding: 0 !important;
          }
          .a4-sheet {
            transform: scale(1) !important;
            box-shadow: none !important;
            border: none !important;
            width: 210mm; /* Reset width for printing on A4 paper */
          }
        }
      `}</style>
    </div>
  );
};

export default Complaints;
