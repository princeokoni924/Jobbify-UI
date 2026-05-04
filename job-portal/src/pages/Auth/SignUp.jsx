
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  validateEmail,
  validateAvatar,
  validatePassword,
} from "../utils/helpler";
import uploadImage from "../utils/uploadStorage";
import {
  User,
  Lock,
  Mail,
  Upload,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Image,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { useAuth } from "../../content/AuthContext";

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const CURRENT_YEAR = new Date().getFullYear();

const SignUp = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    email: "",
    role: "",
    avatar: null,
    // Employer fields
    companyName: "",
    companyDescription: "",
    companyLogo: null,
    companyWebsite: "",
    companySize: "",
    companyIndustry: "",
    companyLocation: "",
    companyFounded: "",
  });

  const [formState, setFormState] = useState({
    loading: false,
    error: {},
    showPassword: false,
    avatarPreview: null,
    companyLogoPreview: null,
    success: false,
  });

  // Handle text input
  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formState.error[name]) {
      setFormState((prev) => ({
        ...prev,
        error: { ...prev.error, [name]: "" },
      }));
    }
  };

  // handle Role
  const handleRoleChanges = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    if (formState.error.role) {
      setFormState((prev) => ({
        ...prev,
        error: { ...prev.error, role: "" },
      }));
    }
  };

  // handle avatar
  const handleAvatarChange = (avatar) => {
    const file = avatar.target.files[0];
    if (file) {
      const error = validateAvatar(file);
      if (error) {
        setFormState((prev) => ({
          ...prev,
          error: { ...prev.error, avatar: error },
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState((prev) => ({
          ...prev,
          avatarPreview: e.target.result,
          error: { ...prev.error, avatar: "" },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // handle company logo
  const handleCompanyLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const error = validateAvatar(file); // reuse same validation
      if (error) {
        setFormState((prev) => ({
          ...prev,
          error: { ...prev.error, companyLogo: error },
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, companyLogo: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState((prev) => ({
          ...prev,
          companyLogoPreview: e.target.result,
          error: { ...prev.error, companyLogo: "" },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // validate employer fields
  const validateEmployerFields = () => {
    const errors = {};

    if (!formData.companyName) {
      errors.companyName = "Company name is required";
    } else if (formData.companyName.length > 20) {
      errors.companyName = "Company name cannot exceed 20 characters";
    }

    if (formData.companyDescription && formData.companyDescription.length > 5000) {
      errors.companyDescription = "Company description cannot exceed 5000 characters";
    }

    if (formData.companyWebsite) {
      try {
        new URL(formData.companyWebsite);
      } catch {
        errors.companyWebsite = "Company website must be a valid URL";
      }
    }

    if (!formData.companySize) {
      errors.companySize = "Please select a company size";
    }

    if (formData.companyIndustry && formData.companyIndustry.length > 100) {
      errors.companyIndustry = "Company industry cannot exceed 100 characters";
    }

    if (formData.companyLocation && formData.companyLocation.length > 50) {
      errors.companyLocation = "Company location cannot exceed 50 characters";
    }

    if (formData.companyFounded) {
      const year = parseInt(formData.companyFounded);
      if (isNaN(year) || year < 1800) {
        errors.companyFounded = "Founded year must be after 1800";
      } else if (year > CURRENT_YEAR) {
        errors.companyFounded = "Founded year cannot be in the future";
      }
    }

    return errors;
  };

  // validate form
  const validateForm = () => {
    const error = {
      fullName: !formData.fullName ? "Kindly enter your full name" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: !formData.role ? "Kindly select a role" : "",
      avatar: "",
    };

    // Employer-specific validation
    if (formData.role === "employer") {
      const employerErrors = validateEmployerFields();
      Object.assign(error, employerErrors);
    }

    Object.keys(error).forEach((key) => {
      if (!error[key]) delete error[key];
    });

    setFormState((prev) => ({ ...prev, error }));
    return Object.keys(error).length === 0;
  };

  // handle submit
  const handleSubmit = async(event)=>{
event.preventDefault();
if (!validateForm()) return;
setFormState((prev) => ({ ...prev, loading: false, error:{}, success: false }));
try{
  // upload profile picture if exists
  let avatarUrl = "";
  if(formData.avatar){
    try{
      const imgUploadResponse = await uploadImage(formData.avatar);
      avatarUrl = imgUploadResponse?.imgUrl ?? "";
    } catch {
      setFormState((prev)=>({
        ...prev, loading: false, error:{error: "Failed to upload profile picture. Kindly try again."}
      }));
      return;
    }
}
  // upload company logo if exists
  let companyLogoUrl = "";
  if(formData.companyLogo){
    try{
      const logoUploadResponse = await uploadImage(formData.companyLogo);
      companyLogoUrl = logoUploadResponse?.imgUrl ?? "";
    } catch {
      setFormState((prev)=>({
        ...prev, loading: false, error:{error: "Failed to upload company logo. Kindly try again."}
      }));
      return;
    }
}

// Build payload
const payload ={
  name : formData.fullName,
email: formData.email,
password: formData.password,
role: formData.role,
avatar: avatarUrl || "",
} ;
if(formData.role === "employer"){
  Object.assign(payload,{
    companyName: formData.companyName,
companyDescription: formData.companyDescription,
companyLogo: companyLogoUrl || "",
companyWebsite: formData.companyWebsite,
companySize: formData.companySize,
companyIndustry: formData.companyIndustry,
companyLocation: formData.companyLocation,
companyFounded: formData.companyFounded ? parseInt(formData.companyFounded) : undefined,
  })
}

const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);
const { token } = response.data;
setFormState((prev,)=>({...prev, loading:true, success: true, error:{}}));

if(token){
  login(response.data, token);
};
setTimeout(() => {
      window.location.href = formData.role === "employer" ? "/employer-dashboard" : "/find-jobs";
    }, 2000);
}catch(error){
  console.log("error",error.response?.data);
   console.log("Status:", error.response?.status);
  console.log("Full data:", JSON.stringify(error.response?.data, null, 2));
  setFormState((prev)=>({...prev, loading:false, error:{submit:error.response?.data?.error?.message || "Registration failed. Kindly try again."}}));
}
}
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (!validateForm()) return;
  //   setFormState((prev) => ({ ...prev, loading: true, error:{} }));
  //    try{

     
  //   try {
  //     let avatarUrl = "";
  //     if (formData.avatar) {
  //       const imgUploadResponse = await uploadImage(formData.avatar);
  //       avatarUrl = imgUploadResponse?.imgUrl ?? "";
  //     }
  //   } catch {
  //   setFormState((prev)=>({
  //     ...prev, loading: false, error:{error: "Failed to upload profile picture. Kindly try again."}
  //   }));
  //   return;
  //   }
  //    }
  //     let companyLogoUrl = "";
  //     if (formData.companyLogo) {
  //       const logoUploadResponse = await uploadImage(formData.companyLogo);
  //       companyLogoUrl = logoUploadResponse?.imgUrl ?? "";
  //     }

  //     const payload = {
  //       name: formData.fullName,
  //       email: formData.email,
  //       password: formData.password,
  //       role: formData.role,
  //       avatar: avatarUrl || "",
  //     };

  //     if (formData.role === "employer") {
  //       Object.assign(payload, {
  //         companyName: formData.companyName,
  //         companyDescription: formData.companyDescription,
  //         companyLogo: companyLogoUrl || "",
  //         companyWebsite: formData.companyWebsite,
  //         companySize: formData.companySize,
  //         companyIndustry: formData.companyIndustry,
  //         companyLocation: formData.companyLocation,
  //         companyFounded: formData.companyFounded ? parseInt(formData.companyFounded) : undefined,
  //       });
  //     }

  //     const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);
  //     const { token } = response.data;

  //     setFormState((prev) => ({
  //       ...prev,
  //       loading: false,
  //       success: true,
  //       error: {},
  //     }));

  //     if (token) {
  //       login(response.data, token);
  //     }

  //     setTimeout(() => {
  //       window.location.href =
  //         formData.role === "employer" ? "/employer-dashboard" : "/find-jobs";
  //     }, 2000);
  //   } catch (error) {
  //     console.log("error", error);
  //     console.log("Full error:", error);
  //     console.log("Response data:", error.response?.data);
  //     console.log("Status:", error.response?.status);
  //     setFormState((prev) => ({
  //       ...prev,
  //       loading: false,
  //       error: {
  //         submit:
  //           error.response?.data?.error?.message  ||
  //           "Registration fail. Kindly try again.",
  //       },
  //     }));
  //   }
  

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          className="bg-white p-8 shadow-xl max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-600 mb-4">
            Welcome to Jobify! Your Account has been created successfully.
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Please wait....</p>
        </motion.div>
      </div>
    );
  }

  const isEmployer = formData.role === "employer";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="text-center mb-4">
          <h2 className="bg-gradient-to-r from-blue-600 text-transparent bg-clip-text to-purple-600 text-xl font-bold text-gray-900 mb-2">
            Register
          </h2>
          <p className="text-sm text-gray-600">
            Join thousands of professionals finding their dream jobs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="true">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fullName">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  formState.error.fullName ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-colors duration-300`}
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChanges}
                placeholder="Enter your full name"
              />
            </div>
            {formState.error.fullName && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChanges}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  formState.error.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-colors duration-300`}
                placeholder="Enter your email"
              />
            </div>
            {formState.error.email && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChanges}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                  formState.error.password ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-colors duration-300`}
                placeholder="Kindly create a strong password"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                }
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400"
              >
                {formState.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formState.error.password && (
              <p className="text-sm text-red-600 flex mt-1 items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.password}
              </p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {formState.avatarPreview ? (
                  <img src={formState.avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleAvatarChange}
                />
                <label
                  htmlFor="avatar"
                  className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload photo</span>
                </label>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  Supported: JPEG, JPG, PNG up to 5MB
                </p>
              </div>
            </div>
            {formState.error.avatar && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.avatar}
              </p>
            )}
          </div>

          {/* Role Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">I am *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.role === "jobseeker"
                    ? "border-blue-500 bg-blue-50 text-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                type="button"
                onClick={() => handleRoleChanges("jobseeker")}
              >
                <UserCheck className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">Job Finder</div>
                <div className="text-xs text-gray-500">Looking for opportunities</div>
              </button>
              <button
                type="button"
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.role === "employer"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-300"
                }`}
                onClick={() => handleRoleChanges("employer")}
              >
                <Building2 className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">Employer</div>
                <div className="text-xs text-gray-500">Hiring talent</div>
              </button>
            </div>
            {formState.error.role && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.role}
              </p>
            )}
          </div>

          {/* ── Employer Fields ── */}
          <AnimatePresence>
            {isEmployer && (
              <motion.div
                key="employer-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-5 pt-2">
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      Company Information
                    </h3>

                    {/* Company Name */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChanges}
                          maxLength={20}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                            formState.error.companyName ? "border-red-500" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-colors duration-300`}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        {formState.error.companyName ? (
                          <p className="text-red-600 text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formState.error.companyName}
                          </p>
                        ) : (
                          <span />
                        )}
                        <span className="text-xs text-gray-400">
                          {formData.companyName.length}/20
                        </span>
                      </div>
                    </div>

                    {/* Company Description */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                          name="companyDescription"
                          value={formData.companyDescription}
                          onChange={handleInputChanges}
                          maxLength={5000}
                          rows={3}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                            formState.error.companyDescription ? "border-red-500" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-colors duration-300 resize-none`}
                          placeholder="Briefly describe your company"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        {formState.error.companyDescription ? (
                          <p className="text-red-600 text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formState.error.companyDescription}
                          </p>
                        ) : (
                          <span />
                        )}
                        <span className="text-xs text-gray-400">
                          {formData.companyDescription.length}/5000
                        </span>
                      </div>
                    </div>

                    {/* Company Logo */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo (Optional)
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                          {formState.companyLogoPreview ? (
                            <img
                              src={formState.companyLogoPreview}
                              alt="company logo preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            id="companyLogo"
                            className="hidden"
                            accept=".jpg, .jpeg, .png"
                            onChange={handleCompanyLogoChange}
                          />
                          <label
                            htmlFor="companyLogo"
                            className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload logo</span>
                          </label>
                          <p className="text-xs font-medium text-gray-500 mt-1">
                            JPEG, JPG, PNG up to 5MB
                          </p>
                        </div>
                      </div>
                      {formState.error.companyLogo && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formState.error.companyLogo}
                        </p>
                      )}
                    </div>

                    {/* Company Website */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="url"
                          name="companyWebsite"
                          value={formData.companyWebsite}
                          onChange={handleInputChanges}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                            formState.error.companyWebsite ? "border-red-500" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-colors duration-300`}
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                      {formState.error.companyWebsite && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formState.error.companyWebsite}
                        </p>
                      )}
                    </div>

                    {/* Company Size */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="companySize"
                          value={formData.companySize}
                          onChange={handleInputChanges}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                            formState.error.companySize ? "border-red-500" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-colors duration-300 bg-white appearance-none`}
                        >
                          <option value="">Select company size</option>
                          {COMPANY_SIZES.map((size) => (
                            <option key={size} value={size}>
                              {size} employees
                            </option>
                          ))}
                        </select>
                      </div>
                      {formState.error.companySize && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formState.error.companySize}
                        </p>
                      )}
                    </div>

                    {/* Company Industry */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="companyIndustry"
                          value={formData.companyIndustry}
                          onChange={handleInputChanges}
                          maxLength={100}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                            formState.error.companyIndustry ? "border-red-500" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-colors duration-300`}
                          placeholder="e.g. Technology, Finance, Healthcare"
                        />
                      </div>
                      {formState.error.companyIndustry && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formState.error.companyIndustry}
                        </p>
                      )}
                    </div>

                    {/* Company Location */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="companyLocation"
                          value={formData.companyLocation}
                          onChange={handleInputChanges}
                          maxLength={50}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                            formState.error.companyLocation ? "border-red-500" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-colors duration-300`}
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>
                      {formState.error.companyLocation && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formState.error.companyLocation}
                        </p>
                      )}
                    </div>

                    {/* Company Founded */}
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year Founded
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="companyFounded"
                          value={formData.companyFounded}
                          onChange={handleInputChanges}
                          min={1800}
                          max={CURRENT_YEAR}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                            formState.error.companyFounded ? "border-red-500" : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-colors duration-300`}
                          placeholder={`e.g. ${CURRENT_YEAR - 5}`}
                        />
                      </div>
                      {formState.error.companyFounded && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formState.error.companyFounded}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Error */}
          {formState.error.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {formState.error.submit}
              </p>
            </div>
          )}

          {/* Submit Btn */}
          <button
            type="submit"
            disabled={formState.loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Submitting your data, please wait.....</span>
              </>
            ) : (
              <span>Create an Account</span>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account{" "}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-700 p-2">
                Login here
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;


// import React, { useState } from "react";
// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import {
//   validateEmail,
//   validateAvatar,
//   validatePassword,
// } from "../utils/helpler";
// import  uploadImage  from "../utils/uploadStorage";
// import {
//   User,
//   Lock,
//   Mail,
//   Upload,
//   Eye,
//   EyeOff,
//   UserCheck,
//   Building2,
//   CheckCircle,
//   AlertCircle,
//   Loader,
// } from "lucide-react";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPath";
// import {useAuth} from '../../content/AuthContext'

// const SignUp = () => {
//   const {login} = useAuth();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     password: "",
//     email: "",
//     role: "",
//     avatar: null,
//   });
//   const [formState, setFormState] = useState({
//     loading: false,
//     error: {},
//     showPassword: false,
//     avatarPreview: false,
//     success: false,
//   });

//   // Handle text input
//   const handleInputChanges = (event) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // clear error when user start typing
//     if (formState.error[name]) {
//       setFormState((prev) => ({
//         ...prev,
//         error: { ...prev.error, [name]: "" },
//       }));
//     }
//   };

//   // handle Role
//   const handleRoleChanges = (role) => {
//     setFormData((prev) => ({
//       ...prev,
//       role,
//     }));
//     if (formState.error.role) {
//       setFormState((prev) => ({
//         ...prev,
//         error: { ...prev.error, role: "" },
//       }));
//     }
//   };

//   // handle avatar
//   const handleAvatarChange = (avatar) => {
//     const file = avatar.target.files[0];
//     if (file) {
//       const error = validateAvatar(file);
//       if (error) {
//         setFormState((prev) => ({
//           ...prev,
//           error: { ...prev.error, avatar: error },
//         }));
//         return;
//       }
//       setFormData((prev) => ({ ...prev, avatar: file }));
//       // create preview
//       const reader = new FileReader();
//       reader.onload = (avatar) => {
//         setFormState((prev) => ({
//           ...prev,
//           avatarPreview: avatar.target.result,
//           error: { ...prev.error, avatar: "" },
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // validate form
//   const validateForm = () => {
//     const error = {
//       fullName: !formData.fullName ? "Kindly enter your full name" : "",
//       email: validateEmail(formData.email),
//       password: validatePassword(formData.password),
//       role: !formData.role ? "Kindly select a role" : "",
//       avatar: "",
//     };

//     // remove empty error when typing
//     Object.keys(error).forEach((keys) => {
//       if (!error[keys]) {
//         delete error[keys];
//       }
//     });
//     setFormState((prev) => ({ ...prev, error }));
//     return Object.keys(error).length === 0;
//   };

//   //handle submit
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!validateForm()) return;
//     setFormState((prev) => ({ ...prev, loading: true }));

//     try {
//       // api call
//       let avatarUrl = "";
      
//       // upload img if present
//       if (formData.avatar) {
//         const imgUploadResponse = await uploadImage(formData.avatar);
//         avatarUrl = imgUploadResponse?.imgUrl ?? "";
//       }

//       const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
//         name: formData.fullName,
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//         avatar: avatarUrl || "",
//       });
//       // handle successful registration
//       const { token } = response.data;
//       setFormState((prev) => ({
//         ...prev,
//         loading: false,
//         success: true,
//         error: {},
//       }));
//       if (token) {
//         login(response.data, token);
//       }
//       // redirect base on role.
//       setTimeout(() => {
//         // setFormState((prev) => ({ ...prev, success: true, loading: false }));
//         window.location.href =
//           formData.role === "employer" ? "/employer-dashboard" : "/find-jobs";
//       }, 2000);
//     } catch (error) {
//       console.log("error", error);
//       setFormState((prev) => ({
//         ...prev,
//         loading: false,
//         error: {
//           submit:
//             error.response?.data.message ||
//             "Registration fail. Kindly try again.",
//         },
//       }));
//     }
//   };

//   if (formState.success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//         <motion.div
//           className="bg-white p-8 shadow-xl max-w-md w-full text-center"
//           initial={{ opacity: 1, y: 0.9 }}
//           animate={{ opacity: 1, y: 1 }}
//         >
//           <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Account Created!
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Welcome to Jobify! Your Account has been created successfully.
//           </p>
//           {/* Spinner */}
//           <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
//           <p className="text-sm text-gray-500">Please wait....</p>
//         </motion.div>
//       </div>
//     );
//   }
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
//       >
//         <div className="text-center mb-4">
//           <h2 className="bg-gradient-to-r from-blue-600 text-transparent bg-clip-text to-purple-600 text-xl font-bold text-gray-900 mb-2">
//             Register
//           </h2>
//           <p className="tex-sm text-gray-600">
//             Join thousands of professionals finding their dream jobs
//           </p>
//         </div>
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-6"
//           autoComplete="true"
//           autoSave="true"
//         >
//           {/* Full Name */}
//           <div>
//             <label
//               className="block text-sm font-medium text-gray-700 mb-2"
//               htmlFor="fullName"
//             >
//               Full Name *
//             </label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 className={`w-full pl-10 pr-4 py-3 rounded-xl border 
//              ${
//                formState.error.fullName ? "border-red-500" : "border-gray-300"
//              } focus:ring-2
//                focus:ring-blue-500 outline-none 
//                focus:border-transparent transition-colors
//                 duration-300`}
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleInputChanges}
//                 placeholder="Enter your full name"
//               />
//             </div>
//             {formState.error.fullName && (
//               <p className="text-red-600 text-sm mt-1 flex items-center">
//                 <AlertCircle className="w-4 h-4 mr-1" />
//                 {formState.error.fullName}
//               </p>
//             )}
//           </div>

//           {/* Email */}
//           <div>
//             <label
//               className="block text-sm font-medium text-gray-700 mb-2"
//               htmlFor="email"
//             >
//               Email Address *
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChanges}
//                 className={`w-full pl-10 pr-4 py-3 
//               rounded-xl border ${
//                 formState.error.email ? "border-red-500" : "border-gray-300"
//               } focus:ring-2
//                focus:ring-blue-500
//                 outline-none focus:border-transparent transition-colors duration-300`}
//                 placeholder="Enter your email"
//               />
//             </div>
//             {formState.error.email && (
//               <p className="text-red-600 text-sm mt-1 flex items-center">
//                 <AlertCircle className="w-4 h-4 mr-1" />
//                 {formState.error.email}
//               </p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label
//               className="block text-sm font-medium text-gray-700 mb-2"
//               htmlFor="password"
//             >
//               Password *
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type={formState.showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChanges}
//                 className={`w-full pl-10 pr-12 py-3 rounded-xl border
//                ${
//                  formState.error.password ? "border-red-500" : "border-gray-300"
//                } focus:ring-2
//                  focus:ring-blue-500 
//                  outline-none
//                   focus:border-transparent transition-colors duration-300`}
//                 placeholder="Kindly create a strong password"
//               />
//               <button
//                 type="button"
//                 onClick={() => {
//                   setFormState((prev) => ({
//                     ...prev,
//                     showPassword: !prev.showPassword,
//                   }));
//                 }}
//                 className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 w-5 h-5"
//               >
//                 {formState.showPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>

//             {formState.error.password && (
//               <p className="text-sm text-red-600 flex mt-1 items-center">
//                 <AlertCircle className="w-4 h-4 mr-1" />
//                 {formState.error.password}
//               </p>
//             )}
//           </div>
//           {/* Profile picture upload*/}
//           <div className="">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Profile Picture (Optional)
//             </label>
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
//                 {formState.avatarPreview ? (
//                   <img
//                     src={formState.avatarPreview}
//                     alt="avatar preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <User className="w-8 h-8 text-gray-400 " />
//                 )}
//               </div>
//               <div className="">
//                 <input
//                   type="file"
//                   id="avatar"
//                   className="hidden"
//                   accept=".jpg, .jpeg, .png"
//                   onChange={handleAvatarChange}
//                 />
//                 <label
//                   htmlFor="avatar"
//                   className="cursor-pointer bg-gray-50 border border-gray-300
//                  rounded-lg px-4 py-2 text-sm
//                   font-medium  text-gray-700
//                    hover:bg-gray-100 transition-colors
//                     flex items-center space-x-4"
//                 >
//                   <Upload className="w-4 h-4" />
//                   <span>Upload photo</span>
//                 </label>
//                 <p className="text-xs font-medium text-gray-500 mt-1">
//                   Supported: JPEG, JPG, PNG up to 5MB
//                 </p>
//               </div>
//             </div>
//             {formState.error.avatar && (
//               <p className="text-red-500 text-sm mt-1 flex items-center">
//                 <AlertCircle className="w-4 h-4 mr-1" />
//                 {formState.error.avatar}
//               </p>
//             )}
//           </div>
//           {/* Role Section */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               I am *
//             </label>
//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 className={`p-4 rounded-lg border-2 transition-all ${
//                   formData.role === "jobseeker"
//                     ? "border-blue-500 bg-blue-50 text-blue-500"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//                 type="button"
//                 onClick={() => handleRoleChanges("jobseeker")}
//               >
//                 <UserCheck className="w-8 h-8 mx-auto mb-2" />
//                 <div className="font-medium">Job Finder</div>
//                 <div className="text-xs text-gray-500">
//                   Looking for opportunities
//                 </div>
//               </button>
//               <button
//               type="button"
//                 className={`p-4 rounded-lg border-2 transition-all ${
//                   formData.role === "employer"
//                     ? "border-blue-500 bg-blue-50 text-blue-700"
//                     : "border-gray-300 hover:border-gray-300"
//                 }`}
//                 onClick={() => handleRoleChanges("employer")}
//               >
//                 <Building2 className="w-8 h-8 mx-auto mb-2" />
//                 <div className="font-medium">Employer</div>
//                 <div className="text-xs text-gray-500">Hiring talent</div>
//               </button>
//             </div>
//             {formState.error.role && (
//               <p className="text-red-500 text-sm mt-2 flex items-center">
//                 <AlertCircle className="w-4 h-4 mr-1" />
//                 {formState.error.role}
//               </p>
//             )}
//           </div>

//           {/* Submit Error */}
//           {formState.error.submit && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-red-700 text-sm flex items-center">
//                 <AlertCircle className="w-4 h-4 mr-2" />
//                 {formState.error.submit}
//               </p>
//             </div>
//           )}
//           {/* Submit Btn */}
//           <button
//             type="submit"
//             disabled={formState.loading}
//             className="w-full bg-gradient-to-r
//            from-blue-600 to-purple-600
//             text-white py-3 
//             rounded-lg font-medium
//              hover:from-blue-700
//               hover:to-purple-700
//                transition-all duration-300
//                 disabled:opacity-50
//                  disabled:cursor-not-allowed
//                   flex items-center
//                    justify-center
//                     space-x-2"
//           >
//             {formState.loading ? (
//               <>
//                 <Loader className="w-5 h-5 animate-spin" />
//                 <span>Submitting your data, please wait.....</span>
//               </>
//             ) : (
//               <span>Create an Account</span>
//             )}
//           </button>

//           {/* Login Link */}
//           <div className="text-center">
//             <p className="text-gray-600">
//               Already have an account{""}
//               <a
//                 href="/login"
//                 className="font-medium text-blue-600 hover:text-blue-700 p-2"
//               >
//                 Login here
//               </a>
//             </p>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default SignUp;
