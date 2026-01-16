import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  userRole,
  onLogout,
}) => {
  const navigate = useNavigate();
  const handViewProfile = () => {
    navigate(userRole === "jobseeker" ? "/profile" : "/employer-profile");
  };
  return (
    <div className="relative">
      <button
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
        onClick={onToggle}
      >
        {avatar ? (
          <img
            className="h-12 w-12 object-cover rounded-full"
            src={avatar}
            alt={`profile`}
          />
        ) : (
          <div
            className="w-8 h-8 bg-gradient-to-br
           from-blue-200 to-blue-300
            rounded-full flex items-center justify-center"
          >
            <span className="text-white font-semibold text-sm">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-900">{companyName}</p>
          <p className="text-xs text-gray-500">
            {userRole === "jobseeker" ? "Job Seeker" : "Employer"}
          </p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-30">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{companyName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          <a
            className="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            onClick={handViewProfile}
          >
            View Profile
          </a>
          <div className="border-t border-gray-100 mt-2 pt-2">
            <a
              href="#"
              onClick={onLogout}
              className="block px-4 py-2 text-sm text-red-600 hover:text-red-200 transition-colors"
            >
              Leave
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfileDropdown;
