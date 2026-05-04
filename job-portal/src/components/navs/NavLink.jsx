
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
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
export default NavLink;