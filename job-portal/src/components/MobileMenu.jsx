import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import {motion} from 'framer-motion';
import { Briefcase, X } from "lucide-react";
import NavLink from "./navs/NavLink";
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
          <Link
          to="/"
          aria-label="Jobify Home"
          className="flex items-center space-x-3 group"
          >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
           <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Jobify
          </span>
          </Link>
         
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
export default MobileMenu