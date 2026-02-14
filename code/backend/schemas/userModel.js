const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    set: function (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // enforce uniqueness
    lowercase: true, // normalize
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6, // basic security
  },
  type: {
    type: String,
    enum: ["Admin", "Owner", "Renter"], // restrict roles
    required: [true, "User type is required"],
  },
  granted: {
    type: String,
    enum: ["granted", "ungranted"],
    default: "ungranted",
  }
}, {
  timestamps: true, // adds createdAt & updatedAt
  strict: true
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);