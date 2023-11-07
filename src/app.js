const express = require("express");
const app = express();
const { Band, Musician } = require("../models/index");
const { db } = require("../db/connection");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());

app.get("/musicians", async (request, response) => {
  const musicians = await Musician.findAll();
  response.json(musicians).status(200);
});
app.get("/musicians/:id", async (request, response) => {
  const musician = await Musician.findByPk(request.params.id);
  if (musician === null) {
    response.status(404).send("Not found");
    return;
  }
  response.json(musician).status(200);
});

app.get("/bands", async (request, response) => {
  const bands = await Band.findAll();
  response.json(bands).status(200);
});

module.exports = app;
