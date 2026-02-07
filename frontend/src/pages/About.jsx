import React from "react";
import { Link } from "react-router-dom";

export default function About() {
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
            <span className="icon-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M21.5 3.5L2.8 10.7c-.9.3-.9 1.6 0 1.9l4.6 1.5 1.7 5.3c.3.9 1.5 1.1 2 .3l2.6-3.6 4.9 3.6c.8.6 2 .2 2.3-.8l3.2-15.4c.2-1-.8-1.9-1.7-1.5Z"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="small">Telegram</span>
            <strong style={{ marginLeft: 8 }}>dzhangazy</strong>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <span className="icon-circle">
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
            </span>
            <span className="small">Instagram</span>
            <strong style={{ marginLeft: 8 }}>dzhangazy</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
