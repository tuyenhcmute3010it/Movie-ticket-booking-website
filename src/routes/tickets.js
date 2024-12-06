const express = require("express");
const route = express.Router();
const ticketsController = require("../app/controllers/ticketsController");
route.get("/purchasedTickets", ticketsController.showPurchasedTickets);

module.exports = route;
