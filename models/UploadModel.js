const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    photo: String,
    category: String,
    likeCount: {
      type: Number,
      default: 0 // Set the initial value to zero
    },
    tags: String,
    username: String,
    email: String,
    password: String,
    details: String,
  }, 
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Upload", uploadSchema);
