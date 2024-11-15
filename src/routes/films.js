const express = require("express");
const route = express.Router();
const filmsController = require("../app/controllers/filmsController");

route.get("/:slug", filmsController.show);

module.exports = route;
