import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./context/UserContext.jsx";
import { isTokenExpired } from "./utils/token.js";

const ProtectedRoute = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return null; // Можно добавить спиннер

  // Если нет пользователя или токен истёк — редирект на главную
  if (!user || isTokenExpired(localStorage.getItem("authTokenExpiration"))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;