const router = require("express").Router();
const { z } = require("zod");

const { auth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  createBooking,
  myBookings,
  cancelBooking,
} = require("../controllers/booking.controller");

const createSchema = z.object({
  body: z.object({
    roomId: z.string().min(10),
    checkIn: z.string(),
    checkOut: z.string(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const idSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().min(10) }),
  query: z.object({}).optional(),
});

router.post("/", auth, validate(createSchema), createBooking);
router.get("/my", auth, myBookings);
router.patch("/:id/cancel", auth, validate(idSchema), cancelBooking);

module.exports = router;
