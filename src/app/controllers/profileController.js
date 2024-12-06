const Profile = require("../models/Auth");
const Films = require("../models/Films");
const Screen = require("../models/Screen");
const { mongooseToObject } = require("../../util/mongoose");
const { multipleMongooseToObject } = require("../../util/mongoose");
// [GET]
class ProfileController {
  // [GET] /profile
  async index(req, res, next) {
    try {
      if (!req.session.userId) {
        return res.redirect("/sign-in");
      }
      const profile = await Profile.findById(req.session.userId);

      if (!profile.name && profile.email) {
        profile.name = profile.email.split("@")[0];
      }
      if (!profile) {
        return res.status(404).send("Profile not found");
      }

      res.render("profile/home-profile", {
        profile: mongooseToObject(profile),
        isLoggedIn: true,
      });
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      next(error);
    }
  }

  async edit(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/sign-in");
    }
    const profile = await Profile.findById(req.session.userId);

    if (!profile.name && profile.email) {
      profile.name = profile.email.split("@")[0];
    }
    if (!profile) {
      return res.status(404).send("Profile not found");
    }

    res.render("profile/edit-profile", {
      isLoggedIn: true,
      profile: mongooseToObject(profile),
    });
  }
  update(req, res, next) {
    const { name, email, phone, password } = req.body;
    Profile.updateOne(
      { _id: req.session.userId },
      { name, email, phone, password }
    )
      .then(() => res.redirect("/profile"))
      .catch(next);
  }
  ////////////////////////////
  async adminProfile(req, res, next) {
    try {
      if (!req.session.userId) {
        return res.redirect("/sign-in"); // Redirect to sign-in if not logged in
      }

      const profile = await Profile.findById(req.session.userId);
      const screens = await Screen.find({});
      if (profile.role !== "admin") {
        return res.status(403).send("Access denied. Admins only."); // Forbidden access if not an admin
      }
      Films.find({}).then((films) =>
        res.render("profile/admin-profile", {
          films: multipleMongooseToObject(films),
          profile: mongooseToObject(profile), // Pass the profile to the view
          screens: multipleMongooseToObject(screens),
          isLoggedIn: true,
        })
      );
    } catch (error) {
      console.error("Error fetching admin profile:", error.message);
      next(error);
    }
  }
}
module.exports = new ProfileController();
