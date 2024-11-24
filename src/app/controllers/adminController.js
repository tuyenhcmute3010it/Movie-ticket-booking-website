const { multipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");
const mongoose = require("mongoose");
const Films = require("../models/Films");
const Profile = require("../models/Auth");
const Screen = require("../models/Screen");
const Showtimes = require("../models/Showtimes");
const Screen_Showtimes = require("../models/Screen_Showtime");
const moment = require("moment"); // Đảm bảo import Moment.js
class adminController {
  //[GET] /me/stored/courses

  async createFilms(req, res, next) {
    const profile = await Profile.findById(req.session.userId);

    if (profile.role !== "admin") {
      return res.status(403).send("Access denied. Admins only.");
    }
    Films.find({}).then((films) =>
      res.render("films/createFilms", {
        films: multipleMongooseToObject(films),
        isLoggedIn: true,
      })
    );
  }
  catch(error) {
    console.error("Error fetching admin profile:", error.message);
    next(error);
  }
  storedFilms(req, res, next) {
    try {
      if (!req.files || !req.files.poster_url) {
        return res.status(400).json({ error: "Poster image is required." });
      }

      // Lấy file poster
      const posterFile = req.files.poster_url[0];
      const poster_url = "/uploads/" + posterFile.filename;

      // Lấy từng thumbnail
      const thumb_preview = [];
      [
        "thumb_preview_1",
        "thumb_preview_2",
        "thumb_preview_3",
        "thumb_preview_4",
      ].forEach((field) => {
        if (req.files[field] && req.files[field][0]) {
          thumb_preview.push("/uploads/" + req.files[field][0].filename);
        }
      });

      const formData = {
        ...req.body,
        poster_url,
        thumb_preview,
      };

      const films = new Films(formData);
      films
        .save()
        .then(() => res.redirect("/profile/admin"))
        .catch((error) => {
          console.error("Error saving films:", error);
          res.status(400).json({ error: "Fail" });
        });
    } catch (error) {
      console.error("Error processing files:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  showUpdateFilms(req, res, next) {
    Films.findById(req.params.id)
      .then((films) =>
        res.render("films/editFilms", {
          films: mongooseToObject(films),
          isLoggedIn: true,
        })
      )
      .catch(next);
  }

  updateFilms(req, res, next) {
    const {
      title,
      duration,
      description,
      release_date,
      cast,
      director,
      trailer_url,
      language,
      country,
    } = req.body;

    const updateData = {
      title,
      duration,
      description,
      release_date,
      cast,
      director,
      trailer_url,
      language,
      country,
    };

    if (req.files.poster_url) {
      updateData.poster_url = `/uploads/${req.files.poster_url[0].filename}`;
    }
    const thumb_preview = [];
    if (req.files.thumb_preview_1)
      thumb_preview.push(`/uploads/${req.files.thumb_preview_1[0].filename}`);
    if (req.files.thumb_preview_2)
      thumb_preview.push(`/uploads/${req.files.thumb_preview_2[0].filename}`);
    if (req.files.thumb_preview_3)
      thumb_preview.push(`/uploads/${req.files.thumb_preview_3[0].filename}`);
    if (req.files.thumb_preview_4)
      thumb_preview.push(`/uploads/${req.files.thumb_preview_4[0].filename}`);
    if (thumb_preview.length) {
      updateData.thumb_preview = thumb_preview;
    }

    Films.updateOne({ _id: req.params.id }, updateData)
      .then(() => res.redirect("/profile/admin"))
      .catch(next);
  }

  ///screen
  async createScreen(req, res, next) {
    const profile = await Profile.findById(req.session.userId);

    if (profile.role !== "admin") {
      return res.status(403).send("Access denied. Admins only.");
    }
    Screen.find({}).then((screens) => res.render("screen/screenCreate"));
  }
  ////
  async storeScreen(req, res, next) {
    try {
      // Log the incoming request body to inspect the data

      let { screen_number, seat_capacity, seats } = req.body;

      // Convert screen_number and seat_capacity to numbers if they are strings
      screen_number = Number(screen_number);
      seat_capacity = Number(seat_capacity);

      // Check if conversion failed
      if (isNaN(screen_number) || isNaN(seat_capacity)) {
        console.error("Invalid screen_number or seat_capacity data.");
        return res
          .status(400)
          .send("Invalid screen_number or seat_capacity data.");
      }

      // Ensure 'seats' is an array and validate each seat object
      if (!Array.isArray(seats) || seats.length === 0) {
        console.error("Invalid seat data: No valid seats found.");
        return res.status(400).send("Invalid seat data.");
      }

      // Parse each seat and ensure it's an object with valid properties
      const parsedSeats = seats
        .map((seat) => {
          try {
            // Ensure seat is a string, parse it as JSON if so
            if (typeof seat === "string") {
              seat = JSON.parse(seat); // Parse the stringified JSON to an object
            }

            // Convert seat_number and seat_price to numbers if they are strings
            seat.seat_number = Number(seat.seat_number);
            seat.seat_price = Number(seat.seat_price);

            // Validate required fields
            if (
              typeof seat.seat_number !== "number" ||
              typeof seat.seat_price !== "number" ||
              typeof seat.row !== "string" ||
              seat.seat_number <= 0 ||
              seat.seat_price <= 0 ||
              seat.row.trim() === ""
            ) {
              throw new Error("Invalid seat properties");
            }

            // Return validated seat object
            return seat;
          } catch (e) {
            console.error("Error parsing or validating seat data:", e.message);
            return null; // Return null for invalid seat data
          }
        })
        .filter((seat) => seat !== null); // Filter out invalid seats

      if (parsedSeats.length === 0) {
        console.error(
          "Invalid seat data: Some seats are missing required properties."
        );
        return res.status(400).send("Invalid seat data.");
      }

      // Add 'status' property if missing, default to false
      const updatedSeats = parsedSeats.map((seat) => {
        return {
          ...seat,
          status: seat.hasOwnProperty("status") ? seat.status : false, // Default status to false if missing
        };
      });

      // Log the validated seats data
      console.log("Validated Seats Data:", updatedSeats);

      // Create the screen object and save to the database
      const screens = new Screen({
        screen_number,
        seat_capacity,
        seats: updatedSeats, // Use the updated seats array with 'status'
      });

      // Save the screen object to the database
      await screens.save();
      res.redirect("/profile/admin");
    } catch (error) {
      console.error("Error saving screen:", error.message);
      res.status(400).json({ error: "The Screen Number Is Available" });
      next(error);
    }
  }
  async createShowtimes(req, res, next) {
    const profile = await Profile.findById(req.session.userId);

    if (profile.role !== "admin") {
      return res.status(403).send("Access denied. Admins only.");
    }
    const screens = await Screen.find({});
    Films.findById(req.params.id)
      .then((films) =>
        res.render("showtimes/createShowtimes", {
          films: mongooseToObject(films),
          screens: multipleMongooseToObject(screens),
          isLoggedIn: true,
        })
      )
      .catch(next);
  }

  async storedShowtimes(req, res, next) {
    try {
      const { filmId } = req.params; // Lấy filmId từ URL
      let { showtimesData } = req.body; // Dữ liệu showtimes từ form

      // Kiểm tra kiểu dữ liệu của showtimesData
      console.log("showtimesData:", showtimesData); // Log ra để kiểm tra cấu trúc

      // Nếu showtimesData là chuỗi JSON, chuyển nó thành mảng
      if (typeof showtimesData === "string") {
        try {
          showtimesData = JSON.parse(showtimesData); // Chuyển chuỗi JSON thành mảng nếu có thể
        } catch (error) {
          return res
            .status(400)
            .json({ error: "Invalid JSON format in showtimesData." });
        }
      }

      // Kiểm tra nếu showtimesData không phải là mảng
      if (!Array.isArray(showtimesData)) {
        return res
          .status(400)
          .json({ error: "showtimesData is not an array." });
      }

      // Lọc bỏ những showtimes không có thông tin valid (showtimes rỗng hoặc không có thời gian)
      const validShowtimesData = showtimesData.filter((dayShowtime) => {
        // Chỉ giữ lại các ngày có ít nhất 1 showtime và showtime có thời gian và ít nhất 1 màn hình
        return dayShowtime.some(
          (movie) =>
            movie.showtimes.length > 0 &&
            movie.showtimes.some(
              (showtime) => showtime.time && showtime.screens.length > 0
            )
        );
      });

      // Kiểm tra nếu validShowtimesData vẫn còn dữ liệu hợp lệ
      if (validShowtimesData.length === 0) {
        return res.status(400).json({ error: "No valid showtimes provided." });
      }

      for (let dayShowtime of validShowtimesData) {
        for (let movie of dayShowtime) {
          for (let showtime of movie.showtimes) {
            // Kiểm tra nếu showtime hợp lệ
            if (
              !showtime.time ||
              !showtime.screens ||
              showtime.screens.length === 0
            ) {
              continue; // Bỏ qua nếu showtime không hợp lệ
            }

            // Tính toán start_time và end_time từ thời gian gửi lên (showtime.time)
            const start_time = moment(showtime.time).toDate();
            const end_time = moment(start_time).add(2, "hours").toDate(); // Giả sử thời gian chiếu là 2 giờ

            // Tạo mới một showtime và lưu vào cơ sở dữ liệu
            const newShowtime = new Showtimes({
              start_time,
              end_time,
            });

            const savedShowtime = await newShowtime.save();

            // Tìm screenId từ màn hình trong dữ liệu gửi lên
            for (let screen of showtime.screens) {
              let screenId;
              if (mongoose.Types.ObjectId.isValid(screen)) {
                screenId = new mongoose.Types.ObjectId(screen);
              } else {
                screenId = parseInt(screen);
              }

              // Lưu thông tin showtime với màn hình tương ứng
              const newScreenShowtime = new Screen_Showtimes({
                screen_id: screenId,
                showtime_id: savedShowtime._id,
              });

              await newScreenShowtime.save();
            }

            // Cập nhật showtimes_id vào film
            const film = await Films.findByIdAndUpdate(
              filmId,
              { $push: { showtimes_id: savedShowtime._id } }, // Thêm showtime vào mảng showtimes_id
              { new: true } // Trả về tài liệu đã cập nhật
            );

            if (!film) {
              throw new Error(`Film with ID ${filmId} not found.`);
            }
          }
        }
      }

      // Sau khi lưu tất cả showtimes, redirect về trang admin
      res.redirect("/profile/admin");
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ error: "Failed to add showtime", details: error.message });
    }
  }
  //[DELETE] /admin/:id
  delete(req,res,next){
    Films.deleteOne({ _id: req.params.id })
      .then(()=>res.redirect('back'))
      .catch(next);
  }
}


module.exports = new adminController();
