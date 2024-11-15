const { multipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");
const mongoose = require("mongoose");
const Films = require("../models/Films");
const Profile = require("../models/Auth");
const Screen = require("../models/Screen");
class adminController {
  //[GET] /me/stored/courses
  showStoredFilms(req, res, next) {
    Films.find({})
      .then((films) =>
        res.render("profile/admin-profile", {
          films: multipleMongooseToObject(films),
        })
      )
      .catch(next);
  }

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
      const { ticket_id, review_id, showtimes_id } = req.body;

      const ticketObjectId = new mongoose.Types.ObjectId(ticket_id);
      const reviewObjectId = new mongoose.Types.ObjectId(review_id);
      const showtimesObjectId = new mongoose.Types.ObjectId(showtimes_id);
      const formData = {
        ...req.body,
        poster_url,
        thumb_preview,
        ticket_id: ticketObjectId,
        review_id: reviewObjectId,
        showtimes_id: showtimesObjectId,
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
    Films.find({}).then((films) => res.render("screen/screenCreate"));
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
      const screen = new Screen({
        screen_number,
        seat_capacity,
        seats: updatedSeats, // Use the updated seats array with 'status'
      });

      // Save the screen object to the database
      await screen.save();
      res.redirect("/admin/screen");
    } catch (error) {
      console.error("Error saving screen:", error.message);
      res.status(400).json({ error: "The Screen Number Is Available" });
      next(error);
    }
  }
}

module.exports = new adminController();
