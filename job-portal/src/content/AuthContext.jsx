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
      const token = localStorage.getItem("token");
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
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
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



// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// axios.defaults.withCredentials = true; 
// axios.defaults.baseURL = "https://YOUR_API_URL"; // change this

// const AuthContext = createContext();

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // 🔵 Run on first load
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // 🔐 Verify current session from backend
//   const checkAuthStatus = async () => {
//     try {
//       const res = await axios.get("/auth/me");

//       setUser(res.data);
//       setIsAuthenticated(true);
//     } catch (err) {
//       setUser(null);
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔐 Login (backend sets cookies)
//   const login = async (email, password) => {
//     await axios.post("/auth/login", { email, password });
//     await checkAuthStatus(); // refresh state
//   };

//   // 🔐 Logout
//   const logout = async () => {
//     await axios.post("/auth/logout");
//     setUser(null);
//     setIsAuthenticated(false);
//     window.location.href = "/";
//   };

//   // ✏️ Update profile (sync UI state)
//   const updateUser = (updated) => {
//     setUser((prev) => ({ ...prev, ...updated }));
//   };

//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     logout,
//     updateUser,
//     checkAuthStatus,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };
