const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const bcryptSalt = process.env.BCRYPT_SALT;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // we need to define the relationship between user and task models
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  {
    timestamps: true,
  }
);
//we use the pre-save MongoDB hook to hash the password first in this part of the code.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
  this.password = hash;
  next();
});

module.exports = mongoose.model("User", userSchema);
