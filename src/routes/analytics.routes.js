const router = require("express").Router();

const { roomsByCity } = require("../controllers/analytics.controller");

router.get("/rooms-by-city", roomsByCity);

module.exports = router;
