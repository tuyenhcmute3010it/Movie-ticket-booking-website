const express = require("express");
const route = express.Router();
const buyticketsController = require("../app/controllers/buyticketsController");
route.get("/:slug/booking", buyticketsController.showBuyTickets);
route.post("/create-payment", buyticketsController.createPayment);
route.get("/vnpay-return", buyticketsController.vnpayReturn);


module.exports = route;
