function daysBetween(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);

  const ms = b.getTime() - a.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return days;
}

function isValidDateRange(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  return (
    a.toString() !== "Invalid Date" && b.toString() !== "Invalid Date" && a < b
  );
}

module.exports = { daysBetween, isValidDateRange };
