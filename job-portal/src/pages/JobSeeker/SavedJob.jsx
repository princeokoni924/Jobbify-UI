
import { ArrowLeft, Bookmark, Grid, List, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../content/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/layout/Navbar";
import JobCard from "../../components/Cards/JobCard";
import PropTypes from "prop-types";

/**
 * View mode constants for job display
 */
const VIEW_MODE = {
  GRID: "grid",
  LIST: "list",
};

/**
 * SavedJob Component
 * Displays and manages user's saved jobs with grid/list view toggle
 * 
 * @component
 * @returns {JSX.Element} SavedJob page component
 */
const SavedJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [savedJobList, setSavedJobList] = useState([]);
  const [viewMode, setViewMode] = useState(VIEW_MODE.GRID);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Navigate back to previous page
   */
  const handleNavigate = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  /**
   * Fetch saved jobs from API
   * @async
   */
  const getSavedJobs = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOB());

      // Validate response data
      if (response?.data) {
        const jobsData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.data || response.data?.savedJobs || [];
        
        setSavedJobList(jobsData);
      } else {
        setSavedJobList([]);
      }
    } catch (err) {
      const errorMessage = 
        err.response?.data?.error?.message || 
        err.response?.data?.message || 
        "Failed to fetch saved jobs";
      
      console.error("Error fetching saved jobs:", err);
      setError(errorMessage);
      toast.error(errorMessage);
      setSavedJobList([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Remove job from saved list
   * @async
   * @param {string} jobId - ID of the job to unsave
   */
  const handleUnsaveJob = useCallback(async (jobId) => {
    if (!jobId) {
      toast.error("Invalid job ID");
      return;
    }

    // Optimistic update
    const previousSavedJobs = [...savedJobList];
    setSavedJobList(prevJobs => prevJobs.filter(save => save.job._id !== jobId));

    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      toast.success("Job removed from saved list");
    } catch (err) {
      // Revert on error
      setSavedJobList(previousSavedJobs);
      
      const errorMessage = 
        err.response?.data?.error?.message || 
        err.response?.data?.message || 
        "Failed to remove job from saved list";
      
      console.error("Error unsaving job:", err);
      toast.error(errorMessage);
    }
  }, [savedJobList]);

  /**
   * Fetch saved jobs on component mount and when user changes
   */
  useEffect(() => {
    getSavedJobs();
  }, [getSavedJobs]);

  /**
   * Render loading state
   */
  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-16 lg:py-20 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-600 text-lg font-medium">Loading saved jobs...</p>
    </div>
  );

  /**
   * Render error state
   */
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16 lg:py-20 bg-red-50/60 backdrop-blur-xl rounded-2xl border border-red-200/20">
      <div className="text-red-600 mb-6">
        <AlertCircle className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
        Failed to Load Saved Jobs
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {error || "An error occurred while fetching your saved jobs."}
      </p>
      <div className="flex gap-3">
        <button 
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          onClick={getSavedJobs}
        >
          Try Again
        </button>
        <button 
          className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
          onClick={() => navigate("/find-jobs")}
        >
          Browse Jobs
        </button>
      </div>
    </div>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 lg:py-20 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20">
      <div className="text-gray-400 mb-6">
        <Bookmark className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
        No Saved Jobs Yet
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Start saving jobs that interest you so you can apply to them later
      </p>
      <button 
        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        onClick={() => navigate("/find-jobs")}
      >
        Explore Jobs
      </button>
    </div>
  );

  /**
   * Render job cards
   */
  const renderJobCards = () => (
    <div
      className={
        viewMode === VIEW_MODE.GRID
          ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6"
          : "space-y-4 lg:space-y-6"
      }
    >
      {savedJobList.map((save) => {
        // Validate save object
        if (!save?.job?._id) {
          console.warn("Invalid saved job object:", save);
          return null;
        }

        return (
          <JobCard
            key={save._id || save.job._id}
            job={save.job}
            onClick={() => navigate(`/job/${save.job._id}`)}
            onToggleSave={() => handleUnsaveJob(save.job._id)}
            saved={true}
          />
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      
      <div className="mx-auto mt-24 container px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            {/* Back Button and Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                className="group flex items-center space-x-2 px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r 
                hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-lg transition-all duration-200
                shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                onClick={handleNavigate}
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              <div>
                <h1 className="text-lg lg:text-xl font-semibold leading-tight text-gray-900">
                  Saved Jobs
                </h1>
                {!isLoading && !error && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {savedJobList.length} {savedJobList.length === 1 ? 'job' : 'jobs'} saved
                  </p>
                )}
              </div>
            </div>

            {/* View Mode Toggle */}
            {!isLoading && !error && savedJobList.length > 0 && (
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl p-1 gap-1">
                  <button
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === VIEW_MODE.GRID
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setViewMode(VIEW_MODE.GRID)}
                    aria-label="Grid view"
                    aria-pressed={viewMode === VIEW_MODE.GRID}
                  >
                    <Grid className="w-4 h-4" />
                  </button>

                  <button
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === VIEW_MODE.LIST
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setViewMode(VIEW_MODE.LIST)}
                    aria-label="List view"
                    aria-pressed={viewMode === VIEW_MODE.LIST}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            {isLoading && renderLoadingState()}
            {!isLoading && error && renderErrorState()}
            {!isLoading && !error && savedJobList.length === 0 && renderEmptyState()}
            {!isLoading && !error && savedJobList.length > 0 && renderJobCards()}
          </div>
        </div>
      </div>
    </div>
  );
};

SavedJob.propTypes = {
};

export default SavedJob;