/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {useAuth} from '../../../content/AuthContext'
const Header = () => {
  // const isAuthenticated = true;
  // const user = { fullName: "Prince", role: "employer" };
  const {user, isAuthenticated} = useAuth();
  const navigate = useNavigate();
  return (
    <motion.header
    initial={{ y: 0, opacity: -20 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="fixed top-0 left-0 right-0 backdrop-blur-sm border-b border-gray-100 w-full bg-white shadow-sm z-50 "
    >
      <div className="container mx-auto px-4 ">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-300 to-blue-400 rounded-md flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl
            bg-gradient-to-r bg-clip-text from-blue-600 to-purple-800 text-transparent font-bold text-gray-900">Jobify</span>
           <div className="">
            <h4>Connecting Talent to Opportunity</h4>
            </div> 
          </div>
          {/* Navigation link Hidden on mobile */}
          <nav className="hidden md:flex space-x-8">
            <a onClick={() => navigate("/find-jobs")}
             className="text-gray-600 hover:text-gray-500 transition-colors font-medium">
              find jobs
            </a>
            <a
              onClick={() => {
                navigate(
                  isAuthenticated && user?.role === "employer"
                    ? "/employer-dashboard"
                    : "/login"
                );
              }}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              For Employers
            </a>
          </nav>

          {/* Auth Btn */}
        <div className='flex items-center space-x-3'>
          {isAuthenticated ? (
            <div className='flex items-center space-x-3'>
              <span className='text-gray-700'>Welcome, {user?.fullName}</span>
              <a href={user.role === 'employer' ? '/employer-dashboard' : '/find-jobs'}
               className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium
                hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-sm'>
                   Dashboard
              </a>
        </div>
          ):(
            <>
            <a href='/login' className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-500">Login</a>
            <a href='/signup' className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px6 p-2 rounded-lg font-medium hover:from-blue-500 hover:to-purple-700 transition-all duration-300 shadow-sm  hover:shadow-md " >Sign Up</a>
            </>
          )}
      </div>  
         
      
        </div>
 </div>
    </motion.header>
  );
};

export default Header;
