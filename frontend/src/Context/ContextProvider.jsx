import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";

const AuthContext = createContext(null);

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (user) => {
    setUser(user);
  };

  const logout = async () => {
    localStorage.removeItem("token");  // Remove token from localStorage
    setUser(null);  // Clear user state
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setUser(res.data.user);  // Set the user if the token is valid
        } else {
          setUser(null);  // Clear user if the token is invalid
        }
      } catch (error) {
        console.error(error);  // Handle any errors while verifying the user
      }
    };
    verifyUser();
  }, []); // Empty dependency array means this only runs once on component mount

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default ContextProvider;
