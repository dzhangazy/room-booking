const mongoose = require("mongoose");

const reviewPreviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    city: { type: String, required: true, index: true },
    address: { type: String, required: true },
    pricePerNight: { type: Number, required: true, min: 0, index: true },
    maxGuests: { type: Number, required: true, min: 1 },
    amenities: { type: [String], default: [] }, // embedded
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true, index: true },

    // агрегированные поля (удобно для витрины)
    avgRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    bookingsCount: { type: Number, default: 0 },

    reviewsPreview: { type: [reviewPreviewSchema], default: [] }, // embedded
  },
  { timestamps: true },
);

// compound index под фильтры/сортировку
roomSchema.index({ city: 1, pricePerNight: 1 });
roomSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Room", roomSchema);
