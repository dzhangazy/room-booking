const Review = require("../models/Review");
const Room = require("../models/Room");

async function recomputeRoomRating(roomId) {
  const stats = await Review.aggregate([
    { $match: { roomId } },
    {
      $group: {
        _id: "$roomId",
        avgRating: { $avg: "$rating" },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);

  const s = stats[0] || { avgRating: 0, reviewsCount: 0 };
  await Room.updateOne(
    { _id: roomId },
    {
      $set: {
        avgRating: Number(s.avgRating || 0),
        reviewsCount: s.reviewsCount || 0,
      },
    },
  );
}

async function createReview(req, res, next) {
  try {
    const { roomId, rating, text } = req.validated.body;

    const room = await Room.findById(roomId);
    if (!room || !room.isActive)
      return res.status(404).json({ message: "room not found" });

    const review = await Review.create({
      userId: req.user.id,
      roomId,
      rating,
      text,
    });

    // advanced update: $push + $slice (храним последние 5)
    await Room.updateOne(
      { _id: roomId },
      {
        $push: {
          reviewsPreview: {
            $each: [
              {
                userId: req.user.id,
                userName: req.user.name,
                rating,
                text,
                createdAt: new Date(),
              },
            ],
            $slice: -5,
          },
        },
      },
    );

    await recomputeRoomRating(room._id);

    res.status(201).json(review);
  } catch (e) {
    // unique index (один отзыв на комнату)
    if (e?.code === 11000)
      return res
        .status(409)
        .json({ message: "review already exists for this room" });
    next(e);
  }
}

async function deleteReview(req, res, next) {
  try {
    const { id } = req.validated.params;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "review not found" });

    const isOwner = review.userId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "access denied" });

    await Review.deleteOne({ _id: id });

    // advanced update: $pull (убираем из embedded previews)
    await Room.updateOne(
      { _id: review.roomId },
      { $pull: { reviewsPreview: { userId: review.userId } } },
    );

    await recomputeRoomRating(review.roomId);

    res.json({ message: "deleted", reviewId: id });
  } catch (e) {
    next(e);
  }
}

module.exports = { createReview, deleteReview };
