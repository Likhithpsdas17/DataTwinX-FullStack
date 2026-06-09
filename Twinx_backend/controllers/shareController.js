const asyncHandler = require("../utils/asyncHandler");
const shareService = require("../services/shareService");

const createShareLink = asyncHandler(async (req, res) => {
  const result = await shareService.createShareLink(
    req.user._id,
    req.params.documentId,
    req.body,
    {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    }
  );

  res.status(201).json({
    success: true,
    message: "Share link created successfully",
    data: result,
  });
});

const revokeShareLink = asyncHandler(async (req, res) => {
  const shareLink = await shareService.revokeShareLink(
    req.user._id,
    req.params.shareLinkId,
    {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    }
  );

  res.status(200).json({
    success: true,
    message: "Share link revoked successfully",
    data: shareLink,
  });
});

module.exports = { createShareLink, revokeShareLink };
