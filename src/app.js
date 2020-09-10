const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
require('dotenv').config()

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.database();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  database() {
    mongoose.connect(`${process.env.MONGO_USER}`, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
