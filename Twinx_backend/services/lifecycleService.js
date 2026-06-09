const ActivityLog = require("../models/ActivityLog");
const { LIFECYCLE_EVENTS } = require("../config/constants");

const logActivity = async ({
  documentId,
  twinId,
  ownerId,
  event,
  actor = "owner",
  metadata = {},
  ipAddress = null,
  userAgent = null,
  session = null,
}) => {
  const payload = {
    document: documentId,
    twin: twinId,
    owner: ownerId,
    event,
    actor,
    metadata,
    ipAddress,
    userAgent,
  };

  if (session) {
    const [log] = await ActivityLog.create([payload], { session });
    return log;
  }

  return ActivityLog.create(payload);
};

const getTimeline = async (twinId, limit = 50) => {
  return ActivityLog.find({ twin: twinId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const getRecentActivities = async (ownerId, limit = 20) => {
  return ActivityLog.find({ owner: ownerId })
    .populate("document", "originalName twinId")
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = {
  logActivity,
  getTimeline,
  getRecentActivities,
  LIFECYCLE_EVENTS,
};
