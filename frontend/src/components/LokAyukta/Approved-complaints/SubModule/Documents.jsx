import React, { useState } from "react";
import { FaEye, FaTimes, FaSpinner } from "react-icons/fa";
import { BsFileEarmarkPdf, BsDownload } from "react-icons/bs";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const Documents = ({ complaint }) => {
  const [pdfViewUrl, setPdfViewUrl] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(null); 


  const normalizePath = (filePath) => {
    if (!filePath) return "";
    let fp = filePath.replace(/^\//, "");
    fp = fp.replace("storage/", "storage/Document/");
    return fp;
  };

  const makeFileUrl = (filePath) => {
    const root = BASE_URL.replace("/api", "");
    const fixedPath = normalizePath(filePath);
    return `${root}/${fixedPath}`;
  };


  const {
    data: documents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["documents", complaint?.id],
    queryFn: async () => {
      const res = await api.get(`/lokayukt/get-document/${complaint.id}`);
      return res.data.status ? res.data.data : [];
    },
    enabled: !!complaint?.id,
  });

  const handleViewPdf = async (filename) => {
    try {
      setLoadingDoc(filename);

      const res = await api.get(`/lokayukt/get-file-preview/${complaint.id}`);

      if (res.data.status && res.data.data.length > 0) {
        const match = res.data.data.find((p) => p.includes(filename));
        if (match) {
          const url = makeFileUrl(match);
          setPdfViewUrl(url);
        }
      }
    } catch (err) {
      alert("PDF नहीं खुल पाया");
    } finally {
      setLoadingDoc(null);
    }
  };


  const handleDownloadPdf = async () => {
    try {
      const res = await api.get(`/lokayukt/get-file-preview/${complaint.id}`);
      if (res.data.status && res.data.data.length > 0) {
        const url = makeFileUrl(res.data.data[0]);
        const a = document.createElement("a");
        a.href = url;
        a.download = `document_${complaint.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      alert("Download error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
        <p className="text-sm">Error loading documents</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Documents
        </h2>

        {/* <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <BsDownload className="w-4 h-4" />
          Download case PDF
        </button> */}
      </div>

      {/* Docs */}
      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No documents available
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
            >
              {/* Icon + Filename */}
              <div className="flex items-center gap-3">
                <BsFileEarmarkPdf className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">{doc.file}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewPdf(doc.file)}
                  disabled={loadingDoc === doc.file}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                >
                  {loadingDoc === doc.file ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                  View
                </button>

                {/* <button
                  onClick={() => handleDownloadPdf()}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  <BsDownload className="w-4 h-4" />
                </button> */}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PDF Modal */}
      {pdfViewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">PDF Viewer</h3>
              <button
                onClick={() => setPdfViewUrl(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <iframe
              src={`${pdfViewUrl}#zoom=page-width`}
              className="w-full h-full border-0"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
