import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  X,
  ArrowLeft,
  CheckCircle,
  Building2,
  MapPin,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../../content/AuthContext";
import { validateResumeFile } from "../../utils/helpler";
import { API_PATHS } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

import TextareaField from "../../../components/input/TextareaField";
import SuccessScreen from "../../../components/SuccessScreen";

const ApplicationForm = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const jobDetails = location.state?.job?? null;
  const [coverLetter, setCoverLetter] = useState("");

  const [resume, setResume] = useState(null);
  const [errResume, setErrResume] = useState("");
  const [errMsge, setErrMsge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);



useEffect(() => {
    if (isSubmittedSuccess) {
      const timer = setTimeout(() => {
        navigate("/find-jobs", { replace: true });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSubmittedSuccess, navigate]);

    /* ----------------Success Screen---------------- */
 if (isSubmittedSuccess) {
   return <SuccessScreen/>
  }



  //============handle input change section================
  const handleCoverLetter = (event) => {
    setCoverLetter(event.target.value);
    setErrMsge("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setResume(null);

    const errorMessage = validateResumeFile(file);
    if (errorMessage) {
      setErrMsge(errorMessage);
      return;
    }
    setResume(file);
  };

  // handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const dragEvent = { target: { files: [file] } };
      handleFileChange(dragEvent);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // remove resume
  const handleRemoveResume = () => {
    setResume(null);
    setErrResume("");
  };

  // handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!jobId) {
      setErrMsge("Job ID is missing. Please try again from the job listing.");
      toast.error("Job ID is Missing");
      return;
    }

    if (!resume && !user?.resume) {
      setErrResume("Please upload your resume to proceed.");
      return;
    }

    setIsSubmitting(true);
    setErrResume("");
    setErrMsge("");

    try {
      // Simulate API call
      if (resume) {
        const resumePathData = new FormData();
        resumePathData.append("resume", resume);

        await axiosInstance.post(
          API_PATHS.APPLICATIONS.UPLOAD_RESUME,
          resumePathData,
        );
      }

      // apply to job
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId), {
        coverLetter: coverLetter.trim() || undefined,
      });
      toast.success("Application submitted successfully!");

      setIsSubmittedSuccess(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error?.response?.data?.message;
      setErrMsge(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ------Header--------- */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
        {jobDetails && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Applying for:
            </h3>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-blue-600">
                {jobDetails?.title}
              </h4>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <div className="px-3 flex items-center gap-3 py-2">
                  {jobDetails.companyLogo ? (
                    <img
                      src={jobDetails.companyLogo}
                      alt={jobDetails?.name}
                      className="object-cover w-16 h-16 rounded-full "
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-3 ">
                      <Building2 className="w-10 h-10  bg-blue-100 text-blue-600 rounded-lg" />
                    </div>
                  )}
                  <span className="font-medium">{jobDetails?.company}</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-9 h-9 text-blue-500" />
                  <span className=" font-medium">{jobDetails.location}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="w-9 h-9 text-blue-500" />
                  <span className="font-medium">
                    {jobDetails.type?.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Submit Your Application
          </h2>
          <p className="text-gray-600 mb-6">
            Your personal information will be automatically included from your
            profile.
          </p>

          {/* Error Alert */}
          {errMsge && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Application Error</p>
                <p className="text-red-600 text-sm mt-1">{errMsge}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* User Info Display */}
            <div className="space-y-4 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700">
                Your Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-600 mb-1">Name</p>
                  <p className="font-medium text-gray-800">
                    {user?.name || "Not provided"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-800">
                    {user?.email || "Not provided"}
                  </p>
                </div>
                {/* {user?.phone && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-600 mb-1">Phone</p>
                    <p className="font-medium text-gray-800">{user.phone}</p>
                  </div>
                )} */}
                {/* {user?.location && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-600 mb-1">Location</p>
                    <p className="font-medium text-gray-800">{user.location}</p>
                  </div>
                )} */}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                To update your information, please visit your profile settings.
              </p>
            </div>

            {/* Resume Upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">
                  Resume/CV <span className="text-red-500">*</span>
                </h3>
                {user?.resume && !resume && (
                  <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Current resume on file
                  </span>
                )}
              </div>

              {!resume ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-2">
                      {user?.resume
                        ? "Upload a new resume or use your existing one"
                        : "Drop your resume here or click to browse"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported formats: PDF ONLY (Max 5MB)
                    </p>
                    {user?.resume && (
                      <p className="text-xs text-blue-600 mt-3">
                        Note: Uploading a new resume will replace your current
                        one
                      </p>
                    )}
                  </label>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-10 h-10 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">{resume.name}</p>
                      <p className="text-sm text-gray-500">
                        {(resume.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              )}

              {errResume && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errResume}
                </p>
              )}
            </div>

            {/* Cover Letter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Cover Letter{" "}
                <span className="text-gray-400 text-sm font-normal">
                  (Optional)
                </span>
              </h3>
              <TextareaField
                name="coverLetter"
                value={coverLetter}
                onChange={handleCoverLetter}
                rows="8"
                maxLength="5000"
                className="placeholder:text-center placeholder:text-sm w-full px-4 py-3 border  border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell the employer why you're a great fit for this position...

              Tip: Mention specific skills and experiences that align with the job requirements."
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Maximum 5000 characters</span>
                <span>{handleCoverLetter.length} / 5000</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || (!resume && !user?.resume)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> By submitting this application, you
                confirm that the information provided is accurate and complete.
                The employer will be able to view your profile, resume, and
                application details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApplicationForm;
