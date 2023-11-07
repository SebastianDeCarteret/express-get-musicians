// install dependencies
// const { execSync } = require("child_process");
// execSync("npm install");
// execSync("npm run seed");

const request = require("supertest");
const { db } = require("./db/connection");
const { Musician } = require("./models/index");
const app = require("./src/app");
const { seedMusician, seedBand } = require("./seedData");
const { syncSeed } = require("./seed");
const { deserialize } = require("v8");

describe("Musician API tests:", () => {
  beforeEach(async () => {
    await db.sync({ force: true });
    await db.sync({ force: true });
    await syncSeed();
  });

  describe("./musicians endpoint:", () => {
    it("should return code: 200", async () => {
      const response = await request(app).get("/musicians");
      expect(response.statusCode).toBe(200);
    });
    it("should return code: 404", async () => {
      await db.sync({ force: true });
      const response = await request(app).get("/musicians");
      expect(response.statusCode).toBe(404);
    });
    it("should return the correct values from the database compared to the seed", async () => {
      const response = await request(app).get("/musicians");
      response.body.forEach((object, index) => {
        expect(object.name).toEqual(seedMusician[index].name);
        expect(object.instrument).toEqual(seedMusician[index].instrument);
      });
    });
  });

  describe("./musicians/:id endpoint:", () => {
    it("should return code: 200", async () => {
      const response = await request(app).get("/musicians/1");
      expect(response.statusCode).toBe(200);
    });
    it("should return code: 404", async () => {
      const response = await request(app).get("/musicians/100");
      expect(response.statusCode).toBe(404);
    });
    it("should return the correct value from the database at each index compared to the seed", async () => {
      seedMusician.forEach(async (object, index) => {
        const response = await request(app).get(`/musicians/${index + 1}`);
        expect(response.body.name).toEqual(seedMusician[index].name);
        expect(response.body.instrument).toEqual(
          seedMusician[index].instrument
        );
      });
    });
  });

  describe("./bands endpoint:", () => {
    it("should return code: 200", async () => {
      const response = await request(app).get("/bands");
      expect(response.statusCode).toBe(200);
    });
    it("should return code: 404", async () => {
      await db.sync({ force: true });
      const response = await request(app).get("/bands");
      expect(response.statusCode).toBe(404);
    });
    it("should return the correct values from the database compared to the seed", async () => {
      const response = await request(app).get("/bands");
      response.body.forEach((object, index) => {
        expect(object.name).toEqual(seedBand[index].name);
        expect(object.genre).toEqual(seedBand[index].genre);
      });
    });
  });
});
