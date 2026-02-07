const router = require("express").Router();
const { z } = require("zod");

const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");
const { validate } = require("../middleware/validate");
const {
  listRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/room.controller");

const idParams = z.object({ id: z.string().min(10) });

const createSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    city: z.string().min(2),
    address: z.string().min(3),
    pricePerNight: z.number().nonnegative(),
    maxGuests: z.number().int().min(1),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    city: z.string().min(2).optional(),
    address: z.string().min(3).optional(),
    pricePerNight: z.number().nonnegative().optional(),
    maxGuests: z.number().int().min(1).optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
  params: idParams,
  query: z.object({}).optional(),
});

const getSchema = z.object({
  body: z.object({}).optional(),
  params: idParams,
  query: z.object({}).optional(),
});

router.get("/", listRooms);
router.get("/:id", validate(getSchema), getRoom);

router.post(
  "/",
  auth,
  requireRole("admin"),
  validate(createSchema),
  createRoom,
);
router.put(
  "/:id",
  auth,
  requireRole("admin"),
  validate(updateSchema),
  updateRoom,
);
router.delete(
  "/:id",
  auth,
  requireRole("admin"),
  validate(getSchema),
  deleteRoom,
);

module.exports = router;
