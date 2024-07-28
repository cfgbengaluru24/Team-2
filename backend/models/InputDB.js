const mongoose = require("mongoose");

// Define the schema for image details
const InputDBSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    }
  },
  {
    collection: "users"
  }
);

// Create a model from the schema
module.exports = mongoose.model("InputDBDetails", InputDBSchema);