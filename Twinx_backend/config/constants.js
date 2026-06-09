const LIFECYCLE_EVENTS = {
  UPLOAD: "upload",
  VIEW: "view",
  DOWNLOAD: "download",
  SHARE: "share",
  EXPIRE: "expire",
  REVOKE: "revoke",
  UNAUTHORIZED_ACCESS: "unauthorized_access",
};

const HEALTH_STATUS = {
  HEALTHY: "healthy",
  WARNING: "warning",
  CRITICAL: "critical",
};

const RISK_LEVEL = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

const SHARE_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  REVOKED: "revoked",
};

const TRUST_SCORING = {
  BASE_SCORE: 100,
  VIEW: 0,
  DOWNLOAD: -1,
  SHARE: -2,
  EXPIRE: -5,
  UNAUTHORIZED_ACCESS: -10,
  REVOKE: 0,
  EXCESSIVE_DOWNLOADS_THRESHOLD: 10,
  EXCESSIVE_DOWNLOADS_PENALTY: 5,
  EXCESSIVE_SHARES_THRESHOLD: 5,
  EXCESSIVE_SHARES_PENALTY: 10,
};

const TRUST_TRIGGER_EVENTS = [
  "view",
  "download",
  "share",
  "revoke",
  "expire",
  "unauthorized_access",
];

module.exports = {
  LIFECYCLE_EVENTS,
  HEALTH_STATUS,
  RISK_LEVEL,
  SHARE_STATUS,
  TRUST_SCORING,
  TRUST_TRIGGER_EVENTS,
};
