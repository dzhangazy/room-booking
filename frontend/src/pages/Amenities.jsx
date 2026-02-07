import React from "react";

const FEATURE_GROUPS = [
  {
    title: "Comfort essentials",
    items: ["Premium bedding", "Climate control", "Blackout curtains", "Quiet zones"],
  },
  {
    title: "Work-ready",
    items: ["High-speed Wi-Fi", "Dedicated desk", "Ergonomic chair", "Monitor ready"],
  },
  {
    title: "Kitchen & dining",
    items: ["Full kitchen", "Coffee setup", "Filtered water", "Dining table"],
  },
  {
    title: "Wellness",
    items: ["Gym access", "Yoga corner", "Outdoor terrace", "Air purification"],
  },
  {
    title: "Family friendly",
    items: ["Crib available", "Extra storage", "Washer/dryer", "Safe locks"],
  },
  {
    title: "Arrivals",
    items: ["Self check-in", "Flexible time", "Smart lock", "24/7 support"],
  },
];

export default function Amenities() {
  return (
    <div className="container">
      <div className="page-hero">
        <div className="card hero-panel">
          <div className="hero-kicker">Amenities</div>
          <div className="h1" style={{ marginTop: 14 }}>
            Built for focus, rest, and reset
          </div>
          <div className="small">
            Every listing is tagged with details that matter. Filter by what you
            need and find a space that fits your routine.
          </div>
        </div>
        <div className="card hero-panel">
          <div className="section-title" style={{ marginBottom: 10 }}>
            Most requested
          </div>
          <div className="chips">
            <span className="chip">fast Wi-Fi</span>
            <span className="chip">workspace</span>
            <span className="chip">late check-in</span>
            <span className="chip">air conditioning</span>
            <span className="chip">laundry</span>
            <span className="chip">pet friendly</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Amenity categories</div>
        <div className="section-grid">
          {FEATURE_GROUPS.map((group) => (
            <div className="card" style={{ padding: 22 }} key={group.title}>
              <div className="h2">{group.title}</div>
              <div className="stack">
                {group.items.map((item) => (
                  <span className="small" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
