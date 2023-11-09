const express = require("express");
const router = express.Router();
const { Musician } = require("../models/index");
const { check, validationResult } = require("express-validator");

// router.use((req, res, next) => {
//   next();
// });
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (request, response) => {
  const musicians = await Musician.findAll();
  response.json(musicians).status(200);
});
router.post(
  "/",
  check(["name", "instrument"]).notEmpty(),
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.json({ error: errors.array() });
    } else {
      await Musician.create(request.body);
      response.json(await Musician.findAll());
    }
  }
);
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
