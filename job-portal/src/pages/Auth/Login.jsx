import { validateEmail, validatePassword } from "../utils/helpler";
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { useAuth } from "../../content/AuthContext";
const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [formState, setFormState] = useState({
    loading: false,
    error: {},
    success: false,
    showPassword: false,
  });

  // Handle input change
  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, //name === 'rememberMe' ? checked : value,
    }));

    // clear error when user start typing
    if (formState.error[name]) {
      setFormState((prev) => ({
        ...prev,
        error: { ...prev.error, [name]: "" },
      }));
    }
  };

  // validate form
  const validateForm = () => {
    const error = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    // remove empty error
    Object.keys(error).forEach((keys) => {
      if (!error[keys]) {
        delete error[keys];
      }
    });

    setFormState((prev) => ({
      ...prev, // loading: true
      error: error,
    }));
    return Object.keys(error).length === 0;
  };

  // handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setFormState((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      // login api integration
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      //console.log("Full response structure:", JSON.stringify(response.data, null, 2));
      
      // destructuring from nested data
      const { user, accessToken } = response.data.data;
      const { role } = user;
      if (!user || !accessToken) {
        throw new Error("Invalid response: missing user data or access token");
      }
      // console.log("Login successful:", {
      //   userId: user._id,
      //   email: user.email,
      //   role,
      //   hasToken: !!accessToken,
      // });
      if (accessToken) {
        login(user, accessToken);
      }
      
      // Update success state
      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        error: {},
      }));

      // Redirect based on role
      setTimeout(() => {
        window.location.href =
          role === "employer" ? "/employer-dashboard" : "find-jobs";
      }, 2000);
    } catch (err) {
      // console.error("Login error:", err);
      // console.error("Error response:", err.response?.data);
      // console.error("Error message:", err.message);
      setFormState((prev) => ({
        ...prev,
        loading: false,
        error: {
          submit:
            err.response?.data?.error?.message ||
            "Login failed, please check your credentials and try again",
        },
      }));
    }
  };

  //old code
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (!validateForm()) return;
  //   setFormState((prev) => ({ ...prev, loading: true }));

  //   try {
  //     // login api integration
  //     const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
  //       email: formData.email,
  //       password: formData.password,
  //       rememberMe: formData.rememberMe,
  //     });
  //     setFormData((prev) => ({
  //       ...prev,
  //       loading: false,
  //       success: true,
  //       error: {},
  //     }));
  //     const { token, role, user } = response.data;
  //     if (token) {
  //       login(response.data, token);
  //       // redirect base on role
  //       setTimeout(() => {
  //         // setFormState((prev) => ({ ...prev, success: true, loading: false }));
  //         window.location.href =
  //           role === "employer" ? "/employer-dashboard" : "/find-jobs";
  //       }, 2000);
  //     }

  //     // redirect base on user role
  //     setTimeout(() => {
  //       const redirectPath =
  //         user.role === "employer" ? "/employer-dashboard" : "/find-jobs";
  //       window.location.href = redirectPath;
  //     }, 1500);
  //   } catch (error) {
  //     setFormState((prev) => ({
  //       ...prev,
  //       loading: false,
  //       error: {
  //         submit:
  //           error.response?.data?.message ||
  //           "Login fail, please check your credentials and try again",
  //       },
  //     }));
  //   }
  // };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 0.9 }}
          animate={{ opacity: 1, y: 1 }}
          className="bg-white p-8  shadow-xl rounded-xl w-full text-center max-w-md"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-4">
            You've successfully logged into your account.
          </p>
          {/* Spinner */}
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 text-sm mt-2">
            Redirecting to your dashboard.....
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50  px-4">
      <motion.div
        className={`bg-white p-8 rounded-lg shadow-lg max-w-md w-full`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center pb-8">
          <h2
            className="text-2xl  font-bold
           text-gray-900 mb-2 bg-gradient-to-r
            from-blue-600 to-purple-600 bg-clip-text
             text-transparent"
          >
            Welcome Back
          </h2>
          <p className="text-gray-600">Login to your Job Runner account</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          autoComplete="true"
          autoSave="true"
        >
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 
              transform -translate-y-1/2
               text-gray-400 w-5 h-5"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChanges}
                className={`w-full pl-10 pr-4 py-3 outline-none
                 rounded-lg border ${
                   formState.error.email ? "border-red-500" : "border-gray-300"
                 } focus:ring-2 focus:ring-blue-500
                 focus:border-transparent transition-colors`}
                placeholder="Enter your email address"
              />
            </div>
            {formState.error.email && (
              <p
                className="text-red-600 text-sm mt-1 
            flex items-center"
              >
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
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChanges}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 outline-none rounded-lg border ${
                  formState.error.password
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formState.error.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className=" w-4 h-4 mr-1" />
                {formState.error.password}
              </p>
            )}
          </div>
          {/* Submit error */}
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold
           hover:from-blue-700
            hover:to-purple-700 transition-all duration-300 disabled:opacity-50  disabled:cursor-not-allowed flex items-center justify-center space-y-2"
            type="submit"
            disabled={formState.loading}
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span className="">Signing you In, Please wait......</span>
              </>
            ) : (
              "Sign In" // <span className="">Sign In</span>
            )}
          </button>
          {/* Sign up link */}
          <div className="text-center ">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
