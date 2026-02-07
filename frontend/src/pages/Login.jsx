import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const payload =
        mode === "register" ? { email, name, password } : { email, password };

      const res =
        mode === "register"
          ? await api.register(payload)
          : await api.login(payload);

      login(res);
      nav("/rooms");
    } catch (e) {
      setErr(e.message || "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 650,
          width: "100%",
          padding: 48,
          animation: "slideInFromTop 0.6s ease-out",
        }}
      >
        <div
          className="h1"
          style={{
            fontSize: 42,
            marginTop: 0,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {mode}
        </div>

        <div
          className="small"
          style={{
            textAlign: "center",
            marginBottom: 32,
            fontSize: 15,
          }}
        >
          {mode === "login"
            ? "welcome back! sign in to continue"
            : "create a new account to get started"}
        </div>

        <div
          className="row"
          style={{
            gap: 12,
            marginBottom: 28,
            justifyContent: "center",
          }}
        >
          <button
            className={mode === "login" ? "btn primary" : "btn"}
            onClick={() => setMode("login")}
            style={{ flex: 1, maxWidth: 200 }}
          >
            login
          </button>
          <button
            className={mode === "register" ? "btn primary" : "btn"}
            onClick={() => setMode("register")}
            style={{ flex: 1, maxWidth: 200 }}
          >
            register
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
          <div>
            <label
              className="small"
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                color: "var(--muted)",
              }}
            >
              Email Address
            </label>
            <input
              className="input"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode === "register" && (
            <div
              style={{
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              <label
                className="small"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "var(--muted)",
                }}
              >
                Full Name
              </label>
              <input
                className="input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === "register"}
              />
            </div>
          )}

          <div>
            <label
              className="small"
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                color: "var(--muted)",
              }}
            >
              Password
            </label>
            <input
              className="input"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {err && (
            <div
              style={{
                color: "var(--danger)",
                padding: "12px 16px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
                animation: "shake 0.4s ease-out",
              }}
            >
              {err}
            </div>
          )}

          <button
            className="btn primary"
            disabled={loading}
            type="submit"
            style={{
              marginTop: 8,
              padding: "14px 24px",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {loading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span className="spinner"></span>
                processing...
              </span>
            ) : mode === "login" ? (
              "sign in"
            ) : (
              "create account"
            )}
          </button>
        </form>

        <div
          className="small"
          style={{
            textAlign: "center",
            marginTop: 24,
            opacity: 0.7,
          }}
        >
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMode(mode === "login" ? "register" : "login");
            }}
            style={{
              color: "var(--accent-bright)",
              fontWeight: 600,
            }}
          >
            {mode === "login" ? "Register" : "Login"}
          </a>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
