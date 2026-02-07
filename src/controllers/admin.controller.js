const Booking = require("../models/Booking");
const Room = require("../models/Room");
const { daysBetween, isValidDateRange } = require("../utils/date");

async function listAllBookings(req, res, next) {
  try {
    const items = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("userId", "email name role")
      .populate("roomId", "title city pricePerNight");
    res.json({ items });
  } catch (e) {
    next(e);
  }
}

async function confirmBooking(req, res, next) {
  try {
    const { id } = req.validated.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { $set: { status: "confirmed" } }, // $set
      { new: true },
    );
    if (!booking) return res.status(404).json({ message: "booking not found" });

    // advanced update: $inc
    await Room.updateOne(
      { _id: booking.roomId },
      { $inc: { bookingsCount: 1 } },
    );

    res.json({ message: "confirmed", booking });
  } catch (e) {
    next(e);
  }
}

async function topRooms(req, res, next) {
  try {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    if (
      from.toString() === "Invalid Date" ||
      to.toString() === "Invalid Date"
    ) {
      return res.status(400).json({ message: "invalid from/to" });
    }

    const data = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
          checkIn: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: "$roomId",
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "_id",
          as: "room",
        },
      },
      { $unwind: "$room" },
      {
        $project: {
          _id: 0,
          roomId: "$room._id",
          title: "$room.title",
          city: "$room.city",
          pricePerNight: "$room.pricePerNight",
          bookings: 1,
          revenue: 1,
        },
      },
    ]);

    res.json({ from, to, topRooms: data });
  } catch (e) {
    next(e);
  }
}

async function listAllRooms(req, res, next) {
  try {
    const items = await Room.find().sort({ createdAt: -1 });
    res.json({ items });
  } catch (e) {
    next(e);
  }
}

async function createBookingAdmin(req, res, next) {
  try {
    const { userId, roomId, checkIn, checkOut, status } = req.validated.body;

    if (!isValidDateRange(checkIn, checkOut)) {
      return res.status(400).json({ message: "invalid date range" });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "room not found" });

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
      userId,
      roomId,
      checkIn,
      checkOut,
      status: status || "pending",
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (e) {
    next(e);
  }
}

async function updateBookingAdmin(req, res, next) {
  try {
    const { id } = req.validated.params;
    const { roomId, checkIn, checkOut, status } = req.validated.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "booking not found" });

    const nextRoomId = roomId || booking.roomId.toString();
    const nextCheckIn = checkIn || booking.checkIn;
    const nextCheckOut = checkOut || booking.checkOut;

    if (!isValidDateRange(nextCheckIn, nextCheckOut)) {
      return res.status(400).json({ message: "invalid date range" });
    }

    const room = await Room.findById(nextRoomId);
    if (!room) return res.status(404).json({ message: "room not found" });

    const overlap = await Booking.findOne({
      _id: { $ne: booking._id },
      roomId: nextRoomId,
      status: { $in: ["pending", "confirmed"] },
      checkIn: { $lt: new Date(nextCheckOut) },
      checkOut: { $gt: new Date(nextCheckIn) },
    });

    if (overlap) {
      return res
        .status(409)
        .json({ message: "room is already booked for these dates" });
    }

    const nights = daysBetween(nextCheckIn, nextCheckOut);
    const totalPrice = nights * room.pricePerNight;

    booking.roomId = nextRoomId;
    booking.checkIn = nextCheckIn;
    booking.checkOut = nextCheckOut;
    booking.totalPrice = totalPrice;
    if (status) booking.status = status;

    await booking.save();

    res.json({ message: "updated", booking });
  } catch (e) {
    next(e);
  }
}

async function deleteBookingAdmin(req, res, next) {
  try {
    const { id } = req.validated.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ message: "booking not found" });
    res.json({ message: "deleted", bookingId: id });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  listAllBookings,
  confirmBooking,
  topRooms,
  listAllRooms,
  createBookingAdmin,
  updateBookingAdmin,
  deleteBookingAdmin,
};
