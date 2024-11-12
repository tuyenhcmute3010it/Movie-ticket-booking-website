const express = require("express");
const route = express.Router();
const filmsController = require("../app/controllers/filmsController");

route.post("/store", filmsController.store);
route.get("/create", filmsController.create);
route.put("/:id", filmsController.update);
route.get("/:id/edit", filmsController.edit);
route.get("/:slug", filmsController.show);

module.exports = route;
