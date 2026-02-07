const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
}

async function register(req, res, next) {
  try {
    const { email, name, password } = req.validated.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "email already used" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash, role: "user" });

    const token = signToken(user._id.toString());
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.validated.body;

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) return res.status(401).json({ message: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "invalid credentials" });

    const token = signToken(user._id.toString());
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { register, login };
