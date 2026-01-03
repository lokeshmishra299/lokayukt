import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

// Draft JS Imports
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

const EditDraft = ({}) => {
  // 1. State Variables Defined
  const [openNoteModal, setOpenNoteModal] = useState(true); // Default true rakha hai taki dikhe
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});

  // 2. Editor Handler
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const content = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    setNote(content);
  };

  // 3. Submit Handler
  const handleSubmitNote = () => {
    // Simple validation example
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      setErrors({ draft_note: ["Please enter some content."] });
      return;
    }
    
    console.log("Submitting Note:", note);
    alert("Draft Submitted! Check console for content.");
    setOpenNoteModal(false);
  };

  return (
    <div>
      {/* Button to reopen modal if closed */}
      {!openNoteModal && (
        <button 
            onClick={() => setOpenNoteModal(true)}
            className="m-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
            Open Draft Editor
        </button>
      )}

      {openNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 md:p-0">
          <div className="bg-white w-full md:w-11/12 h-full md:h-[70vh] shadow-xl relative flex flex-col md:flex-row rounded-md overflow-hidden">
            
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white/80 hover:bg-gray-100 rounded-full z-10"
              onClick={() => setOpenNoteModal(false)}
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1 px-4 md:p-6 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4 md:mb-6">Create Draft</h2>
              
              <label className="block text-sm font-medium mb-2">
                Draft Content <span className="text-red-500">*</span>
              </label>

              {/* Editor Container */}
              <div
                className={`border rounded-md ${
                  errors.draft_note ? "border-red-500" : "border-gray-300"
                }`}
              >
                <Editor
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName px-3 min-h-[120px] md:min-h-[150px]"
                  placeholder="Enter your note here..."
                  toolbar={{
                    options: [
                      "inline",
                      "blockType",
                      "fontSize",
                      "list",
                      "textAlign",
                      "colorPicker",
                      "link",
                      "emoji",
                      "remove",
                      "history",
                    ],
                    inline: { options: ["bold", "italic", "underline"] },
                  }}
                />
              </div>

              {/* Error Message */}
              {errors.draft_note && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.draft_note[0]}
                </p>
              )}

              {/* Submit Button */}
              <div className="flex justify-end mt-24">
                <button
                  className="bg-blue-600 text-white px-3 py-3 rounded-lg hover:bg-blue-700 transition text-md"
                  onClick={handleSubmitNote}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDraft;