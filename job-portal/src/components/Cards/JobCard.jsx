import { Bookmark, Building2, Calendar, MapPin, Building } from "lucide-react";
import moment from "moment";
import { useAuth } from "../../content/AuthContext";
import StatusBadge from "../StatusBadge";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, onToggleSave, saved, hideApply }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatSalary = (min, max, currency = "NGN") => {
    const currencySymbols = {
      NGN: "₦",
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "C$",
      AUD: "A$",
      INR: "₹",
    };

    const symbols = currencySymbols[currency] || "₦";

    const formatNumber = (number) => {
      if (number >= 1000000) {
        return `${symbols}${(number / 1000000).toFixed(1)}M`;
      } else if (number >= 1000) {
        return `${symbols}${(number / 1000).toFixed(0)}K`;
      } else {
        return `${symbols} ${number}`;
      }
    };

    if (!min && !max) {
      return "Not specified";
    }

    if (min && max) {
      return `${formatNumber(min)} - ${formatNumber(max)}`;
    }
    return formatNumber(min || max);
  };

  // Navigate to job details when card is clicked
  const handleCardClick = () => {
    const jobId = job?._id || job?.id;
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
  };

  // Navigate to application page with resume upload
  const handleApplyClick = (e) => {
    e.stopPropagation(); // Prevent card click event

    if (!user) {
      // If not logged in, redirect to login
      navigate("/login", {
        state: {
          from: `/jobs/${job?._id}`,
          message: "Please login to apply for this job",
        },
      });
      return;
    }

    // Navigate to application form with job details
    navigate(`/apply/${job._id}`, {
      state: {
        job: {
          id: job._id,
          title: job.title,
          company: job.company?.companyName,
          location: job.location,
          type: job.type,
        },
      },
    });
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200
        p-6 hover:shadow-xl hover:shadow-gray-200
        transition-all duration-300
        group relative overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {job?.company?.companyLogo ? (
            <img
              className="w-14 h-14 object-cover rounded-2xl border-2
                border-white/20 shadow-lg"
              src={job?.company?.companyLogo}
              alt={job?.company?.companyName || "logo"}
            />
          ) : (
            <div
              className="w-14 h-14 bg-gray-50 
                border-2 border-gray-200 rounded-2xl flex items-center justify-center"
            >
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-base group-hover:text-blue-500 transition-colors leading-snug">
              {job?.title}
            </h3>
            <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
              <Building className="w-3.5 h-3.5" />
              {job?.company?.companyName}
            </p>
          </div>
        </div>

        {user && (
          <button
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            aria-label={
              job?.isSaved || saved ? "Remove from saved" : "Save job"
            }
          >
            <Bookmark
              className={`w-5 h-5 transition-colors ${
                job?.isSaved || saved
                  ? "text-blue-500 fill-blue-500"
                  : "text-gray-400 hover:text-blue-600"
              }`}
            />
          </button>
        )}
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
            <MapPin className="w-3 h-3" />
            {job?.location}
          </span>

          <span
            className={`px-3 py-1 rounded-full font-medium ${
              job?.type === "full_time" || job?.type === "full-time"
                ? "bg-green-100 text-green-600"
                : job?.type === "part_time" || job?.type === "part-time"
                  ? "bg-yellow-100 text-yellow-600"
                  : job?.type === "contract"
                    ? "bg-orange-100 text-orange-600"
                    : job?.type === "freelance"
                      ? "bg-purple-100 text-purple-600"
                      : job?.type === "internship"
                        ? "bg-pink-100 text-pink-600"
                        : job?.type === "remote"
                          ? "bg-cyan-100 text-cyan-700"
                          : job?.type === "hybrid"
                            ? "bg-indigo-100 text-indigo-700"
                            : job?.type === "onsite"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
            }`}
          >
            {job?.type?.replace("_", " ") || "Not specified"}
          </span>

          {job?.category && (
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
              {job?.category}
            </span>
          )}

          {job?.experienceLevel && (
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-medium">
              {job?.experienceLevel}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center text-xs font-medium text-gray-500 mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Posted{" "}
            {job?.createdAt ? moment(job?.createdAt).fromNow() : "recently"}
          </span>
        </div>
      </div>
      {/* salaryPeriod */}
      <div className="flex items-center justify-between">
        <div className="text-blue-600 font-semibold text-lg">
          {formatSalary(job?.salaryMin, job?.salaryMax, job?.salaryCurrency)}
          {job?.salaryPeriod && (
            <span className="text-xs text-gray-500 ml-1">
              /
              {job?.salaryPeriod === "yearly"
                ? "yr"
                : job?.salaryPeriod === "monthly"
                  ? "mo"
                  : job?.salaryPeriod === "hourly"
                    ? "hr"
                    : job?.salaryPeriod}
            </span>
          )}
        </div>

        {!saved && (
          <>
            {job?.applicationStatus ? (
              <StatusBadge status={job?.applicationStatus} />
            ) : (
              <>
                {!hideApply && (
                  <button
                    onClick={handleApplyClick}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-sm text-white px-6 py-2.5 rounded-xl
                      hover:from-blue-600 hover:to-blue-700 
                      transition-all duration-200 font-semibold transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Apply Now
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Optional: Show application count or views */}
      {(job?.applicationCount > 0 || job?.viewCount > 0) && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
          {job?.applicationCount > 0 && (
            <span>
              {job.applicationCount} applicant
              {job.applicationCount !== 1 ? "s" : ""}
            </span>
          )}
          {job?.viewCount > 0 && (
            <span>
              {job.viewCount} view{job.viewCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default JobCard;
// import { Bookmark, Building, Building2, MapPin, Calendar } from "lucide-react";
// import moment from "moment";
// import { useAuth } from "../../content/AuthContext";
// import StatusBadge from "../StatusBadge";
// import {useNavigate} from 'react-router-dom';

// const JobCard = ({ job, onClick, onToggleSave, onApply, saved, hideApply }) => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const goToJobDetails =()=>{
//     navigate(`/job/${job?._id}`);
//   }

//   const goToApplyPage =()=>{
//     navigate(`/job/${job?._id} apply`);
//   }
//   const formatSalary = (min, max) => {
//     const formatNumber = (number) => {
//       if (number >= 1000) {
//         return `₦${(number / 1000).toFixed(0)}K`; // change the currency icon to naira
//       } else {
//         return `₦${number}`;
//       }
//     };
//     return `${formatNumber(min)}/m`;
//   };

//   return (
//     <div
//       className="bg-white rounded-2xl border border-gray-200
//     p-6 hover:shadow-xl hover:shadow-gray-200
//      transition-all duration-300
//       group relative overflow-hidden cursor-pointer"
//       onClick={goToJobDetails}
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-start gap-4 ">
//           {job?.company?.companyLogo ? (
//             <img
//               className="w-14 h-14 object-cover rounded-2xl border-2
//             border-white/20 shadow-lg "
//               src={job?.company?.companyLogo}
//               alt={`logo`}
//             />
//           ) : (
//             <div
//               className="w-14 h-14 bg-gray-50
//             border-2 border-gray-200 rounded-2xl flex items-center justify-center"
//             >
//               <Building2 className="w-8 h-8 text-gray-400" />
//             </div>
//           )}
//           <div className="flex-1">
//             <h3 className="font-semibold text-gray-800 text-base group-hover:text-blue-500 transition-colors leading-snug">
//               {job?.title}
//             </h3>
//             <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
//               <Building className="w-3.5 h-3.5" />
//               {job?.company?.companyName}
//             </p>
//           </div>
//         </div>
//         {user && (
//           <button
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggleSave();
//             }}
//           >
//             <Bookmark
//               className={`w-5 h-5 hover:text-blue-600 ${
//                 job?.isSaved || saved ? "text-blue-500" : "text-gray-400"
//               }`}
//             />
//           </button>
//         )}
//       </div>

//       <div className="mb-5">
//         <div className="flex items-center gap-2 text-xs">
//           <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
//             <MapPin className="w-3 h-3" />
//             {job?.location}
//           </span>

//           <span
//             className={`px-3 py-1 rounded-full font-medium ${
//               job?.type === "full-time"
//                 ? "bg-green-100 text-green-600"
//                 : job?.type === "part-time"
//                 ? "bg-yellow-100 text-yellow-500"
//                 : job?.type === "contract"
//                 ? "bg-orange-100 text-orange-500"
//                 : job?.type === "freelance"
//                 ? "bg-purple-100 text-purple-600"
//                 : job?.type === "internship"
//                 ? "bg-gray-100 text-gray-500"
//                 : job?.type === "remote"
//                 ? "bg-cyan-100 text-cyan-700"
//                 : job?.type === "hybrid"
//                 ? "bg-indigo-100 text-indigo-900"
//                 : "bg-blue-100 text-blue-600"
//             }`}
//           >
//             {job?.type}
//           </span>
//           <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
//             {job?.category}
//           </span>
//         </div>
//       </div>

//       <div className="flex items-center text-xs font-medium text-gray-500 mb-5 pb-4 border-b border-gray-100">
//         <div className="flex items-center gap-4">
//           <span className="flex items-center gap-1.5">
//             <Calendar className="w-3.5 h-3.5" />
//             {job?.createdAt
//               ? moment(job?.createdAt).format("Do MM YYYY")
//               : "N/A"}
//           </span>
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="text-blue-600 font-semibold text-lg">
//           {formatSalary(job?.salaryMin, job?.salaryMax)}
//         </div>
//         {!saved && (
//           <>
//             {job?.applicationStatus ? (
//               <StatusBadge status={job?.applicationStatus} />
//             ) : (
//               <>
//                 {/* Treat this code */}
//                 {!hideApply && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onApply();
//                     }}
//                     className="bg-gradient-to-r from-blue-100 to-blue-100 text-sm text-blue-600 hover:text-white px-6 py-2.5 rounded-xl
//                      hover:from-blue-500 hover:to-blue-600
//                      transition-all duration-200 font-semibold transform hover:-translate-y-0.5"
//                   >
//                     Apply
//                   </button>
//                 )}
//               </>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobCard;
