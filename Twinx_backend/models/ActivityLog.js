const mongoose = require("mongoose");
const { LIFECYCLE_EVENTS } = require("../config/constants");

const activityLogSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    twin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DigitalTwin",
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    event: {
      type: String,
      enum: Object.values(LIFECYCLE_EVENTS),
      required: true,
    },
    actor: {
      type: String,
      default: "owner",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
  },
  { timestamps: true }
);

activityLogSchema.index({ twin: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
