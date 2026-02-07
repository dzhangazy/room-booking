const Booking = require("../models/Booking");
const Room = require("../models/Room");
const { daysBetween, isValidDateRange } = require("../utils/date");

async function createBooking(req, res, next) {
  try {
    const { roomId, checkIn, checkOut } = req.validated.body;

    if (!isValidDateRange(checkIn, checkOut)) {
      return res.status(400).json({ message: "invalid date range" });
    }

    const room = await Room.findById(roomId);
    if (!room || !room.isActive)
      return res.status(404).json({ message: "room not found" });

    // проверка пересечения броней
    const overlap = await Booking.findOne({
      roomId,
      status: { $in: ["pending", "confirmed"] },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });

    if (overlap) {
      return res
        .status(409)
        .json({ message: "room is already booked for these dates" });
    }

    const nights = daysBetween(checkIn, checkOut);
    const totalPrice = nights * room.pricePerNight;

    const booking = await Booking.create({
      userId: req.user.id,
      roomId,
      checkIn,
      checkOut,
      status: "pending",
      totalPrice,
    });

    await Room.updateOne({ _id: roomId }, { $inc: { bookingsCount: 1 } });

    res.status(201).json(booking);
  } catch (e) {
    next(e);
  }
}

async function myBookings(req, res, next) {
  try {
    const items = await Booking.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("roomId", "title city pricePerNight");
    res.json({ items });
  } catch (e) {
    next(e);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const { id } = req.validated.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "booking not found" });

    const isOwner = booking.userId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "access denied" });

    if (booking.status === "cancelled")
      return res.json({ message: "already cancelled" });

    booking.status = "cancelled";
    await booking.save();
    await Room.updateOne(
      { _id: booking.roomId },
      { $inc: { bookingsCount: -1 } },
    );

    res.json({ message: "cancelled", bookingId: id });
  } catch (e) {
    next(e);
  }
}

module.exports = { createBooking, myBookings, cancelBooking };
