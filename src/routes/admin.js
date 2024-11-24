const express = require("express");
const route = express.Router();
const adminController = require("../app/controllers/adminController");
const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file theo thời gian
    },
  }),
});

route.post(
  "/storedFilms",
  upload.fields([
    { name: "poster_url", maxCount: 1 },
    { name: "thumb_preview_1", maxCount: 1 },
    { name: "thumb_preview_2", maxCount: 1 },
    { name: "thumb_preview_3", maxCount: 1 },
    { name: "thumb_preview_4", maxCount: 1 },
  ]),
  adminController.storedFilms
);
route.put(
  "/:id",
  upload.fields([
    { name: "poster_url", maxCount: 1 },
    { name: "thumb_preview_1", maxCount: 1 },
    { name: "thumb_preview_2", maxCount: 1 },
    { name: "thumb_preview_3", maxCount: 1 },
    { name: "thumb_preview_4", maxCount: 1 },
  ]),
  adminController.updateFilms
);

route.get("/createFilms", adminController.createFilms);
route.get("/:id/UpdateFilms", adminController.showUpdateFilms);
route.get("/screen", adminController.createScreen);
route.post("/screen/stored", adminController.storeScreen);
route.get("/:id/showtimes", adminController.createShowtimes);
route.post("/:filmId/showtimes/stored", adminController.storedShowtimes);
route.delete("/:id", adminController.delete);

module.exports = route;
