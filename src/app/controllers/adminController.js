const { multipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");
const Films = require("../models/Films");
const Profile = require("../models/Auth");
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

      const formData = {
        ...req.body,
        poster_url,
        thumb_preview, // Mảng chứa đường dẫn 4 thumbnail
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
}

module.exports = new adminController();
