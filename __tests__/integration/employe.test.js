const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Employe = require("../../src/app/models/Employe");
const app = require("../../src/app");

describe("Employe", () => {
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

  it("should be able to create a new employe", async () => {
    const response = await request(app).post("/employe").send({
      name: "Ozy",
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Ozy");
  });

  it("should be able to list all employe", async () => {
    for (let i = 1; i <= 10; i++) {
      await request(app)
        .post("/employe")
        .send({
          name: "Ozy" + i,
        });
    }

    const response = await request(app).get("/employe");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(10);
  });

  it("should be able to list 5 employe with percentage report", async () => {
    for (let i = 1; i <= 10; i++) {
      const employe = await request(app)
        .post("/employe")
        .send({
          name: "Ozy" + i,
        });

      for (let i = 1; i <= 9; i++) {
        if (i % 3 == 0) {
          await request(app).post("/attendance").send({
            employe: employe.body,
            isLate: false,
            isLeave: false,
            isAttend: true,
          });
        } else if (i % 3 == 1) {
          await request(app).post("/attendance").send({
            employe: employe.body,
            isLate: false,
            isLeave: true,
            isAttend: false,
          });
        } else {
          await request(app).post("/attendance").send({
            employe: employe.body,
            isLate: true,
            isLeave: false,
            isAttend: true,
          });
        }
      }
    }

    const response = await request(app).get("/employe?count=5");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
    for (let i = 0; i < 5; i++) {
      expect(response.body[i].name).toBe("Ozy" + (i + 1));
      expect(Math.round(response.body[i].attendPercentage)).toBe(67);
      expect(Math.round(response.body[i].latePercentage)).toBe(33);
      expect(Math.round(response.body[i].leavePercentage)).toBe(33);
    }
  });

  it("should be able to update an employe", async () => {
    const create = await request(app).post("/employe").send({
      name: "Ozy",
    });

    expect(create.status).toBe(200);
    expect(create.body.name).toBe("Ozy");

    const update = await request(app)
      .put(`/employe/${create.body["_id"]}`)
      .send({
        name: "OzyUpdate",
      });

    expect(update.status).toBe(200);
    expect(update.body.name).toBe("OzyUpdate");
  });

  it("should be able to delete an employe", async () => {
    const create = await request(app).post("/employe").send({
      name: "Ozy",
    });
    expect(create.status).toBe(200);
    expect(create.body.name).toBe("Ozy");

    const deleted = await request(app).delete(`/employe/${create.body["_id"]}`);
    expect(deleted.status).toBe(204);
  });
});
