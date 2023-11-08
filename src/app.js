const express = require("express");
const app = express();
const { Band, Musician } = require("../models/index");
const { db } = require("../db/connection");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());

const musiciansRouter = require("../routes/musicians");
app.use("/musicians", musiciansRouter);

const bandsRouter = require("../routes/bands");
app.use("/bands", bandsRouter);

module.exports = app;
