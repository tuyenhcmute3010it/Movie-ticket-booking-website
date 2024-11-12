const Auth = require("../models/Auth");
const Profile = require("../models/Auth");
const Films = require("../models/Films");
const { mongooseToObject } = require("../../util/mongoose");
const { multipleMongooseToObject } = require("../../util/mongoose");
class AuthController {
  //[GET] /me/films/courses
  signIn(req, res, next) {
    res.render("auth/sign-in", { hideHeaderFooter: true });
  }
  signUp(req, res, next) {
    res.render("auth/sign-up", { hideHeaderFooter: true });
  }
  //[Post]
  store(req, res, next) {
    const auth = new Auth(req.body);
    auth
      .save()
      .then(() => res.redirect("/sign-in"))
      .catch((error) => {
        console.error("Error saving user:", error);
        res.status(400).json({ error: "The Email Is Available" });
      });
  }
  ////////////////
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Kiểm tra xem email và password có được cung cấp không
      if (!email || !password) {
        throw new Error("Email hoặc mật khẩu không được để trống");
      }
      const user = await Auth.findOne({ email });

      if (!user) {
        return res.status(404).send("User not found");
      }
      if (user.password === password) {
        req.session.userId = user._id;
        const profile = await Profile.findById(req.session.userId);
        if (!profile.name && profile.email) {
          profile.name = profile.email.split("@")[0];
        }
        if (!profile) {
          return res.status(404).send("Profile not found");
        }
        Films.find({})
          .then((films) => {
            res.render("home", {
              isLoggedIn: true,
              films: multipleMongooseToObject(films),
              profile: mongooseToObject(profile),
            });
          })
          .catch(next);
      } else {
        return res.status(400).send("Incorrect password");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      res.redirect("/sign-in");
    }
  }
  async index(req, res, next) {
    const profile = await Profile.findById(req.session.userId);
    if (!profile.name && profile.email) {
      profile.name = profile.email.split("@")[0];
    }
    if (!profile) {
      return res.status(404).send("Profile not found");
    }
    Films.find({})
      .then((films) => {
        res.render("home", {
          isLoggedIn: true,
          films: multipleMongooseToObject(films),
          profile: mongooseToObject(profile),
        });
      })
      .catch(next);
  }
}
module.exports = new AuthController();
