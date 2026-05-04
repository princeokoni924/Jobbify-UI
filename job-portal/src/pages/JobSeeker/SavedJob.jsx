
import { ArrowLeft, Heart, AlertCircle, Loader2 } from "lucide-react";
import FeedbackPanel from "../../components/FeedBackPanel";
import FeedbackAction from "../../components/FeedbackAction";
import ViewToggle from "../../components/ViewToggle";
import { useAuth } from "../../content/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/navs/Navbar";
import JobCard from "../../components/Cards/JobCard";

const VIEW_MODE = {
  GRID: "grid",
  LIST: "list",
};

const SavedJob = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(VIEW_MODE.GRID);
  const [error, setError] = useState(null);

const fetchSavedJobs = useCallback(async ()=>{
  if(!user){setLoading(false); return;}
  setLoading(true);
  setError(null);
  try{
 const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOB);
 setSavedJobs(response?.data?.data ?? []);
}catch(error){
  const errorMessage = error?.response?.data?.message || error.message || "Fail to fetch jobs";
  setError(errorMessage);
  toast.error(errorMessage);
  setSavedJobs([]);
console.error(error)
}finally{
  setLoading(false);
}
}, [user]);


// handle unsave job
const handleUnsaveJob = useCallback(async(jobId)=>{
if(!jobId) {toast.error("Invalid job ID"); return;}
 const snapshot = [...savedJobs];
  setSavedJobs((prev)=> prev.filter((save) => (save?.job?._id  ?? save?._id)!== jobId)); 
  try{
    await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
    toast.success("Job removed from save list")
  }catch(error){
    setSavedJobs(snapshot);
    
    toast.error(error.response?.data?.message || error.message || "Fail to remove job from save list")
    console.log(error)
  }
},[savedJobs]);


// handle share job
const handleSharedJob = useCallback(async(jobId)=>{
if(!jobId) {return;} 
const response = await axiosInstance.get(API_PATHS.JOBS.SHARE_JOB(jobId));
const shareableLink = response?.data?.data?.shareableLink;
if(!shareableLink){
  throw new Error("Failed to get shareable link");
}

if(navigator.share){
  await navigator.share({
    title: "Check out this job I saved on Jobify!",
    text: "I found this job on Jobify and thought you might be interested.",
    url: shareableLink
  });
  return null;
}
return null;
// if(shareableLink){
//   navigator.clipboard.writeText(shareableLink);
//   toast.success("Shareable link copied to clipboard");
// }else{
//   toast.error("Failed to get shareable link");
// }
}, []);

useEffect(()=>{
fetchSavedJobs(); 
}, [fetchSavedJobs]);


const renderLoadState = ()=>(
  <FeedbackPanel>
    <Loader2 className="animate-spin w-12 h-12 text-blue-600 mb-4" />
    <p className="text-gray-600 text-lg font-medium">Loading saved jobs...</p>
  </FeedbackPanel>
)

const renderErrorState = () => (
    <FeedbackPanel bgClass="bg-red-50/60" borderClass="border-red-200/20">
      <AlertCircle className="w-16 h-16 mx-auto text-red-600 mb-6" />
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Failed to Load Saved Jobs</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
      <FeedbackAction primary={{ label: "Try Again", onClick: fetchSavedJobs }} secondary={{ label: "Browse Jobs", onClick: () => navigate("/find-jobs") }} />
    </FeedbackPanel>
  );

  const renderEmptyState = () => (
    <FeedbackPanel>
      <Heart className="w-16 h-16 mx-auto text-gray-400 mb-6" />
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">No Saved Jobs Yet</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">Start saving jobs that interest you so you can apply to them later</p>
      <FeedbackAction primary={{ label: "Explore Jobs", onClick: () => navigate("/find-jobs") }} />
    </FeedbackPanel>
  );


  const renderJobCards = () => (
    <div className={viewMode === VIEW_MODE.GRID ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6" : "space-y-4 lg:space-y-6"}>
      {savedJobs.map((save) => {
        if (!save?.job?._id) return null;
        return (
          <JobCard key={save._id ?? save.job._id} job={save.job}
            onClick={() => navigate(`/job/${save.job._id}`)}
            onToggleSave={() => handleUnsaveJob(save.job._id)}
            onShare={handleSharedJob}
            saved />
        );
      })}
    </div>
  );

   const showToggle = !loading && !error && savedJobs.length > 0;

   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      <div className="mx-auto mt-24 container px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={() => navigate(-1)} aria-label="Go back"
                className="group flex items-center space-x-2 px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div>
                <h1 className="text-lg lg:text-xl font-semibold leading-tight text-gray-900">Saved Jobs</h1>
                {!loading && !error && (
                  <p className="text-sm text-gray-500 mt-0.5">{savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved</p>
                )}
              </div>
            </div>
            {showToggle && <div className="flex items-center gap-3"><ViewToggle viewMode={viewMode} onChange={setViewMode} /></div>}
          </div>
          <div className="space-y-8">
            {loading                                         && renderLoadState()}
            {!loading && error                               && renderErrorState()}
            {!loading && !error && savedJobs.length === 0 && renderEmptyState()}
            {!loading && !error && savedJobs.length  > 0  && renderJobCards()}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SavedJob;