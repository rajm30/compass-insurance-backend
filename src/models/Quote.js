const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    insuranceType: {
      type: String,
      required: [true, "Insurance type is required"],
      enum: [
        "health",
        "motor",
        "life",
        "home",
        "travel",
        "commercial",
        "marine",
        "fire",
        "liability",
        "personal-accident",
        "critical-illness",
        "senior-citizen",
        "child",
        "term",
        "endowment",
        "ulip",
        "pension",
        "two-wheeler",
        "commercial-vehicle",
        "crop",
        "pet",
        "cyber",
        "other",
      ],
    },
    additionalInfo: {
      type: String,
      trim: true,
      maxlength: [1000, "Additional information cannot exceed 1000 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quote", quoteSchema);
