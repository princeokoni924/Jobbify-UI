import {
  Download,
  X,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Linkedin,
  Github,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { getInitials } from "../../pages/utils/helpler";
import moment from "moment";
import axiosInstance from "../../pages/utils/axiosInstance";
import { API_PATHS } from "../../pages/utils/apiPath";
import toast from "react-hot-toast";
import StatusBadge from "../StatusBadge";
import TextareaField from "../input/TextareaField";
//import STATUS_OPTIONS from '../../pages/utils/data'


const ApplicationProfilePreview = ({
  selectApplicant,
  setSelectApplicant,
  handleDownloadResume,
  handleClose,
}) => {

  const STATUS_OPTIONS = [
  "Applied",
  "In Review",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Accepted",
  "Withdrawn",
];
  // Extract applicant data
  const applicants = selectApplicant?.applicant || {};

  // console.log("Applicant data:", applicants);

  const {
    email = "",
    phone = "",
    location = "",
    bio = "",
    //resume = "",
    skill = [],
    experience = [],
    education = [],
    portfolio = "",
    linkedin = "",
    github = "",
  } = applicants;

  const [currentStatus, setCurrentStatus] = useState(
    selectApplicant?.status,
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus management for accessibility
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    if (selectApplicant?.status) {
      setCurrentStatus(selectApplicant.status);
    }

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectApplicant]);

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
    if (!selectApplicant || !selectApplicant._id) {
       //console.error("No applicant selected or Missing ID");
      return;
    }

    // Prevent changing closed applications
    const closedStatuses = ["Rejected", "Accepted", "Withdrawn"];
    if (closedStatuses.includes(selectApplicant.status)) {
      toast.error("Cannot modify a closed application");
      return;
    }
    // Prevent unnecessary API calls if status hasn't changed
    //if (newStatus === currentStatus) return;
    if (newStatus === "Rejected" && !rejectionReason.trim()) {
      setCurrentStatus(newStatus);
      return;
    }

    if (newStatus === "Interview" && currentStatus !== "Interview") {
      setCurrentStatus(newStatus);
      return;
    }
   // Validate required fields before submission
    if (newStatus === "Rejected" && !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    if (newStatus === "Interview" && !interviewDate) {
      // show date picker
      //setCurrentStatus(newStatus);
      toast.error("Please select an interview date");
      return;
    }

    const applicantId = selectApplicant._id;
    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    setIsUpdatingStatus(true);
    

    try {
      const payload = { status: newStatus };
      if (newStatus === "Rejected" && rejectionReason.trim()) {
        payload.rejectionReason = rejectionReason.trim();
      }

      if (newStatus === "Interview" && interviewDate) {
        payload.interviewDate = interviewDate;
      }
      const response = await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(applicantId),
        payload,
      );

      if (response && (response.status === 200 || response.data?.success)) {
        setSelectApplicant((prev) => {
          if (!prev) return prev;
          return { ...prev, status: newStatus };
        });
        toast.success("Application status updated successfully");
        setRejectionReason("");
        setInterviewDate("")
        return;
      }
    } catch (error) {
      setCurrentStatus(previousStatus);
      let errorMessage = "Failed to update application status";
      if (error.response) {
        errorMessage =
          error.response.data?.error?.message ||
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server";
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error("Status update error:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle resume download with loading state
  const handleResumeDownload = async (resumePath) => {
  try {
    console.log(' Starting download for:', resumePath);
    
    
    
    // Extract userId and filename from path
    const pathParts = resumePath.split('/');
    const userId = pathParts[pathParts.length - 2]; // Second to last part
    const filename = pathParts[pathParts.length - 1]; // Last part
    
    console.log(' UserId:', userId);
    console.log(' Filename:', filename);

    // Call backend download endpoint
    const response = await axiosInstance.get(
      API_PATHS.DOWNLOAD_RESUME(userId, filename),
      {
        responseType: 'blob', // IMPORTANT!
      }
    );

    console.log('Download response received');

    // Create blob and trigger download
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'application/pdf' 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    console.log(' Download completed successfully');
    toast.success('Resume downloaded successfully');

  } catch (error) {
    console.error(' Download error:', error);
    
    if (error.response) {
      const status = error.response.status;
      
      if (status === 404) {
        toast.error('Resume file not found');
      } else if (status === 403) {
        toast.error('Access denied');
      } else {
        toast.error('Failed to download resume');
      }
    } else {
      toast.error('Network error - please check your connection');
    }
    
    throw error;
  }
};
  
  
  
  // const handleResumeDownload = async () => {
  //   if (!selectApplicant?.applicant?.resume) {
      
  //     toast.error("Resume not available");
  //     return;
  //   }
  //   console.log(' Resume path:', selectApplicant.applicant.resume);
  //   setIsDownloading(true);
  //   try {
  //     await handleDownloadResume(selectApplicant.applicant.resume);
  //   } catch (error) {
  //     toast.error("Failed to download resume");
  //     console.error("Resume download error:", error);
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

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
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
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
        <div className="p-6 space-y-6">
          {/* Applicant Info */}
          <div className="text-center">
            {applicant?.avatar ? (
              <img
                className="w-24 h-24 object-cover mx-auto rounded-full border-4 border-blue-100"
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
              className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto border-4 border-blue-200"
              style={{ display: applicant?.avatar ? "none" : "flex" }}
            >
              <span className="text-white text-2xl font-semibold">
                {applicant?.name ? getInitials(applicant.name) : "NA"}
              </span>
            </div>
            <h4 className="mt-4 text-2xl font-bold text-gray-900">
              {applicant?.name || "Unknown Applicant"}
            </h4>
            {bio && (
              <p className="text-gray-600 mt-2 max-w-xl mx-auto">{bio}</p>
            )}
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 rounded-lg p-4">
            {email && (
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-blue-600 truncate text-sm"
                >
                  {email}
                </a>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <a
                  href={`tel:${phone}`}
                  className="hover:text-blue-600 text-sm"
                >
                  {phone}
                </a>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm">{location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm">Applied: {formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Applied Position */}
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Applied Position
            </h5>
            <p className="text-gray-900 font-medium text-lg">
              {job?.title || "Position not specified"}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {job?.location || "Location not specified"} •{" "}
              {job?.type || "Type not specified"}
            </p>
          </div>

          {/* Skills Section */}
          {skill && skill.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Skills
              </h5>
              <div className="flex flex-wrap gap-2">
                {skill.map((s, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Experience
              </h5>
              <div className="space-y-2">
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500"
                  >
                    <p className="text-gray-700 text-sm whitespace-pre-line">
                      {exp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Education
              </h5>
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500"
                  >
                    <p className="text-gray-700 text-sm whitespace-pre-line">
                      {edu}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(portfolio || linkedin || github) && (
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-900">Links</h5>
              <div className="grid grid-cols-1 gap-2">
                {portfolio && (
                  <a
                    href={
                      portfolio.startsWith("http")
                        ? portfolio
                        : `https://${portfolio}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Globe className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 truncate">
                      Portfolio: {portfolio}
                    </span>
                  </a>
                )}
                {linkedin && (
                  <a
                    href={
                      linkedin.startsWith("http")
                        ? linkedin
                        : `https://${linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Linkedin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 truncate">
                      LinkedIn: {linkedin}
                    </span>
                  </a>
                )}
                {github && (
                  <a
                    href={
                      github.startsWith("http") ? github : `https://${github}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Github className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 truncate">
                      GitHub: {github}
                    </span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Application Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3">
              Application Status
            </h5>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-gray-600 text-sm">Current Status:</span>
              <StatusBadge status={currentStatus} />
            </div>
          </div>

          {/* Download Resume Button */}
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleResumeDownload}
            disabled={isDownloading || !applicant.resume}
            aria-label="Download applicant resume"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download Resume"}
          </button>

          {/* Status Change Dropdown */}
          <div>
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

            {/* Show rejection reason field when "Rejected" is selected */}
            {currentStatus === "Rejected" && (
              <div className="mt-3">
                <label
                  className="block mb-2 text-sm text-gray-700 font-medium"
                  htmlFor="rejection-reason"
                >
                  Rejection Reason <span className="text-red-500 ml-2">*</span>
                </label>
                <TextareaField
                  id={`rejection-reason`}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={`Please provide a reason for rejection....`}
                  rows={3}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    console.log("=== BUTTON CLICK ===");
                    console.log("Rejection reason:", rejectionReason);
                    console.log("Is updating:", isUpdatingStatus);
                    console.log(
                      "Should be disabled:",
                      !rejectionReason.trim() || isUpdatingStatus,
                    );

                    handleStatusChange({ target: { value: "Rejected" } });
                  }}
                  disabled={!rejectionReason.trim() || isUpdatingStatus}
                  className="mt-2 w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:cursor-not-allowed transition-colors disabled:opacity-50"
                >
                  {isUpdatingStatus ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            )}

            {currentStatus === "Interview" && (
              <div className="mt-3">
                <label className="block mb-2 text-sm text-gray-700 font-medium">
                  Interview Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id={"interview-date"}
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange({ target: { value: "Interview" } })
                  }
                  disabled={!interviewDate || isUpdatingStatus}
                  className="w-full mt-2 px-4 py-2 text-white font-medium  rounded-lg hover:bg-blue-700 disabled:opacity-50 bg-blue-600"
                >
                  {isUpdatingStatus ? "Scheduling..." : "Confirm Interview"}
                  {/* {console.log("btn clicked")} */}
                </button>
              </div>
            )}

             {/* Show message for closed applications */}
          {["Rejected", "Accepted", "Withdrawn"].includes(currentStatus) && (
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              This application is closed and cannot be modified.
            </p>
          )}
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
