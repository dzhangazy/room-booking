import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";

export default function Rooms() {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
  ];
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [amenity, setAmenity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 9;

  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const initialAmenity = searchParams.get("amenity");
    if (initialAmenity) {
      setAmenity(initialAmenity);
      setPage(1);
    }
  }, [searchParams]);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (title) p.set("title", title);
    if (city) p.set("city", city);
    if (amenity) p.set("amenity", amenity);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (sort) p.set("sort", sort);
    p.set("page", String(page));
    p.set("limit", String(limit));
    return `?${p.toString()}`;
  }, [city, title, amenity, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    api
      .listRooms(query)
      .then((res) => {
        if (!alive) return;
        setItems(res.items || []);
        setTotal(res.total || 0);
      })
      .catch((e) => alive && setErr(e.message || "error"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [query]);

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      <div className="container">
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div className="h1" style={{ marginTop: 0 }}>
            rooms
          </div>
          <div className="small">
            find a place, open details, book dates, and manage bookings.
          </div>
        </div>

        <div className="filters">
          <input
            className="input"
            placeholder="room name (e.g. loft)"
            value={title}
            onChange={(e) => {
              setPage(1);
              setTitle(e.target.value);
            }}
          />
          <input
            className="input"
            placeholder="city (e.g. astana)"
            value={city}
            onChange={(e) => {
              setPage(1);
              setCity(e.target.value);
            }}
          />
          <input
            className="input"
            placeholder="amenity (e.g. Wi-Fi)"
            value={amenity}
            onChange={(e) => {
              setPage(1);
              setAmenity(e.target.value);
            }}
          />
          <input
            className="input"
            placeholder="min price"
            value={minPrice}
            onChange={(e) => {
              setPage(1);
              setMinPrice(e.target.value);
            }}
          />
          <input
            className="input"
            placeholder="max price"
            value={maxPrice}
            onChange={(e) => {
              setPage(1);
              setMaxPrice(e.target.value);
            }}
          />
          <select
            className="select"
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
          >
            <option value="newest">newest</option>
            <option value="priceAsc">price asc</option>
            <option value="priceDesc">price desc</option>
            <option value="ratingDesc">rating desc</option>
          </select>
        </div>

        {loading && <div className="small">loading...</div>}
        {err && <div style={{ color: "var(--danger)" }}>{err}</div>}

        <div className="grid">
          {items.map((r, idx) => (
            <div
              key={r._id}
              className="card"
              style={{
                padding: 22,
                animationDelay: `${idx * 0.1}s`,
              }}
            >
              {r.images && r.images.length > 0 ? (
                <div
                  className="room-image"
                  style={{ backgroundImage: `url(${r.images[0]})` }}
                />
              ) : (
                <div
                  className="room-image"
                  style={{
                    backgroundImage: `url(${fallbackImages[idx % fallbackImages.length]})`,
                  }}
                />
              )}
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <div className="h2" style={{ margin: 0 }}>
                    {r.title}
                  </div>
                  <div className="small">
                    {r.city} • max {r.maxGuests} guests
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 18,
                      color: "var(--accent-bright)",
                    }}
                  >
                    ${r.pricePerNight}/night
                  </div>
                  <div className="small">
                    ⭐ {Number(r.avgRating || 0).toFixed(1)} (
                    {r.reviewsCount || 0})
                  </div>
                </div>
              </div>

              <div className="hr" />

              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="row">
                  {(r.amenities || []).slice(0, 3).map((a) => (
                    <Link
                      className="badge"
                      key={a}
                      to={`/rooms?amenity=${encodeURIComponent(a)}`}
                    >
                      {a}
                    </Link>
                  ))}
                  {(r.amenities || []).length > 3 && (
                    <span className="badge">
                      +{(r.amenities || []).length - 3}
                    </span>
                  )}
                </div>
                <Link className="btn primary" to={`/rooms/${r._id}`}>
                  open
                </Link>
              </div>
            </div>
          ))}
        </div>

        {!loading && items.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--muted)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
            <div style={{ fontSize: 18, marginBottom: 8 }}>No rooms found</div>
            <div className="small">Try adjusting your filters</div>
          </div>
        )}

        <div
          className="row"
          style={{ marginTop: 24, justifyContent: "center", gap: 16 }}
        >
          <button
            className="btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← prev
          </button>
          <div
            className="small"
            style={{ padding: "0 12px", display: "flex", alignItems: "center" }}
          >
            page {page} / {pages}
          </div>
          <button
            className="btn"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            next →
          </button>
        </div>
      </div>
    </>
  );
}
