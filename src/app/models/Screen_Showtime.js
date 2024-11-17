const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const screenShowtimesSchema = new Schema({
//   screen_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Screen",
//     required: true,
//   },
//   showtime_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Showtimes",
//     required: true,
//   },
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now },
// });
const screenShowtimesSchema = new mongoose.Schema({
  screen_id: { type: Number, required: true }, // Chuyển screen_id thành Number thay vì ObjectId
  showtime_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Showtimes",
    required: true,
  },
});

module.exports = mongoose.model("Screen_Showtimes", screenShowtimesSchema);
