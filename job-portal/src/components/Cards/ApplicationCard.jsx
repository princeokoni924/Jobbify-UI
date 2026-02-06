import moment from "moment";
import { getInitials } from "../../pages/utils/helpler";
import { Calendar, Download, Eye } from "lucide-react";
import StatusBadge from "../StatusBadge";
// Extracted Application Card Component
const ApplicationCard = ({ application, onDownloadResume, onViewProfile }) => {
  const app = application;
  const applicantName = app.applicant?.name || "";
  const applicantEmail = app.applicant?.email || "";
  const applicantAvatar = app.applicant?.avatar;
  const resumeUrl = app.applicant?.resume;
  const appliedDate = app.createdAt
    ? moment(app.createdAt).format("Do MMM YYYY")
    : "N/A";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border p-4 border-gray-200 rounded-lg transition-colors hover:bg-gray-50">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {applicantAvatar ? (
            <img
              src={applicantAvatar}
              alt={`${applicantName}'s profile`}
              className="w-12 h-12 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {getInitials(applicantName)}
              </span>
            </div>
          )}
        </div>

        {/* Application Info */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900">{applicantName}</h3>
          {applicantEmail && (
            <p className="text-gray-500 text-sm truncate">{applicantEmail}</p>
          )}
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <span>Applied {appliedDate}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <StatusBadge status={app.status} />
        <button
          onClick={() => onDownloadResume(resumeUrl)}
          disabled={!resumeUrl || resumeUrl}
          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Download ${applicantName}'s resume`}
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Resume
        </button>

        <button
          onClick={() => onViewProfile(app)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
          aria-label={`View ${applicantName}'s profile`}
        >
          <Eye className="h-5 w-5" aria-hidden="true" />
          View Profile
        </button>
      </div>
    </div>
  );
};
export default ApplicationCard;