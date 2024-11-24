const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  food_id: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
