
import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X, Filter, Grid, List, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";
import LoaderSpinner from "../../components/LoaderSpinner";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../content/AuthContext";
import FilterContent from "../JobSeeker/components/FilterContent";
import SearchHeader from "../JobSeeker/components/SearchHeader "
import Navbar from "../../components/layout/Navbar";
import JobCard from "../../components/Cards/JobCard";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Constants
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [expandedSections, setExpandedSections] = useState(INITIAL_EXPANDED_SECTIONS);

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
        : response.data?.jobs || [];

      setJobs(jobData);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        "Failed to fetch jobs. Please try again.";
      
      setError(errorMessage);
      setJobs([]);
      
      // Show error toast for non-network errors
      if (!err.message?.includes("Network")) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Debounced filter effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const apiFilters = { ...filters };

      // Check if there are meaningful filters
      const hasFilters = Object.values(apiFilters).some(
        (value) => value !== "" && value !== false && value !== null && value !== undefined
      );

      fetchJobs(hasFilters ? apiFilters : {});
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [filters, fetchJobs]);

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
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, isSaved: !isSaved } : job
        )
      );
    } catch (err) {
      console.error("Failed to toggle saved job:", err);
      const errorMessage = err.response?.data?.message || "Failed to save job. Please try again.";
      toast.error(errorMessage);
    }
  }, []);

  // Apply to job
  const applyToJob = useCallback(async (jobId) => {
    if (!jobId) {
      toast.error("Invalid job ID");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      toast.success("Application submitted successfully");
      
      // Update local state
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, hasApplied: true } : job
        )
      );
    } catch (err) {
      console.error("Failed to apply to job:", err);
      const errorMessage = err.response?.data?.message || "Failed to submit application. Please try again.";
      toast.error(errorMessage);
    }
  }, []);

  // Navigate to job details
  const handleJobClick = useCallback((jobId) => {
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
  }, [navigate]);

  // Memoized values
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === "remoteOnly") return value === true;
      return value !== "" && value !== null && value !== undefined;
    });
  }, [filters]);

  const jobCount = jobs.length;

  // Loading state
  if (isLoading && jobs.length === 0) {
    return <LoaderSpinner />;
  }

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
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800">Error Loading Jobs</h4>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
              <button
                onClick={() => fetchJobs(hasActiveFilters ? filters : {})}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          <div className="flex gap-6 lg:gap-8">
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
                    <span className="font-bold text-gray-800">
                      {jobCount}
                    </span>{" "}
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
                        {Object.values(filters).filter(v => v && v !== "").length}
                      </span>
                    )}
                  </button>

                  {/* View Mode Toggle */}
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
                <EmptyState onClearFilters={clearAllFilters} hasFilters={hasActiveFilters} />
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
                      onApply={() => applyToJob(job._id)}
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

// Empty State Component
const EmptyState = ({ onClearFilters, hasFilters }) => (
  <div className="text-center py-16 lg:py-20 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm">
    <div className="text-gray-400 mb-6">
      <Search className="w-16 h-16 mx-auto" />
    </div>
    <h3 className="text-xl text-gray-900 mb-3 font-bold lg:text-2xl">
      No Jobs Found
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      {hasFilters
        ? "Try adjusting your search criteria or filters to find more opportunities."
        : "There are no job postings available at the moment. Check back soon!"}
    </p>
    {hasFilters && (
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={onClearFilters}
      >
        Clear All Filters
      </button>
    )}
  </div>
);

EmptyState.propTypes = {
  onClearFilters: PropTypes.func.isRequired,
  hasFilters: PropTypes.bool.isRequired,
};

// Mobile Filters Overlay Component
const MobileFiltersOverlay = ({
  isOpen,
  onClose,
  toggleSection,
  clearAllFilter,
  expandedSections,
  filters,
  handleFilterChange,
}) => {
  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 inset-0 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-filters-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 id="mobile-filters-title" className="font-bold text-gray-900 text-lg">
            Filters
          </h3>
          <button
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
          <FilterContent
            toggleSection={toggleSection}
            clearAllFilter={clearAllFilter}
            expandedSections={expandedSections}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>

        {/* Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
  
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






