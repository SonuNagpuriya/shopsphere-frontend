import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // { _id, name, email, role }
  const [token, setToken] = useState(null); // JWT string
  const [loading, setLoading] = useState(true);

  // App load hone par localStorage se data nikaalo
  useEffect(() => {
    const savedUser = localStorage.getItem("ss_user");
    const savedToken = localStorage.getItem("ss_token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("ss_user", JSON.stringify(userData));
    localStorage.setItem("ss_token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ss_user");
    localStorage.removeItem("ss_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
