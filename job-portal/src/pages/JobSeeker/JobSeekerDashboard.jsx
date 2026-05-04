import { useState, useEffect, useCallback, useMemo } from "react";
import { X, Loader2, Filter, Grid, List, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";
import LoaderSpinner from "../../components/LoaderSpinner";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../content/AuthContext";
import FilterContent from "../JobSeeker/components/FilterContent";
import SearchHeader from "../JobSeeker/components/SearchHeader ";
import Navbar from "../../components/navs/Navbar";
import JobCard from "../../components/Cards/JobCard";
import MobileFiltersOverlay from "../../components/layout/MobileFiltersOverlay";
import EmptyState from "../../components/EmptyState";
//Constants
const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
};

const DEBOUNCE_DELAY = 400;

const INITIAL_FILTERS = {
  keyword: "",
  location: "",
  category: "",
  type: "",
  minSalary: "",
  maxSalary: "",
  experience: "",
  remoteOnly: false,
};

const INITIAL_EXPANDED_SECTIONS = {
  jobType: true,
  salary: true,
  categories: true,
};

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  // mobile filter state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // filter state
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // collape state
  const [expandedSections, setExpandedSections] = useState(
    INITIAL_EXPANDED_SECTIONS,
  );

  // Fetch jobs from API
  const fetchJobs = useCallback(async (filterParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();

        // Add filters to params
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value && value !== "" && value !== false) {
            params.append(key, value);
          }
        });

        // Add user ID if authenticated
        if (user?._id) {
          params.append("userId", user._id);
        }

        const queryString = params.toString();
        const url = queryString
          ? `${API_PATHS.JOBS.GET_ALL_JOBS}?${queryString}`
          : API_PATHS.JOBS.GET_ALL_JOBS;

        const response = await axiosInstance.get(url);

        // Handle different response formats
        const jobData = Array.isArray(response.data)
          ? response.data
          : response.data?.data?.jobs || response.data?.jobs || [];
        setJobs(jobData);
      } catch (err) {
        console.error("Error fetching jobs:", err);

        const errorMessage = ""
          setError(errorMessage);
        setJobs([]);

        // Show error toast for non-network errors
        if (!err.message?.includes("Network")) {
          //toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  // Debounced filter effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const apiFilters = { ...filters };
      // Check if there are meaningful filters
      const hasFilters = Object.values(apiFilters).some(
        (value) =>
          value !== "" &&
          value !== false &&
          value !== null &&
          value !== undefined,
      );

      fetchJobs(hasFilters ? apiFilters : fetchJobs()); //{}
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [fetchJobs, filters, user]); //user

  // Handle filter changes
  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Toggle section expansion
  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Toggle mobile filters
  const handleToggleMobileFilters = useCallback(() => {
    setShowMobileFilters((prev) => !prev);
  }, []);

  const handleCloseMobileFilters = useCallback(() => {
    setShowMobileFilters(false);
  }, []);

  // Toggle view mode
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // Toggle saved job
  // const jobId = jobs?._id || jobs.id
  const toggleSavedJob = useCallback(async (jobId, isSaved) => {
    if (!jobId) {
      toast.error("Invalid job ID");
      return;
    }

    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed from saved list");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job added to saved list");
      }

      // Update local state immediately for better UX
      //fetchJobs()
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, isSaved: !isSaved } : job,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle saved job:", err);
      //const errorMessage = err.response?.data?.message || "Failed to save job. Please try again.";
      const errorMessage = "Failed to save job. Please try again";
      toast.error(errorMessage);
    }
    // fetchJobs
  }, []);

  // Navigate to job details
  const handleJobClick = useCallback(
    (jobId) => {
      if (jobId) {
        navigate(`/jobs/${jobId}`);
      }
    },
    [navigate],
  );

  // Memorized values
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === "remoteOnly") return value === true;
      return value !== "" && value !== null && value !== undefined;
    });
  }, [filters]);

  const jobCount = jobs.length;

  // Loading state
  if (isLoading) {
    // && jobs.length === 0
    return <LoaderSpinner />;
  }

  /**
   * Render error state
   */
  
  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-gray-100 min-h-screen">
      <Navbar />

      <div className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 sm:py-6">
          {/* Search Header */}
          <SearchHeader
            filters={filters}
            handleFilterChange={handleFilterChange}
          />

          {/* Error Display */}
          {error && !isLoading && (
            <div className="flex flex-col mt-2 items-center justify-center py-10 lg:py-16 backdrop-blur-xl rounded-2xl border bg-red-50/60 border-red-200/20">
              <div className="text-red-600 mb-6">
                <AlertCircle className="w-20 h-20 mx-auto" />
              </div>

              <h4 className="text-sm font-medium text-red-800">
                Error Loading Jobs
              </h4>
              <p className="text-sm text-red-600 mt-1">
                {error.message}
              </p>

              <div className="flex gap-3">
                <button
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  onClick={fetchJobs}
                >
                  Refresh Again
                </button>
                <button
                  onClick={() => fetchJobs(hasActiveFilters ? filters : {})}
                  className="text-sm bg-red-600 w-20 rounded-md h-10 font-bold text-white hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-6 lg:gap-8 mt-5">
            {/* Desktop Sidebar Filter */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sticky top-24">
                <h3 className="font-bold text-gray-800 text-xl mb-6">
                  Filter Jobs
                </h3>
                <FilterContent
                  toggleSection={toggleSection}
                  clearAllFilter={clearAllFilters}
                  expandedSections={expandedSections}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
                <div>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Showing{" "}
                    <span className="font-bold text-gray-800">{jobCount}</span>{" "}
                    {jobCount === 1 ? "job" : "jobs"}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear filters
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                    onClick={handleToggleMobileFilters}
                    aria-label="Open filters"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                        {
                          Object.values(filters).filter((v) => v && v !== "")
                            .length
                        }
                      </span>
                    )}
                  </button>

                  {/* View Mode Toggle Grid*/}
                  <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-white shadow-sm">
                    <button
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === VIEW_MODES.GRID
                          ? "bg-blue-500 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                      onClick={() => handleViewModeChange(VIEW_MODES.GRID)}
                      aria-label="Grid view"
                      aria-pressed={viewMode === VIEW_MODES.GRID}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === VIEW_MODES.LIST
                          ? "bg-blue-500 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                      onClick={() => handleViewModeChange(VIEW_MODES.LIST)}
                      aria-label="List view"
                      aria-pressed={viewMode === VIEW_MODES.LIST}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Jobs Display */}
              {isLoading && jobs.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  Updating results...
                </div>
              )}

              {jobCount === 0 && !isLoading ? (
                <EmptyState
                  onClearFilters={clearAllFilters}
                  hasFilters={hasActiveFilters}
                />
              ) : (
                <div
                  className={
                    viewMode === VIEW_MODES.GRID
                      ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6"
                      : "space-y-4 lg:space-y-6"
                  }
                >
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onClick={() => handleJobClick(job._id)}
                      onToggleSave={() => toggleSavedJob(job._id, job.isSaved)}
                      //onApply={() => applyToJob(job._id)}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        <MobileFiltersOverlay
          isOpen={showMobileFilters}
          onClose={handleCloseMobileFilters}
          toggleSection={toggleSection}
          clearAllFilter={clearAllFilters}
          expandedSections={expandedSections}
          filters={filters}
          handleFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

EmptyState.propTypes = {
  onClearFilters: PropTypes.func.isRequired,
  hasFilters: PropTypes.bool.isRequired,
};

MobileFiltersOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  toggleSection: PropTypes.func.isRequired,
  clearAllFilter: PropTypes.func.isRequired,
  expandedSections: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};

export default JobSeekerDashboard;
