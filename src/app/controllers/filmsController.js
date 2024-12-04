const Films = require("../models/Films");
const mongooseToObject = require("../../util/mongoose");
// const Screen = require("../models/Screen");
const ScreenShowtimes = require("../models/Screen_Showtime");
const Showtimes = require("../models/Showtimes");
const moment = require("moment");
class FilmsController {
  // [GET] /courses/:slug

  async show(req, res, next) {
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

    // Render view và truyền dữ liệu showtimes theo ngày
    res.render("films/filmsDetail", {
      films: film,
      showtimesByDate,
      today: today.toISOString().split("T")[0], // Ngày hôm nay
    });
  }
}
module.exports = new FilmsController();
