const router = require("express").Router();
const { z } = require("zod");

const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");
const { validate } = require("../middleware/validate");
const {
  listAllBookings,
  confirmBooking,
  topRooms,
  listAllRooms,
  createBookingAdmin,
  updateBookingAdmin,
  deleteBookingAdmin,
} = require("../controllers/admin.controller");

const idSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().min(10) }),
  query: z.object({}).optional(),
});

const createBookingSchema = z.object({
  body: z.object({
    userId: z.string().min(10),
    roomId: z.string().min(10),
    checkIn: z.string(),
    checkOut: z.string(),
    status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateBookingSchema = z.object({
  body: z.object({
    roomId: z.string().min(10).optional(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  }),
  params: z.object({ id: z.string().min(10) }),
  query: z.object({}).optional(),
});

router.use(auth, requireRole("admin"));

router.get("/bookings", listAllBookings);
router.post("/bookings", validate(createBookingSchema), createBookingAdmin);
router.patch("/bookings/:id/confirm", validate(idSchema), confirmBooking);
router.patch("/bookings/:id", validate(updateBookingSchema), updateBookingAdmin);
router.delete("/bookings/:id", validate(idSchema), deleteBookingAdmin);
router.get("/analytics/top-rooms", topRooms);
router.get("/rooms", listAllRooms);

module.exports = router;
