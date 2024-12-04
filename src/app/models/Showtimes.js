const mongoose = require("mongoose");

const showtimesSchema = new mongoose.Schema({
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
});

// const showtimesSchema = new mongoose.Schema({
//   start_time: { type: Date, required: true },
//   end_time: { type: Date, required: true },
// });

module.exports = mongoose.model("Showtimes", showtimesSchema);
