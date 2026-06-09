const mongoose = require("mongoose");
const DigitalTwin = require("../models/DigitalTwin");
const ApiError = require("../utils/ApiError");
const lifecycleService = require("./lifecycleService");
const { formatTrustProfile } = require("./trustService");

const formatActivity = (log) => ({
  id: log._id,
  document: log.document,
  twin: log.twin,
  owner: log.owner,
  event: log.event,
  actor: log.actor,
  metadata: log.metadata,
  ipAddress: log.ipAddress,
  userAgent: log.userAgent,
  createdAt: log.createdAt,
});

const findTwinForOwner = async (ownerId, twinIdParam) => {
  const query = { owner: ownerId };

  if (mongoose.Types.ObjectId.isValid(twinIdParam)) {
    const twin = await DigitalTwin.findOne({
      ...query,
      $or: [{ twinId: twinIdParam }, { _id: twinIdParam }],
    });
    if (twin) return twin;
  } else {
    const twin = await DigitalTwin.findOne({ ...query, twinId: twinIdParam });
    if (twin) return twin;
  }

  throw new ApiError(404, "Digital Twin not found");
};

const getTimeline = async (ownerId, twinIdParam) => {
  const twin = await findTwinForOwner(ownerId, twinIdParam);
  const activities = await lifecycleService.getTimeline(twin._id);

  return {
    twinId: twin.twinId,
    twinObjectId: twin._id,
    count: activities.length,
    timeline: activities.map(formatActivity),
  };
};

const getTrust = async (ownerId, twinIdParam) => {
  const twin = await findTwinForOwner(ownerId, twinIdParam);

  return {
    twinObjectId: twin._id,
    ...formatTrustProfile(twin),
  };
};

module.exports = { getTimeline, getTrust };
