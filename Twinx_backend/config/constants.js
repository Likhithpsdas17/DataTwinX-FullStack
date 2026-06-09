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

module.exports = {
  LIFECYCLE_EVENTS,
  HEALTH_STATUS,
  RISK_LEVEL,
  SHARE_STATUS,
};
