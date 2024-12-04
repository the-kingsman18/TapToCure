// src/routes/ProtectedRoute.tsx
import React from "react";
import {  Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserRole } from "./roles"; // Adjust path as needed

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const userRole = useSelector((state: any) => state.user.role);

  if (!allowedRoles.includes(userRole)) {
    //if navigate to unauthorised page
    return <p>You don’t have permission to view this page.</p>;
   
  }

  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
