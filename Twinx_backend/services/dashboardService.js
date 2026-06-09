const mongoose = require("mongoose");
const Document = require("../models/Document");
const DigitalTwin = require("../models/DigitalTwin");
const ActivityLog = require("../models/ActivityLog");
const { HEALTH_STATUS, RISK_LEVEL } = require("../config/constants");

const toObjectId = (ownerId) => new mongoose.Types.ObjectId(ownerId);

const getTwinAggregates = async (ownerId) => {
  const [result] = await DigitalTwin.aggregate([
    { $match: { owner: toObjectId(ownerId) } },
    {
      $group: {
        _id: null,
        totalTwins: { $sum: 1 },
        totalViews: { $sum: "$analytics.totalViews" },
        totalDownloads: { $sum: "$analytics.totalDownloads" },
        totalShares: { $sum: "$analytics.totalShares" },
        averageTrustScore: { $avg: "$trustScore" },
        healthyCount: {
          $sum: {
            $cond: [{ $eq: ["$healthStatus", HEALTH_STATUS.HEALTHY] }, 1, 0],
          },
        },
        warningCount: {
          $sum: {
            $cond: [{ $eq: ["$healthStatus", HEALTH_STATUS.WARNING] }, 1, 0],
          },
        },
        criticalCount: {
          $sum: {
            $cond: [{ $eq: ["$healthStatus", HEALTH_STATUS.CRITICAL] }, 1, 0],
          },
        },
        lowRiskCount: {
          $sum: {
            $cond: [{ $eq: ["$riskLevel", RISK_LEVEL.LOW] }, 1, 0],
          },
        },
        mediumRiskCount: {
          $sum: {
            $cond: [{ $eq: ["$riskLevel", RISK_LEVEL.MEDIUM] }, 1, 0],
          },
        },
        highRiskCount: {
          $sum: {
            $cond: [{ $eq: ["$riskLevel", RISK_LEVEL.HIGH] }, 1, 0],
          },
        },
      },
    },
  ]);

  return (
    result || {
      totalTwins: 0,
      totalViews: 0,
      totalDownloads: 0,
      totalShares: 0,
      averageTrustScore: 0,
      healthyCount: 0,
      warningCount: 0,
      criticalCount: 0,
      lowRiskCount: 0,
      mediumRiskCount: 0,
      highRiskCount: 0,
    }
  );
};

const getTotalDocuments = async (ownerId) => {
  return Document.countDocuments({ owner: ownerId, isDeleted: false });
};

const getRecentActivity = async (ownerId) => {
  const activities = await ActivityLog.find({ owner: ownerId })
    .populate("document", "originalName twinId")
    .sort({ createdAt: -1 })
    .limit(10);

  return activities.map((log) => ({
    id: log._id,
    event: log.event,
    document: log.document
      ? {
          id: log.document._id,
          originalName: log.document.originalName,
        }
      : null,
    twinId: log.metadata?.twinId || log.document?.twinId || null,
    timestamp: log.createdAt,
  }));
};

const getRecentDocuments = async (ownerId) => {
  const documents = await Document.find({
    owner: ownerId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("twinId originalName mimeType fileSize createdAt");

  return documents.map((doc) => ({
    id: doc._id,
    twinId: doc.twinId,
    originalName: doc.originalName,
    mimeType: doc.mimeType,
    fileSize: doc.fileSize,
    uploadedAt: doc.createdAt,
  }));
};

const getOverview = async (ownerId) => {
  const [twinStats, totalDocuments, recentActivity, recentDocuments] =
    await Promise.all([
      getTwinAggregates(ownerId),
      getTotalDocuments(ownerId),
      getRecentActivity(ownerId),
      getRecentDocuments(ownerId),
    ]);

  const averageTrustScore = twinStats.totalTwins
    ? Math.round(twinStats.averageTrustScore * 100) / 100
    : 0;

  const userStatistics = {
    totalDocuments,
    totalTwins: twinStats.totalTwins,
    totalShares: twinStats.totalShares,
    totalViews: twinStats.totalViews,
    totalDownloads: twinStats.totalDownloads,
  };

  const trustStatistics = {
    averageTrustScore,
    healthyCount: twinStats.healthyCount,
    warningCount: twinStats.warningCount,
    criticalCount: twinStats.criticalCount,
  };

  const riskStatistics = {
    lowRiskCount: twinStats.lowRiskCount,
    mediumRiskCount: twinStats.mediumRiskCount,
    highRiskCount: twinStats.highRiskCount,
  };

  const summary = {
    totalDocuments,
    totalShares: twinStats.totalShares,
    totalViews: twinStats.totalViews,
    totalDownloads: twinStats.totalDownloads,
    averageTrustScore,
  };

  return {
    userStatistics,
    trustStatistics,
    riskStatistics,
    recentActivity,
    recentDocuments,
    summary,
  };
};

module.exports = { getOverview };
