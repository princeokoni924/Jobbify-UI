import { useState, useCallback, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Briefcase, Menu, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../content/AuthContext";
import PropTypes from "prop-types";

/**
 * Navigation link configuration
 */
const NAV_LINKS = [
  { id: "find-jobs", label: "Find Jobs", path: "/find-jobs", requiresAuth: false },
  { id: "employers", label: "For Employers", path: "/employer-dashboard", requiresAuth: false, authPath: "/login" },
  { id: "pricing", label: "Pricing Plans", path: "/price", requiresAuth: false },
  { id: "partner", label: "Partner", path: "/partner", requiresAuth: false },
  { id: "press", label: "Press & Media", path: "/press", requiresAuth: false },
  { id: "about", label: "About Us", path: "/about-us", requiresAuth: false },
  { id: "contact", label: "Contact Us", path: "/contact", requiresAuth: false },
];

/**
 * Navigation Link Component
 */
const NavLink = ({ link, isAuthenticated, userRole, onClick, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = useCallback((e) => {
    e.preventDefault();
    
    // Special handling for employer link
    if (link.id === "employers") {
      const destination = isAuthenticated && userRole === "employer" 
        ? link.path 
        : link.authPath;
      navigate(destination);
    } else {
      navigate(link.path);
    }
    
    if (onClick) onClick();
  }, [link, isAuthenticated, userRole, navigate, onClick]);

  return (
    <a
      href={link.path}
      onClick={handleClick}
      className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium ${className}`}
      aria-label={link.label}
    >
      {link.label}
    </a>
  );
};

NavLink.propTypes = {
  link: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    authPath: PropTypes.string,
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  userRole: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Mobile Menu Component
 */
const MobileMenu = ({ isOpen, onClose, links, isAuthenticated, userRole, user }) => {
  const navigate = useNavigate();

  const handleNavigation = useCallback((path) => {
    navigate(path);
    onClose();
  }, [navigate, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-white md:hidden"
    >
      {/* Mobile Menu Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Jobify
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Menu Content */}
      <nav className="flex flex-col p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.id}
            link={link}
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            onClick={onClose}
            className="py-3 px-4 rounded-lg hover:bg-gray-50 block"
          />
        ))}
      </nav>

      {/* Mobile Auth Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        {isAuthenticated ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Welcome, <span className="font-semibold text-gray-900">{user?.name || "User"}</span>
            </p>
            <button
              onClick={() => handleNavigation(
                userRole === "employer" ? "/employer-dashboard" : "/find-jobs"
              )}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium
                hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => handleNavigation("/login")}
              className="w-full text-gray-700 bg-white border border-gray-300 px-6 py-3 rounded-lg font-medium
                hover:bg-gray-50 transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={() => handleNavigation("/signup")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium
                hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  userRole: PropTypes.string,
  user: PropTypes.object,
};

/**
 * Header Component
 * Main navigation header with authentication support and mobile menu
 * 
 * @component
 * @returns {JSX.Element} Header component
 */
const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  /**
   * Close mobile menu
   */
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  /**
   * Get dashboard path based on user role
   */
  const dashboardPath = useMemo(() => {
    return user?.role === "employer" ? "/employer-dashboard" : "/find-jobs";
  }, [user?.role]);

  /**
   * Get user display name
   */
  const displayName = useMemo(() => {
    return user?.name || user?.fullName || "User";
  }, [user]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 backdrop-blur-sm border-b border-gray-100 w-full bg-white/95 shadow-sm z-50"
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              aria-label="Jobify Home"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center
                group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
                group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                Jobify
              </span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.id}
                  link={link}
                  isAuthenticated={isAuthenticated}
                  userRole={user?.role}
                />
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold text-gray-900">{displayName}</span>
                  </span>
                  <Link
                    to={dashboardPath}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium
                      hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md
                      transform hover:-translate-y-0.5"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg
                      hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium
                      hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md
                      transform hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        links={NAV_LINKS}
        isAuthenticated={isAuthenticated}
        userRole={user?.role}
        user={user}
      />

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

Header.propTypes = {
};

export default Header;







// /* eslint-disable no-unused-vars */
// import React from "react";
// import { motion } from "framer-motion";
// import { Briefcase } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../../content/AuthContext";
// const Header = () => {
//   // const isAuthenticated = true;
//   // const user = { fullName: "Prince", role: "employer" };
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   return (
//     <motion.header
//       initial={{ y: 0, opacity: -20 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.6 }}
//       className="fixed top-0 left-0 right-0 backdrop-blur-sm border-b border-gray-100 w-full bg-white shadow-sm z-50 "
//     >
//       <div className="container mx-auto px-4 ">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-3 cursor-pointer">
//             <div
//              className="w-8 h-8 bg-gradient-to-r from-blue-300 to-blue-400 rounded-md flex items-center justify-center">
//               <Briefcase className="w-5 h-5 text-white" />
//             </div>
//             <span
//               className="text-xl
//             bg-gradient-to-r bg-clip-text from-blue-600 to-purple-800 text-transparent font-bold text-gray-900"
//             >
//               <a href="/login">

//               </a>
//               Jobify
//             </span>

//             {/* <div className=" bg-green-500 relative">
//                 <div className="absolute top-1 inset-y-0 right-10">
//                   <h4 className="text-gray-700 text-sm">Connecting Talent to Opportunity</h4>
//                 </div>
              
//             </div> */}
//           </div>
//           {/* Navigation link Hidden on mobile */}
//           <nav className="hidden md:flex space-x-8">
//             <a
//             href="#"
//               onClick={() => navigate("/find-jobs")}
//               className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer font-medium"
//             >
//               find jobs
//             </a>
//             <a
//             href="#"
//               onClick={() => {
//                 navigate(
//                   isAuthenticated && user?.role === "employer"
//                     ? "/employer-dashboard"
//                     : "/login"
//                 );
//               }}
//               className="text-gray-600 hover:text-blue-500 cursor-pointer transition-colors font-medium"
//             >
//               For Employers
//             </a>

//              <a
//              href="#"
//               onClick={() => navigate("/price")}
//               className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer font-medium"
//             >
//              Pricing Plans
//             </a>

//             <a
//              href="#"
//               onClick={() => navigate("/")}
//               className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer font-medium"
//             >
//              Partner
//             </a>
//              <a
//              href="#"
//               onClick={() => navigate("/")}
//               className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer font-medium"
//             >
//              Press & Media
//             </a>
//             <a
//              href="#"
//               onClick={() => navigate("/about-us")}
//               className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer font-medium"
//             >
//              About Us
//             </a>

//              <a
//              href="#"
//               onClick={() => navigate("/")}
//               className="text-gray-600  hover:text-blue-500 transition-colors cursor-pointer font-medium"
//             >
//              Contact Us
//             </a>
//           </nav>

//           {/* Auth Btn */}
//           <div className="flex items-center space-x-3">
//             {isAuthenticated ? (
//               <div className="flex items-center space-x-3">
//                 <span className="text-gray-700">Welcome,</span>
//                 <a
//                   href={
//                     user.role === "employer"
//                       ? "/employer-dashboard"
//                       : "/find-jobs"
//                   }
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium
//                 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-sm"
//                 >
//                   {user?.name || "Dashboard"}
//                  {/* {user?.fullName} Dashboard */}
//                 </a>
//               </div>
//             ) : (
//               <>
//                 <a
//                   href="/login"
//                   className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-blue-500 gap-2"
//                 >
//                   Login
//                 </a>
//                 <a
//                   href="/signup"
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px6 p-2 rounded-lg font-medium hover:from-blue-500 hover:to-purple-700 transition-all duration-300 shadow-sm  hover:shadow-md "
//                 >
//                   Sign Up
//                 </a>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </motion.header>
//   );
// };

// export default Header;
