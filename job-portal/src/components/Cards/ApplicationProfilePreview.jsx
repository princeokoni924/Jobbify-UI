
import { Download, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { getInitials } from "../../pages/utils/helpler";
import moment from "moment";
import axiosInstance from "../../pages/utils/axiosInstance";
import { API_PATHS } from "../../pages/utils/apiPath";
import toast from "react-hot-toast";
import StatusBadge from "../StatusBadge";

const STATUS_OPTIONS = ["Applied", "Accepted", "Reject", "In Review"];

const ApplicationProfilePreview = ({
  selectApplicant,
  setSelectApplicant,
  handleDownloadResume,
  handleClose,
}) => {
  const [currentStatus, setCurrentStatus] = useState(selectApplicant?.status || "");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus management for accessibility
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  // Handle status change with proper error handling and validation
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    // Prevent unnecessary API calls if status hasn't changed
    if (newStatus === currentStatus) return;

    setCurrentStatus(newStatus);
    setIsUpdatingStatus(true);

    try {
      const response = await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(selectApplicant._id),
        { status: newStatus }
      );

      if (response.status === 200) {
        // Update local state after successful update
        setSelectApplicant({ ...selectApplicant, status: newStatus });
        toast.success("Application status updated successfully");
      }
    } catch (error) {
      // Revert to previous status on error
      setCurrentStatus(selectApplicant.status);
      
      // Show appropriate error message
      const errorMessage = error.response?.data?.message || "Failed to update application status";
      toast.error(errorMessage);
      
      // Log error for debugging
      console.error("Status update error:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle resume download with loading state
  const handleResumeDownload = async () => {
    if (!selectApplicant?.applicant?.resume) {
      toast.error("Resume not available");
      return;
    }

    setIsDownloading(true);
    try {
      await handleDownloadResume(selectApplicant.applicant.resume);
    } catch (error) {
      toast.error("Failed to download resume");
      console.error("Resume download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Format date with fallback
  const formatDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("Do MMM YYYY");
  };

  // Null check for selectApplication
  if (!selectApplicant) {
    return null;
  }

  const { applicant, job, createdAt } = selectApplicant;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
            Applicant Profile
          </h3>
          <button
            ref={closeButtonRef}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleClose}
            aria-label="Close modal"
            type="button"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Applicant Info */}
          <div className="text-center mb-6">
            {applicant?.avatar ? (
              <img
                className="w-20 h-20 object-cover mx-auto rounded-full border-2 border-gray-200"
                src={applicant.avatar}
                alt={`${applicant.name}'s avatar`}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto"
              style={{ display: applicant?.avatar ? "none" : "flex" }}
            >
              <span className="text-white text-xl font-semibold">
                {applicant?.name ? getInitials(applicant.name) : "NA"}
              </span>
            </div>
            <h4 className="mt-4 text-xl font-semibold text-gray-900">
              {applicant?.name || "Unknown Applicant"}
            </h4>
            <p className="text-gray-600 break-all">
              {applicant?.email || "No email provided"}
            </p>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            {/* Applied Position */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">
                Applied Position
              </h5>
              <p className="text-gray-700 font-medium">
                {job?.title || "Position not specified"}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {job?.location || "Location not specified"} • {job?.type || "Type not specified"}
              </p>
            </div>

            {/* Application Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">
                Application Details
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <StatusBadge status={currentStatus} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Applied Date:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Download Resume Button */}
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResumeDownload}
              disabled={isDownloading || !applicant?.resume}
              aria-label="Download applicant resume"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Downloading..." : "Download Resume"}
            </button>

            {/* Status Change Dropdown */}
            <div className="mt-4">
              <label
                className="block mb-2 text-sm text-gray-700 font-medium"
                htmlFor="status-select"
              >
                Change Application Status
              </label>
              <select
                id="status-select"
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Application status"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {isUpdatingStatus && (
                <p className="text-sm text-blue-600 font-medium mt-2 flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  Updating status...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ApplicationProfilePreview.propTypes = {
  selectApplicant: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    applicant: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      avatar: PropTypes.string,
      resume: PropTypes.string,
    }),
    job: PropTypes.shape({
      title: PropTypes.string,
      location: PropTypes.string,
      type: PropTypes.string,
    }),
  }).isRequired,
  setSelectApplicant: PropTypes.func.isRequired,
  handleDownloadResume: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ApplicationProfilePreview;
















// /* eslint-disable no-unused-vars */
// import { Download, X } from "lucide-react";
// import { useState } from "react";
// import { getInitials } from "../../pages/utils/helpler";
// import moment from "moment";
// import axiosInstance from "../../pages/utils/axiosInstance";
// import { API_PATHS } from "../../pages/utils/apiPath";
// import toast from "react-hot-toast";
// import StatusBadge from "../StatusBadge";

// const statusOptions = ["Applied", "Accepted", "Reject", "In Review"];

// const ApplicationProfilePreview = ({
//   selectApplication,
//   setSelectApplications,
//   handleDownloadResume,
//   handleClose,
// }) => {
//   const [currentStatus, setCurrentStatus] = useState(selectApplication.status);
//   const [isLoading, setIsLoading] = useState(false);

//   // handle on change status
//   const onChangeStatus = async (event) => {
//     const newStatus = event.target.value;
//     setCurrentStatus(newStatus);
//     setIsLoading(true);
//     try {
//       const response = await axiosInstance.put(
//         API_PATHS.APPLICATIONS.UPDATE_STATUS(selectApplication._id),
//         {
//           status: newStatus,
//         }
//       );
//       if (response.status === 200) {
//         // update local state after succefull update
//         setSelectApplications({ ...selectApplication, status: newStatus });
//         toast.success("Application status updated successfully");
//       }
//     } catch (err) {
//       toast.error("Error updating status.");
//       // optionally revert status if fail
//       setCurrentStatus(selectApplication.status);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div className="fixed inset-0 bg-[rgb(0,0,0,0.2)] bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
//         {/* Model Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Applicant Profile
//           </h3>
//           <button
//             className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
//             onClick={() => handleClose()}
//           >
//             <X className="h-5 w-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Model Content */}
//         <div className="p-6">
//           <div className="text-center mb-6">
//             {selectApplication.applicant.avatar ? (
//               <img
//                 className="w-20 h-20 object-cover mx-auto rounded-full"
//                 src={selectApplication.applicant.avatar}
//                 alt={selectApplication.applicant.name}
//               />
//             ) : (
//               <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center mx-auto">
//                 <span className="text-white text-xl font-semibold">
//                   {getInitials(selectApplication.applicant.name)}
//                 </span>
//               </div>
//             )}
//             <h4 className="mt-4 text-xl font-semibold text-gray-900">
//               {selectApplication.applicant.name}
//             </h4>
//             <p className="text-gray-600">{selectApplication.applicant.email}</p>
//           </div>

//           {/* Applied postion */}
//           <div className="space-y-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h5 className="font-medium text-gray-900 mb-2">
//                 Applied Position
//               </h5>
//               <p className="text-gray-700">{selectApplication.job.title}</p>
//               <p className="text-gray-600 text-sm mt-1">
//                 {selectApplication.job.location}.{selectApplication.job.type}
//               </p>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4">
//               <h5 className="font-medium text-gray-900 mb-2">
//                 Application Details
//               </h5>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Status</span>
//                   <StatusBadge status={currentStatus} />
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Applied Date:</span>
//                   <span className="text-gray-900">
//                     {moment(selectApplication.createdAt).format("Do MM YYYY")}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <button
//               className="inline-flex w-full
//                items-center justify-center
//                gap-2 px-4 py-2 bg-blue-500 text-white font-medium 
//                rounded-lg hover:bg-blue-800 transition-colors duration-200"
//               onClick={() =>
//                 handleDownloadResume(selectApplication.applicant.resume)
//               }
//             >
//               <Download className="w-4 h-4" />
//               Download CV
//             </button>

//             {/* Status Dropdown */}
//             <div className="mt-4">
//               <label
//                 className="block mb-1 text-sm text-gray-700 font-medium"
//                 htmlFor=""
//               >
//                 Change Application status
//               </label>
//               <select
//                 value={currentStatus}
//                 onChange={onChangeStatus}
//                 disabled={isLoading}
//                 className="w-full border border-gray-300 rounded-lg
//                p-2 focus:ring-blue-500 focus:border-blue-500 "
//               >
//                 {statusOptions.map((status) => (
//                   <option key={status} value={status}>
//                     {status}
//                   </option>
//                 ))}
//               </select>
//               {isLoading && (
//                 <p className="text-sm text-gray-500 font-medium mt-1">
//                   Updating Status, please wait......
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ApplicationProfilePreview;
