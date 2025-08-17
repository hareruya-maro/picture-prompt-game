"use client";

import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />; // Or a proper loading spinner
  }

  return <>{children}</>;
};
