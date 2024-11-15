const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seat_number: { type: Number, required: true },
  row: { type: String, required: true },
  seat_price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Seat", seatSchema);
///////////////////
// const mongoose = require("mongoose");

// const seatSchema = new mongoose.Schema({
//   seat_number: { type: Number, required: true }, // Số ghế
//   row: { type: String, required: true }, // Hàng ghế
//   seat_price: { type: Number, required: true }, // Giá ghế
//   status: { type: String, default: "available" }, // Trạng thái (available/booked)
// });

// const Screen = new mongoose.Schema({
//   screen_number: { type: Number, required: true }, // Số màn hình
//   seat_capacity: { type: Number, required: true }, // Sức chứa
//   seats: [seatSchema], // Mảng ghế
// });

// module.exports = mongoose.model("Screen", Screen);
