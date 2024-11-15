const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Auth = new Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: "user" }, // "user" hoặc "admin"
  },
  {
    timestamps: { createdAt: "create_at", updatedAt: "update_at" },
  }
);

module.exports = mongoose.model("User", Auth);
