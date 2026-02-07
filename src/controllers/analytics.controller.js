const Room = require("../models/Room");

async function roomsByCity(req, res, next) {
  try {
    const items = await Room.aggregate([
      {
        $match: {
          city: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$city",
          roomsCount: { $sum: 1 },
          avgPrice: { $avg: "$pricePerNight" },
          minPrice: { $min: "$pricePerNight" },
          maxPrice: { $max: "$pricePerNight" },
        },
      },
      { $sort: { roomsCount: -1 } },
      {
        $project: {
          _id: 0,
          city: "$_id",
          roomsCount: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
        },
      },
    ]);

    res.json({ items });
  } catch (e) {
    next(e);
  }
}

module.exports = { roomsByCity };
