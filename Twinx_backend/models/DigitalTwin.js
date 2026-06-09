const mongoose = require("mongoose");
const {
  HEALTH_STATUS,
  RISK_LEVEL,
} = require("../config/constants");

const digitalTwinSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      unique: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    twinId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    trustScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    healthStatus: {
      type: String,
      enum: Object.values(HEALTH_STATUS),
      default: HEALTH_STATUS.HEALTHY,
    },
    riskLevel: {
      type: String,
      enum: Object.values(RISK_LEVEL),
      default: RISK_LEVEL.LOW,
    },
    analytics: {
      totalViews: { type: Number, default: 0 },
      totalDownloads: { type: Number, default: 0 },
      totalShares: { type: Number, default: 0 },
      unauthorizedAttempts: { type: Number, default: 0 },
      integrityViolations: { type: Number, default: 0 },
    },
    recommendations: [
      {
        type: { type: String, required: true },
        message: { type: String, required: true },
        priority: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    lastAssessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DigitalTwin", digitalTwinSchema);
