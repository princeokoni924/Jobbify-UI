import { useState, useEffect } from "react";
import {
  AlertCircle,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Eye,
  Send,
  Wifi,
  Clock,
  TrendingUp,
  Plus,
  X,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { API_PATHS } from "../utils/apiPath";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  CURRENCIES,
  WORK_MODE,
  SAlARY_PERIOD,
  EXPERIENCE_LEVEL,
} from "../utils/data";
import InputField from "../../components/input/InputField";
import SelectField from "../../components/input/SelectField ";
import TextareaField from "../../components/input/TextareaField";
import JobPostingPreview from "../../components/Cards/JobPostingPreview";

import toast from "react-hot-toast";
const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    responsibilities: "",
    location: "",
    category: "",
    jobTitle: "",
    jobType: "",
    salaryMax: "",
    salaryMin: "",
    description: "",
    requirement: "",
    salaryCurrency: "NGN",
    workMode: "onsite",
    experienceLevel: "mid",
    salaryPeriod: "monthly",
    skills: [],
    benefits: [],
    applicationDeadline: "",
    expiryAt: "",
    isFeatured: false,
  });

  const [errs, setErrs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

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
  // handle add skill
  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  // remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // handle add benefit
  const handleAddBenefit = () => {
    if (
      benefitInput.trim() &&
      !formData.benefits.includes(benefitInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput("");
    }

    if (errs.benefits) {
      setErrs((prev) => ({
        ...prev,
        benefits: "",
      }));
    } else if (benefitInput.length > 150) {
      setErrs((prev) => ({
        ...prev,
        benefitInput: "Benefit cannot exceed 150 characters",
      }));
    }
  };

  // remove benefit
  const handleRemoveBenefit = (benefitToRemove) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((benefit) => benefit !== benefitToRemove),
    }));
  };
  // submit method
  const handSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
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
      location: formData.location,
      salaryCurrency: formData.salaryCurrency,
      workMode: formData.workMode,
      salaryPeriod: formData.salaryPeriod,
      experienceLevel: formData.experienceLevel,
      responsibilities: formData.responsibilities,
      skills: formData.skills,
      benefits: formData.benefits,
      applicationDeadline: formData.applicationDeadline || undefined,
      expiryAt: formData.expiryAt || undefined,
      isFeatured: formData.isFeatured,
    };
    try {
      const response = jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOBS, jobPayload);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          jobId ? "Job updated successfully!" : "Job Posted successfuuly!",
        );
        setFormData({
          jobId: "",
          responsibilities: "",
          jobTitle: "",
          location: "",
          category: "",
          requirement: "",
          description: "",
          salaryMin: "",
          salaryMax: "",
          salaryCurrency: "NGN",
          jobType: "",
          workMode: "onsite",
          salaryPeriod: "monthly",
          experienceLevel: "mid",
        });
        navigate("/employer-dashboard");
        return;
      }
      console.error("Unexpected error occur", response.error);
      //toast.error("Something went wrong, please try again")
    } catch (err) {
      if (err.response?.data?.message) {
        //console.error("API Error", err.response.data.message);
        toast.error(err.response.data.message);
      } else if (err.response?.data?.error) {
        toast.error(err.response.data.error);
        //console.error();
        //"Unexpcted error occur", err
        toast.error("Fail to post job. Please try again, Thank you.");
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("Failed to post job. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // form validation helpler
  const validateForm = (formData) => {
    const error = {};
    if (!formData.jobTitle || "".trim()) {
      error.jobTitle = "Job title required!";
    }
    if (!formData.category) {
      error.category = "Kindly select job category because its required!";
    }

    if (!formData.location) {
      error.location = "Job location required!";
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      error.salaryMax = "Both minimum and maximum salary are required!";
    } else if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
      error.salary = "Maximun salary must be greater than minimun salary!";
    }

    if (!formData.jobType) {
      error.jobType = "Kindly select job type because its required!";
    }

    if (!formData.requirement || !formData.requirement.trim()) {
      error.requirement = "Job requirement are required!";
    }
    if (!(formData.description || "").trim()) {
      error.description = "Job description required!";
    }

    if (!formData.workMode) {
      error.workMode = "Select work mode";
    }

    if (!formData.experienceLevel) {
      error.experienceLevel = "Select experience level";
    }
    if (!formData.salaryPeriod) {
      error.salaryPeriod = "Select payment period";
    }
    if (!formData.responsibilities || !formData.responsibilities.trim()) {
      error.responsibilities = "responsibilities required!";
    }

    // validate application deadline
    if (formData.applicationDeadline) {
      const deadLineDate = new Date(formData.applicationDeadline);
      if (deadLineDate <= new Date()) {
        error.applicationDeadline =
          "Application deadline must be a future date";
      }
    }

    // validate expiration date
    if (formData.expiryAt) {
      const expiryDate = new Date(formData.expiryAt);
      if (expiryDate <= new Date()) {
        error.expiryAt = "Expiry date must be a future date";
      }
    }
    return error;
  };

  // if form valid method
  const isFormValid = () => {
    const validationErrs = validateForm(formData);
    return Object.keys(validationErrs).length === 0;
  };

  // fetch job data for editing
  useEffect(() => {
    const fetchJobDetailsForEdit = async () => {
      if (!jobId) {
        return;
      }
      try {
        const res = await axiosInstance.get(
          API_PATHS.JOBS.GET_JOB_BY_ID(jobId),
        );
        const jobData = res.data?.data;

        if (jobData) {
          setFormData((prev) => ({
            ...prev,
            jobType: jobData.type ?? "",
            jobTitle: jobData.title ?? "",
            location: jobData.location ?? "",
            category: jobData.category ?? "",
            requirement: jobData.requirements ?? "",
            description: jobData.description ?? "",
            salaryMin: jobData.salaryMin ?? "",
            salaryMax: jobData.salaryMax ?? "",
            salaryCurrency: jobData.salaryCurrency ?? "NGN",
            workMode: jobData.workMode ?? "onsite",
            experienceLevel: jobData.experienceLevel ?? "mid",
            salaryPeriod: jobData.salaryPeriod ?? "monthly",
            responsibilities: jobData.responsibilities ?? "",
            skills: jobData.skills || [],
            benefits: jobData.benefits || [],
            applicationDeadline: jobData.applicationDeadline
              ? new Date(jobData.applicationDeadline)
                  .toISOString()
                  .split("T")[0]
              : "",
            expiryAt: jobData.expiryAt
              ? new Date(jobData.expiryAt).toISOString().split("T")[0]
              : "",
            isFeatured: jobData.isFeatured || false,
          }));
        }
      } catch (err) {
        if (err.res) {
          console.error("API Error:");
        }
      }
    };
    fetchJobDetailsForEdit();
    return () => {};
  }, [jobId]);

  // get currency symbol
  const displayCurrencySymbol = () => {
    const currency = CURRENCIES.find(
      (c) => c.value === formData.salaryCurrency,
    );
    return currency ? currency.symbol : "₦";
  };
  if (isPreview) {
    return (
      <DashboardLayout activeMenu={"post-job"}>
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview} />
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
                  Fill out the form below to get your Job Posted
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

                {/* Job type */}
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

              {/* Work Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label={`Work Mode`}
                  id={`workMode`}
                  placeholder={`select work mode`}
                  value={formData.workMode}
                  onChange={(e) =>
                    handleInputChange("workMode", e.target.value)
                  }
                  option={WORK_MODE}
                  error={errs.workMode}
                  required
                  icon={Wifi}
                />

                {/* Experience Level */}
                <SelectField
                  label={`Experience Level`}
                  id={`experienceLevel`}
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    handleInputChange("experienceLevel", e.target.value)
                  }
                  placeholder={`Select experience level`}
                  option={EXPERIENCE_LEVEL}
                  error={errs.experienceLevel}
                  icon={TrendingUp}
                />

                <div className="flex items-end">
                  <label className="flex items-center space-x-3 cursor-pointer bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 rounded-lg px-4 py-3 w-full hover:from-amber-100 hover:to-yellow-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        handleInputChange("isFeatured", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span>⭐</span>
                    <span className="text-sm font-medium text-gray-700">
                      Featured Job
                    </span>
                  </label>
                </div>
              </div>

              {/* Job Description */}
              <TextareaField
                label={`Job Description`}
                id={`description`}
                placeholder={`Describe the role`}
                required
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                error={errs.description}
                //helperText={`Include: key responsibilities, day-to-day task, and what make this role exciting.`}
              />

              {/* Requirement */}
              <TextareaField
                label={`Requirement`}
                id={`requirement`}
                placeholder={`Requirement and qualifications`}
                value={formData.requirement}
                onChange={(e) =>
                  handleInputChange("requirement", e.target.value)
                }
                error={errs.requirement}
                required
                //helperText={`Include: required skills, experience levels, education, and any preference qualification. `}
              />

              {/* responsibilities */}

              <TextareaField
                label={`responsibilities`}
                id={`responsibilities`}
                placeholder={`responsibility`}
                value={formData.responsibilities}
                onChange={(event) =>
                  handleInputChange("responsibilities", event.target.value)
                }
                error={errs.responsibilities}
                required
              />

              {/* Skills */}
              <div className="space-y-4">
                <label
                  htmlFor="skills"
                  className="text-sm font-medium text-gray-600"
                >
                  Required Skills
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id={`skills`}
                    label={`Skills`}
                    placeholder="Add skills if required"
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyPress={(event) =>
                      event.key === "Enter" &&
                      (event.preventDefault(), handleAddSkill())
                    }
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <span className="text-white">
                      <Plus className="w-4 h-4" />
                    </span>
                    Add skill
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100  text-blue-700 rounded-lg text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Benefits
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add benefit if required but it shouldn't exceeded 150 characters "
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddBenefit())
                    }
                    maxLength={200}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                  >
                    <span>
                      <Plus className="w-4 h-4" />
                    </span>
                    Add benefit
                  </button>
                </div>
                {errs.benefits && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4"/>
                     <span> {errs.benefits}</span>
                  </p>
                )}
                {formData.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{benefit}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(benefit)}
                          className="text-green-600 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Salary range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Payment Range <span className="text-red-500 ml-1">*</span>
                </label>

                {/* Currency Selector */}
                <div className="w-full">
                  <SelectField
                    label=""
                    id="salaryCurrency"
                    value={formData.salaryCurrency}
                    onChange={(e) =>
                      handleInputChange("salaryCurrency", e.target.value)
                    }
                    option={CURRENCIES}
                    placeholder="Select currency"
                    error={errs.salaryCurrency}
                    icon={DollarSign}
                  />

                  <SelectField
                    label=""
                    id="salaryPeriod"
                    value={formData.salaryPeriod}
                    onChange={(e) =>
                      handleInputChange("salaryPeriod", e.target.value)
                    }
                    option={SAlARY_PERIOD}
                    placeholder="Select payment period"
                    error={errs.salaryPeriod}
                    icon={Clock}
                  />
                </div>

                {/* Min && Max Salary Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Min Salary */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <span className="text-gray-500 font-medium">
                        {displayCurrencySymbol()}
                      </span>
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

                  {/* Max Salary */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <span className="text-gray-500 font-medium">
                        {displayCurrencySymbol()}
                      </span>
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

                {/* Error Messages */}
                {errs.salaryMax && (
                  <div className="text-sm text-red-600 font-medium flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errs.salaryMax}</span>
                  </div>
                )}
                {errs.salary && (
                  <div className="text-sm text-red-600 font-medium flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errs.salary}</span>
                  </div>
                )}
              </div>
                {/* Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" >
                  <div className="space-y-2" hidden>
                  <label htmlFor="deadlineDate" className="items-center flex text-sm font-medium text-gray-600">
                    <span className=" flex  ml-2 gap-2">
                      <Calendar className="w-5 h-5"/>
                      Application Dead line
                    </span>
                  </label>
                  <input
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(event)=>handleInputChange("applicationDeadline", event.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errs.applicationDeadline && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4"/>
                      <span>{errs.applicationDeadline}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500 font-medium">When should application close?</p>
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span>
                    <Calendar className="h-5 w-5"/>
                  </span>
                  Job Expiration Date
                  </label>
                  <input
                  type="date"
                  value={formData.expiryAt}
                  onChange={(event)=>handleInputChange("expiryAt", event.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errs.expiryAt && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4"/>
                      <span>{errs.expiryAt}</span>
                    </p>
                  )}
                  <p className="text-sm font-medium text-gray-500">Default to 30 days if not set.</p>
                  </div>
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
                      <Send className="w-5 h-5 mr-2" />
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
