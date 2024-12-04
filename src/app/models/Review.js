const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  create_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
