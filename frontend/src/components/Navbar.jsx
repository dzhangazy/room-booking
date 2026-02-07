import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { isAuthed, user, logout } = useAuth();
  const nav = useNavigate();
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="nav">
      <div className="nav-inner">
        <Link to="/rooms" className="brand">
          LuxStay
        </Link>

        <div className="spacer" />

        <div className="nav-sections">
          <span className="small">Sections:</span>
          <a className="muted" href="/rooms">
            rooms
          </a>
          <a className="muted" href="/amenities">
            amenities
          </a>
          <a className="muted" href="/about">
            about
          </a>
          <a className="muted" href="/contact">
            contact
          </a>
        </div>

        <div className="nav-auth">
          {isAuthed ? (
            <>
              {user?.role === "admin" && (
                <Link to="/admin" className="muted">
                  admin
                </Link>
              )}
              <Link to="/my-bookings" className="muted">
                my bookings
              </Link>
              <span
                className="small"
                style={{
                  padding: "8px 14px",
                  background: "rgba(45, 212, 191, 0.1)",
                  borderRadius: "10px",
                  border: "1px solid rgba(45, 212, 191, 0.25)",
                }}
              >
                {user?.email}
                {user?.role === "admin" && (
                  <span style={{ marginLeft: 8, color: "var(--accent2)" }}>
                    admin
                  </span>
                )}
              </span>
              <button
                className="btn"
                onClick={() => {
                  logout();
                  nav("/login");
                }}
              >
                logout
              </button>
            </>
          ) : (
            <Link className="btn primary" to="/login">
              login
            </Link>
          )}
        </div>

        <button
          className="theme-toggle"
          onClick={() =>
            setTheme((prev) => (prev === "dark" ? "light" : "dark"))
          }
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2M12 19v2M4.5 6.5l1.5 1.5M18 18l1.5 1.5M3 12h2M19 12h2M6.5 19.5l1.5-1.5M18 6l1.5-1.5"
              />
              <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12.8A8.5 8.5 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8Z"
              />
            </svg>
          )}
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        <button
          className="burger"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav-menu ${open ? "open" : ""}`}>
        <Link to="/rooms" className="muted" onClick={() => setOpen(false)}>
          rooms
        </Link>
        <Link to="/amenities" className="muted" onClick={() => setOpen(false)}>
          amenities
        </Link>
        <Link to="/about" className="muted" onClick={() => setOpen(false)}>
          about
        </Link>
        <Link to="/contact" className="muted" onClick={() => setOpen(false)}>
          contact
        </Link>

        {isAuthed ? (
          <>
            {user?.role === "admin" && (
              <Link to="/admin" className="muted" onClick={() => setOpen(false)}>
                admin
              </Link>
            )}
            <Link
              to="/my-bookings"
              className="muted"
              onClick={() => setOpen(false)}
            >
              my bookings
            </Link>
            <span
              className="small"
              style={{
                padding: "8px 14px",
                background: "rgba(45, 212, 191, 0.1)",
                borderRadius: "10px",
                border: "1px solid rgba(45, 212, 191, 0.25)",
              }}
            >
              {user?.email}
              {user?.role === "admin" && (
                <span style={{ marginLeft: 8, color: "var(--accent2)" }}>
                  admin
                </span>
              )}
            </span>
            <button
              className="btn"
              onClick={() => {
                logout();
                nav("/login");
                setOpen(false);
              }}
            >
              logout
            </button>
          </>
        ) : (
          <Link className="btn primary" to="/login" onClick={() => setOpen(false)}>
            login
          </Link>
        )}
      </div>
    </div>
  );
}
