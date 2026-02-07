import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">LuxStay</div>
          <div className="small">
            Curated rooms, seamless booking, real-time availability.
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-title">Explore</div>
          <div className="small">Rooms</div>
          <div className="small">Amenities</div>
          <div className="small">About</div>
        </div>
        <div className="footer-links">
          <div className="footer-title">Contacts</div>
          <div className="small">Support: support@luxstay.app — dzhangazy</div>
          <div className="small">Phone: +1 (415) 555-0136 — dzhangazy</div>
          <div className="small">© 2026 LuxStay</div>
        </div>
      </div>
    </footer>
  );
}
