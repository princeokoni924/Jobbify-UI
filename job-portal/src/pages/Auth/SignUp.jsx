import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { validateEmail, validateAvater, validatePassword } from "../utils/helpler";
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
} from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    email: "",
    role: "",
    avater: null,
  });
  const [formState, setFormState] = useState({
    loading: false,
    error: {},
    showPassword: false,
    avaterPreview: false,
    success: false,
  });
 //Password Rule
//  const [passwordRule, setPasswordRule] = useState({
//   lower: false,
//     upper: false,
//     number: false,
//     special: false,
//     length: false,
//  });

  
  // Handle text input
  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

 // real-time password validation
    // if (name === "password") {
    //   setPasswordRule(checkPasswordRule(value));
    // }


    // clear error when user start typing
    if (formState.error[name]) {
      setFormState((prev) => ({
        ...prev,
        error: { ...prev, [name]: "" },
      }));
    }
  };

  // handle Role
  const handleRoleChanges = (role) => {
    setFormData((prev)=>({
      ...prev, role,
    }));
    if(formState.error.role){
      setFormState((prev)=>({
        ...prev,
        error:{...prev.error, role:""},

      }))
    }
  };

  // handle Avater
  const handleAvaterChange = (avater) => {
    const file = avater.target.files[0];
    if(file){
      const error = validateAvater(file);
      if(error){
        setFormState((prev)=>({
          ...prev, error:{...prev.error, avater: error},
        }));
        return;
      }
      setFormData((prev)=>({...prev, avater: file}));
      // create preview
      const reader = new FileReader();
      reader.onload=(avater)=>{
        setFormState((prev)=>({...prev, avaterPreview:avater.target.result,
          error:{...prev.error, avater:""}
        }));
      }
      reader.readAsDataURL(file);
    }
  };

  // validate form
  const validateForm = () => {
    //const isPasswordValid = Object.values(passwordRule).every(Boolean);
    const error={
      fullName: !formData.fullName ? "Kindly enter your full name":"",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      // password: !isPasswordValid ? "Password doesn't meet the criteria":"",//validatePassword(formData.password),
      role:!formData.role ? "Kindly select a role":"",
      avater:"",
    };

    // remove empty error when typing
    Object.keys(error).forEach(keys=>{
      if(!error[keys]){
        delete error[keys]
      }
    });
    setFormState((prev)=>({...prev,error}));
    return Object.keys(error).length === 0
  };

  //handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!validateForm()) return;
    setFormState((prev)=>({...prev, loading:true}));

    try{
         /// api call
         setTimeout(() => {
        setFormState((prev) => ({ ...prev, success: true, loading: false }));
      }, 2000);

    }catch(error){
      console.log("error", error);
      setFormState((prev)=>({
        ...prev, loading:false,
          error:{
            submit:
            error.response?.data.message || "Registration fail. Kindly try again."
          },
      }));
    }
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          className="bg-white p-8 shadow-xl max-w-md w-full text-center"
          initial={{ opacity: 1, y: 0.9 }}
          animate={{ opacity: 1, y: 1 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Created!
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome to Job Runner! Your Account has been created successfully.
          </p>
          {/* Spinner */}
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500">Please wait....</p>
        </motion.div>
      </div>
    );
  }
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
            Create Account
          </h2>
          <p className="tex-sm text-gray-600">
            Join thousands of professionals finding their dream jobs
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          autoComplete="true"
          autoSave="true"
        >
          {/* Full Name */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="fullName"
            >
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className={`w-full pl-10 pr-4 py-3 rounded-xl border 
             ${
               formState.error.fullName ? "border-red-500" : "border-gray-300"
             } focus:ring-2
               focus:ring-blue-500 outline-none 
               focus:border-transparent transition-colors
                duration-300`}
                type="text"
                name="fullName"
                value={formState.fullName}
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
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChanges}
                className={`w-full pl-10 pr-4 py-3 
              rounded-xl border ${
                formState.error.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2
               focus:ring-blue-500
                outline-none focus:border-transparent transition-colors duration-300`}
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
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="password"
            >
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChanges}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border
               ${
                 formState.error.password ? "border-red-500" : "border-gray-300"
               } focus:ring-2
                 focus:ring-blue-500 
                 outline-none
                  focus:border-transparent transition-colors duration-300`}
                placeholder="Kindly create a strong password"
              />
              <button
                type="button"
                onClick={() => {
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }));
                }}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {/* LIVE PASSWORD RULES */}
            {/* <div className="mt-2 space-y-1 text-sm">
              {[
                ["lower", "At least one lowercase letter"],
                ["upper", "At least one uppercase letter"],
                ["number", "At least one number"],
                ["special", "At least one special character (!@#$%^&*)"],
                ["length", "Minimum of 10 characters"],
              ].map(([key, label]) => (
                <p
                  key={key}
                  className={`flex items-center ${
                    passwordRule[key] ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {passwordRule[key] ? (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-1" />
                  )}
                  {label}
                </p>
              ))}
            </div> */}
            {formState.error.password && (
              <p className="text-sm text-red-600 flex mt-1 items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.password}
              </p>
            )}
          </div>
          {/* Profile picture upload*/}
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {formState.avaterPreview ? (
                  <img
                    src={formState.avaterPreview}
                    alt="Avater preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400 " />
                )}
              </div>
              <div className="">
                <input
                  type="file"
                  id="avater"
                  className="hidden"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleAvaterChange}
                />
                <label
                  htmlFor="avater"
                  className="cursor-pointer bg-gray-50 border border-gray-300
                 rounded-lg px-4 py-2 text-sm
                  font-medium  text-gray-700
                   hover:bg-gray-100 transition-colors
                    flex items-center space-x-4"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload photo</span>
                </label>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  Supported: JPEG, JPG, PNG up to 5MB
                </p>
              </div>
            </div>
            {formState.error.avater && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.avater}
              </p>
            )}
          </div>
          {/* Role Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am *
            </label>
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
                <div className="text-xs text-gray-500">
                  Looking for opportunities
                </div>
              </button>
              <button
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
            className="w-full bg-gradient-to-r
           from-blue-600 to-purple-600
            text-white py-3 
            rounded-lg font-medium
             hover:from-blue-700
              hover:to-purple-700
               transition-all duration-300
                disabled:opacity-50
                 disabled:cursor-not-allowed
                  flex items-center
                   justify-center
                    space-x-2"
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
              Already have an account{""}
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
