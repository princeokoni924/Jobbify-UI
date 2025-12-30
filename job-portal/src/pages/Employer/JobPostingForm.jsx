import { useState, useEffect } from "react";
import {
  AlertCircle,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Eye,
  Send,
} from "lucide-react";
import { API_PATHS } from "../utils/apiPath";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { JOB_CATEGORIES, JOB_TYPES} from "../utils/data";
import InputField from "../../components/input/InputField";
import SelectField from "../../components/input/SelectField ";
import TextareaField from "../../components/input/TextareaField";
import JobPostingPreview from '../../components/Cards/JobPostingPreview'

import toast from "react-hot-toast";
const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    location: "",
    category: "",
    jobTitle: "",
    jobType: "",
    salaryMax: "",
    salaryMin: "",
    description: "",
    requirement: "",
  });

  const [errs, setErrs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // validate input method
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // clear error for the field when user start typing
    if (errs[field]) {
      setErrs((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // submit method
  const handSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if(Object.keys(validationErrors).length>0){
   setErrs(validationErrors);
   return;
    }
    setIsSubmitting(true);

    const jobPayload = {
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirement,
      type: formData.jobType,
      category: formData.category,
      salaryMax: formData.salaryMax,
      salaryMin: formData.salaryMin,
      location: formData.location
    };
    try{
      const response = jobId ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload)
      : await axiosInstance.post(API_PATHS.JOBS.POST_JOBS, jobPayload);

      if(response.status===200 || response.status===201){
        toast.success(
          jobId ? "Job updated successfully!":"Job Posted successfuuly!"
        );
        setFormData({
          jobId: "",
          jobTitle: "",
          location:"",
          category:"",
          requirement: "",
          description:"",
          salaryMin:"",
          salaryMax:"",
          jobType:''
        });
        navigate("/employer-dashboard");
        return;
      }
      console.error("Unexpected error occur", response.error);
      toast.error("Something went wrong, please try again")
    }catch(err){
      if(err.response?.data?.message){
        console.error("API Error", err.response.data.message);
        toast.error(err.response.data.message);
      }else{
        console.error("Unexpcted error occur", err);
        toast.error("Fail to post job. Please try again, Thank you.")
      }
    }finally{
      setIsSubmitting(false);
    }
  };

  // form validation helpler
  const validateForm = (formData) => {
    const error = {};
    if(!(formData.jobTitle ||"").trim()){
      error.jobTitle ="Job title required!"
    }
 if(!formData.category){
  error.category ="Kindly select job category because its required!"
 }

 if(!formData.location){
  error.location = "Job location required!"
 }

 if(!formData.salaryMin || !formData.salaryMax){
  error.salaryMax = "Both minimum and maximum salary are required!"
 }else if(parseInt(formData.salaryMin)>= parseInt(formData.salaryMax)){
  error.salary = "Maximun salary must be greater than minimun salary!"
 }

 

 if(!formData.jobType){
  error.jobType = "Kindly select job type because its required!"
 }

 if(!formData.requirement || !formData.requirement.trim()){
  error.requirement = "Job requirement are required!"
 }
 if(!(formData.description || "").trim()){
  error.description="Job description required!"
 }
    return error;
  };

  // if form valid method
  const isFormValid = () => {
    const validationErrs = validateForm(formData);
    return Object.keys(validationErrs).length === 0;
  };

// fetch job data for editing
useEffect(()=>{
  const fetchJobDetailsForEdit = async()=>{
    if(jobId){
      try{
        const res = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId));
        const jobData = res.data;
        console.log("JOB FROM API", jobData)
        if(jobData){
          setFormData({
            jobType: jobData.type ,
            jobTitle: jobData.title ,
            location: jobData.location, 
            category: jobData.category ,
            requirement: jobData.requirements, 
            description: jobData.description ,
            salaryMin: jobData.salaryMin ,
            salaryMax: jobData.salaryMax ,
            // jobId: jobData.jobId
          })
        }
      }catch(err){
        console.error("Error fetching job detail")
        if(err.res){
          console.error("API Error:");
        }
      }
    };
  };
  fetchJobDetailsForEdit();
   return ()=>{};
}, [])

  if(isPreview){
    return (
      <DashboardLayout activeMenu={"post-job"}>
        <JobPostingPreview
        formData={formData}
        setIsPreview={setIsPreview}
        />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout activeMenu={`post-jobs`}>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50
       via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
               
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Post a New Job
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Fill out the form below to get your Job Posting
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="group flex items-center space-x-2 px-6
                   py-3 text-sm font-medium text-gray-600 hover:text-white
                    bg-white/50 hover:bg-gradient-to-r hover:from-blue-500
                   hover:to-blue-600 border border-gray-200 hover:border-transparent
                    rounded-xl shadow-gray-100 shadow-lg transition-all duration-300
                     hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setIsPreview(true)}
                  disabled={!isFormValid()}
                >
                  <Eye className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Job Title */}
              <InputField
                label={`Job Title`}
                id={`jobTitle`}
                placeholder={`Type in your job`}
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                error={errs.jobTitle}
                required
                icon={Briefcase}
              />

              {/* Location & Remote */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <InputField
                      label={`Location`}
                      id={`location`}
                      placeholder={`where your job is located`}
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      error={errs.location}
                      required
                      icon={MapPin}
                    />
                  </div>
                </div>
              </div>

              {/*Job Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label={`category`}
                  id={`category`}
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  option={JOB_CATEGORIES}
                  placeholder={`Select job category`}
                  error={errs.category}
                  required
                  icon={Users}
                />

                <SelectField
                  label={`Job Type`}
                  id={`jobType`}
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  placeholder={`Select job type`}
                  option={JOB_TYPES}
                  required
                  error={errs.jobType}
                  icon={Briefcase}
                />
              </div>

              {/* Job Description */}
              <TextareaField
                label={`Job Description`}
                id={`description`}
                placeholder={`Describe the role and the responsiblities.....`}
                required
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                error={errs.description}
                helperText={`Include: key responsibilities, day-to-day task, and what make this role exciting.`}
              />

              <TextareaField
                label={`Requirement`}
                id={`requirement`}
                placeholder={`List key qualifications and skills.....`}
                value={formData.requirement}
                onChange={(e) =>
                  handleInputChange("requirement", e.target.value)
                }
                error={errs.requirement}
                required
                helperText={`Include: required skills, experience levels, education, and any preference qualification. `}
              />

              {/* Salary range */}
              <div className="">
                <label className="">
                  Salary Range <span className="text-red-500 ml-1">*</span>
                </label>
                {/* Min Salary*/}
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      {/* <span className="ml-2">(Naira)</span> */}
                    </div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={formData.salaryMin}
                      onChange={(e) =>
                        handleInputChange("salaryMin", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300
                       rounded-lg text-base focus:outline-none focus:ring-1
                        focus:ring-blue-500 focus:ring-opacity-20 transition-colors duration-200
                        focus:border-blue-500"
                    />
                  </div>
                   
                   {/* Max salary */}
                     <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      {/* <span>(Naira)</span> */}
                    </div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={(e) =>
                        handleInputChange("salaryMax", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300
                       rounded-lg text-base focus:outline-none focus:ring-1
                        focus:ring-blue-500 focus:ring-opacity-20 transition-colors duration-200
                        focus:border-blue-500"
                    />
                  </div>
                </div>

                {errs.salary && (
                  <div className="text-sm text-red-600 font-medium flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errs.salary}</span>
                  </div>
                )}
              </div>

              {/* Submit Btn */}
              <div className="pt-2">
                <button
                  onClick={handSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className="w-full flex items-center justify-center px-4 py-3 text-white border-transparent
                   hover:bg-blue-700 text-base
                    font-medium
                     rounded-lg bg-blue-500
                     focus:outline-none focus:ring-offset-2 focus:ring-blue-500
                      disabled:bg-gray-400 disabled:cursor-not-allowed 
                      outline-none transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full w-5 h-5 border-b-2 border-blue-600 mr-2"></div>
                      Publishing Job......
                    </>
                  ) : (
                    <>
                    <Send className="w-5 h-5 mr-2"/>
                    Publish Job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingForm;
