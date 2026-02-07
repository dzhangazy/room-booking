import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (d.toString() === "Invalid Date") return "-";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const today = new Date();
  const defaultTo = today.toISOString().split("T")[0];
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - 30);
  const defaultFrom = fromDate.toISOString().split("T")[0];

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const [bookings, setBookings] = useState([]);
  const [topRooms, setTopRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [roomDraft, setRoomDraft] = useState({
    title: "",
    city: "",
    address: "",
    pricePerNight: "",
    maxGuests: "",
    amenities: "",
    images: "",
    isActive: true,
  });
  const [editingRoomId, setEditingRoomId] = useState("");
  const [bookingDraft, setBookingDraft] = useState({
    userId: "",
    roomId: "",
    checkIn: "",
    checkOut: "",
    status: "pending",
  });
  const [bookingEdits, setBookingEdits] = useState({});

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    Promise.all([
      api.adminBookings(),
      api.adminTopRooms(from, to),
      api.adminRooms(),
    ])
      .then(([bookingRes, topRes, roomRes]) => {
        if (!alive) return;
        setBookings(bookingRes.items || []);
        setTopRooms(topRes.topRooms || []);
        setRooms(roomRes.items || []);
      })
      .catch((e) => alive && setErr(e.message || "error"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [from, to]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const cancelled = bookings.filter((b) => b.status === "cancelled");
    const pending = bookings.filter((b) => b.status === "pending");
    const revenue = confirmed.reduce(
      (sum, b) => sum + Number(b.totalPrice || 0),
      0,
    );
    const users = new Set(
      bookings.map((b) => b.userId?._id || b.userId?.id || b.userId),
    );
    const rooms = new Set(
      bookings.map((b) => b.roomId?._id || b.roomId?.id || b.roomId),
    );

    return {
      total,
      confirmed: confirmed.length,
      cancelled: cancelled.length,
      pending: pending.length,
      revenue,
      users: users.size,
      rooms: rooms.size,
    };
  }, [bookings]);

  const recentBookings = bookings.slice(0, 6);

  function parseRoomPayload(draft) {
    return {
      title: draft.title.trim(),
      city: draft.city.trim(),
      address: draft.address.trim(),
      pricePerNight: Number(draft.pricePerNight),
      maxGuests: Number(draft.maxGuests),
      amenities: draft.amenities
        ? draft.amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [],
      images: draft.images
        ? draft.images
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [],
      isActive: Boolean(draft.isActive),
    };
  }

  async function handleSaveRoom(e) {
    e.preventDefault();
    try {
      const payload = parseRoomPayload(roomDraft);
      if (editingRoomId) {
        await api.adminUpdateRoom(editingRoomId, payload);
      } else {
        await api.adminCreateRoom(payload);
      }
      setRoomDraft({
        title: "",
        city: "",
        address: "",
        pricePerNight: "",
        maxGuests: "",
        amenities: "",
        images: "",
        isActive: true,
      });
      setEditingRoomId("");
      const res = await api.adminRooms();
      setRooms(res.items || []);
    } catch (e) {
      setErr(e.message || "room save failed");
    }
  }

  function handleEditRoom(room) {
    setEditingRoomId(room._id);
    setRoomDraft({
      title: room.title || "",
      city: room.city || "",
      address: room.address || "",
      pricePerNight: room.pricePerNight ?? "",
      maxGuests: room.maxGuests ?? "",
      amenities: (room.amenities || []).join(", "),
      images: (room.images || []).join(", "),
      isActive: room.isActive !== false,
    });
  }

  async function handleDeleteRoom(id) {
    if (!confirm("Deactivate this room?")) return;
    try {
      await api.adminDeleteRoom(id);
      const res = await api.adminRooms();
      setRooms(res.items || []);
    } catch (e) {
      setErr(e.message || "room delete failed");
    }
  }

  async function handleToggleRoom(room) {
    try {
      await api.adminUpdateRoom(room._id, { isActive: !room.isActive });
      const res = await api.adminRooms();
      setRooms(res.items || []);
    } catch (e) {
      setErr(e.message || "room update failed");
    }
  }

  async function handleCreateBooking(e) {
    e.preventDefault();
    try {
      await api.adminCreateBooking({
        ...bookingDraft,
      });
      setBookingDraft({
        userId: "",
        roomId: "",
        checkIn: "",
        checkOut: "",
        status: "pending",
      });
      const res = await api.adminBookings();
      setBookings(res.items || []);
    } catch (e) {
      setErr(e.message || "booking create failed");
    }
  }

  function updateBookingEdit(id, patch) {
    setBookingEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), ...patch },
    }));
  }

  async function handleSaveBooking(id) {
    const edits = bookingEdits[id] || {};
    try {
      await api.adminUpdateBooking(id, edits);
      const res = await api.adminBookings();
      setBookings(res.items || []);
      setBookingEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (e) {
      setErr(e.message || "booking update failed");
    }
  }

  async function handleDeleteBooking(id) {
    if (!confirm("Delete this booking?")) return;
    try {
      await api.adminDeleteBooking(id);
      const res = await api.adminBookings();
      setBookings(res.items || []);
    } catch (e) {
      setErr(e.message || "booking delete failed");
    }
  }

  return (
    <div className="container">
      <div className="page-hero">
        <div className="card hero-panel">
          <div className="hero-kicker">Admin Panel</div>
          <div className="h1" style={{ marginTop: 14 }}>
            Operations overview
          </div>
          <div className="small">
            Track booking activity, revenue signals, and the rooms performing
            best in the selected period.
          </div>
          <div className="hero-actions">
            <div style={{ minWidth: 200 }}>
              <div className="small" style={{ marginBottom: 6 }}>
                From
              </div>
              <input
                className="input"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div style={{ minWidth: 200 }}>
              <div className="small" style={{ marginBottom: 6 }}>
                To
              </div>
              <input
                className="input"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card hero-panel stack">
          <div className="section-title" style={{ marginBottom: 6 }}>
            Snapshot
          </div>
          <div className="stat">
            <strong>${stats.revenue.toLocaleString()}</strong>
            <span className="small">confirmed revenue</span>
          </div>
          <div className="stat">
            <strong>{stats.total}</strong>
            <span className="small">total bookings</span>
          </div>
          <div className="stat">
            <strong>{stats.users}</strong>
            <span className="small">unique guests</span>
          </div>
        </div>
      </div>

      {loading && <div className="small">loading admin analytics...</div>}
      {err && <div style={{ color: "var(--danger)" }}>{err}</div>}

      {!loading && !err && (
        <>
          <div className="section">
            <div className="section-title">Booking status</div>
            <div className="section-grid">
              <div className="card" style={{ padding: 22 }}>
                <div className="h2">Confirmed</div>
                <div className="small">{stats.confirmed} bookings</div>
              </div>
              <div className="card" style={{ padding: 22 }}>
                <div className="h2">Pending</div>
                <div className="small">{stats.pending} bookings</div>
              </div>
              <div className="card" style={{ padding: 22 }}>
                <div className="h2">Cancelled</div>
                <div className="small">{stats.cancelled} bookings</div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Top rooms</div>
            <div className="table">
              <div className="table-row header">
                <span>Room</span>
                <span>City</span>
                <span>Bookings</span>
                <span>Revenue</span>
              </div>
              {topRooms.length === 0 && (
                <div className="small" style={{ padding: "8px 4px" }}>
                  No confirmed bookings in this range.
                </div>
              )}
              {topRooms.map((room) => (
                <div className="table-row" key={room.roomId}>
                  <strong>{room.title}</strong>
                  <span className="small">{room.city}</span>
                  <span>{room.bookings}</span>
                  <span>${Number(room.revenue || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="section-title">Recent bookings</div>
            <div className="table">
              <div className="table-row header">
                <span>Guest</span>
                <span>Room</span>
                <span>Status</span>
                <span>Dates</span>
              </div>
              {recentBookings.map((b) => (
                <div className="table-row" key={b._id}>
                  <div>
                    <strong>{b.userId?.name || "Guest"}</strong>
                    <div className="small">{b.userId?.email || "-"}</div>
                  </div>
                  <span className="small">{b.roomId?.title || "Room"}</span>
                  <span style={{ textTransform: "capitalize" }}>{b.status}</span>
                  <span className="small">
                    {formatDate(b.checkIn)} - {formatDate(b.checkOut)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="section-title">Manage rooms</div>
            <div className="card" style={{ padding: 22, marginBottom: 18 }}>
              <div className="h2" style={{ marginTop: 0 }}>
                {editingRoomId ? "Edit room" : "Create room"}
              </div>
              <form className="stack" onSubmit={handleSaveRoom}>
                <div className="form-grid">
                  <input
                    className="input"
                    placeholder="Title"
                    value={roomDraft.title}
                    onChange={(e) =>
                      setRoomDraft((p) => ({ ...p, title: e.target.value }))
                    }
                    required
                  />
                  <input
                    className="input"
                    placeholder="City"
                    value={roomDraft.city}
                    onChange={(e) =>
                      setRoomDraft((p) => ({ ...p, city: e.target.value }))
                    }
                    required
                  />
                  <input
                    className="input"
                    placeholder="Address"
                    value={roomDraft.address}
                    onChange={(e) =>
                      setRoomDraft((p) => ({ ...p, address: e.target.value }))
                    }
                    required
                  />
                  <input
                    className="input"
                    type="number"
                    placeholder="Price per night"
                    value={roomDraft.pricePerNight}
                    onChange={(e) =>
                      setRoomDraft((p) => ({
                        ...p,
                        pricePerNight: e.target.value,
                      }))
                    }
                    required
                  />
                  <input
                    className="input"
                    type="number"
                    placeholder="Max guests"
                    value={roomDraft.maxGuests}
                    onChange={(e) =>
                      setRoomDraft((p) => ({
                        ...p,
                        maxGuests: e.target.value,
                      }))
                    }
                    required
                  />
                  <input
                    className="input"
                    placeholder="Amenities (comma separated)"
                    value={roomDraft.amenities}
                    onChange={(e) =>
                      setRoomDraft((p) => ({
                        ...p,
                        amenities: e.target.value,
                      }))
                    }
                  />
                </div>
                <input
                  className="input"
                  placeholder="Image URLs (comma separated)"
                  value={roomDraft.images}
                  onChange={(e) =>
                    setRoomDraft((p) => ({ ...p, images: e.target.value }))
                  }
                />
                <label className="small" style={{ display: "flex", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={roomDraft.isActive}
                    onChange={(e) =>
                      setRoomDraft((p) => ({
                        ...p,
                        isActive: e.target.checked,
                      }))
                    }
                  />
                  Active
                </label>
                <div className="hero-actions">
                  <button className="btn primary" type="submit">
                    {editingRoomId ? "Save changes" : "Create room"}
                  </button>
                  {editingRoomId && (
                    <button
                      className="btn"
                      type="button"
                      onClick={() => {
                        setEditingRoomId("");
                        setRoomDraft({
                          title: "",
                          city: "",
                          address: "",
                          pricePerNight: "",
                          maxGuests: "",
                          amenities: "",
                          images: "",
                          isActive: true,
                        });
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="table">
              <div className="table-row header">
                <span>Room</span>
                <span>City</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {rooms.map((room) => (
                <div className="table-row" key={room._id}>
                  <div>
                    <strong>{room.title}</strong>
                    <div className="small">${room.pricePerNight}/night</div>
                  </div>
                  <span className="small">{room.city}</span>
                  <span>{room.isActive ? "active" : "inactive"}</span>
                  <div className="row" style={{ justifyContent: "flex-end" }}>
                    <button className="btn" onClick={() => handleEditRoom(room)}>
                      edit
                    </button>
                    <button className="btn" onClick={() => handleToggleRoom(room)}>
                      {room.isActive ? "deactivate" : "activate"}
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => handleDeleteRoom(room._id)}
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="section-title">Manage bookings</div>
            <div className="card" style={{ padding: 22, marginBottom: 18 }}>
              <div className="h2" style={{ marginTop: 0 }}>
                Create booking
              </div>
              <form className="stack" onSubmit={handleCreateBooking}>
                <div className="form-grid">
                  <input
                    className="input"
                    placeholder="User ID"
                    value={bookingDraft.userId}
                    onChange={(e) =>
                      setBookingDraft((p) => ({ ...p, userId: e.target.value }))
                    }
                    required
                  />
                  <input
                    className="input"
                    placeholder="Room ID"
                    value={bookingDraft.roomId}
                    onChange={(e) =>
                      setBookingDraft((p) => ({ ...p, roomId: e.target.value }))
                    }
                    required
                  />
                  <input
                    className="input"
                    type="date"
                    value={bookingDraft.checkIn}
                    onChange={(e) =>
                      setBookingDraft((p) => ({ ...p, checkIn: e.target.value }))
                    }
                    required
                  />
                  <input
                    className="input"
                    type="date"
                    value={bookingDraft.checkOut}
                    onChange={(e) =>
                      setBookingDraft((p) => ({
                        ...p,
                        checkOut: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <select
                  className="select"
                  value={bookingDraft.status}
                  onChange={(e) =>
                    setBookingDraft((p) => ({ ...p, status: e.target.value }))
                  }
                >
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="cancelled">cancelled</option>
                </select>
                <button className="btn primary" type="submit">
                  Create booking
                </button>
              </form>
            </div>

            <div className="table">
              <div className="table-row header">
                <span>Guest</span>
                <span>Room</span>
                <span>Dates</span>
                <span>Actions</span>
              </div>
              {bookings.map((b) => {
                const edit = bookingEdits[b._id] || {};
                return (
                  <div className="table-row" key={b._id}>
                    <div>
                      <strong>{b.userId?.name || "Guest"}</strong>
                      <div className="small">{b.userId?.email || "-"}</div>
                    </div>
                    <div className="small">{b.roomId?.title || "Room"}</div>
                    <div className="stack">
                      <input
                        className="input"
                        type="date"
                        value={
                          edit.checkIn ||
                          new Date(b.checkIn).toISOString().split("T")[0]
                        }
                        onChange={(e) =>
                          updateBookingEdit(b._id, { checkIn: e.target.value })
                        }
                      />
                      <input
                        className="input"
                        type="date"
                        value={
                          edit.checkOut ||
                          new Date(b.checkOut).toISOString().split("T")[0]
                        }
                        onChange={(e) =>
                          updateBookingEdit(b._id, { checkOut: e.target.value })
                        }
                      />
                      <select
                        className="select"
                        value={edit.status || b.status}
                        onChange={(e) =>
                          updateBookingEdit(b._id, { status: e.target.value })
                        }
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>
                    <div className="row" style={{ justifyContent: "flex-end" }}>
                      <button className="btn" onClick={() => handleSaveBooking(b._id)}>
                        save
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => handleDeleteBooking(b._id)}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
