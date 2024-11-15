const express = require("express");
const route = express.Router();
const buyticketsController = require("../app/controllers/buyticketsController");
route.get("/:id/booking", buyticketsController.showBuyTickets);

module.exports = route;
