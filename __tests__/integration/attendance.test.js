const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Attendance = require("../../src/app/models/Attendance");
const app = require("../../src/app");

describe("Attendance", () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const URI = await mongoServer.getUri();

    mongoose.connect(URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async (done) => {
    mongoose.disconnect(done);
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany();
    }
  });

  it("should be able to create a attendace record", async () => {
    const employe = await request(app).post("/employe").send({
      name: "Ozy",
    });

    const response = await request(app).post("/attendance").send({
      employe: employe.body,
      isLate: true,
      isLeave: false,
      isAttend: true,
    });

    expect(response.status).toBe(200);
    expect(response.body.employe).toBe(employe.body["_id"]);
    expect(response.body.isLate).toBe(true);
    expect(response.body.isLeave).toBe(false);
    expect(response.body.isAttend).toBe(true);
  });

  it("should not able to create a attendace record", async () => {
    const employe = await request(app).post("/employe").send({
      name: "Ozy",
    });

    const response = await request(app).post("/attendance").send({
      employe: employe.body,
      isLate: true,
      isLeave: true,
      isAttend: true,
    });

    expect(response.status).toBe(400);
  });

  it("should be able to list all attendace record", async () => {
    const employe = await request(app).post("/employe").send({
      name: "Ozy",
    });

    for (let i = 1; i <= 10; i++) {
      await request(app).post("/attendance").send({
        employe: employe.body,
        isLate: false,
        isLeave: false,
        isAttend: true,
      });
    }

    const response = await request(app).get("/attendance");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(10);
  });
});
