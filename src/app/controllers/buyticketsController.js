const Films = require("../models/Films");
const { mongooseToObject } = require("../../util/mongoose");
const { multipleMongooseToObject } = require("../../util/mongoose");
// const Screen = require("../models/Screen");
const ScreenShowtimes = require("../models/Screen_Showtime");
const sendticket = require("../../service/sendTicket"); // Import file dịch vụ gửi email
const Showtimes = require("../models/Showtimes");
const moment = require("moment");
const Screen = require("../models/Screen");
const querystring = require("qs");
const crypto = require("crypto");

class BuyticketsController {
  // [GET] /courses/:slug
  async showBuyTickets(req, res, next) {
    const film = await Films.findOne({ slug: req.params.slug }).lean();

    if (!film) {
      return res.status(404).send("Film not found");
    }

    // Kiểm tra nếu không có showtimes_id
    if (!film.showtimes_id || film.showtimes_id.length === 0) {
      return res.status(404).send("No showtimes found for this film");
    }

    // Lọc các ngày từ hôm nay đến 14 ngày sau
    const today = new Date();
    const futureDates = [];
    for (let i = 0; i < 14; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      futureDates.push(day.toISOString().split("T")[0]); // Chỉ lấy phần ngày trong format YYYY-MM-DD
    }

    // Cập nhật showtimes_id với thông tin chi tiết
    film.showtimes_id = await Promise.all(
      film.showtimes_id.map(async (showtimeId) => {
        const showtime = await Showtimes.findById(showtimeId);

        if (!showtime) {
          return {
            start_time: "N/A",
            end_time: "N/A",
            screen_id: null,
            date: null,
          };
        }

        const screenShowtime = await ScreenShowtimes.findOne({
          showtime_id: showtimeId,
        });

        // Chuyển đổi start_time và end_time thành đối tượng Date
        const startTime = new Date(showtime.start_time);
        const endTime = new Date(showtime.end_time);

        // Định dạng lại thời gian
        const formattedStartTime =
          startTime instanceof Date && !isNaN(startTime)
            ? startTime.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A";

        const formattedEndTime =
          endTime instanceof Date && !isNaN(endTime)
            ? endTime.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A";

        const formattedDate = startTime.toISOString().split("T")[0]; // Lấy ngày (YYYY-MM-DD)

        return {
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          screen_id: screenShowtime ? screenShowtime.screen_id : null,
          date: formattedDate,
        };
      })
    );

    // Nhóm showtimes theo từng ngày
    const showtimesByDate = futureDates.reduce((acc, date) => {
      acc[date] = film.showtimes_id.filter(
        (showtime) => showtime.date === date
      );
      return acc;
    }, {});
    //////
    const screens = await Screen.find({});
    /////
    // Render view và truyền dữ liệu showtimes theo ngày
    res.render("tickets/buytickets", {
      films: film,
      showtimesByDate,
      today: today.toISOString().split("T")[0], // Ngày hôm nay
      screens: multipleMongooseToObject(screens),
      isLoggedIn: true,
    });
  }
  async createPayment(req, res, next) {
    try {
      const {
        amount,
        orderInfo = "Thanh toán đơn hàng vé và combo",
        idFilm,
        email,
        date_film,
        time_film,
        seat_film,
      } = req.body;

      // Kiểm tra dữ liệu
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const tmnCode = "U2XWC1UC";
      const secretKey = "H13FCAHLKVP4JFFAQHM4UMVLJWWVEQT8";
      const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
      const returnUrl = "http://localhost:3000/buytickets/vnpay-return";

      const date = new Date();
      const createDate = moment(date).format("YYYYMMDDHHmmss");
      const orderId = date.getTime();

      const params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: encodeURIComponent(
          `${orderInfo}|${email}|${amount}|${seat_film}|${date_film}|${time_film}|${idFilm}`
        ),
        vnp_OrderType: "billpayment",
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: req.ip || "::1",
        vnp_CreateDate: createDate,
      };

      const sortedParams = sortObject(params);
      const signData = querystring.stringify(sortedParams, { encode: false });
      const secureHash = crypto
        .createHmac("sha512", secretKey)
        .update(signData)
        .digest("hex");
      sortedParams["vnp_SecureHash"] = secureHash;

      const paymentUrl = `${vnpUrl}?${querystring.stringify(sortedParams, {
        encode: false,
      })}`;
      console.log("Payment URL:", paymentUrl);

      res.redirect(paymentUrl);
    } catch (error) {
      console.error("Error creating payment:", error);
      res
        .status(500)
        .send("An error occurred while creating the payment: " + error.message);
    }
  }

  async vnpayReturn(req, res, next) {
    try {
      const vnpParams = req.query;
      const secureHash = vnpParams.vnp_SecureHash;

      delete vnpParams.vnp_SecureHash;
      delete vnpParams.vnp_SecureHashType;

      const sortedParams = Object.keys(vnpParams)
        .sort()
        .reduce((acc, key) => {
          acc[key] = vnpParams[key];
          return acc;
        }, {});

      const secretKey = "H13FCAHLKVP4JFFAQHM4UMVLJWWVEQT8";
      const query = querystring.stringify(sortedParams);
      const signData = crypto
        .createHmac("sha512", secretKey)
        .update(query)
        .digest("hex");

      if (secureHash === signData) {
        if (vnpParams.vnp_ResponseCode === "00") {
          const orderInfoDecoded = decodeURIComponent(vnpParams.vnp_OrderInfo);
          const [
            orderInfo,
            email,
            amount,
            seat_film,
            date_film,
            time_film,
            idFilm,
          ] = orderInfoDecoded.split("|");

          const film = await Films.findOne({ _id: idFilm }).lean();
          if (!film) {
            return res.status(404).send("Film not found");
          }
          // Gửi email
          await sendticket(
            film.title,
            email,
            amount,
            seat_film,
            date_film,
            time_film
          );

          // res.redirect("/");
          res.redirect(`/buytickets/${film._id}/confirmation`);
        } else {
          res.send(
            `Thanh toán không thành công. Lỗi: ${vnpParams.vnp_ResponseCode}`
          );
        }
      } else {
        res.send("Chữ ký không hợp lệ!");
      }
    } catch (error) {
      console.error("Error processing VNPAY return:", error);
      res
        .status(500)
        .send("An error occurred while processing the VNPAY return");
    }
  }

  async showConfirmation(req, res, next) {
    // const film = Films.findOne({_id : });
    Films.findById(req.params.id)
      .then((films) =>
        res.render("tickets/confirmation", {
          films: mongooseToObject(films),
          isLoggedIn: true,
        })
      )
      .catch(next);
  }
}
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort(); // Sắp xếp khóa theo alphabet
  for (let key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+"); // Mã hóa giá trị
  }
  return sorted;
}

// req.params.id
module.exports = new BuyticketsController();
