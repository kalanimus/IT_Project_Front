import React, { createContext, useContext, useState, useEffect } from "react";
import { getMe, MyApi } from "../api.ts";

const initialUser = {
  id: null,
  fullName: "",
  username: "",
  balance: 0,
  rating: 0,
  activityRate: 0,
  email: "",
  roleId: null,
  roleName: "",
};

const UserContext = createContext({
  user: initialUser,
  setUser: () => {},
  login: () => {},
  logout: () => {},
  isLoading: false,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      MyApi.setAuthToken(token);
      getMe()
        .then((userData) => {
          setUser(userData);
          setIsLoading(false);
        })
        .catch(() => {
          setUser(initialUser);
          setIsLoading(false);
          localStorage.removeItem("authToken");
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token.token);
    localStorage.setItem("authTokenExpiration", token.expiration);
    console.log("UserContext: login", token);
    MyApi.setAuthToken(token.token);
    setIsLoading(true);
    getMe()
      .then((userData) => {
        setUser(userData);
        setIsLoading(false);
      })
      .catch(() => {
        setUser(initialUser);
        setIsLoading(false);
        localStorage.removeItem("authToken");
      });
  };

  const logout = () => {
    setUser(initialUser);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenExpiration");
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (e) {
      setUser(null);
    }
    setIsLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, refreshUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);