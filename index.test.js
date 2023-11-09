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
    it("GET should return code: 200", async () => {
      const response = await request(app).get("/musicians");
      expect(response.statusCode).toBe(200);
    });
    it("GET should return code: 200 when table has no values", async () => {
      await db.sync({ force: true });
      const response = await request(app).get("/musicians");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(0);
    });
    it("GET should return the correct values from the database compared to the seed", async () => {
      const response = await request(app).get("/musicians");
      response.body.forEach((object, index) => {
        expect(object.name).toEqual(seedMusician[index].name);
        expect(object.instrument).toEqual(seedMusician[index].instrument);
      });
    });
    it("POST should add a new resturant when keys are less than 2 char or more than 20 char", async () => {
      const sendData = { name: "Japanese", instrument: "Bristol" };
      const response = await request(app).post("/musicians").send(sendData);
      const restaruantFound = await Musician.findByPk(4);
      expect(restaruantFound.name).toEqual(sendData.name);
      expect(restaruantFound.instrument).toEqual(sendData.instrument);
      expect(response.body.error).toBe(undefined);
    });
    it("POST should return error when keys are less than 2 char or more than 20 char", async () => {
      const sentData = { name: "", instrument: "" };
      const response = await request(app).post("/musicians").send(sentData);
      response.body.error.forEach((error, index) => {
        const errorMessageCurrent = {
          location: "body",
          path: Object.keys(sentData)[index], // get the key name at the index of loop
          msg: "Invalid value",
          type: "field",
          value: "",
        };
        expect(error).toEqual(errorMessageCurrent);
      });
    });
  });

  describe("./musicians/:id endpoint:", () => {
    it("GET should return code: 200", async () => {
      const response = await request(app).get("/musicians/1");
      expect(response.statusCode).toBe(200);
    });
    it("GET should return code: 404", async () => {
      const response = await request(app).get("/musicians/100");
      expect(response.statusCode).toBe(404);
    });

    seedMusician.forEach((_, index) =>
      it(`GET should return the correct value from the database for index: ${index} compared to the seed`, async () => {
        const response = await request(app).get(`/musicians/${index + 1}`);
        expect(response.body.name).toEqual(seedMusician[index].name);
        expect(response.body.instrument).toEqual(
          seedMusician[index].instrument
        );
      })
    );
    it("PUT should return code: 200 if the data input is more than 2 char and less that 20 char", async () => {
      const sentData = { name: "Jon Bon Jovi", instrument: "Guitar" };
      const response = await request(app).put("/musicians/1").send(sentData);
      expect(response.body.error).toBe(undefined);
      expect(response.statusCode).toBe(200);
    });
    it("PUT should return error if the data input is less than 2 char", async () => {
      const sentData = { name: "J", instrument: "G" };
      const response = await request(app).put("/musicians/1").send(sentData);
      response.body.error.forEach((error, index) => {
        expect(error.path).toBe(Object.keys(sentData)[index]);
        expect(error.value).toBe(Object.values(sentData)[index]);
      });
      //expect(response.body.error).toBe(undefined);
      expect(response.statusCode).toBe(200);
    });
    it("PUT should return error if the data input is more than 20 char", async () => {
      const sentData = {
        name: "superfragalisticexpialidocious",
        instrument: "superfragalisticexpialidocious",
      };
      const response = await request(app).put("/musicians/1").send(sentData);
      response.body.error.forEach((error, index) => {
        expect(error.path).toBe(Object.keys(sentData)[index]);
        expect(error.value).toBe(Object.values(sentData)[index]);
      });
      //expect(response.body.error).toBe(undefined);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("./bands endpoint:", () => {
    it("GET should return code: 200 when table has values", async () => {
      const response = await request(app).get("/bands");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(seedBand.length);
    });
    it("GET should return code: 200 when table has no values", async () => {
      await db.sync({ force: true });
      const response = await request(app).get("/bands");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(0);
    });
    it("GET should return the correct values from the database compared to the seed", async () => {
      const response = await request(app).get("/bands");
      response.body.forEach((object, index) => {
        expect(object.name).toEqual(seedBand[index].name);
        expect(object.instrument).toEqual(seedBand[index].instrument);
      });
    });
  });
});
