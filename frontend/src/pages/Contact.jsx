import React, { useState } from "react";
import { api } from "../api/client";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  return (
    <div className="container">
      <div className="page-hero">
        <div className="card hero-panel">
          <div className="hero-kicker">Contact</div>
          <div className="h1" style={{ marginTop: 14 }}>
            We are here to help
          </div>
          <div className="small">
            Reach us with questions about bookings, hosting, or partnerships.
            We respond within one business day.
          </div>
        </div>
        <div className="card hero-panel stack">
          <div className="section-title" style={{ marginBottom: 6 }}>
            Support channels
          </div>
          <div className="small">Email: support@roombooking.app — dzhangazy</div>
          <div className="small">Phone: +1 (415) 555-0136 — dzhangazy</div>
          <div className="small">Hours: Mon–Fri, 9:00–18:00</div>
          <div className="chips" style={{ marginTop: 8 }}>
            <span className="chip">dzhangazy</span>
          </div>
        </div>
      </div>

      <div className="contact-grid">
        <div className="card contact-card">
          <div className="section-title">Send a message</div>
          <div className="small" style={{ marginBottom: 12 }}>
            Tag: dzhangazy
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setErr("");
              setLoading(true);
              try {
                await api.createContact({
                  ...form,
                });
                setSent(true);
                setForm({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  subject: "",
                  message: "",
                });
              } catch (e) {
                setErr(e.message || "send failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="form-grid">
              <input
                className="input"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, firstName: e.target.value }))
                }
                required
              />
              <input
                className="input"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, lastName: e.target.value }))
                }
                required
              />
              <input
                className="input"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
              <input
                className="input"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <input
                className="input"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) =>
                  setForm((p) => ({ ...p, subject: e.target.value }))
                }
                required
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <textarea
                className="input"
                placeholder="Tell us about your request"
                rows={5}
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                required
              />
            </div>
            <div className="hero-actions">
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? "sending..." : "send message"}
              </button>
              {sent && !err && (
                <span
                  className="small"
                  style={{ color: "var(--accent-bright)" }}
                >
                  Thanks! We will reach out soon.
                </span>
              )}
              {err && (
                <span className="small" style={{ color: "var(--danger)" }}>
                  {err}
                </span>
              )}
            </div>
          </form>
        </div>

        <div className="card contact-card stack" style={{ marginTop: 12 }}>
          <div className="section-title">Hosting help</div>
          <div className="small">Contact tag: dzhangazy</div>
          <div className="small">
            Want to list a property or room? We will guide you through setup,
            pricing, and verification.
          </div>
          <div className="chips" style={{ marginTop: 10 }}>
            <span className="chip">listing checklist</span>
            <span className="chip">pricing advice</span>
            <span className="chip">photo tips</span>
          </div>
          <div className="section-title" style={{ marginTop: 12 }}>
            Partnerships
          </div>
          <div className="small">
            For corporate stays or group bookings, ask about volume discounts
            and custom invoicing.
          </div>
        </div>
      </div>
    </div>
  );
}
