import { useState, useCallback, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Briefcase, Menu, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../content/AuthContext";
import PropTypes from "prop-types";
import {NAV_LINKS} from "../../utils/data"
import NavLink from "../../../components/navs/NavLink"
import MobileMenu from "../../../components/MobileMenu"




/**
 * Header Component
 * Main navigation header with authentication support and mobile menu
 * 
 * @component
 * @returns {JSX.Element} Header component
 */
const Header = () => {
  const { user, isAuthenticated } = useAuth();
  // eslint-disable-next-line no-unused-vars
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
            <div className="hidden md:flex items-center  space-x-3">
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


/**
 * Navigation component
 * 
 */
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
 * Mobile Menu component
 * 
 */
MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  userRole: PropTypes.string,
  user: PropTypes.object,
};

Header.propTypes = {
};

export default Header;