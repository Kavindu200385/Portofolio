import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAdminAuth } from "./AdminAuthContext";

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { authenticated, loading } = useAdminAuth();

  if (loading || authenticated === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        Loading…
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
