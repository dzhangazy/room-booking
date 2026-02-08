function parseNumber(v, def) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

function buildRoomQuery(q) {
  const filter = { isActive: true };

  if (q.title) filter.title = new RegExp(String(q.title), "i");
  if (q.city) filter.city = String(q.city);
  if (q.minPrice || q.maxPrice) {
    filter.pricePerNight = {};
    if (q.minPrice) filter.pricePerNight.$gte = parseNumber(q.minPrice, 0);
    if (q.maxPrice) filter.pricePerNight.$lte = parseNumber(q.maxPrice, 1e12);
  }
  if (q.guests) filter.maxGuests = { $gte: parseNumber(q.guests, 1) };
  const amenitiesRaw = String(q.amenities || q.amenity || "");
  const amenities = amenitiesRaw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  if (amenities.length > 0) filter.amenities = { $all: amenities };

  return filter;
}

function buildSort(q) {
  const sort = {};
  const s = String(q.sort || "");
  // examples: priceAsc | priceDesc | ratingDesc | newest
  if (s === "priceAsc") sort.pricePerNight = 1;
  else if (s === "priceDesc") sort.pricePerNight = -1;
  else if (s === "ratingDesc") sort.avgRating = -1;
  else if (s === "ratingAsc") sort.avgRating = 1;
  else sort.createdAt = -1;

  return sort;
}

function buildPagination(q) {
  const page = Math.max(1, parseNumber(q.page, 1));
  const limit = Math.min(50, Math.max(1, parseNumber(q.limit, 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

module.exports = { buildRoomQuery, buildSort, buildPagination };
