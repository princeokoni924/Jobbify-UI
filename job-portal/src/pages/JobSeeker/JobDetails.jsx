import { 
  MapPin, 
  DollarSign, 
  Building2, 
  Clock, 
  Users, 
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Calendar
} from "lucide-react";
import { useAuth } from "../../content/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/layout/Navbar";
import moment from "moment";
import StatusBadge from "../../components/StatusBadge";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { user } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  // Fetch job details
  const getJobDetailsById = useCallback(async () => {
    if (!jobId) {
      setError("Invalid job ID");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOB_BY_ID(jobId),
        {
          params: { userId: user?._id || null },
        }
      );

      if (response.data) {
        setJobDetails(response.data);
      } else {
        throw new Error("No job data received");
      }
    } catch (err) {
      console.error("Error fetching job details:");
      
      const errorMessage = 
        err.response?.status === 404 
          ? "Job not found" 
          : err.response?.data?.message || 
            err.message || 
            "Failed to load job details";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [jobId, user]);

  // Apply to job
  const applyToJob = useCallback(async () => {
    if (!jobId) {
      toast.error("Invalid job ID");
      return;
    }

    if (!user) {
      toast.error("Please login to apply for this job");
      navigate("/login", { state: { from: `/jobs/${jobId}` } });
      return;
    }

    try {
      setIsApplying(true);
      
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      
      toast.success("Application submitted successfully!");
      
      // Refresh job details to update application status
      await getJobDetailsById();
    } catch (err) {
      console.error("Error applying to job:", err);
      
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        "Failed to submit application. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setIsApplying(false);
    }
  }, [jobId, user, navigate, getJobDetailsById]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date not available";
    return moment(date).format("Do MMM YYYY");
  };

  // Format salary range
  const formatSalary = (min, max) => {
    if (!min && !max) return "Not specified";
    if (!max) return `$${min?.toLocaleString()}+`;
    if (!min) return `Up to $${max?.toLocaleString()}`;
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
  };

  useEffect(() => {
    if (jobId) {
      getJobDetailsById();
    } else {
      setError("No job ID provided");
      setIsLoading(false);
    }
  }, [jobId, getJobDetailsById]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div 
                className="animate-spin rounded-full w-12 h-12 border-b-2 border-blue-600 mx-auto"
                role="status"
                aria-label="Loading job details"
              />
              <p className="mt-4 text-gray-600">Loading job details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !jobDetails) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error === "Job not found" ? "Job Not Found" : "Error Loading Job"}
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "Unable to load job details. Please try again."}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Go Back
                </button>
                <button
                  onClick={getJobDetailsById}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto pt-24 px-4 pb-12">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="group flex items-center space-x-2 px-3 py-2 mb-6 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 rounded-xl border border-gray-200 hover:border-transparent transition-all duration-200 hover:shadow-xl shadow-lg shadow-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </button>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative px-6 lg:px-8 py-8 border-b bg-gradient-to-br from-gray-50 to-white">
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                {/* Company Logo & Title */}
                <div className="flex items-start gap-4 flex-1">
                  {jobDetails?.company?.companyLogo ? (
                    <img
                      className="h-16 w-16 lg:h-20 lg:w-20 object-cover rounded-xl border-2 border-white shadow-md flex-shrink-0"
                      src={jobDetails.company.companyLogo}
                      alt={`${jobDetails.company.name || 'Company'} logo`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-white shadow-md flex items-center justify-center flex-shrink-0"
                    style={{ display: jobDetails?.company?.companyLogo ? "none" : "flex" }}
                  >
                    <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-900">
                      {jobDetails.title}
                    </h1>
                    {jobDetails?.company?.name && (
                      <p className="text-lg text-gray-600 font-medium mb-3">
                        {jobDetails.company.name}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      {jobDetails.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
                          <span className="text-sm font-medium">{jobDetails.location}</span>
                        </div>
                      )}
                      {jobDetails.type && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400" aria-hidden="true" />
                          <span className="text-sm font-medium">{jobDetails.type}</span>
                        </div>
                      )}
                      {jobDetails.createdAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" />
                          <span className="text-sm font-medium">Posted {formatDate(jobDetails.createdAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Apply Button / Status */}
                <div className="flex-shrink-0">
                  {jobDetails?.applicationStatus ? (
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={jobDetails.applicationStatus} />
                      <p className="text-sm text-gray-500">
                        You've already applied
                      </p>
                    </div>
                  ) : (
                    <button
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={applyToJob}
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <span className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Applying...
                        </span>
                      ) : (
                        "Apply Now"
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                {jobDetails.category && (
                  <span className="px-4 py-2 bg-blue-50 text-sm text-blue-700 font-semibold rounded-full border border-blue-200">
                    {jobDetails.category}
                  </span>
                )}
                {jobDetails.type && (
                  <span className="px-4 py-2 bg-purple-50 text-sm font-semibold rounded-full border border-purple-200 text-purple-700">
                    {jobDetails.type}
                  </span>
                )}
                {jobDetails.experienceLevel && (
                  <span className="px-4 py-2 bg-emerald-50 text-sm font-semibold rounded-full border border-emerald-200 text-emerald-700">
                    {jobDetails.experienceLevel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 lg:px-8 py-8 space-y-8">
            {/* Salary Section */}
            {(jobDetails.salaryMin || jobDetails.salaryMax) && (
              <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r rounded-full from-emerald-400/10 to-teal-400/10 -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-1">
                          Salary Range
                        </h3>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatSalary(jobDetails.salaryMin, jobDetails.salaryMax)}
                        </div>
                        <span className="text-sm text-gray-600">per month</span>
                      </div>
                    </div>
                    
                    {jobDetails.benefits && jobDetails.benefits.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-100 px-3 py-2 rounded-full">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">
                          {jobDetails.benefits.length} {jobDetails.benefits.length === 1 ? 'benefit' : 'benefits'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Job Description */}
            {jobDetails.description && (
              <div className="space-y-4">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                  <span>About This Role</span>
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {jobDetails.description}
                  </div>
                </div>
              </div>
            )}

            {/* Requirements */}
            {jobDetails.requirement && (
              <div className="space-y-4">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full bg-gradient-to-b from-purple-600 to-blue-600"></div>
                  <span>What We're Looking For</span>
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {jobDetails.requirement}
                  </div>
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {jobDetails.responsibilities && (
              <div className="space-y-4">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-600 to-teal-600"></div>
                  <span>Key Responsibilities</span>
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {jobDetails.responsibilities}
                  </div>
                </div>
              </div>
            )}

            {/* Benefits */}
            {jobDetails.benefits && jobDetails.benefits.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-600 to-teal-600"></div>
                  <span>Benefits & Perks</span>
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {jobDetails.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Apply CTA */}
            {!jobDetails?.applicationStatus && (
              <div className="pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Ready to Apply?
                      </h4>
                      <p className="text-gray-600">
                        Take the next step in your career journey with us.
                      </p>
                    </div>
                    <button
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                      onClick={applyToJob}
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <span className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Applying...
                        </span>
                      ) : (
                        "Apply for this Position"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;