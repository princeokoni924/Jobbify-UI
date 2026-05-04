import { useState, useEffect, Children } from "react";
import { Briefcase, Building2, LogOut, X, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../content/AuthContext";
import { NAVIGATION_MENU } from "../../pages/utils/data";
import ProfileDropdown from "../layout/ProfileDropdown";
import Navbar from "../navs/Navbar";

const DashboardLayout = ({ activeMenu, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const NavigationItem = ({ items, isActive, onClick, isCollapsed }) => {
    const Icon = items.icon;
    return (
      <button
        onClick={() => onClick(items.id)}
        className={`flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-500"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <Icon
          className={`h-5 w-5 flex-shrink-0 ${
            isActive ? "text-blue-600" : "text-gray-500"
          }`}
        />
        {!isCollapsed && <span className="ml-3 truncate">{items.name}</span>}
      </button>
    );
  };
  //=======Mobile Responsive Behavior===========
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      //  setIsMobile(window.innerWidth < 768);
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //=====close dropdown when click outside============
  useEffect(() => {
    const handleClickedOut = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickedOut);
    return () => {
      document.removeEventListener("click", handleClickedOut);
    };
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarCollapse = !isMobile && false;
  return (
    <div className="flex h-screen bg-gray-200">
      {/* sideBar section*/}
      <div
        className={`fixed inset-y-8 left-0 z-50 transition-transform duration-300 transform ${
          isMobile // If the device is mobile
            ? sidebarOpen  // If sidebarOpen is true → show the sidebar
              ? "translate-x-0" // If sidebarOpen is false → hide it by sliding left
              : "-translate-x-full" // Sidebar is completely off-screen to the left
            : "translate-x-0" // Sidebar is visible
        } ${
          sidebarCollapse ? "w-16" : "w-64"  /**Sidebar is always visible and Sidebar width = 16 (collapsed) */
        } bg-white border-r border-gray-200`}
      >
        {/* Company logo */}
        <div className="flex items-center h-16 border-b border-gray-200 pl-6">
          {!sidebarCollapse ? (
            <Link className="flex items-center space-x-3" to={"/"}>
              <div className="h-8 w-8 bg-gradient-to-br from-blue-300 to-blue-400 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span
                className="text-gray-900 font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-700
              bg-clip-text text-transparent"
              >
                Jobify
              </span>
            </Link>
          ) : (
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white " />
            </div>
          )}
        </div>
        {/* ==========Navigation========= */}
        <nav className="p-4 space-y-2">
          {NAVIGATION_MENU.map((items) => (
            <NavigationItem
              key={items.id}
              items={items}
              isActive={activeNavItem === items.id}
              onClick={handleNavigation}
              isCollapsed={sidebarCollapse}
            />
          ))}
        </nav>
        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 "
            onClick={logout}
          >
            <LogOut className={`h-5 w-5 flex-shrink-0 text-gray-500`} />
            {!sidebarCollapse && <span className="ml-3 text-red-500">Logout</span>}
          </button>
        </div>
      </div>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-25 z-40 backdrop-blur-sm`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex-col flex transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarCollapse ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top Navbar */}
        <header
          className="bg-white/80 backdrop-blur-sm
         border-b border-gray-200 h-16
         flex items-center justify-between
        px-6 sticky top-0 z-40"
        >
          <div className={`flex items-center space-x-4`}>
            {isMobile && (
              <button
                className={`p-2 rounded-xl hover:bg-gradient-to-r
               hover:from-blue-100
                hover:to-blue-200 transition-colors duration-300`}
                onClick={toggleSidebar}
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button>
            )}
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                Welcome Back!
              </h1>
              <p className="text-sm sm:block hidden text-gray-500">
                Here's what's going with your Job today.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Profile Dropdown */}
            {/* <Navbar/> */}
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              avatar={user?.avatar || ""}
              companyName={user?.name || ""}
              email={user?.email || ""}
              userRole={user?.role}
              onLogout={logout}
            />
          </div>
        </header>
        {/* Main Content area */}
        <main className="overflow-auto flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
