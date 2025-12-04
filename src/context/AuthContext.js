// src/context/AuthContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // App load hone par localStorage se user read karo
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("AUTH: initial user from localStorage >>>", parsed);
        setUser(parsed);
      }
    } catch (err) {
      console.error("AUTH: error reading user from localStorage", err);
    }
  }, []);

  // LoginPage / RegisterPage se yahi call hota hai
  const login = (userData) => {
    console.log("AUTH login userData >>>", userData);

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    const check = localStorage.getItem("user");
    console.log("AUTH saved in localStorage >>>", check);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);