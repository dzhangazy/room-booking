const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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

    checkIn: { type: Date, required: true, index: true },
    checkOut: { type: Date, required: true, index: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      index: true,
    },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

// “мои брони” быстро
bookingSchema.index({ userId: 1, createdAt: -1 });
// аналитика по периодам + статус
bookingSchema.index({ status: 1, checkIn: 1, roomId: 1 });

// защита от дублей: один юзер не может иметь две одинаковые брони на те же даты
bookingSchema.index(
  { userId: 1, roomId: 1, checkIn: 1, checkOut: 1 },
  { unique: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
