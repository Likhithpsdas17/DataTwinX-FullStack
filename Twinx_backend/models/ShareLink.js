const mongoose = require("mongoose");
const { SHARE_STATUS } = require("../config/constants");

const shareLinkSchema = new mongoose.Schema(
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
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(SHARE_STATUS),
      default: SHARE_STATUS.ACTIVE,
    },
    restrictions: {
      oneTimeView: { type: Boolean, default: false },
      viewOnly: { type: Boolean, default: false },
      allowDownload: { type: Boolean, default: true },
      maxViews: { type: Number, default: null },
      downloadLimit: { type: Number, default: null },
      expiresAt: { type: Date, default: null },
    },
    usage: {
      viewCount: { type: Number, default: 0 },
      downloadCount: { type: Number, default: 0 },
      hasBeenViewed: { type: Boolean, default: false },
    },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShareLink", shareLinkSchema);
