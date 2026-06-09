const DigitalTwin = require("../models/DigitalTwin");
const ActivityLog = require("../models/ActivityLog");
const { assessTrust } = require("./trustEngineClient");
const { LIFECYCLE_EVENTS } = require("../config/constants");

const formatTrustProfile = (twin) => ({
  twinId: twin.twinId,
  trustScore: twin.trustScore,
  healthStatus: twin.healthStatus,
  riskLevel: twin.riskLevel,
  recommendations: twin.recommendations,
  analytics: twin.analytics,
  lastAssessedAt: twin.lastAssessedAt,
});

const reassessTrust = async (twinObjectId, options = {}) => {
  const twin = await DigitalTwin.findById(twinObjectId);
  if (!twin) {
    return null;
  }

  const expireCount = await ActivityLog.countDocuments({
    twin: twinObjectId,
    event: LIFECYCLE_EVENTS.EXPIRE,
  });

  const assessment = await assessTrust({
    twinId: twin.twinId,
    analytics: twin.analytics,
    eventCounts: { expire: expireCount },
    triggeringEvent: options.triggeringEvent || null,
  });

  twin.trustScore = assessment.trustScore;
  twin.healthStatus = assessment.healthStatus;
  twin.riskLevel = assessment.riskLevel;
  twin.recommendations = assessment.recommendations;
  twin.lastAssessedAt = new Date();
  await twin.save();

  return twin;
};

module.exports = { reassessTrust, formatTrustProfile };
