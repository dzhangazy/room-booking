const Room = require("../models/Room");
const {
  buildRoomQuery,
  buildSort,
  buildPagination,
} = require("../utils/apiFeatures");

async function listRooms(req, res, next) {
  try {
    const filter = buildRoomQuery(req.query);
    const sort = buildSort(req.query);
    const { page, limit, skip } = buildPagination(req.query);

    const [items, total] = await Promise.all([
      Room.find(filter).sort(sort).skip(skip).limit(limit),
      Room.countDocuments(filter),
    ]);

    res.json({ page, limit, total, items });
  } catch (e) {
    next(e);
  }
}

async function getRoom(req, res, next) {
  try {
    const { id } = req.validated.params;
    const room = await Room.findById(id);
    if (!room || !room.isActive)
      return res.status(404).json({ message: "room not found" });
    res.json(room);
  } catch (e) {
    next(e);
  }
}

async function createRoom(req, res, next) {
  try {
    const payload = req.validated.body;
    const room = await Room.create(payload);
    res.status(201).json(room);
  } catch (e) {
    next(e);
  }
}

async function updateRoom(req, res, next) {
  try {
    const { id } = req.validated.params;
    const payload = req.validated.body;

    const room = await Room.findByIdAndUpdate(
      id,
      { $set: payload }, // advanced update ($set)
      { new: true, runValidators: true },
    );
    if (!room) return res.status(404).json({ message: "room not found" });
    res.json(room);
  } catch (e) {
    next(e);
  }
}

async function deleteRoom(req, res, next) {
  try {
    const { id } = req.validated.params;

    // soft-delete (бизнес-логика + безопаснее)
    const room = await Room.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true },
    );
    if (!room) return res.status(404).json({ message: "room not found" });
    res.json({ message: "room deactivated", roomId: id });
  } catch (e) {
    next(e);
  }
}

module.exports = { listRooms, getRoom, createRoom, updateRoom, deleteRoom };
