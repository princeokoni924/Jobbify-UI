import {
  Heart,
  Building2,
  Calendar,
  MapPin,
  Building,
  AlertCircle,
  AlertTriangle,
  Share2,
} from "lucide-react";
import moment from "moment";
import { useState, useCallback } from "react";
import { useAuth } from "../../content/AuthContext";
import StatusBadge from "../StatusBadge";
import { useNavigate } from "react-router-dom";
import CornerBadge from "../CornerBadge";
import Tag from "../Tag";
import SALARY_PAYMENT_PERIOD  from "../../constant/salaryPaymentPeriod";
import IconButton from "../IconButton";
import Job_TYPE_STYLES  from "../../constant/jobTypeStyle";
import ShareModal from "../ShareModal";
import {formatSalary }from "../../pages/utils/currency"

const JobCard = ({ job, onToggleSave, onShare, saved, hideApply }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shareModal, setShareModal] = useState({ open: false, url: "" });
  const [shareLoading, setShareLoading] = useState(false);
  const now = moment();
  const jobId = job?._id;
  const isExpiredJob = job?.expiresAt && moment(job.expiresAt).isBefore(now);
const hasDeadlinePassed =
  job?.applicationDeadline &&
  moment(job.applicationDeadline).isBefore(now);
  const isClosedJob = job?.isClosed || isExpiredJob || hasDeadlinePassed;


  const handleShareClick = useCallback(
    async (e) => {
      e.stopPropagation();
      setShareLoading(true);
      try {
        const url = await onShare(jobId);
        if (url) setShareModal({ open: true, url });
      } finally {
        setShareLoading(false);
      }
    },
    [jobId, onShare]);



  // format expiration message (absolute date)
  const getExpirationMessage = () => {
    if (!job?.expiresAt) {
      return null;
    }
    
    const expiry = moment(job?.expiresAt);
    if (expiry.isSameOrBefore(now, "day")) {
      return null;
    }
    return expiry.format("D/M/YYYY");
  };

  const getDaysUntilExpirationDate = () => {
    if (!job?.expiresAt) {
      return null;
    }
    const now = moment();
    const expiry = moment(job.expiresAt);
    const days = expiry.diff(now, "days");
    return days <0 ? 0 : days;
    
  };

  if (isClosedJob && !saved && user?.role === "jobseeker") {
    return null;
  }
  const daysUntilExpirationDate = getDaysUntilExpirationDate();
  const expirationMessage = getExpirationMessage();
  const handleCardClick = () => {
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
  };

  const handleApplyClick = (event) => {
    event.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/apply/${jobId}`, {
      state: {
        job: {
          id: job._id,
          title: job.title,
          company: job.company?.companyName,
          companyLogo: job.company?.companyLogo,
          location: job.location,
          type: job.type,
        },
      },
    });
  };



  return (
    <>
      <div
        onClick={handleCardClick}
        className={`bg-white rounded-2xl border ${isClosedJob ? "border-red-200 bg-red-50/30" : "bg-gray-200"} p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200 transition-shadow duration-200 overflow-hidden group cursor-pointer relative flex flex-col gap-0`}
      >
        {/* Corner badge for expired/closed jobs */}
        {isClosedJob && (
          <CornerBadge
            icon={AlertCircle}
            className="bg-red-100 text-red-600 border-red-700"
          >
            {isExpiredJob
              ? "Expired"
              : hasDeadlinePassed
                ? "Deadline Passed"
                : "Closed"}
          </CornerBadge>
        )}

        {!isClosedJob &&
          daysUntilExpirationDate !== null &&
          daysUntilExpirationDate > 0 && (
            <CornerBadge
              icon={AlertTriangle}
              className="bg-yellow-100 text-yellow-700 border-yellow-500"
            >
              <span className="text-sm">
                The job will expire on {expirationMessage}
              </span>
            </CornerBadge>
          )}
        <div className="flex items-start justify-between *:first-letter:mb-4">
          <div className="flex items-start gap-4">
            {job?.company?.companyLogo ? (
              <img
                className="w-14 h-14 object-cover rounded-2xl border-2 border-white/20 shadow-lg"
                src={job.company.companyLogo}
                alt={`${job.company.companyName} logo`}
              />
            ) : (
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-white/20 shadow-lg bg-gray-300">
                <Building2 className="text-blue-500 w-8 h-8" />
              </div>
            )}

            <div className="flex-1">
              <h3
                className={`font-semibold text-gray-600 text-base group-hover:text-blue-500 transition-colors leading-snug`}
              >
                {job?.title}
              </h3>
              <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                <Building className="w-3.5 h-3.5" />
                {job?.company?.companyName}
              </p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-1">
              {saved && onShare && (
                <IconButton
                  onClick={handleShareClick}
                  disabled={shareLoading}
                  label={`share`}
                  className="hover:text-blue-100"
                >
                  <Share2
                    className={`w-5 h-5 transition-colors ${shareLoading ? "text-gray-300 animate-pulse" : "text-gray-400 hover:text-blue-500"}`}
                  />
                </IconButton>
              )}

              <IconButton
                onClick={(e)=>{e.stopPropagation(); onToggleSave(e)}}
                label={job?.isSaved || saved ? "Remove from saved" : "Save job"}
                className="hover:bg-gray-100"
              >
                <Heart
                  className={`w-7 h-7 transition-colors ${
                    job?.isSaved || saved
                      ? "text-red-500 fill-blue-500"
                      : "text-gray-400 hover:text-blue-600"
                  }`}
                />
              </IconButton>
            </div>
          )}
        </div>
          <div className="flex items-center gap-2 text-xs flex-wrap mb-5">
             <Tag icon={MapPin} className="bg-gray-100 text-gray-700">
            {job?.location}
          </Tag>

          <Tag className={Job_TYPE_STYLES[job?.type] ?? "bg-gray-100 text-gray-600"}>
            {job?.type?.replace("_", " ") || ""}
          </Tag>

          {job?.category && (
            <Tag className="bg-blue-50 text-blue-700">{job.category}</Tag>
          )}

          {job?.experienceLevel && (
            <Tag className="bg-purple-50 text-purple-700">{job.experienceLevel}</Tag>
          )}
          </div>

            {/* ── Meta row ── */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-5 pb-4 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Posted {job?.createdAt ? moment(job.createdAt).fromNow() : "recently"}
          </span>
          {job?.expiresAt && !isExpiredJob && (
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              The job will expire on {moment(job.expiresAt).format("D/M/YYYY")}
            </span>
          )}
        </div>
          <div className="items-center justify-between">
            <div className="flex flex-col">
              <div className="text-blue-600 font-semibold text-lg leading-tight">
              {formatSalary(job?.salaryMin, job?.salaryMax, job?.salaryCurrency)}
              {job?.salaryPeriod && (
                <span className="text-xs text-gray-500 font-normal ml-1">
                  /{SALARY_PAYMENT_PERIOD[job.salaryPeriod] ?? job.salaryPeriod}
                </span>
              )}
            </div>
            {job?.salaryCurrency && (
              <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mt-0.5">
                {job.salaryCurrency}
              </span>
            )}
            </div>
            {!saved && (
            job?.applicationStatus ? (
              <StatusBadge status={job.applicationStatus} />
            ) : (
              !hideApply && (
                isClosedJob ? (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 text-sm px-6 py-2.5 rounded-lg cursor-not-allowed font-semibold"
                  >
                    {isExpiredJob ? "Expired" : "Closed"}
                  </button>
                ) : (
                  <button
                    onClick={handleApplyClick}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-sm text-white px-6 py-2.5
                      rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200
                      font-semibold transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Apply Now
                  </button>
                )
              )
            )
          )}
          </div>
          {/* ── Closed reason ── */}
        {isClosedJob && job?.closedReason && (
          <div className="mt-3 pt-3 border-t border-red-200">
            <p className="text-xs text-red-600 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
              <span>{job.closedReason}</span>
            </p>
          </div>
        )}

        {/* ── Application / view counts ── */}
        {(job?.applicationCount > 0 || job?.viewCount > 0) && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
            {job?.applicationCount > 0 && (
              <span>{job.applicationCount} applicant{job.applicationCount !== 1 ? "s" : ""}</span>
            )}
            {job?.viewCount > 0 && (
              <span>{job.viewCount} view{job.viewCount !== 1 ? "s" : ""}</span>
            )}
          </div>
        )}
      </div>
       {/* ── Share modal ── */}
      {shareModal.open && (
        <ShareModal
          job={job}
          shareUrl={shareModal.url}
          onClose={() => setShareModal({ open: false, url: "" })}
        />
      )}
    </>
  );
};
export default JobCard;
