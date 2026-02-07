import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function About() {
  const gallery = [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % gallery.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [gallery.length]);

  return (
    <div className="container">
      <div className="page-hero">
        <div className="card hero-panel">
          <div className="hero-kicker">About the platform</div>
          <div className="h1" style={{ marginTop: 14 }}>
            Spaces that fit your rhythm
          </div>
          <div className="small">
            Room Booking brings curated stays and workspaces into one place.
            Browse real availability, compare clear pricing, and reserve with
            confidence.
          </div>
          <div className="hero-actions">
            <Link className="btn primary" to="/rooms">
              explore rooms
            </Link>
            <Link className="btn" to="/contact">
              talk to us
            </Link>
          </div>
        </div>

        <div className="card hero-panel stack">
          <div className="section-title" style={{ marginBottom: 6 }}>
            Platform highlights
          </div>
          <div className="stat">
            <strong>98%</strong>
            <span className="small">confirmation rate within 2 minutes</span>
          </div>
          <div className="stat">
            <strong>12k+</strong>
            <span className="small">nights booked across major cities</span>
          </div>
          <div className="stat">
            <strong>4.8</strong>
            <span className="small">average host rating</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">What we optimize for</div>
        <div className="section-grid">
          <div className="card" style={{ padding: 22 }}>
            <div className="h2">Clarity first</div>
            <div className="small">
              Transparent pricing and straightforward policies. No surprises at
              checkout.
            </div>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div className="h2">Quality hosts</div>
            <div className="small">
              We prioritize owners who respond quickly and maintain reliable
              standards.
            </div>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div className="h2">Flexible stays</div>
            <div className="small">
              From a single night to extended trips, we keep the booking flow
              smooth.
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">How it works</div>
        <div className="section-grid">
          <div className="card" style={{ padding: 22 }}>
            <div className="h2">1. Discover</div>
            <div className="small">
              Use filters to narrow by city, budget, and review scores.
            </div>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div className="h2">2. Compare</div>
            <div className="small">
              Open room details to check amenities, capacity, and ratings.
            </div>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div className="h2">3. Book</div>
            <div className="small">
              Lock in your dates and manage everything from one dashboard.
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Find us</div>
        <div className="card" style={{ padding: 22 }}>
          <div className="row">
            <a
              className="icon-circle"
              href="https://t.me/dzhangazy"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M21.5 3.5L2.8 10.7c-.9.3-.9 1.6 0 1.9l4.6 1.5 1.7 5.3c.3.9 1.5 1.1 2 .3l2.6-3.6 4.9 3.6c.8.6 2 .2 2.3-.8l3.2-15.4c.2-1-.8-1.9-1.7-1.5Z"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              className="small"
              href="https://t.me/dzhangazy"
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>
            <a
              href="https://t.me/dzhangazy"
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: 8, fontWeight: 700 }}
            >
              dzhangazy
            </a>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <a
              className="icon-circle"
              href="https://www.instagram.com/dzhangazy_/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="4"
                  strokeWidth="1.6"
                />
                <circle cx="12" cy="12" r="3.5" strokeWidth="1.6" />
                <circle cx="17" cy="7" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <a
              className="small"
              href="https://www.instagram.com/dzhangazy_/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.instagram.com/dzhangazy_/"
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: 8, fontWeight: 700 }}
            >
              dzhangazy_
            </a>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Life around your stay</div>
        <div className="card" style={{ padding: 22 }}>
          <div className="carousel">
            <button
              className="btn"
              onClick={() =>
                setActiveSlide(
                  (activeSlide - 1 + gallery.length) % gallery.length,
                )
              }
            >
              ←
            </button>
            <div className="carousel-frame">
              <img
                src={gallery[activeSlide]}
                alt="Room Booking highlight"
              />
            </div>
            <button
              className="btn"
              onClick={() => setActiveSlide((activeSlide + 1) % gallery.length)}
            >
              →
            </button>
          </div>
          <div className="carousel-dots">
            {gallery.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === activeSlide ? "active" : ""}`}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
