const router = require("express").Router();
const { z } = require("zod");

const { validate } = require("../middleware/validate");
const { createContactMessage } = require("../controllers/contact.controller");

const createSchema = z.object({
  body: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(2),
    message: z.string().min(5),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

router.post("/", validate(createSchema), createContactMessage);

module.exports = router;
