const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

// один отзыв от юзера на комнату
reviewSchema.index({ userId: 1, roomId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
