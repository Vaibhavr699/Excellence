import React, { createContext, useState, useEffect, useContext } from "react";
// Import jwt-decode as a namespace import to avoid default export issues in Vite
import * as jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Call the default export function on the namespace import
        const decoded = jwt_decode.default(token);
        setUser({ username: decoded.username, role: decoded.role });
        setToken(token);
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwt_decode.default(token);
    setUser({ username: decoded.username, role: decoded.role });
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier use in components
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
