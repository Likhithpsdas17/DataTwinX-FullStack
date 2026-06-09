const ActivityLog = require("../models/ActivityLog");
const { LIFECYCLE_EVENTS, TRUST_TRIGGER_EVENTS } = require("../config/constants");
const trustService = require("./trustService");

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

  let log;

  if (session) {
    [log] = await ActivityLog.create([payload], { session });
  } else {
    log = await ActivityLog.create(payload);

    if (TRUST_TRIGGER_EVENTS.includes(event)) {
      await trustService.reassessTrust(twinId, { triggeringEvent: event });
    }
  }

  return log;
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
