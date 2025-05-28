import React, { createContext, useContext, useState } from "react";

// Определяем структуру пользователя
const defaultUser = {
  fullName: "",
  username: "",
  balance: 0,
  rating: 0,
  activityrating: 0,
  email: "",
  token: "",
  role: "",
};

const UserContext = createContext({
  user: defaultUser,
  setUser: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);

  const logout = () => setUser(defaultUser);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);