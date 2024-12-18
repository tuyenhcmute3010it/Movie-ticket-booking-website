const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const seatSchema = new Schema({
  seat_number: { type: Number, required: true },
  row: { type: String, required: true },
  seat_price: { type: Number, required: true },
  status: { type: Boolean, default: false }, // Default to false (unoccupied)
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Screen = new Schema({
  ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
  screen_number: { type: Number, required: true, unique: true },
  seat_capacity: { type: Number, required: true },
  seats: [seatSchema], // Embed seat schema as an array
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Screen", Screen);
