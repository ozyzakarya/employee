const { Router } = require("express");
const ProjectController = require("./app/controllers/ProjectController");
const EmployeController = require("./app/controllers/EmployeController");
const AttendanceController = require("./app/controllers/AttendanceController");

const routes = Router();

routes.get("/projects", ProjectController.index);
routes.get("/projects/:id", ProjectController.show);
routes.post("/projects", ProjectController.store);
routes.put("/projects/:id", ProjectController.update);
routes.delete("/projects/:id", ProjectController.destroy);

routes.get("/employe", EmployeController.index);
routes.get("/employe/:id", EmployeController.show);
routes.post("/employe", EmployeController.store);
routes.put("/employe/:id", EmployeController.update);
routes.delete("/employe/:id", EmployeController.destroy);

routes.get("/attendance", AttendanceController.index);
routes.get("/attendance/:id", AttendanceController.show);
routes.post("/attendance", AttendanceController.store);
routes.put("/attendance/:id", AttendanceController.update);
routes.delete("/attendance/:id", AttendanceController.destroy);

module.exports = routes;
