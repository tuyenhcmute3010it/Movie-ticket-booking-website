const Auth = require("../models/Auth");
const Profile = require("../models/Auth");
const Films = require("../models/Films");
const { mongooseToObject } = require("../../util/mongoose");
const { multipleMongooseToObject } = require("../../util/mongoose");
const sendEmailService = require("../../service/emailService"); // Import file dịch vụ gửi email
const sendPassword = require("../../service/sendPassword"); // Import file dịch vụ gửi email
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
      return res.json(response);
    } catch (error) {
      console.error("Error logging in:", error.message);
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
  forgotPassword(req, res, next) {
    res.render("auth/fogot-password", { hideHeaderFooter: true });
  }

  async forgotPasswordEmailed(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: "error",
          message: "Email is required",
        });
      }

      const user = await Auth.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Email not found in the database",
        });
      }

      const otp = await sendEmailService(email); // Gửi OTP qua email
      req.session.otp = otp.otp; // Lưu OTP vào session
      req.session.email = email; // Lưu email vào session
      req.session.attempts = 0; // Đặt số lần thử về 0
      req.session.otpTime = Date.now(); // Lưu thời gian gửi OTP vào session

      // Chuyển hướng đến trang nhập OTP
      return res.redirect("/forgot-password-emailed"); // Đường dẫn đến trang nhập OTP
    } catch (error) {
      console.error("Error in forgotPasswordEmailed:", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while sending OTP",
      });
    }
  }

  Convert(req, res, next) {
    res.render("auth/fogot-password-emailed");
  }

  async sendGmail(req, res, next) {
    try {
      const { otp } = req.body;

      // Kiểm tra OTP có được gửi trong body không
      if (!otp) {
        return res.status(400).json({
          status: "error",
          message: "OTP is required",
        });
      }

      // Lấy các giá trị từ session
      const sessionOtp = req.session.otp;
      const email = req.session.email;
      let attempts = req.session.attempts || 0; // Nếu attempts không tồn tại, gán mặc định là 0
      const otpTime = req.session.otpTime;

      // Kiểm tra số lần thử
      if (attempts >= 5) {
        return res.status(403).json({
          status: "error",
          message: "Too many incorrect attempts. Please try again later.",
        });
      }

      // Kiểm tra xem OTP có hết hạn không (5 phút)
      const currentTime = Date.now();
      const otpExpiryTime = 5 * 60 * 1000; // 5 phút tính bằng mili giây
      if (!otpTime || currentTime - otpTime > otpExpiryTime) {
        return res.status(400).json({
          status: "error",
          message: "OTP has expired. Please request a new OTP.",
        });
      }

      // Kiểm tra OTP
      if (otp === String(sessionOtp)) {
        // OTP chính xác, gửi mật khẩu cho người dùng qua email
        const user = await Auth.findOne({ email });
        if (!user) {
          return res.status(404).json({
            status: "error",
            message: "User not found",
          });
        }
        console.log(email);
        // Gửi mật khẩu cho người dùng qua email
        await sendPassword(email, `Mật khẩu của bạn là: ${user.password}`);

        // Xóa OTP trong session sau khi gửi mật khẩu
        delete req.session.otp;
        delete req.session.otpTime; // Xóa thời gian gửi OTP

        // Chuyển hướng về trang đăng nhập sau khi gửi email thành công
        return res.redirect("/sign-in"); // Chuyển hướng về trang Sign In
      } else {
        // OTP sai, tăng số lần thử
        req.session.attempts = attempts + 1; // Tăng số lần thử
        return res.status(400).json({
          status: "error",
          message: `Incorrect OTP. You have ${
            5 - req.session.attempts
          } attempts left.`,
        });
      }
    } catch (error) {
      console.error("Error in sendGmail:", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while verifying OTP",
      });
    }
  }
}

module.exports = new AuthController();
