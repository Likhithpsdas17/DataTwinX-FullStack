const {
  HEALTH_STATUS,
  RISK_LEVEL,
  TRUST_SCORING,
} = require("../config/constants");

/**
 * Calls the Python Trust Engine microservice.
 * Falls back to local rule-based scoring when the service is unavailable.
 */
const assessTrust = async (twinData) => {
  const trustEngineUrl = process.env.TRUST_ENGINE_URL;

  if (trustEngineUrl) {
    try {
      const response = await fetch(`${trustEngineUrl}/assess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(twinData),
      });

      if (response.ok) {
        return response.json();
      }
    } catch {
      // Fall through to local scoring
    }
  }

  return localTrustAssessment(twinData);
};

const clampScore = (score) => Math.max(0, Math.min(100, score));

const resolveHealthAndRisk = (score) => {
  if (score >= 80) {
    return { healthStatus: HEALTH_STATUS.HEALTHY, riskLevel: RISK_LEVEL.LOW };
  }
  if (score >= 50) {
    return {
      healthStatus: HEALTH_STATUS.WARNING,
      riskLevel: RISK_LEVEL.MEDIUM,
    };
  }
  return { healthStatus: HEALTH_STATUS.CRITICAL, riskLevel: RISK_LEVEL.HIGH };
};

const generateRecommendations = (score, analytics, eventCounts) => {
  const recommendations = [];

  if (analytics.totalShares >= 3) {
    recommendations.push({
      type: "reduce_sharing",
      message: "Reduce sharing — multiple active share links detected.",
      priority: score < 50 ? "high" : "medium",
    });
  }

  if (score < 80 || analytics.unauthorizedAttempts > 0) {
    recommendations.push({
      type: "revoke_active_links",
      message: "Revoke active share links to limit exposure.",
      priority: score < 50 ? "high" : "medium",
    });
  }

  if (analytics.unauthorizedAttempts > 0 || analytics.totalDownloads > 5) {
    recommendations.push({
      type: "enable_one_time_access",
      message: "Enable one-time access for future shares.",
      priority: "high",
    });
  }

  if (
    (eventCounts.expire || 0) > 0 ||
    analytics.totalShares > 0 ||
    score < 80
  ) {
    recommendations.push({
      type: "enable_expiry_protection",
      message: "Enable expiry protection on share links.",
      priority: score < 50 ? "high" : "medium",
    });
  }

  if (score < 50) {
    recommendations.push({
      type: "critical_review",
      message:
        "Trust score is critical. Review all document activity immediately.",
      priority: "high",
    });
  }

  return recommendations;
};

const localTrustAssessment = (twinData) => {
  const { analytics, eventCounts = {} } = twinData;

  let score = TRUST_SCORING.BASE_SCORE;

  score += analytics.totalViews * TRUST_SCORING.VIEW;
  score += analytics.totalDownloads * TRUST_SCORING.DOWNLOAD;
  score += analytics.totalShares * TRUST_SCORING.SHARE;
  score += (eventCounts.expire || 0) * TRUST_SCORING.EXPIRE;
  score += analytics.unauthorizedAttempts * TRUST_SCORING.UNAUTHORIZED_ACCESS;

  if (analytics.totalDownloads > TRUST_SCORING.EXCESSIVE_DOWNLOADS_THRESHOLD) {
    score -= TRUST_SCORING.EXCESSIVE_DOWNLOADS_PENALTY;
  }

  if (analytics.totalShares > TRUST_SCORING.EXCESSIVE_SHARES_THRESHOLD) {
    score -= TRUST_SCORING.EXCESSIVE_SHARES_PENALTY;
  }

  score = clampScore(score);

  const { healthStatus, riskLevel } = resolveHealthAndRisk(score);
  const recommendations = generateRecommendations(
    score,
    analytics,
    eventCounts
  );

  return {
    trustScore: score,
    healthStatus,
    riskLevel,
    recommendations,
  };
};

module.exports = { assessTrust };
