import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function RoomDetails() {
  const { id } = useParams();
  const { isAuthed } = useAuth();
  const nav = useNavigate();

  const [room, setRoom] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookMsg, setBookMsg] = useState("");
  const [bookLoading, setBookLoading] = useState(false);
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const fallbackImages = [
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
  ];

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    api
      .getRoom(id)
      .then((r) => alive && setRoom(r))
      .catch((e) => alive && setErr(e.message || "error"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [id]);

  async function book() {
    setBookMsg("");
    setBookLoading(true);

    try {
      if (!isAuthed) {
        setBookMsg("Please login first to book this room");
        setBookLoading(false);
        setTimeout(() => nav("/login"), 2000);
        return;
      }

      if (!checkIn || !checkOut) {
        setBookMsg("Please select check-in and check-out dates");
        setBookLoading(false);
        return;
      }

      const res = await api.createBooking({ roomId: id, checkIn, checkOut });
      setBookMsg(`Booking confirmed! ID: ${res._id}`);
      setCheckIn("");
      setCheckOut("");
    } catch (e) {
      setBookMsg(e.message || "Booking failed. Please try again.");
    } finally {
      setBookLoading(false);
    }
  }

  async function submitReview() {
    setReviewMsg("");
    setReviewLoading(true);
    try {
      if (!isAuthed) {
        setReviewMsg("Please login first to leave a review");
        setReviewLoading(false);
        setTimeout(() => nav("/login"), 2000);
        return;
      }
      if (!reviewText.trim()) {
        setReviewMsg("Please write a short review");
        setReviewLoading(false);
        return;
      }

      await api.createReview({
        roomId: id,
        rating: Number(rating),
        text: reviewText.trim(),
      });

      const refreshed = await api.getRoom(id);
      setRoom(refreshed);
      setReviewText("");
      setRating("5");
      setReviewMsg("Review submitted");
    } catch (e) {
      setReviewMsg(e.message || "Review failed. Please try again.");
    } finally {
      setReviewLoading(false);
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
          <div className="small">loading room details...</div>
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

  if (!room) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🏠</div>
          <div className="h2">Room not found</div>
          <a
            href="/rooms"
            className="btn primary"
            style={{ marginTop: 24, display: "inline-block" }}
          >
            Browse Rooms
          </a>
        </div>
      </div>
    );
  }

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
        )
      : 0;
  const totalPrice = nights > 0 ? nights * room.pricePerNight : 0;

  return (
    <div className="container">
      <button
        onClick={() => nav("/rooms")}
        className="btn"
        style={{
          marginBottom: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        ← Back to rooms
      </button>

      <div style={{ display: "grid", gap: 24 }}>
        <div className="room-gallery">
          {room.images && room.images.length > 0 ? (
            <>
              <div
                className="room-image"
                style={{ backgroundImage: `url(${room.images[0]})` }}
              />
              <div style={{ display: "grid", gap: 16 }}>
                {(room.images || []).slice(1, 3).map((img) => (
                  <div
                    className="room-image small"
                    key={img}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
                {(room.images || []).length < 2 && (
                  <div className="room-image small empty">no image</div>
                )}
              </div>
            </>
          ) : (
            <>
              <div
                className="room-image"
                style={{ backgroundImage: `url(${fallbackImages[0]})` }}
              />
              <div style={{ display: "grid", gap: 16 }}>
                {fallbackImages.slice(1).map((img) => (
                  <div
                    className="room-image small"
                    key={img}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {/* Main Info Card */}
        <div
          className="card"
          style={{
            padding: 36,
            animation: "slideInFromTop 0.5s ease-out",
          }}
        >
          <div
            className="h1"
            style={{ marginTop: 0, marginBottom: 12, fontSize: 38 }}
          >
            {room.title}
          </div>

          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              className="small"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span style={{ fontSize: 18 }}>📍</span>
              {room.city} • {room.address}
            </div>
            <div
              className="small"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span style={{ fontSize: 18 }}>👥</span>
              Max {room.maxGuests} guests
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div className="small" style={{ marginBottom: 4 }}>
                Price per night
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 32,
                  background:
                    "linear-gradient(135deg, #2dd4bf 0%, #f59e0b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ${room.pricePerNight}
              </div>
            </div>

            <div
              style={{
                padding: "12px 20px",
                background: "rgba(251, 191, 36, 0.15)",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 20 }}>⭐</span>
              <div>
                <div
                  style={{ fontWeight: 700, fontSize: 18, color: "#fbbf24" }}
                >
                  {Number(room.avgRating || 0).toFixed(1)}
                </div>
                <div className="small">{room.reviewsCount || 0} reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div
          className="card"
          style={{
            padding: 32,
            animation: "fadeInUp 0.5s ease-out 0.1s both",
          }}
        >
          <div className="h2" style={{ marginTop: 0, marginBottom: 20 }}>
            📅 Book this room
          </div>
          <div
            className="small"
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--muted)",
            }}
          >
            <span style={{ fontSize: 18 }}>🗓️</span>
            Use the built-in calendar inputs below to pick your dates.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div>
              <label
                className="small"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Check-in Date
              </label>
              <input
                className="input"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label
                className="small"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Check-out Date
              </label>
              <input
                className="input"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {nights > 0 && (
            <div
              style={{
                padding: 16,
                background: "rgba(45, 212, 191, 0.1)",
                border: "1px solid rgba(45, 212, 191, 0.3)",
                borderRadius: "var(--radius-sm)",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span className="small">Number of nights:</span>
                <span style={{ fontWeight: 600 }}>{nights}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="small">Total price:</span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 20,
                    color: "var(--accent-bright)",
                  }}
                >
                  ${totalPrice}
                </span>
              </div>
            </div>
          )}

          <button
            className="btn primary"
            onClick={book}
            disabled={bookLoading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {bookLoading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span
                  className="spinner"
                  style={{ width: 16, height: 16 }}
                ></span>
                Processing...
              </span>
            ) : (
              "Confirm Booking"
            )}
          </button>

          {bookMsg && (
            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                background:
                  bookMsg.includes("confirmed") || bookMsg.includes("created")
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                border: `1px solid ${
                  bookMsg.includes("confirmed") || bookMsg.includes("created")
                    ? "rgba(16, 185, 129, 0.3)"
                    : "rgba(239, 68, 68, 0.3)"
                }`,
                borderRadius: "var(--radius-sm)",
                color:
                  bookMsg.includes("confirmed") || bookMsg.includes("created")
                    ? "#10b981"
                    : "var(--danger)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {bookMsg}
            </div>
          )}
        </div>

        {/* Amenities Card */}
        <div
          className="card"
          style={{
            padding: 32,
            animation: "fadeInUp 0.5s ease-out 0.2s both",
          }}
        >
          <div className="h2" style={{ marginTop: 0, marginBottom: 16 }}>
            ✨ Amenities
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {(room.amenities || []).map((a) => (
              <Link
                className="badge"
                key={a}
                to={`/rooms?amenity=${encodeURIComponent(a)}`}
              >
                {a}
              </Link>
            ))}
            {(room.amenities || []).length === 0 && (
              <span className="small">No amenities listed</span>
            )}
          </div>
        </div>

        {/* Reviews Card */}
        <div
          className="card"
          style={{
            padding: 32,
            animation: "fadeInUp 0.5s ease-out 0.3s both",
          }}
        >
          <div className="h2" style={{ marginTop: 0, marginBottom: 20 }}>
            💬 Reviews
          </div>

          <div
            className="card"
            style={{
              padding: 20,
              marginBottom: 20,
              background: "var(--surface-soft)",
            }}
          >
            <div className="section-title" style={{ marginBottom: 8 }}>
              Leave a review
            </div>
            <div className="stack">
              <select
                className="select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
              <textarea
                className="input"
                rows={4}
                placeholder="Share your experience"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button
                className="btn primary"
                onClick={submitReview}
                disabled={reviewLoading}
              >
                {reviewLoading ? "Saving..." : "Submit review"}
              </button>
              {reviewMsg && (
                <div
                  className="small"
                  style={{
                    color: reviewMsg.includes("submitted")
                      ? "var(--accent-bright)"
                      : "var(--danger)",
                  }}
                >
                  {reviewMsg}
                </div>
              )}
            </div>
          </div>

          {(room.reviewsPreview || []).length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                opacity: 0.6,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
              <div className="small">
                No reviews yet. Be the first to review!
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {(room.reviewsPreview || []).map((rv, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 20,
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(45, 212, 191, 0.15)",
                    borderRadius: "var(--radius-sm)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(45, 212, 191, 0.06)";
                    e.currentTarget.style.borderColor =
                      "rgba(45, 212, 191, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.02)";
                    e.currentTarget.style.borderColor =
                      "rgba(45, 212, 191, 0.15)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {rv.userName}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        background: "rgba(251, 191, 36, 0.15)",
                        borderRadius: "999px",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fbbf24",
                      }}
                    >
                      ⭐ {rv.rating}
                    </div>
                  </div>
                  <div
                    style={{
                      color: "var(--muted)",
                      lineHeight: 1.6,
                      fontSize: 15,
                    }}
                  >
                    {rv.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
