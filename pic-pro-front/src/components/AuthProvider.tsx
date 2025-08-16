"use client";

import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return <>{children}</>;
};
