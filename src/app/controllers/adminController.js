const { multipleMongooseToObject } = require("../../util/mongoose");
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
    if (!req.file) {
      return res.status(400).json({ error: "Poster image is required." });
    }
    // Đường dẫn của poster sau khi upload
    const poster_url = "/uploads/" + req.file.filename;
    const formData = req.body;
    formData.poster_url = poster_url;
    const films = new Films(req.body);
    // Lưu vào MongoDB
    films
      .save()
      .then(() => res.redirect("/profile/admin"))
      .catch((error) => {
        console.error("Error saving films:", error);
        res.status(400).json({ error: "Fail" });
      });
  }
}
module.exports = new adminController();
