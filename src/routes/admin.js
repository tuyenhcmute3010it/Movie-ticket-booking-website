const express = require("express");
const route = express.Router();
const adminController = require("../app/controllers/adminController");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file theo thời gian
  },
});
const upload = multer({ storage: storage });

route.get("/createFilms", adminController.createFilms);
route.post(
  "/storedFilms",
  upload.single("poster_url"),
  adminController.storedFilms
);

module.exports = route;
