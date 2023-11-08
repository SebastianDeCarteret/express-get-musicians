const express = require("express");
const router = express.Router();
const { Band } = require("../models/index");

router.use((req, res, next) => {
  next();
});

router.get("/", async (request, response) => {
  const bands = await Band.findAll();
  response.json(bands).status(200);
});

module.exports = router;
