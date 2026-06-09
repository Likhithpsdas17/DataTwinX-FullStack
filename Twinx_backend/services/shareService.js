const fs = require("fs");
const ShareLink = require("../models/ShareLink");
const Document = require("../models/Document");
const DigitalTwin = require("../models/DigitalTwin");
const ApiError = require("../utils/ApiError");
const generateShareToken = require("../utils/generateShareToken");
const getBaseUrl = require("../utils/getBaseUrl");
const lifecycleService = require("./lifecycleService");
const { LIFECYCLE_EVENTS, SHARE_STATUS } = require("../config/constants");

const formatShareLink = (link) => ({
  id: link._id,
  token: link.token,
  status: link.status,
  restrictions: link.restrictions,
  usage: link.usage,
  revokedAt: link.revokedAt,
  createdAt: link.createdAt,
  updatedAt: link.updatedAt,
});

const getReqMeta = (reqMeta = {}) => ({
  ipAddress: reqMeta.ipAddress || null,
  userAgent: reqMeta.userAgent || null,
});

const findOwnedDocument = async (ownerId, documentId) => {
  const document = await Document.findOne({
    _id: documentId,
    owner: ownerId,
    isDeleted: false,
  });

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  return document;
};

const findTwinForDocument = async (documentId) => {
  const twin = await DigitalTwin.findOne({ document: documentId });
  if (!twin) {
    throw new ApiError(404, "Digital Twin not found for this document");
  }
  return twin;
};

const markExpired = async (shareLink, reqMeta = {}) => {
  if (shareLink.status === SHARE_STATUS.EXPIRED) {
    return shareLink;
  }

  shareLink.status = SHARE_STATUS.EXPIRED;
  await shareLink.save();

  await lifecycleService.logActivity({
    documentId: shareLink.document,
    twinId: shareLink.twin,
    ownerId: shareLink.owner,
    event: LIFECYCLE_EVENTS.EXPIRE,
    actor: "system",
    metadata: {
      shareLinkId: shareLink._id,
      token: shareLink.token,
      expiresAt: shareLink.restrictions.expiresAt,
    },
    ...getReqMeta(reqMeta),
  });

  return shareLink;
};

const validateShareLink = async (token, reqMeta = {}) => {
  const shareLink = await ShareLink.findOne({ token }).populate("document");

  if (!shareLink) {
    throw new ApiError(404, "Share link not found");
  }

  if (!shareLink.document || shareLink.document.isDeleted) {
    throw new ApiError(404, "Document no longer available");
  }

  if (shareLink.status === SHARE_STATUS.REVOKED) {
    throw new ApiError(403, "Share link has been revoked");
  }

  if (
    shareLink.restrictions.expiresAt &&
    new Date() > new Date(shareLink.restrictions.expiresAt)
  ) {
    await markExpired(shareLink, reqMeta);
    throw new ApiError(403, "Share link has expired");
  }

  if (shareLink.status === SHARE_STATUS.EXPIRED) {
    throw new ApiError(403, "Share link has expired");
  }

  if (
    shareLink.restrictions.maxViews != null &&
    shareLink.usage.viewCount >= shareLink.restrictions.maxViews
  ) {
    throw new ApiError(403, "Maximum view limit reached");
  }

  if (shareLink.restrictions.oneTimeView && shareLink.usage.hasBeenViewed) {
    throw new ApiError(403, "One-time access already used");
  }

  return shareLink;
};

const createShareLink = async (ownerId, documentId, options = {}, reqMeta = {}) => {
  const document = await findOwnedDocument(ownerId, documentId);
  const twin = await findTwinForDocument(document._id);

  const allowDownload = options.allowDownload !== false;
  const token = generateShareToken();
  const expiresAt = options.expiresAt ? new Date(options.expiresAt) : null;

  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    throw new ApiError(400, "Invalid expiresAt date");
  }

  const shareLink = await ShareLink.create({
    document: document._id,
    twin: twin._id,
    owner: ownerId,
    token,
    restrictions: {
      expiresAt,
      maxViews: options.maxViews ?? null,
      allowDownload,
      viewOnly: !allowDownload,
      oneTimeView: options.oneTimeAccess || false,
      downloadLimit: null,
    },
  });

  await DigitalTwin.findByIdAndUpdate(twin._id, {
    $inc: { "analytics.totalShares": 1 },
  });

  await lifecycleService.logActivity({
    documentId: document._id,
    twinId: twin._id,
    ownerId,
    event: LIFECYCLE_EVENTS.SHARE,
    actor: "owner",
    metadata: {
      shareLinkId: shareLink._id,
      token: shareLink.token,
      twinId: twin.twinId,
      restrictions: shareLink.restrictions,
    },
    ...getReqMeta(reqMeta),
  });

  const baseUrl = getBaseUrl();
  const shareUrl = `${baseUrl}/public/share/${token}`;

  return {
    shareUrl,
    token,
    shareLink: formatShareLink(shareLink),
    expiry: {
      expiresAt: shareLink.restrictions.expiresAt,
      maxViews: shareLink.restrictions.maxViews,
      oneTimeAccess: shareLink.restrictions.oneTimeView,
      allowDownload: shareLink.restrictions.allowDownload,
    },
  };
};

const accessShare = async (token, reqMeta = {}) => {
  const shareLink = await validateShareLink(token, reqMeta);
  const document = shareLink.document;

  shareLink.usage.viewCount += 1;
  shareLink.usage.hasBeenViewed = true;
  await shareLink.save();

  await DigitalTwin.findByIdAndUpdate(shareLink.twin, {
    $inc: { "analytics.totalViews": 1 },
  });

  await lifecycleService.logActivity({
    documentId: document._id,
    twinId: shareLink.twin,
    ownerId: shareLink.owner,
    event: LIFECYCLE_EVENTS.VIEW,
    actor: "recipient",
    metadata: {
      shareLinkId: shareLink._id,
      token: shareLink.token,
      twinId: document.twinId,
      originalName: document.originalName,
      viewCount: shareLink.usage.viewCount,
    },
    ...getReqMeta(reqMeta),
  });

  const viewsRemaining =
    shareLink.restrictions.maxViews != null
      ? Math.max(0, shareLink.restrictions.maxViews - shareLink.usage.viewCount)
      : null;

  return {
    document: {
      twinId: document.twinId,
      originalName: document.originalName,
      mimeType: document.mimeType,
      fileSize: document.fileSize,
    },
    share: {
      allowDownload: shareLink.restrictions.allowDownload,
      expiresAt: shareLink.restrictions.expiresAt,
      maxViews: shareLink.restrictions.maxViews,
      viewsRemaining,
      oneTimeAccess: shareLink.restrictions.oneTimeView,
      viewCount: shareLink.usage.viewCount,
    },
  };
};

const downloadShare = async (token, reqMeta = {}) => {
  const shareLink = await validateShareLink(token, reqMeta);
  const document = shareLink.document;

  if (
    shareLink.restrictions.viewOnly ||
    shareLink.restrictions.allowDownload === false
  ) {
    throw new ApiError(403, "Download not allowed for this share link");
  }

  if (
    shareLink.restrictions.downloadLimit != null &&
    shareLink.usage.downloadCount >= shareLink.restrictions.downloadLimit
  ) {
    throw new ApiError(403, "Download limit reached");
  }

  if (!fs.existsSync(document.filePath)) {
    throw new ApiError(404, "File not found on server");
  }

  shareLink.usage.downloadCount += 1;
  if (shareLink.restrictions.oneTimeView) {
    shareLink.usage.hasBeenViewed = true;
  }
  await shareLink.save();

  await DigitalTwin.findByIdAndUpdate(shareLink.twin, {
    $inc: { "analytics.totalDownloads": 1 },
  });

  await lifecycleService.logActivity({
    documentId: document._id,
    twinId: shareLink.twin,
    ownerId: shareLink.owner,
    event: LIFECYCLE_EVENTS.DOWNLOAD,
    actor: "recipient",
    metadata: {
      shareLinkId: shareLink._id,
      token: shareLink.token,
      twinId: document.twinId,
      originalName: document.originalName,
      downloadCount: shareLink.usage.downloadCount,
    },
    ...getReqMeta(reqMeta),
  });

  return {
    filePath: document.filePath,
    originalName: document.originalName,
    mimeType: document.mimeType,
  };
};

const revokeShareLink = async (ownerId, shareLinkId, reqMeta = {}) => {
  const shareLink = await ShareLink.findOne({
    _id: shareLinkId,
    owner: ownerId,
  });

  if (!shareLink) {
    throw new ApiError(404, "Share link not found");
  }

  if (shareLink.status === SHARE_STATUS.REVOKED) {
    throw new ApiError(400, "Share link is already revoked");
  }

  shareLink.status = SHARE_STATUS.REVOKED;
  shareLink.revokedAt = new Date();
  await shareLink.save();

  await lifecycleService.logActivity({
    documentId: shareLink.document,
    twinId: shareLink.twin,
    ownerId,
    event: LIFECYCLE_EVENTS.REVOKE,
    actor: "owner",
    metadata: {
      shareLinkId: shareLink._id,
      token: shareLink.token,
      revokedAt: shareLink.revokedAt,
    },
    ...getReqMeta(reqMeta),
  });

  return formatShareLink(shareLink);
};

module.exports = {
  createShareLink,
  accessShare,
  downloadShare,
  revokeShareLink,
};
