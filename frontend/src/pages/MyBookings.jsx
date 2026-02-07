import React, { useEffect, useState } from "react";
import { api } from "../api/client";

export default function MyBookings() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.myBookings();
      setItems(res.items || []);
    } catch (e) {
      setErr(e.message || "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function cancel(id) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await api.cancelBooking(id);
      await load();
    } catch (e) {
      alert(e.message || "cancel error");
    }
  }

  if (loading) {
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
        <div style={{ textAlign: "center" }}>
          <div
            className="spinner"
            style={{
              width: 48,
              height: 48,
              border: "4px solid rgba(45, 212, 191, 0.2)",
              borderTopColor: "var(--accent-bright)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <div className="small">loading your bookings...</div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container">
        <div
          className="card"
          style={{
            padding: 24,
            background: "rgba(239, 68, 68, 0.1)",
            borderColor: "rgba(239, 68, 68, 0.3)",
          }}
        >
          <div style={{ color: "var(--danger)", fontSize: 16 }}>{err}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        className="card"
        style={{
          padding: 28,
          marginBottom: 24,
          animation: "slideInFromTop 0.5s ease-out",
        }}
      >
        <div className="h1" style={{ marginTop: 0, marginBottom: 8 }}>
          my bookings
        </div>
        <div className="small">
          manage your room reservations and view booking history
        </div>
      </div>

      {items.length === 0 && (
        <div
          className="card"
          style={{
            padding: 60,
            textAlign: "center",
            animation: "fadeIn 0.6s ease-out",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>📅</div>
          <div className="h2" style={{ marginBottom: 8 }}>
            No bookings yet
          </div>
          <div className="small">When you book a room, it will appear here</div>
          <a
            href="/rooms"
            className="btn primary"
            style={{
              marginTop: 24,
              display: "inline-block",
            }}
          >
            Browse Rooms
          </a>
        </div>
      )}

      <div style={{ display: "grid", gap: 20 }}>
        {items.map((b, idx) => {
          const statusColors = {
            confirmed: {
              bg: "rgba(16, 185, 129, 0.15)",
              border: "rgba(16, 185, 129, 0.4)",
              text: "#10b981",
            },
            cancelled: {
              bg: "rgba(239, 68, 68, 0.15)",
              border: "rgba(239, 68, 68, 0.4)",
              text: "#ef4444",
            },
            pending: {
              bg: "rgba(251, 191, 36, 0.15)",
              border: "rgba(251, 191, 36, 0.4)",
              text: "#fbbf24",
            },
          };

          const statusStyle = statusColors[b.status] || statusColors.pending;

          return (
            <div
              key={b._id}
              className="card"
              style={{
                padding: 24,
                animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 250 }}>
                  <div className="h2" style={{ margin: "0 0 8px 0" }}>
                    {b.roomId?.title || "Room"}
                  </div>

                  <div className="small" style={{ marginBottom: 12 }}>
                    📍 {b.roomId?.city || "Unknown location"}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div className="small" style={{ marginBottom: 4 }}>
                        Check-in
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>
                        {new Date(b.checkIn).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        opacity: 0.5,
                      }}
                    >
                      →
                    </div>

                    <div>
                      <div className="small" style={{ marginBottom: 4 }}>
                        Check-out
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>
                        {new Date(b.checkOut).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 14px",
                      background: statusStyle.bg,
                      border: `1px solid ${statusStyle.border}`,
                      borderRadius: "999px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: statusStyle.text,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {b.status}
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "right",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    minWidth: 150,
                  }}
                >
                  <div>
                    <div className="small" style={{ marginBottom: 4 }}>
                      Total Price
                    </div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 28,
                        background:
                          "linear-gradient(135deg, #2dd4bf 0%, #f59e0b 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      ${b.totalPrice}
                    </div>
                  </div>

                  <button
                    className="btn danger"
                    disabled={b.status === "cancelled"}
                    onClick={() => cancel(b._id)}
                    style={{
                      marginTop: 12,
                      opacity: b.status === "cancelled" ? 0.5 : 1,
                    }}
                  >
                    {b.status === "cancelled" ? "Cancelled" : "Cancel Booking"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
