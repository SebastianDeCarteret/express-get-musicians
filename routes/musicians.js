const express = require("express");
const router = express.Router();
const { Musician } = require("../models/index");

router.use((req, res, next) => {
  next();
});

router.get("/", async (request, response) => {
  const musicians = await Musician.findAll();
  response.json(musicians).status(200);
});
router.post("/", async (request, response) => {
  await Musician.create(request.body);
  response.status(201).send("Added new musician");
});
router.put("/:id", async (request, response) => {
  const musician = await Musician.findByPk(request.params.id);
  await musician.update(request.body);
  response
    .status(200)
    .send(`Updated musician with an id of: ${request.params.id}`);
});
router.delete("/:id", async (request, response) => {
  const musician = await Musician.findByPk(request.params.id);
  await musician.destroy(musician);
  response
    .status(200)
    .send(`Deleted musician with an id of: ${request.params.id}`);
});

router.get("/:id", async (request, response) => {
  const musician = await Musician.findByPk(request.params.id);
  if (musician === null) {
    response.status(404).send("Not found");
    return;
  }
  response.json(musician).status(200);
});

module.exports = router;
