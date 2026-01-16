import { ArrowLeft, Bookmark, Grid, List } from "lucide-react";
import { useAuth } from "../../content/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import JobCard from "../../components/Cards/JobCard";

const SavedJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // state management
  const [savedJobList, setSavedJobList] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  // retrived save jobs
  const getSavedJobs = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOB());
      setSavedJobList(response.data);
    } catch (err) {
      console.log("Error:", err);
      toast.error("Error fetching saved jobs");
    }
  };

  // remove save job
  const handleUnsaveJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UPDATE_JOB(jobId));
      toast.success("You've successfully remove this job from save list");
      setSavedJobList();
    } catch (err) {
      console.log("Error:", err);
      toast.error("Error occur trying unsaved this job");
    }
  };

  useEffect(() => {
    if (user) {
      getSavedJobs();
    }
  }, user);
  return (
    <div className="bg-gradient-to-br from-blue-50">
      <Navbar />
      <div className="mx-auto mt-24 container">
        {savedJobList && (
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  className="group flex items-center space-x-2 px-3.5 py-2.5 text-sm font-medium text-gray-600  hover:text-white bg-white/50 hover:bg-gradient-to-r 
                hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-lg transform-all duration-200
                shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5 "
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                </button>
                <h1 className="text-lg lg:text-xl font-semibold leading-tight text-gray-900">
                  Saved Jobs
                </h1>
              </div>

              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl p-1">
                  <button
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </button>

                  <button
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {/* Content section */}
            <div className="">
              {/* Job */}
              {savedJobList.length === 0 ? (
                <div className="">
                  <div className="">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <h3 className="">You have not save any job yet</h3>
                  <p className="">
                    Start saving a job that you're interested on so that you can
                    apply later
                  </p>
                  <button className="" onClick={() => navigate(`/find-jobs`)}>
                    Explore Jobs
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6"
                        : "space-y-4 lg:space-y-6"
                    }
                  >
                    {savedJobList.map((save) => {
                      <JobCard
                        key={save._id}
                        job={save?.job}
                        onClick={() => navigate(`/job/${save?.job._id}`)}
                        onToggleSave={() => handleUnsaveJob(save.job._id)}
                        saved
                      />;
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SavedJob;
