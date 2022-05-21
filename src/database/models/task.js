const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    // we need to define the relationship between user and task models
    // user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  // the timestamps will automatically have created_at and updated_at fields
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
