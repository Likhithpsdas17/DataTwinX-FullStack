const { HEALTH_STATUS, RISK_LEVEL } = require("../config/constants");

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

const localTrustAssessment = (twinData) => {
  const { analytics } = twinData;
  let score = 100;

  score -= analytics.unauthorizedAttempts * 10;
  score -= analytics.integrityViolations * 15;
  score -= Math.min(analytics.totalShares * 2, 20);
  score -= Math.min(analytics.totalDownloads * 1, 15);
  score = Math.max(0, Math.min(100, score));

  let healthStatus = HEALTH_STATUS.HEALTHY;
  let riskLevel = RISK_LEVEL.LOW;
  const recommendations = [];

  if (score < 40) {
    healthStatus = HEALTH_STATUS.CRITICAL;
    riskLevel = RISK_LEVEL.HIGH;
    recommendations.push({
      type: "revoke_access",
      message: "Trust score is critical. Revoke all active share links immediately.",
      priority: "high",
    });
  } else if (score < 70) {
    healthStatus = HEALTH_STATUS.WARNING;
    riskLevel = RISK_LEVEL.MEDIUM;
    recommendations.push({
      type: "reduce_sharing",
      message: "Consider reducing the number of active share links.",
      priority: "medium",
    });
  }

  if (analytics.unauthorizedAttempts > 0) {
    recommendations.push({
      type: "enable_one_time_access",
      message: "Unauthorized access detected. Enable one-time view for future shares.",
      priority: "high",
    });
  }

  return {
    trustScore: score,
    healthStatus,
    riskLevel,
    recommendations,
  };
};

module.exports = { assessTrust };
