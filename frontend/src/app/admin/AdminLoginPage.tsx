import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useAdminAuth } from "./AdminAuthContext";

type LoginFormValues = { email: string; password: string };

export function AdminLoginPage() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "100%",
          maxWidth: "360px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 800, margin: 0 }}>
            Admin login
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "6px 0 0 0" }}>
            Sign in to manage the portfolio.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email ? (
            <span style={{ fontSize: "12px", color: "#f87171" }}>{errors.email.message}</span>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password ? (
            <span style={{ fontSize: "12px", color: "#f87171" }}>{errors.password.message}</span>
          ) : null}
        </div>

        {error ? <div style={{ fontSize: "13px", color: "#f87171" }}>{error}</div> : null}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
