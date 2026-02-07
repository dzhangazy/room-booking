const ContactMessage = require("../models/ContactMessage");

async function createContactMessage(req, res, next) {
  try {
    const { firstName, lastName, email, phone, subject, message } =
      req.validated.body;

    const doc = await ContactMessage.create({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({ message: "saved", id: doc._id });
  } catch (e) {
    next(e);
  }
}

module.exports = { createContactMessage };
