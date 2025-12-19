import { useState, useEffect } from "react";
import { Briefcase, Building2, LogOut, X, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../content/AuthContext";
import { NAVIGATION_MENU } from "../../pages/utils/data";
const DashboardLayout = (activeMenu) => {
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
        onClick={() => onclick(items.id)}
        className={`flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-500"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <Icon
          className={`h-5 w-5 flex-shrink-0 ${
            isActive ? "text-blue-600" : "text-gray-500"
          }`}
        />
      </button>
    );
  };
  //=======Mobile Responsive Behavior===========
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
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
    <div className="flex h-screen bg-gray-50">
      {/* sideBar section*/}
      <div
        className={`fixed inset-y-8 left-0 z-50 transition-transform duration-300 transform ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } ${
          sidebarCollapse ? "w-16" : "w-64"
        } bg-white border-r border-gray-200`}
      >
        {/* Company logo */}
        <div className="flex items-center w-16 border-b border-gray-200 pl-6">
          {!sidebarCollapse ? (
            <Link className="flex items-center space-x-3" to={"/"}>
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
                <span className="text-gray-900 font-bold text-xl">Jobify</span>
              </div>
            </Link>
          ) : (
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white " />
            </div>
          )}
        </div>
        {/* ==========Navigation========= */}
        <nav className="p-4 space-y-4">
          {NAVIGATION_MENU.map((items) => {
            <NavigationItem
              key={items.id}
              item={items}
              isActive={activeNavItem === items.id}
              onClick={handleNavigation}
              isCollapsed={sidebarCollapse}
            />;
          })}
        </nav>
        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 "
            onClick={logout}
          >
            <LogOut className={`h-5 w-5 flex-shrink-0 text-gray-500`} />
            {!sidebarCollapse && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
