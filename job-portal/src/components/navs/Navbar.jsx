import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Briefcase,
  ChevronDown,
  Heart,
  FileText
} from "lucide-react";
import PropTypes from "prop-types";
import { useAuth } from "../../content/AuthContext";
import { getInitials } from "../../pages/utils/helpler";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const userMenuRef = useRef(null);

  // Close mobile menu on route change
  const currentPath = location.pathname;
  useEffect(() => {
    return () => {
      setIsMobileMenuOpen(false);
    };
  }, [currentPath]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Close user menu on ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isUserMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const navigateToProfile = () => {
    setIsUserMenuOpen(false);
    navigate("/user-profile");
  };

  const navigateToSavedJobs = () => {
    setIsUserMenuOpen(false);
    navigate("/saved-job");
  };

  const navigateToMyApplications = () => {
    setIsUserMenuOpen(false);
    navigate("/my-applications");
  };

  const navigateToSettings = () => {
    setIsUserMenuOpen(false);
    navigate("/settings");
  };

  // Check if user is a job seeker
  const isJobSeeker = user?.role === "jobseeker" || user?.userType === "jobseeker";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">Jobify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && isJobSeeker ? (
              // Job Seeker User Menu
              <UserMenu
                user={user}
                isOpen={isUserMenuOpen}
                onToggle={toggleUserMenu}
                onProfile={navigateToProfile}
                onSavedJobs={navigateToSavedJobs}
                onApplications={navigateToMyApplications}
                onSettings={navigateToSettings}
                onLogout={handleLogout}
                menuRef={userMenuRef}
              />
            ) : user ? (
              // Other user types (employer, admin, etc.)
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Leave
                </button>
              </div>
            ) : (
              // Not logged in
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          user={user}
          isJobSeeker={isJobSeeker}
          onProfile={navigateToProfile}
          onSavedJobs={navigateToSavedJobs}
          onApplications={navigateToMyApplications}
          onSettings={navigateToSettings}
          onLogout={handleLogout}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

// Desktop User Menu Component
const UserMenu = ({ 
  user, 
  isOpen, 
  onToggle, 
  onProfile, 
  onSavedJobs, 
  onApplications,
  onSettings, 
  onLogout,
  menuRef 
}) => {
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const userAvatar = user?.avatar || user?.profilePicture;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* User Avatar */}
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={`${displayName}'s avatar`}
            className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-gray-200"
          style={{ display: userAvatar ? "none" : "flex" }}
        >
          <span className="text-white font-semibold text-sm">
            {getInitials(displayName)}
          </span>
        </div>

        {/* User Info */}
        <div className="text-left">
          <p className="font-semibold text-gray-900 text-sm max-w-[120px] truncate">
            {displayName}
          </p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>

        {/* Dropdown Icon */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-fade-in">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-900">{displayName}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={onProfile}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">View Profile</span>
            </button>

            <button
              onClick={onSavedJobs}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <Heart className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Saved Jobs</span>
            </button>

            <button
              onClick={onApplications}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium">My Applications</span>
            </button>

            <button
              onClick={onSettings}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Settings</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Leave</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onProfile: PropTypes.func.isRequired,
  onSavedJobs: PropTypes.func.isRequired,
  onApplications: PropTypes.func.isRequired,
  onSettings: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  menuRef: PropTypes.object.isRequired,
};

// Mobile Menu Component
const MobileMenu = ({ 
  user, 
  isJobSeeker, 
  onProfile, 
  onSavedJobs,
  onApplications,
  onSettings, 
  onLogout, 
  onClose 
}) => {
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const userAvatar = user?.avatar || user?.profilePicture;

  return (
    <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto">
      <div className="px-4 py-6 space-y-4">
        {user && isJobSeeker ? (
          <>
            {/* User Info */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={`${displayName}'s avatar`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  loading="lazy"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-gray-200">
                  <span className="text-white font-semibold">
                    {getInitials(displayName)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{displayName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              <button
                onClick={onProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-medium">View Profile</span>
              </button>

              <button
                onClick={onSavedJobs}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <Heart className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Saved Jobs</span>
              </button>

              <button
                onClick={onApplications}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="font-medium">My Applications</span>
              </button>

              <button
                onClick={onSettings}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Settings</span>
              </button>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </>
        ) : user ? (
          // Other user types
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-900">
                {user.name || user.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Leave
            </button>
          </div>
        ) : (
          // Not logged in
          <div className="space-y-3">
            <Link
              to="/login"
              onClick={onClose}
              className="block w-full px-4 py-3 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="block w-full px-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  user: PropTypes.object,
  isJobSeeker: PropTypes.bool.isRequired,
  onProfile: PropTypes.func.isRequired,
  onSavedJobs: PropTypes.func.isRequired,
  onApplications: PropTypes.func.isRequired,
  onSettings: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Navbar;
