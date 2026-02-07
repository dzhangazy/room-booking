const router = require("express").Router();
const { z } = require("zod");

const { auth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  createReview,
  deleteReview,
} = require("../controllers/review.controller");

const createSchema = z.object({
  body: z.object({
    roomId: z.string().min(10),
    rating: z.number().min(1).max(5),
    text: z.string().min(3),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const idSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().min(10) }),
  query: z.object({}).optional(),
});

router.post("/", auth, validate(createSchema), createReview);
router.delete("/:id", auth, validate(idSchema), deleteReview);

module.exports = router;
