const request = require("supertest");
const { db } = require("./db/connection");
const { Musician, Band } = require("./models/index");
const app = require("./src/app");
const { seedMusician, seedBand } = require("./seedData");
const { syncSeed } = require("./seed");

describe("Musician API tests:", () => {
  beforeEach(async () => {
    await syncSeed();
  });

  describe("./musicians endpoint:", () => {
    it("should return code: 200", async () => {
      const response = await request(app).get("/musicians");
      expect(response.statusCode).toBe(200);
    });
    it("should return code: 200 when table has no values", async () => {
      await db.sync({ force: true });
      const response = await request(app).get("/musicians");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(0);
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

    seedMusician.forEach((_, index) =>
      it(`should return the correct value from the database for index: ${index} compared to the seed`, async () => {
        const response = await request(app).get(`/musicians/${index + 1}`);
        expect(response.body.name).toEqual(seedMusician[index].name);
        expect(response.body.instrument).toEqual(
          seedMusician[index].instrument
        );
      })
    );
  });

  describe("./bands endpoint:", () => {
    it("should return code: 200 when table has values", async () => {
      const response = await request(app).get("/bands");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(seedBand.length);
    });
    it("should return code: 200 when table has no values", async () => {
      await db.sync({ force: true });
      const response = await request(app).get("/bands");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(0);
    });
    it("should return the correct values from the database compared to the seed", async () => {
      const response = await request(app).get("/bands");
      response.body.forEach((object, index) => {
        expect(object.name).toEqual(seedBand[index].name);
        expect(object.instrument).toEqual(seedBand[index].instrument);
      });
    });
  });
});
