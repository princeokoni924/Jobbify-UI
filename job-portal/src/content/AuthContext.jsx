/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

 const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be use within the Authentication provider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Fail to check Authentication", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const updateUser = (updateUserData) => {
    const newUserData = { ...user, ...updateUserData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



// import { createContext, useContext, useEffect, useState, useCallback } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPath";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

// // Helper: Decode JWT without verification (just to read payload)
// const decodeToken = (token) => {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//         .join('')
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error("Failed to decode token:", error);
//     return null;
//   }
// };

// // Helper: Check if token is expired
// const isTokenExpired = (token) => {
//   const decoded = decodeToken(token);
//   if (!decoded || !decoded.exp) return true;
  
//   // Check if token expires in the next 60 seconds (buffer time)
//   return decoded.exp * 1000 < Date.now() + 60000;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Check and refresh authentication status
//   const checkAuthStatus = useCallback(async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const userStr = localStorage.getItem("user");

//       // If no token or user data, user is not authenticated
//       if (!token || !userStr) {
//         setUser(null);
//         setIsAuthenticated(false);
//         return;
//       }

//       // Check if token is expired
//       if (isTokenExpired(token)) {
//         console.log("Access token expired, attempting refresh...");
        
//         try {
//           // Try to refresh the token using the HTTP-only cookie
//           const response = await axiosInstance.post(API_PATHS.AUTH.REFRESH);
//           const newAccessToken = response.data.data.accessToken;
          
//           // Store new token
//           localStorage.setItem("accessToken", newAccessToken);
          
//           // Token refreshed successfully, parse user data
//           const userData = JSON.parse(userStr);
//           setUser(userData);
//           setIsAuthenticated(true);
          
//           console.log("Token refreshed successfully");
//         } catch (refreshError) {
//           console.error("Token refresh failed:", refreshError);
//           // Refresh failed, logout user
//           logout();
//         }
//       } else {
//         // Token is still valid
//         const userData = JSON.parse(userStr);
//         setUser(userData);
//         setIsAuthenticated(true);
//       }
//     } catch (err) {
//       console.error("Failed to check authentication status:", err);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Run auth check on mount
//   useEffect(() => {
//     checkAuthStatus();
//   }, [checkAuthStatus]);

//   // Set up automatic token refresh (check every 5 minutes)
//   useEffect(() => {
//     if (!isAuthenticated) return;

//     const refreshInterval = setInterval(() => {
//       const token = localStorage.getItem("accessToken");
//       if (token && isTokenExpired(token)) {
//         console.log("Token expired, refreshing...");
//         checkAuthStatus();
//       }
//     }, 5 * 60 * 1000); // Check every 5 minutes

//     return () => clearInterval(refreshInterval);
//   }, [isAuthenticated, checkAuthStatus]);

//   // Login function
//   const login = useCallback((userData, token) => {
//     // Validate token before storing
//     if (!token || typeof token !== 'string') {
//       console.error("Invalid token provided to login");
//       return;
//     }

//     // Validate user data
//     if (!userData || !userData._id || !userData.role) {
//       console.error("Invalid user data provided to login");
//       return;
//     }

//     try {
//       localStorage.setItem("accessToken", token);
//       localStorage.setItem("user", JSON.stringify(userData));

//       setUser(userData);
//       setIsAuthenticated(true);

//       console.log("User logged in successfully:", {
//         userId: userData._id,
//         role: userData.role,
//       });
//     } catch (error) {
//       console.error("Failed to store auth data:", error);
//     }
//   }, []);

//   // Logout function
//   const logout = useCallback(async () => {
//     try {
//       // Call backend logout endpoint to clear refresh token cookie
//       await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
//     } catch (error) {
//       console.error("Logout API call failed:", error);
//       // Continue with local logout even if API call fails
//     } finally {
//       // Clear local storage
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("user");

//       // Clear state
//       setUser(null);
//       setIsAuthenticated(false);

//       // Redirect to home or login page
//       window.location.href = "/login";
//     }
//   }, []);

//   // Update user data
//   const updateUser = useCallback((updatedUserData) => {
//     if (!user) {
//       console.error("Cannot update user: no user logged in");
//       return;
//     }

//     try {
//       const newUserData = { ...user, ...updatedUserData };
//       localStorage.setItem("user", JSON.stringify(newUserData));
//       setUser(newUserData);

//       console.log("User data updated successfully");
//     } catch (error) {
//       console.error("Failed to update user data:", error);
//     }
//   }, [user]);

//   // Refresh token manually
//   const refreshToken = useCallback(async () => {
//     try {
//       const response = await axiosInstance.post(API_PATHS.AUTH.REFRESH);
//       const newAccessToken = response.data.data.accessToken;
      
//       localStorage.setItem("accessToken", newAccessToken);
      
//       console.log("Token refreshed manually");
//       return newAccessToken;
//     } catch (error) {
//       console.error("Manual token refresh failed:", error);
//       logout();
//       throw error;
//     }
//   }, [logout]);

//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     logout,
//     updateUser,
//     checkAuthStatus,
//     refreshToken, // Expose for manual refresh if needed
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
