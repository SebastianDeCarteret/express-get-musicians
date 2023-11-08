const { Musician, Band } = require("./models/index");
const { db } = require("./db/connection");
const { seedMusician, seedBand } = require("./seedData");

const syncSeed = async () => {
  await db.sync({ force: true });
  await Promise.all(seedMusician.map((musician) => Musician.create(musician)));
  await Promise.all(seedBand.map((band) => Band.create(band)));

  let i = 3;
  while (i > 0) {
    const newBand = await Band.findByPk(i);
    const allMusicians = await Musician.findByPk(i);
    await newBand.setMusicians(allMusicians);
    i--;
  }
  // const newBand = await Band.findByPk(1);
  // const allMusicians = await Musician.findAll();
  // await newBand.setMusicians(allMusicians);
};

module.exports = { syncSeed };
